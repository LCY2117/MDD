import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/users/me
 * 获取当前用户信息
 */
router.get('/me', authenticate, (req, res) => {
  const user = db.prepare(`
    SELECT u.id, u.username, u.nickname, u.avatar, u.bio, u.user_mode, u.is_vip, u.join_date, u.last_active,
      (SELECT COUNT(*) FROM posts WHERE author_id = u.id) as post_count,
      (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as follower_count,
      (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count,
      (SELECT COUNT(*) FROM post_likes pl JOIN posts p ON pl.post_id = p.id WHERE p.author_id = u.id) as total_likes
    FROM users u WHERE u.id = ?
  `).get(req.userId);

  if (!user) {
    return res.status(404).json({ success: false, message: '用户不存在' });
  }

  res.json({
    success: true,
    data: {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      bio: user.bio,
      userMode: user.user_mode,
      isVip: !!user.is_vip,
      joinDate: user.join_date,
      lastActive: user.last_active,
      stats: {
        posts: user.post_count,
        followers: user.follower_count,
        following: user.following_count,
        likes: user.total_likes,
      },
    },
  });
});

/**
 * PUT /api/users/me
 * 更新当前用户信息
 */
router.put('/me', authenticate, (req, res) => {
  const { nickname, bio, avatar, userMode } = req.body;
  const now = new Date().toISOString();

  const updates = [];
  const params = [];

  if (nickname !== undefined) { updates.push('nickname = ?'); params.push(nickname); }
  if (bio !== undefined) { updates.push('bio = ?'); params.push(bio); }
  if (avatar !== undefined) { updates.push('avatar = ?'); params.push(avatar); }
  if (userMode !== undefined) {
    if (!['patient', 'caregiver'].includes(userMode)) {
      return res.status(400).json({ success: false, message: '用户模式无效' });
    }
    // 检查是否有家庭绑定，有绑定则不允许切换角色
    const bindingCount = db.prepare(
      `SELECT COUNT(*) as cnt FROM family_bindings WHERE patient_id = ? OR caregiver_id = ?`
    ).get(req.userId, req.userId);
    if (bindingCount.cnt > 0) {
      return res.status(409).json({ success: false, message: '已有家庭绑定关系，请先解除所有绑定后再修改身份' });
    }
    updates.push('user_mode = ?');
    params.push(userMode);
  }

  if (updates.length === 0) {
    return res.status(400).json({ success: false, message: '没有可更新的字段' });
  }

  updates.push('updated_at = ?');
  params.push(now);
  params.push(req.userId);

  db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);

  const user = db.prepare('SELECT id, username, nickname, avatar, bio, user_mode, is_vip, join_date FROM users WHERE id = ?').get(req.userId);

  res.json({
    success: true,
    message: '更新成功',
    data: {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      bio: user.bio,
      userMode: user.user_mode,
    },
  });
});

/**
 * GET /api/users/:id
 * 获取指定用户公开信息
 */
router.get('/:id', (req, res) => {
  const user = db.prepare(`
    SELECT u.id, u.nickname, u.avatar, u.bio, u.user_mode, u.join_date,
      (SELECT COUNT(*) FROM posts WHERE author_id = u.id AND is_anonymous = 0) as post_count,
      (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as follower_count,
      (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count,
      (SELECT COUNT(*) FROM post_likes pl JOIN posts p ON pl.post_id = p.id WHERE p.author_id = u.id) as total_likes
    FROM users u WHERE u.id = ?
  `).get(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: '用户不存在' });
  }

  res.json({
    success: true,
    data: {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      bio: user.bio,
      joinDate: user.join_date,
      stats: {
        posts: user.post_count,
        followers: user.follower_count,
        following: user.following_count,
        likes: user.total_likes,
      },
    },
  });
});

/**
 * GET /api/users/:id/followers
 * 获取粉丝列表
 */
router.get('/:id/followers', authenticate, (req, res) => {
  const users = db.prepare(`
    SELECT u.id, u.nickname, u.avatar, u.bio
    FROM follows f JOIN users u ON f.follower_id = u.id
    WHERE f.following_id = ?
    ORDER BY f.created_at DESC LIMIT 100
  `).all(req.params.id);
  res.json({ success: true, data: users });
});

/**
 * GET /api/users/:id/following
 * 获取关注列表
 */
router.get('/:id/following', authenticate, (req, res) => {
  const users = db.prepare(`
    SELECT u.id, u.nickname, u.avatar, u.bio
    FROM follows f JOIN users u ON f.following_id = u.id
    WHERE f.follower_id = ?
    ORDER BY f.created_at DESC LIMIT 100
  `).all(req.params.id);
  res.json({ success: true, data: users });
});

/**
 * POST /api/users/:id/follow
 * 关注/取消关注用户
 */
router.post('/:id/follow', authenticate, (req, res) => {
  const targetId = req.params.id;
  if (targetId === req.userId) {
    return res.status(400).json({ success: false, message: '不能关注自己' });
  }

  const target = db.prepare('SELECT id FROM users WHERE id = ?').get(targetId);
  if (!target) {
    return res.status(404).json({ success: false, message: '用户不存在' });
  }

  const existing = db.prepare('SELECT * FROM follows WHERE follower_id = ? AND following_id = ?').get(req.userId, targetId);

  if (existing) {
    // 取消关注
    db.prepare('DELETE FROM follows WHERE follower_id = ? AND following_id = ?').run(req.userId, targetId);
    res.json({ success: true, message: '已取消关注', data: { isFollowing: false } });
  } else {
    // 关注
    db.prepare('INSERT INTO follows (follower_id, following_id, created_at) VALUES (?, ?, ?)').run(
      req.userId, targetId, new Date().toISOString()
    );

    // 发送通知
    const notifId = `notif_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
    db.prepare(`
      INSERT INTO notifications (id, user_id, type, from_user_id, content, is_read, created_at)
      VALUES (?, ?, 'follow', ?, '关注了你', 0, ?)
    `).run(notifId, targetId, req.userId, new Date().toISOString());

    res.json({ success: true, message: '关注成功', data: { isFollowing: true } });
  }
});

/**
 * GET /api/users/me/settings
 * 获取用户设置
 */
router.get('/me/settings', authenticate, (req, res) => {
  let settings = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(req.userId);
  if (!settings) {
    db.prepare('INSERT OR IGNORE INTO user_settings (user_id) VALUES (?)').run(req.userId);
    settings = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(req.userId);
  }
  res.json({ success: true, data: settings });
});

/**
 * PUT /api/users/me/settings
 * 更新用户设置
 */
router.put('/me/settings', authenticate, (req, res) => {
  const allowed = ['notify_likes', 'notify_comments', 'notify_follows', 'notify_system', 'notify_family',
    'privacy_show_posts', 'privacy_allow_message', 'privacy_hide_profile', 'privacy_allow_follow'];

  const updates = [];
  const params = [];

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      updates.push(`${key} = ?`);
      params.push(req.body[key] ? 1 : 0);
    }
  }

  if (updates.length > 0) {
    params.push(req.userId);
    db.prepare(`UPDATE user_settings SET ${updates.join(', ')} WHERE user_id = ?`).run(...params);
  }

  const settings = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(req.userId);
  res.json({ success: true, message: '设置已更新', data: settings });
});

/**
 * DELETE /api/users/me
 * 注销当前账号（软删除：清空内容但保留 ID）
 */
router.delete('/me', authenticate, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ success: false, message: '用户不存在' });

  // 清理用户数据
  const deleteStmt = db.transaction(() => {
    db.prepare('DELETE FROM post_likes WHERE user_id = ?').run(req.userId);
    db.prepare('DELETE FROM comment_likes WHERE user_id = ?').run(req.userId);
    db.prepare('DELETE FROM favorites WHERE user_id = ?').run(req.userId);
    db.prepare('DELETE FROM follows WHERE follower_id = ? OR following_id = ?').run(req.userId, req.userId);
    db.prepare('DELETE FROM family_bindings WHERE patient_id = ? OR caregiver_id = ?').run(req.userId, req.userId);
    db.prepare('DELETE FROM direct_messages WHERE sender_id = ?').run(req.userId);
    db.prepare('DELETE FROM notifications WHERE user_id = ? OR from_user_id = ?').run(req.userId, req.userId);
    db.prepare('DELETE FROM ai_chat_history WHERE user_id = ?').run(req.userId);
    db.prepare('DELETE FROM user_settings WHERE user_id = ?').run(req.userId);
    db.prepare('DELETE FROM diary_entries WHERE user_id = ?').run(req.userId);
    db.prepare('DELETE FROM mood_entries WHERE user_id = ?').run(req.userId);
    db.prepare('UPDATE users SET nickname = ?, bio = ?, avatar = ?, username = ? WHERE id = ?')
      .run('已注销用户', '', '', `deleted_${req.userId}`, req.userId);
  });
  deleteStmt();

  res.json({ success: true, message: '账号已注销' });
});

export default router;
