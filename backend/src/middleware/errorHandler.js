/**
 * 统一错误处理中间件
 */
export function errorHandler(err, req, res, next) {
  console.error('服务器错误:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({ success: false, message: '数据已存在' });
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : '服务器内部错误',
  });
}

/**
 * 404处理
 */
export function notFound(req, res) {
  res.status(404).json({ success: false, message: `路由 ${req.path} 不存在` });
}
