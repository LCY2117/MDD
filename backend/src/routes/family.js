import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/family/members
 * 获取家庭成员列表
 */
router.get('/members', authenticate, (req, res) => {
  const user = db.prepare('SELECT user_mode FROM users WHERE id = ?').get(req.userId);

  let members = [];
  if (user.user_mode === 'patient') {
    // 患者获取家属列表
    const bindings = db.prepare(`
      SELECT fb.*, u.id, u.nickname, u.avatar, u.last_active, fb.relation
      FROM family_bindings fb
      JOIN users u ON fb.caregiver_id = u.id
      WHERE fb.patient_id = ?
    `).all(req.userId);

    members = bindings.map(b => ({
      id: b.id,
      userId: b.caregiver_id,
      name: b.nickname,
      avatar: b.avatar,
      role: 'caregiver',
      relation: b.relation,
      status: isOnline(b.last_active) ? 'online' : 'offline',
      shareMood: !!b.share_mood,
    }));
  } else {
    // 家属获取被照顾者列表
    const bindings = db.prepare(`
      SELECT fb.*, u.id, u.nickname, u.avatar, u.last_active, fb.relation
      FROM family_bindings fb
      JOIN users u ON fb.patient_id = u.id
      WHERE fb.caregiver_id = ?
    `).all(req.userId);

    members = bindings.map(b => ({
      id: b.id,
      userId: b.patient_id,
      name: b.nickname,
      avatar: b.avatar,
      role: 'patient',
      relation: b.relation,
      status: isOnline(b.last_active) ? 'online' : 'offline',
      shareMood: !!b.share_mood,
    }));
  }

  res.json({ success: true, data: members });
});

/**
 * GET /api/family/mood/:patientId
 * 家属查看患者的情绪趋势（需要已绑定且患者允许共享）
 */
router.get('/mood/:patientId', authenticate, (req, res) => {
  const binding = db.prepare(`
    SELECT * FROM family_bindings
    WHERE patient_id = ? AND caregiver_id = ? AND share_mood = 1
  `).get(req.params.patientId, req.userId);

  if (!binding) {
    return res.status(403).json({ success: false, message: '无权查看或对方未开启情绪共享' });
  }

  const { days = 7 } = req.query;
  const since = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000).toISOString();

  const entries = db.prepare(`
    SELECT * FROM mood_entries WHERE user_id = ? AND created_at >= ? ORDER BY created_at ASC
  `).all(req.params.patientId, since);

  res.json({
    success: true,
    data: {
      entries: entries.map(e => ({
        id: e.id,
        mood: e.mood,
        score: e.score,
        date: e.date,
        note: e.note,
        createdAt: e.created_at,
      })),
      stats: {
        avgScore: entries.length > 0
          ? (entries.reduce((s, e) => s + e.score, 0) / entries.length).toFixed(1)
          : '0.0',
        sunnyDays: entries.filter(e => e.mood === 'sunny').length,
        cloudyDays: entries.filter(e => e.mood === 'cloudy').length,
        rainyDays: entries.filter(e => e.mood === 'rainy').length,
      },
    },
  });
});

/**
 * POST /api/family/invite
 * 生成家庭邀请码
 */
router.post('/invite', authenticate, (req, res) => {
  const code = generateInviteCode();
  const id = `inv_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24小时有效

  db.prepare(`
    INSERT INTO family_invites (id, code, creator_id, expires_at, is_used, created_at)
    VALUES (?, ?, ?, ?, 0, ?)
  `).run(id, code, req.userId, expiresAt, now);

  res.status(201).json({
    success: true,
    data: { code, expiresAt },
  });
});

/**
 * POST /api/family/bind
 * 使用邀请码绑定家庭关系
 */
router.post('/bind', authenticate, (req, res) => {
  const { code, relation = '家属' } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: '邀请码不能为空' });
  }

  const invite = db.prepare(`
    SELECT * FROM family_invites
    WHERE code = ? AND is_used = 0 AND expires_at > ?
  `).get(code, new Date().toISOString());

  if (!invite) {
    return res.status(400).json({ success: false, message: '邀请码无效或已过期' });
  }

  if (invite.creator_id === req.userId) {
    return res.status(400).json({ success: false, message: '不能绑定自己' });
  }

  // 判断创建者和当前用户的角色
  const creator = db.prepare('SELECT user_mode FROM users WHERE id = ?').get(invite.creator_id);
  const currentUser = db.prepare('SELECT user_mode FROM users WHERE id = ?').get(req.userId);

  let patientId, caregiverId;
  if (creator.user_mode === 'patient' && currentUser.user_mode === 'caregiver') {
    patientId = invite.creator_id;
    caregiverId = req.userId;
  } else if (creator.user_mode === 'caregiver' && currentUser.user_mode === 'patient') {
    patientId = req.userId;
    caregiverId = invite.creator_id;
  } else {
    return res.status(400).json({ success: false, message: '需要一名患者和一名家属才能绑定' });
  }

  // 检查是否已绑定
  const existing = db.prepare('SELECT id FROM family_bindings WHERE patient_id = ? AND caregiver_id = ?').get(patientId, caregiverId);
  if (existing) {
    return res.status(409).json({ success: false, message: '已经绑定过了' });
  }

  const bindId = `bind_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO family_bindings (id, patient_id, caregiver_id, relation, share_mood, created_at)
    VALUES (?, ?, ?, ?, 1, ?)
  `).run(bindId, patientId, caregiverId, relation, now);

  // 标记邀请码已使用
  db.prepare('UPDATE family_invites SET is_used = 1 WHERE id = ?').run(invite.id);

  // 发送家庭通知
  const notifId = `notif_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
  db.prepare(`
    INSERT INTO notifications (id, user_id, type, from_user_id, content, is_read, created_at)
    VALUES (?, ?, 'family', ?, '成功绑定家庭关系', 0, ?)
  `).run(notifId, invite.creator_id, req.userId, now);

  res.status(201).json({ success: true, message: '绑定成功' });
});

/**
 * DELETE /api/family/bind/:memberId
 * 解除家庭绑定
 */
router.delete('/bind/:memberId', authenticate, (req, res) => {
  const binding = db.prepare(`
    SELECT * FROM family_bindings WHERE id = ? AND (patient_id = ? OR caregiver_id = ?)
  `).get(req.params.memberId, req.userId, req.userId);

  if (!binding) {
    return res.status(404).json({ success: false, message: '绑定关系不存在' });
  }

  db.prepare('DELETE FROM family_bindings WHERE id = ?').run(req.params.memberId);
  res.json({ success: true, message: '已解除绑定' });
});

/**
 * PUT /api/family/settings
 * 更新情绪共享设置
 */
router.put('/settings', authenticate, (req, res) => {
  const { shareMood, memberId } = req.body;

  if (memberId) {
    db.prepare(`
      UPDATE family_bindings SET share_mood = ? WHERE id = ? AND patient_id = ?
    `).run(shareMood ? 1 : 0, memberId, req.userId);
  } else {
    db.prepare(`
      UPDATE family_bindings SET share_mood = ? WHERE patient_id = ?
    `).run(shareMood ? 1 : 0, req.userId);
  }

  res.json({ success: true, message: '设置已更新' });
});

/**
 * POST /api/family/encourage
 * 发送鼓励消息给家庭成员
 */
router.post('/encourage', authenticate, (req, res) => {
  const { targetUserId, message } = req.body;

  if (!targetUserId || !message) {
    return res.status(400).json({ success: false, message: '参数不完整' });
  }

  // 验证是否有家庭绑定关系
  const binding = db.prepare(`
    SELECT * FROM family_bindings
    WHERE (patient_id = ? AND caregiver_id = ?) OR (patient_id = ? AND caregiver_id = ?)
  `).get(req.userId, targetUserId, targetUserId, req.userId);

  if (!binding) {
    return res.status(403).json({ success: false, message: '没有家庭绑定关系' });
  }

  const notifId = `notif_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO notifications (id, user_id, type, from_user_id, content, is_read, created_at)
    VALUES (?, ?, 'family', ?, ?, 0, ?)
  `).run(notifId, targetUserId, req.userId, `💌 ${message}`, now);

  res.status(201).json({ success: true, message: '鼓励消息已发送' });
});

// 辅助函数
function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function isOnline(lastActive) {
  if (!lastActive) return false;
  return Date.now() - new Date(lastActive).getTime() < 5 * 60 * 1000; // 5分钟内活跃
}

export default router;
