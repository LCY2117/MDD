import { Router } from 'express';
import db from '../db/database.js';
import { optionalAuthenticate } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/search
 * 全局搜索（帖子、用户、文章）
 */
router.get('/', optionalAuthenticate, (req, res) => {
  const { q, type = 'all', page = 1, limit = 20 } = req.query;

  if (!q || q.trim().length < 1) {
    return res.status(400).json({ success: false, message: '搜索关键词不能为空' });
  }

  const keyword = q.trim();
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const result = {};

  // 搜索帖子
  if (type === 'all' || type === 'posts') {
    const posts = db.prepare(`
      SELECT p.id, p.content, p.is_anonymous, p.like_count, p.comment_count, p.created_at,
        u.nickname as author_name, u.avatar as author_avatar
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.content LIKE ?
        OR p.id IN (SELECT post_id FROM post_tags WHERE tag LIKE ?)
      ORDER BY p.like_count DESC LIMIT ? OFFSET ?
    `).all(`%${keyword}%`, `%${keyword}%`, parseInt(limit), offset);

    result.posts = posts.map(p => ({
      id: p.id,
      content: p.content.length > 100 ? p.content.substring(0, 100) + '...' : p.content,
      author: p.is_anonymous ? { name: '匿名用户', isAnonymous: true } : { name: p.author_name, avatar: p.author_avatar },
      likes: p.like_count,
      comments: p.comment_count,
      createdAt: p.created_at,
    }));
  }

  // 搜索用户（仅昵称，不搜索匿名内容）
  if (type === 'all' || type === 'users') {
    const users = db.prepare(`
      SELECT id, nickname, avatar, bio FROM users WHERE nickname LIKE ? LIMIT ?
    `).all(`%${keyword}%`, parseInt(limit));

    result.users = users;
  }

  // 搜索文章
  if (type === 'all' || type === 'articles') {
    const articles = db.prepare(`
      SELECT id, title, category, summary FROM articles
      WHERE title LIKE ? OR summary LIKE ? LIMIT ?
    `).all(`%${keyword}%`, `%${keyword}%`, parseInt(limit));

    result.articles = articles;
  }

  res.json({ success: true, data: result, keyword });
});

export default router;
