import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/database.js';

const router = Router();

/**
 * POST /api/auth/register
 * 用户注册（手机号/邮箱+密码，模拟微信登录）
 */
router.post('/register', (req, res) => {
  const { username, nickname, password } = req.body;

  if (!username || !nickname || !password) {
    return res.status(400).json({ success: false, message: '用户名、昵称和密码不能为空' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: '密码至少6位' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    return res.status(409).json({ success: false, message: '用户名已存在' });
  }

  const id = `user_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
  const passwordHash = bcrypt.hashSync(password, 10);
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO users (id, username, nickname, avatar, bio, user_mode, join_date, created_at, updated_at)
    VALUES (?, ?, ?, '', '', 'patient', ?, ?, ?)
  `).run(id, username, nickname, now, now, now);

  // 创建用户设置
  db.prepare(`
    INSERT INTO user_settings (user_id) VALUES (?)
  `).run(id);

  // 存储密码（单独存储，不在users表中）
  // 使用一个简单的auth表
  db.prepare(`
    CREATE TABLE IF NOT EXISTS auth_credentials (
      user_id TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `).run();

  db.prepare('INSERT INTO auth_credentials (user_id, password_hash) VALUES (?, ?)').run(id, passwordHash);

  const token = jwt.sign({ userId: id, nickname }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const user = db.prepare('SELECT id, username, nickname, avatar, bio, user_mode, is_vip, join_date FROM users WHERE id = ?').get(id);

  res.status(201).json({
    success: true,
    message: '注册成功',
    data: { token, user },
  });
});

/**
 * POST /api/auth/login
 * 用户登录
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
  }

  // 确保auth_credentials表存在
  db.prepare(`
    CREATE TABLE IF NOT EXISTS auth_credentials (
      user_id TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `).run();

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) {
    return res.status(401).json({ success: false, message: '用户名或密码错误' });
  }

  const cred = db.prepare('SELECT password_hash FROM auth_credentials WHERE user_id = ?').get(user.id);
  if (!cred || !bcrypt.compareSync(password, cred.password_hash)) {
    return res.status(401).json({ success: false, message: '用户名或密码错误' });
  }

  // 更新最后活跃时间
  db.prepare('UPDATE users SET last_active = ? WHERE id = ?').run(new Date().toISOString(), user.id);

  const token = jwt.sign({ userId: user.id, nickname: user.nickname }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.json({
    success: true,
    message: '登录成功',
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        bio: user.bio,
        userMode: user.user_mode,
        isVip: !!user.is_vip,
        joinDate: user.join_date,
      },
    },
  });
});

/**
 * POST /api/auth/wechat-mock
 * 模拟微信一键登录（开发用，生产环境需替换为真实微信OAuth）
 */
router.post('/wechat-mock', (req, res) => {
  const { openid } = req.body;

  // 模拟微信openid生成或查找用户
  const mockOpenid = openid || `wx_${Date.now()}`;
  const username = `wx_${mockOpenid.slice(-8)}`;

  // 确保auth_credentials表存在
  db.prepare(`
    CREATE TABLE IF NOT EXISTS auth_credentials (
      user_id TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `).run();

  let user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user) {
    // 首次登录，自动创建账号
    const id = `user_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
    const now = new Date().toISOString();
    const nickname = `用户${id.slice(-6)}`;

    db.prepare(`
      INSERT INTO users (id, username, nickname, avatar, bio, user_mode, join_date, created_at, updated_at)
      VALUES (?, ?, ?, '', '', 'patient', ?, ?, ?)
    `).run(id, username, nickname, now, now, now);

    db.prepare('INSERT OR IGNORE INTO user_settings (user_id) VALUES (?)').run(id);

    user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }

  db.prepare('UPDATE users SET last_active = ? WHERE id = ?').run(new Date().toISOString(), user.id);

  const token = jwt.sign({ userId: user.id, nickname: user.nickname }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.json({
    success: true,
    message: '登录成功',
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        bio: user.bio,
        userMode: user.user_mode,
        isVip: !!user.is_vip,
        joinDate: user.join_date,
      },
    },
  });
});

/**
 * POST /api/auth/refresh
 * 刷新Token
 */
router.post('/refresh', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: '未提供Token' });
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    const user = db.prepare('SELECT id, nickname FROM users WHERE id = ?').get(payload.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: '用户不存在' });
    }

    const newToken = jwt.sign({ userId: user.id, nickname: user.nickname }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.json({ success: true, data: { token: newToken } });
  } catch {
    res.status(401).json({ success: false, message: 'Token无效' });
  }
});

export default router;
