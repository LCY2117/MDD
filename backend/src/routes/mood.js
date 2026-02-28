import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/mood
 * 获取当前用户的情绪记录
 */
router.get('/', authenticate, (req, res) => {
  const { days = 30 } = req.query;
  const since = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000).toISOString();

  const entries = db.prepare(`
    SELECT * FROM mood_entries
    WHERE user_id = ? AND created_at >= ?
    ORDER BY created_at DESC
  `).all(req.userId, since);

  res.json({ success: true, data: entries.map(formatMood) });
});

/**
 * POST /api/mood
 * 添加情绪记录
 */
router.post('/', authenticate, (req, res) => {
  const { mood, note, date } = req.body;

  if (!mood || !['sunny', 'cloudy', 'rainy'].includes(mood)) {
    return res.status(400).json({ success: false, message: '情绪类型无效' });
  }

  const scoreMap = { sunny: 3, cloudy: 2, rainy: 1 };
  const id = `mood_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
  const now = new Date().toISOString();
  const entryDate = date || now;

  db.prepare(`
    INSERT INTO mood_entries (id, user_id, mood, score, note, date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.userId, mood, scoreMap[mood], note || null, entryDate, now);

  const entry = db.prepare('SELECT * FROM mood_entries WHERE id = ?').get(id);
  res.status(201).json({ success: true, message: '情绪记录成功', data: formatMood(entry) });
});

/**
 * PUT /api/mood/:id
 * 更新情绪记录
 */
router.put('/:id', authenticate, (req, res) => {
  const entry = db.prepare('SELECT * FROM mood_entries WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!entry) {
    return res.status(404).json({ success: false, message: '记录不存在' });
  }

  const { mood, note } = req.body;
  const scoreMap = { sunny: 3, cloudy: 2, rainy: 1 };

  if (mood && !['sunny', 'cloudy', 'rainy'].includes(mood)) {
    return res.status(400).json({ success: false, message: '情绪类型无效' });
  }

  db.prepare(`
    UPDATE mood_entries SET mood = ?, score = ?, note = ? WHERE id = ?
  `).run(mood || entry.mood, scoreMap[mood] || entry.score, note !== undefined ? note : entry.note, req.params.id);

  const updated = db.prepare('SELECT * FROM mood_entries WHERE id = ?').get(req.params.id);
  res.json({ success: true, message: '更新成功', data: formatMood(updated) });
});

/**
 * DELETE /api/mood/:id
 * 删除情绪记录
 */
router.delete('/:id', authenticate, (req, res) => {
  const entry = db.prepare('SELECT * FROM mood_entries WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!entry) {
    return res.status(404).json({ success: false, message: '记录不存在' });
  }

  db.prepare('DELETE FROM mood_entries WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: '记录已删除' });
});

/**
 * GET /api/mood/stats
 * 获取情绪统计
 */
router.get('/stats', authenticate, (req, res) => {
  const { days = 7 } = req.query;
  const since = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000).toISOString();

  const entries = db.prepare(`
    SELECT * FROM mood_entries WHERE user_id = ? AND created_at >= ? ORDER BY created_at ASC
  `).all(req.userId, since);

  const stats = {
    total: entries.length,
    avgScore: entries.length > 0
      ? (entries.reduce((s, e) => s + e.score, 0) / entries.length).toFixed(1)
      : '0.0',
    sunnyDays: entries.filter(e => e.mood === 'sunny').length,
    cloudyDays: entries.filter(e => e.mood === 'cloudy').length,
    rainyDays: entries.filter(e => e.mood === 'rainy').length,
    trend: entries.map(e => ({
      date: new Date(e.date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
      score: e.score,
    })),
  };

  res.json({ success: true, data: stats });
});

function formatMood(entry) {
  return {
    id: entry.id,
    mood: entry.mood,
    score: entry.score,
    note: entry.note,
    date: entry.date,
    createdAt: entry.created_at,
  };
}

export default router;
