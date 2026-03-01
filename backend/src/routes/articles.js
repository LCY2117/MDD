import { Router } from 'express';
import db from '../db/database.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/articles
 * 获取知识文章列表
 */
router.get('/', (req, res) => {
  const { category, page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let whereClause = '1=1';
  const params = [];

  if (category) {
    whereClause += ' AND category = ?';
    params.push(category);
  }

  const total = db.prepare(`SELECT COUNT(*) as count FROM articles WHERE ${whereClause}`).get(...params).count;
  const articles = db.prepare(`
    SELECT id, title, category, summary, author, read_count, created_at
    FROM articles WHERE ${whereClause}
    ORDER BY created_at DESC LIMIT ? OFFSET ?
  `).all(...params, parseInt(limit), offset);

  // 获取分类列表
  const categories = db.prepare('SELECT DISTINCT category FROM articles ORDER BY category').all().map(r => r.category);

  res.json({
    success: true,
    data: {
      articles,
      categories,
      pagination: { total, page: parseInt(page), limit: parseInt(limit) },
    },
  });
});

/**
 * GET /api/articles/:id
 * 获取文章详情
 */
router.get('/:id', optionalAuthenticate, (req, res) => {
  const idAliasMap = {
    'support-guide': 'how-to-support',
  };
  const canonicalId = idAliasMap[req.params.id] || req.params.id;

  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(canonicalId);
  if (!article) {
    return res.status(404).json({ success: false, message: '文章不存在' });
  }

  // 增加阅读量
  db.prepare('UPDATE articles SET read_count = read_count + 1 WHERE id = ?').run(canonicalId);

  res.json({ success: true, data: article });
});

/**
 * GET /api/articles/search
 * 搜索文章
 */
router.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ success: false, message: '搜索关键词不能为空' });
  }

  const articles = db.prepare(`
    SELECT id, title, category, summary, author, read_count, created_at
    FROM articles
    WHERE title LIKE ? OR summary LIKE ? OR content LIKE ?
    ORDER BY read_count DESC LIMIT 10
  `).all(`%${q}%`, `%${q}%`, `%${q}%`);

  res.json({ success: true, data: articles });
});

export default router;
