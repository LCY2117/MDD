import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

function getBlockStatus(userA, userB) {
  const blockedByMe = !!db.prepare(
    'SELECT 1 FROM user_blocks WHERE blocker_id = ? AND blocked_id = ?'
  ).get(userA, userB);
  const blockedByOther = !!db.prepare(
    'SELECT 1 FROM user_blocks WHERE blocker_id = ? AND blocked_id = ?'
  ).get(userB, userA);
  return { blockedByMe, blockedByOther, isBlocked: blockedByMe || blockedByOther };
}

/**
 * GET /api/messages/conversations
 * 获取私信会话列表
 */
router.get('/conversations', authenticate, (req, res) => {
  const conversations = db.prepare(`
    SELECT c.*,
      CASE WHEN c.user1_id = ? THEN c.user2_id ELSE c.user1_id END as other_user_id,
      (SELECT COUNT(*) FROM direct_messages dm WHERE dm.conversation_id = c.id AND dm.sender_id != ? AND dm.is_read = 0) as unread_count
    FROM conversations c
    WHERE c.user1_id = ? OR c.user2_id = ?
    ORDER BY c.last_message_time DESC
  `).all(req.userId, req.userId, req.userId, req.userId);

  const formatted = conversations.map(conv => {
    const otherUser = db.prepare('SELECT id, nickname, avatar FROM users WHERE id = ?').get(conv.other_user_id);
    return {
      id: conv.id,
      user: {
        id: otherUser?.id,
        name: otherUser?.nickname,
        avatar: otherUser?.avatar,
        isOnline: false,
      },
      lastMessage: conv.last_message,
      lastMessageTime: conv.last_message_time,
      unreadCount: conv.unread_count,
    };
  });

  res.json({ success: true, data: formatted });
});

/**
 * GET /api/messages/conversations/:id
 * 获取会话内的消息列表
 */
router.get('/conversations/:id', authenticate, (req, res) => {
  const conv = db.prepare('SELECT * FROM conversations WHERE id = ? AND (user1_id = ? OR user2_id = ?)').get(req.params.id, req.userId, req.userId);
  if (!conv) {
    return res.status(404).json({ success: false, message: '会话不存在' });
  }

  const { page = 1, limit = 50 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const messages = db.prepare(`
    SELECT dm.*, u.nickname, u.avatar
    FROM direct_messages dm
    JOIN users u ON dm.sender_id = u.id
    WHERE dm.conversation_id = ?
    ORDER BY dm.created_at DESC LIMIT ? OFFSET ?
  `).all(req.params.id, parseInt(limit), offset);

  // 标记消息已读
  db.prepare(`UPDATE direct_messages SET is_read = 1 WHERE conversation_id = ? AND sender_id != ?`).run(req.params.id, req.userId);

  res.json({
    success: true,
    data: messages.reverse().map(m => ({
      id: m.id,
      sender: { id: m.sender_id, name: m.nickname, avatar: m.avatar },
      content: m.content,
      isRead: !!m.is_read,
      isMine: m.sender_id === req.userId,
      createdAt: m.created_at,
    })),
  });
});

/**
 * POST /api/messages/:convId/message
 * 在已有会话中发送消息（凭 convId，不需要 userId）
 */
router.post('/:convId/message', authenticate, (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, message: '消息内容不能为空' });
  }

  const conv = db.prepare(
    'SELECT * FROM conversations WHERE id = ? AND (user1_id = ? OR user2_id = ?)'
  ).get(req.params.convId, req.userId, req.userId);

  if (!conv) {
    return res.status(404).json({ success: false, message: '会话不存在或无权限' });
  }

  const now = new Date().toISOString();
  const targetUserId = conv.user1_id === req.userId ? conv.user2_id : conv.user1_id;
  const blockStatus = getBlockStatus(req.userId, targetUserId);
  if (blockStatus.isBlocked) {
    return res.status(403).json({ success: false, message: '当前无法发送消息（存在屏蔽关系）' });
  }

  db.prepare('UPDATE conversations SET last_message = ?, last_message_time = ? WHERE id = ?')
    .run(content.trim(), now, conv.id);

  const msgId = `msg_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
  db.prepare(
    'INSERT INTO direct_messages (id, conversation_id, sender_id, content, is_read, created_at) VALUES (?, ?, ?, ?, 0, ?)'
  ).run(msgId, conv.id, req.userId, content.trim(), now);

  res.status(201).json({
    success: true,
    data: {
      id: msgId,
      senderId: req.userId,
      content: content.trim(),
      createdAt: now,
    },
  });
});

/**
 * POST /api/messages/conversations/:userId
 * 发送私信（自动创建会话）
 */
router.post('/conversations/:userId', authenticate, (req, res) => {
  const { content } = req.body;
  const targetUserId = req.params.userId;

  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, message: '消息内容不能为空' });
  }

  const targetUser = db.prepare('SELECT id FROM users WHERE id = ?').get(targetUserId);
  if (!targetUser) {
    return res.status(404).json({ success: false, message: '用户不存在' });
  }

  if (targetUserId === req.userId) {
    return res.status(400).json({ success: false, message: '不能给自己发消息' });
  }

  const blockStatus = getBlockStatus(req.userId, targetUserId);
  if (blockStatus.isBlocked) {
    return res.status(403).json({ success: false, message: '当前无法发送消息（存在屏蔽关系）' });
  }

  // 查找或创建会话
  const [u1, u2] = [req.userId, targetUserId].sort();
  let conv = db.prepare('SELECT * FROM conversations WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)').get(u1, u2, u2, u1);

  const now = new Date().toISOString();
  if (!conv) {
    const convId = `conv_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
    db.prepare('INSERT INTO conversations (id, user1_id, user2_id, last_message, last_message_time, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(
      convId, u1, u2, content.trim(), now, now
    );
    conv = db.prepare('SELECT * FROM conversations WHERE id = ?').get(convId);
  } else {
    db.prepare('UPDATE conversations SET last_message = ?, last_message_time = ? WHERE id = ?').run(content.trim(), now, conv.id);
  }

  const msgId = `msg_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
  db.prepare('INSERT INTO direct_messages (id, conversation_id, sender_id, content, is_read, created_at) VALUES (?, ?, ?, ?, 0, ?)').run(
    msgId, conv.id, req.userId, content.trim(), now
  );

  res.status(201).json({
    success: true,
    message: '发送成功',
    data: {
      id: msgId,
      conversationId: conv.id,
      content: content.trim(),
      createdAt: now,
      isMine: true,
    },
  });
});

/**
 * GET /api/messages/notifications
 * 获取互动通知
 */
router.get('/notifications', authenticate, (req, res) => {
  const notifications = db.prepare(`
    SELECT n.*, u.nickname as from_name, u.avatar as from_avatar,
      (SELECT SUBSTR(p.content, 1, 50) FROM posts p WHERE p.id = n.related_post_id) as post_preview
    FROM notifications n
    LEFT JOIN users u ON n.from_user_id = u.id
    WHERE n.user_id = ? AND n.type != 'message'
    ORDER BY n.created_at DESC LIMIT 50
  `).all(req.userId);

  res.json({
    success: true,
    data: notifications.map(n => ({
      id: n.id,
      type: n.type,
      from: n.from_user_id
        ? { id: n.from_user_id, name: n.from_name, avatar: n.from_avatar }
        : null,
      content: n.content,
      relatedPostId: n.related_post_id || null,
      relatedPost: n.post_preview ? `${n.post_preview}...` : null,
      isRead: !!n.is_read,
      createdAt: n.created_at,
    })),
  });
});

/**
 * DELETE /api/messages/notifications
 * 清空所有通知
 */
router.delete('/notifications', authenticate, (req, res) => {
  db.prepare('DELETE FROM notifications WHERE user_id = ?').run(req.userId);
  res.json({ success: true, message: '已清空所有通知' });
});

/**
 * POST /api/messages/notifications/read-all
 * 标记所有通知为已读
 */
router.post('/notifications/read-all', authenticate, (req, res) => {
  db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(req.userId);
  res.json({ success: true, message: '已全部标记为已读' });
});

/**
 * GET /api/messages/unread-count
 * 获取未读消息总数
 */
router.get('/unread-count', authenticate, (req, res) => {
  const unreadNotifs = db.prepare(`
    SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0
  `).get(req.userId).count;

  const unreadMessages = db.prepare(`
    SELECT COUNT(*) as count FROM direct_messages dm
    JOIN conversations c ON dm.conversation_id = c.id
    WHERE (c.user1_id = ? OR c.user2_id = ?) AND dm.sender_id != ? AND dm.is_read = 0
  `).get(req.userId, req.userId, req.userId).count;

  res.json({ success: true, data: { notifications: unreadNotifs, messages: unreadMessages, total: unreadNotifs + unreadMessages } });
});

/**
 * GET /api/messages/conversation-with/:userId
 * 查找与某用户的现有会话 ID（不存在则返回 null）
 */
router.get('/conversation-with/:userId', authenticate, (req, res) => {
  const { userId } = req.params;
  const [u1, u2] = [req.userId, userId].sort();
  const conv = db.prepare(
    'SELECT id FROM conversations WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)'
  ).get(u1, u2, u2, u1);
  res.json({ success: true, data: { conversationId: conv ? conv.id : null } });
});

/**
 * GET /api/messages/block-status/:userId
 * 获取与某用户的屏蔽状态
 */
router.get('/block-status/:userId', authenticate, (req, res) => {
  const { userId } = req.params;
  if (userId === req.userId) {
    return res.json({ success: true, data: { blockedByMe: false, blockedByOther: false, isBlocked: false } });
  }

  const targetUser = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
  if (!targetUser) {
    return res.status(404).json({ success: false, message: '用户不存在' });
  }

  res.json({ success: true, data: getBlockStatus(req.userId, userId) });
});

/**
 * POST /api/messages/block/:userId
 * 设置/取消屏蔽某用户
 */
router.post('/block/:userId', authenticate, (req, res) => {
  const { userId } = req.params;
  const { blocked = true } = req.body ?? {};

  if (userId === req.userId) {
    return res.status(400).json({ success: false, message: '不能屏蔽自己' });
  }

  const targetUser = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
  if (!targetUser) {
    return res.status(404).json({ success: false, message: '用户不存在' });
  }

  if (blocked) {
    db.prepare(
      'INSERT OR IGNORE INTO user_blocks (blocker_id, blocked_id, created_at) VALUES (?, ?, ?)'
    ).run(req.userId, userId, new Date().toISOString());
  } else {
    db.prepare('DELETE FROM user_blocks WHERE blocker_id = ? AND blocked_id = ?').run(req.userId, userId);
  }

  res.json({ success: true, message: blocked ? '已屏蔽该用户' : '已取消屏蔽', data: getBlockStatus(req.userId, userId) });
});

export default router;
