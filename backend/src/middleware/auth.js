import jwt from 'jsonwebtoken';

/**
 * 验证JWT Token中间件（必须登录）
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: '未登录，请先登录' });
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    req.userNickname = payload.nickname;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token无效或已过期' });
  }
}

/**
 * 可选认证中间件（不强制登录）
 */
export function optionalAuthenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = payload.userId;
      req.userNickname = payload.nickname;
    } catch {
      // token无效，继续但不设置userId
    }
  }
  next();
}
