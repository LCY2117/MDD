import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/database.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';

const router = Router();

/**
 * 格式化帖子数据（添加作者信息、标签、图片等）
 */
function formatPost(post, currentUserId) {
  if (!post) return null;

  const author = db.prepare('SELECT id, nickname, avatar FROM users WHERE id = ?').get(post.author_id);
  const tags = db.prepare('SELECT tag FROM post_tags WHERE post_id = ?').all(post.id).map(r => r.tag);
  const images = db.prepare('SELECT url FROM post_images WHERE post_id = ? ORDER BY order_index').all(post.id).map(r => r.url);

  let isLiked = false;
  let isFavorited = false;
  if (currentUserId) {
    isLiked = !!db.prepare('SELECT 1 FROM post_likes WHERE user_id = ? AND post_id = ?').get(currentUserId, post.id);
    isFavorited = !!db.prepare('SELECT 1 FROM favorites WHERE user_id = ? AND post_id = ?').get(currentUserId, post.id);
  }

  return {
    id: post.id,
    author: post.is_anonymous
      ? { name: '匿名用户', isAnonymous: true }
      : { id: author?.id, name: author?.nickname || '未知用户', avatar: author?.avatar, isAnonymous: false },
    content: post.content,
    tags,
    images,
    likes: post.like_count,
    comments: post.comment_count,
    isLiked,
    isFavorited,
    isPinned: !!post.is_pinned,
    createdAt: post.created_at,
  };
}

/**
 * GET /api/posts
 * 获取帖子列表（支持分页、排序、搜索）
 */
router.get('/', optionalAuthenticate, (req, res) => {
  const { tab = 'hot', page = 1, limit = 20, tag, search } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let orderBy = 'p.like_count DESC, p.created_at DESC';
  let whereClause = '1=1';
  const params = [];

  if (tab === 'latest') {
    orderBy = 'p.created_at DESC';
  } else if (tab === 'following' && req.userId) {
    whereClause = 'p.author_id IN (SELECT following_id FROM follows WHERE follower_id = ?)';
    params.push(req.userId);
    orderBy = 'p.created_at DESC';
  }

  if (tag) {
    whereClause += ` AND p.id IN (SELECT post_id FROM post_tags WHERE tag = ?)`;
    params.push(tag);
  }

  if (search) {
    whereClause += ` AND (p.content LIKE ? OR p.id IN (SELECT post_id FROM post_tags WHERE tag LIKE ?))`;
    params.push(`%${search}%`, `%${search}%`);
  }

  const total = db.prepare(`SELECT COUNT(*) as count FROM posts p WHERE ${whereClause}`).get(...params).count;
  const posts = db.prepare(`
    SELECT p.* FROM posts p WHERE ${whereClause} ORDER BY ${orderBy} LIMIT ? OFFSET ?
  `).all(...params, parseInt(limit), offset);

  res.json({
    success: true,
    data: {
      posts: posts.map(p => formatPost(p, req.userId)),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    },
  });
});

/**
 * GET /api/posts/:id
 * 获取单个帖子详情
 */
router.get('/:id', optionalAuthenticate, (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: '帖子不存在' });
  }
  res.json({ success: true, data: formatPost(post, req.userId) });
});

/**
 * POST /api/posts
 * 发布帖子
 */
router.post('/', authenticate, (req, res) => {
  const { content, isAnonymous = false, tags = [], images = [] } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, message: '内容不能为空' });
  }
  if (content.length > 1000) {
    return res.status(400).json({ success: false, message: '内容不能超过1000字' });
  }

  const id = `post_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO posts (id, author_id, content, is_anonymous, like_count, comment_count, created_at, updated_at)
    VALUES (?, ?, ?, ?, 0, 0, ?, ?)
  `).run(id, req.userId, content.trim(), isAnonymous ? 1 : 0, now, now);

  // 插入标签
  const insertTag = db.prepare('INSERT OR IGNORE INTO post_tags (post_id, tag) VALUES (?, ?)');
  for (const tag of tags.slice(0, 3)) {
    if (tag && tag.trim()) insertTag.run(id, tag.trim());
  }

  // 插入图片
  const insertImage = db.prepare('INSERT INTO post_images (id, post_id, url, order_index) VALUES (?, ?, ?, ?)');
  for (let i = 0; i < Math.min(images.length, 9); i++) {
    insertImage.run(uuidv4(), id, images[i], i);
  }

  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
  res.status(201).json({
    success: true,
    message: '发布成功',
    data: formatPost(post, req.userId),
  });
});

/**
 * DELETE /api/posts/:id
 * 删除帖子
 */
router.delete('/:id', authenticate, (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: '帖子不存在' });
  }
  if (post.author_id !== req.userId) {
    return res.status(403).json({ success: false, message: '无权删除此帖子' });
  }

  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: '帖子已删除' });
});

/**
 * POST /api/posts/:id/like
 * 点赞/取消点赞帖子
 */
router.post('/:id/like', authenticate, (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: '帖子不存在' });
  }

  const existing = db.prepare('SELECT * FROM post_likes WHERE user_id = ? AND post_id = ?').get(req.userId, req.params.id);

  if (existing) {
    db.prepare('DELETE FROM post_likes WHERE user_id = ? AND post_id = ?').run(req.userId, req.params.id);
    db.prepare('UPDATE posts SET like_count = like_count - 1 WHERE id = ? AND like_count > 0').run(req.params.id);
    res.json({ success: true, message: '取消点赞', data: { isLiked: false } });
  } else {
    db.prepare('INSERT INTO post_likes (user_id, post_id, created_at) VALUES (?, ?, ?)').run(
      req.userId, req.params.id, new Date().toISOString()
    );
    db.prepare('UPDATE posts SET like_count = like_count + 1 WHERE id = ?').run(req.params.id);

    // 发送通知给作者（非匿名帖子）
    if (!post.is_anonymous && post.author_id !== req.userId) {
      const notifId = `notif_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
      db.prepare(`
        INSERT INTO notifications (id, user_id, type, from_user_id, content, related_post_id, is_read, created_at)
        VALUES (?, ?, 'like', ?, '赞了你的帖子', ?, 0, ?)
      `).run(notifId, post.author_id, req.userId, req.params.id, new Date().toISOString());
    }

    res.json({ success: true, message: '点赞成功', data: { isLiked: true } });
  }
});

/**
 * POST /api/posts/:id/favorite
 * 收藏/取消收藏帖子
 */
router.post('/:id/favorite', authenticate, (req, res) => {
  const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: '帖子不存在' });
  }

  const existing = db.prepare('SELECT * FROM favorites WHERE user_id = ? AND post_id = ?').get(req.userId, req.params.id);

  if (existing) {
    db.prepare('DELETE FROM favorites WHERE user_id = ? AND post_id = ?').run(req.userId, req.params.id);
    res.json({ success: true, message: '取消收藏', data: { isFavorited: false } });
  } else {
    db.prepare('INSERT INTO favorites (user_id, post_id, created_at) VALUES (?, ?, ?)').run(
      req.userId, req.params.id, new Date().toISOString()
    );
    res.json({ success: true, message: '收藏成功', data: { isFavorited: true } });
  }
});

/**
 * GET /api/posts/:id/comments
 * 获取帖子评论
 */
router.get('/:id/comments', optionalAuthenticate, (req, res) => {
  const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: '帖子不存在' });
  }

  const comments = db.prepare(`
    SELECT c.*, u.nickname, u.avatar
    FROM comments c
    LEFT JOIN users u ON c.author_id = u.id
    WHERE c.post_id = ? AND c.parent_id IS NULL
    ORDER BY c.created_at ASC
  `).all(req.params.id);

  const formatted = comments.map(c => {
    const isLiked = req.userId
      ? !!db.prepare('SELECT 1 FROM comment_likes WHERE user_id = ? AND comment_id = ?').get(req.userId, c.id)
      : false;

    const replies = db.prepare(`
      SELECT c2.*, u.nickname, u.avatar
      FROM comments c2
      LEFT JOIN users u ON c2.author_id = u.id
      WHERE c2.parent_id = ?
      ORDER BY c2.created_at ASC
    `).all(c.id);

    return {
      id: c.id,
      author: c.is_anonymous
        ? { name: '匿名用户', isAnonymous: true }
        : { id: c.author_id, name: c.nickname || '未知用户', avatar: c.avatar, isAnonymous: false },
      content: c.content,
      likes: c.like_count,
      isLiked,
      createdAt: c.created_at,
      replies: replies.map(r => ({
        id: r.id,
        author: r.is_anonymous
          ? { name: '匿名用户', isAnonymous: true }
          : { id: r.author_id, name: r.nickname || '未知用户', avatar: r.avatar, isAnonymous: false },
        content: r.content,
        likes: r.like_count,
        createdAt: r.created_at,
      })),
    };
  });

  res.json({ success: true, data: formatted });
});

/**
 * POST /api/posts/:id/comments
 * 发表评论
 */
router.post('/:id/comments', authenticate, (req, res) => {
  const { content, isAnonymous = false, parentId } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, message: '评论内容不能为空' });
  }
  if (content.length > 500) {
    return res.status(400).json({ success: false, message: '评论不能超过500字' });
  }

  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: '帖子不存在' });
  }

  const commentId = `comment_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO comments (id, post_id, author_id, content, is_anonymous, like_count, parent_id, created_at)
    VALUES (?, ?, ?, ?, ?, 0, ?, ?)
  `).run(commentId, req.params.id, req.userId, content.trim(), isAnonymous ? 1 : 0, parentId || null, now);

  // 更新帖子评论数
  db.prepare('UPDATE posts SET comment_count = comment_count + 1 WHERE id = ?').run(req.params.id);

  // 发送通知给帖子作者
  if (!post.is_anonymous && post.author_id !== req.userId) {
    const notifId = `notif_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
    db.prepare(`
      INSERT INTO notifications (id, user_id, type, from_user_id, content, related_post_id, is_read, created_at)
      VALUES (?, ?, 'comment', ?, '回复了你的帖子', ?, 0, ?)
    `).run(notifId, post.author_id, req.userId, req.params.id, now);
  }

  const user = db.prepare('SELECT nickname, avatar FROM users WHERE id = ?').get(req.userId);
  res.status(201).json({
    success: true,
    message: '评论成功',
    data: {
      id: commentId,
      author: isAnonymous
        ? { name: '匿名用户', isAnonymous: true }
        : { id: req.userId, name: user?.nickname, avatar: user?.avatar, isAnonymous: false },
      content: content.trim(),
      likes: 0,
      isLiked: false,
      createdAt: now,
      replies: [],
    },
  });
});

/**
 * GET /api/posts/user/:userId
 * 获取指定用户的公开帖子
 */
router.get('/user/:userId', optionalAuthenticate, (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  // 查询非匿名帖子
  const isOwnProfile = req.userId === req.params.userId;
  const whereClause = isOwnProfile ? 'author_id = ?' : 'author_id = ? AND is_anonymous = 0';

  const total = db.prepare(`SELECT COUNT(*) as count FROM posts WHERE ${whereClause}`).get(req.params.userId).count;
  const posts = db.prepare(`
    SELECT * FROM posts WHERE ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?
  `).all(req.params.userId, parseInt(limit), offset);

  res.json({
    success: true,
    data: {
      posts: posts.map(p => formatPost(p, req.userId)),
      pagination: { total, page: parseInt(page), limit: parseInt(limit) },
    },
  });
});

/**
 * GET /api/posts/user/:userId/liked
 * 获取用户点赞的帖子
 */
router.get('/user/:userId/liked', authenticate, (req, res) => {
  if (req.userId !== req.params.userId) {
    return res.status(403).json({ success: false, message: '无权查看' });
  }

  const posts = db.prepare(`
    SELECT p.* FROM posts p
    JOIN post_likes pl ON p.id = pl.post_id
    WHERE pl.user_id = ?
    ORDER BY pl.created_at DESC
  `).all(req.userId);

  res.json({ success: true, data: { posts: posts.map(p => formatPost(p, req.userId)) } });
});

/**
 * GET /api/posts/user/:userId/favorites
 * 获取用户收藏的帖子
 */
router.get('/user/:userId/favorites', authenticate, (req, res) => {
  if (req.userId !== req.params.userId) {
    return res.status(403).json({ success: false, message: '无权查看' });
  }

  const posts = db.prepare(`
    SELECT p.* FROM posts p
    JOIN favorites f ON p.id = f.post_id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
  `).all(req.userId);

  res.json({ success: true, data: { posts: posts.map(p => formatPost(p, req.userId)) } });
});

export default router;
