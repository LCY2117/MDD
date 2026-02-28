import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/diary
 * 获取当前用户的日记列表
 */
router.get('/', authenticate, (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const total = db.prepare('SELECT COUNT(*) as count FROM diary_entries WHERE user_id = ?').get(req.userId).count;
  const entries = db.prepare(`
    SELECT * FROM diary_entries WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?
  `).all(req.userId, parseInt(limit), offset);

  res.json({
    success: true,
    data: {
      entries: entries.map(formatDiary),
      pagination: { total, page: parseInt(page), limit: parseInt(limit) },
    },
  });
});

/**
 * GET /api/diary/:id
 * 获取单个日记
 */
router.get('/:id', authenticate, (req, res) => {
  const entry = db.prepare('SELECT * FROM diary_entries WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!entry) {
    return res.status(404).json({ success: false, message: '日记不存在' });
  }
  res.json({ success: true, data: formatDiary(entry) });
});

/**
 * POST /api/diary
 * 创建日记
 */
router.post('/', authenticate, (req, res) => {
  const { title, content, tags = [], isPrivate = true, mood } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, message: '日记内容不能为空' });
  }

  if (mood && !['sunny', 'cloudy', 'rainy'].includes(mood)) {
    return res.status(400).json({ success: false, message: '心情类型无效' });
  }

  const id = `diary_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO diary_entries (id, user_id, title, content, is_private, mood, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.userId, title || null, content.trim(), isPrivate ? 1 : 0, mood || null, now, now);

  // 插入标签
  const insertTag = db.prepare('INSERT OR IGNORE INTO diary_tags (diary_id, tag) VALUES (?, ?)');
  for (const tag of tags.slice(0, 5)) {
    if (tag && tag.trim()) insertTag.run(id, tag.trim());
  }

  const entry = db.prepare('SELECT * FROM diary_entries WHERE id = ?').get(id);
  res.status(201).json({ success: true, message: '日记保存成功', data: formatDiary(entry) });
});

/**
 * PUT /api/diary/:id
 * 更新日记
 */
router.put('/:id', authenticate, (req, res) => {
  const entry = db.prepare('SELECT * FROM diary_entries WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!entry) {
    return res.status(404).json({ success: false, message: '日记不存在' });
  }

  const { title, content, tags, isPrivate, mood } = req.body;
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE diary_entries SET title = ?, content = ?, is_private = ?, mood = ?, updated_at = ? WHERE id = ?
  `).run(
    title !== undefined ? title : entry.title,
    content !== undefined ? content.trim() : entry.content,
    isPrivate !== undefined ? (isPrivate ? 1 : 0) : entry.is_private,
    mood !== undefined ? mood : entry.mood,
    now,
    req.params.id
  );

  // 更新标签
  if (tags !== undefined) {
    db.prepare('DELETE FROM diary_tags WHERE diary_id = ?').run(req.params.id);
    const insertTag = db.prepare('INSERT OR IGNORE INTO diary_tags (diary_id, tag) VALUES (?, ?)');
    for (const tag of tags.slice(0, 5)) {
      if (tag && tag.trim()) insertTag.run(req.params.id, tag.trim());
    }
  }

  const updated = db.prepare('SELECT * FROM diary_entries WHERE id = ?').get(req.params.id);
  res.json({ success: true, message: '日记更新成功', data: formatDiary(updated) });
});

/**
 * DELETE /api/diary/:id
 * 删除日记
 */
router.delete('/:id', authenticate, (req, res) => {
  const entry = db.prepare('SELECT * FROM diary_entries WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!entry) {
    return res.status(404).json({ success: false, message: '日记不存在' });
  }

  db.prepare('DELETE FROM diary_entries WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: '日记已删除' });
});

function formatDiary(entry) {
  const tags = db.prepare('SELECT tag FROM diary_tags WHERE diary_id = ?').all(entry.id).map(r => r.tag);
  return {
    id: entry.id,
    title: entry.title,
    content: entry.content,
    tags,
    isPrivate: !!entry.is_private,
    mood: entry.mood,
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
  };
}

export default router;
