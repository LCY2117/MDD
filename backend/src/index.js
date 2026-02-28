import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// 先初始化数据库
import './db/init.js';

// 路由
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import moodRoutes from './routes/mood.js';
import diaryRoutes from './routes/diary.js';
import messageRoutes from './routes/messages.js';
import aiRoutes from './routes/ai.js';
import familyRoutes from './routes/family.js';
import articleRoutes from './routes/articles.js';
import searchRoutes from './routes/search.js';
import uploadRoutes from './routes/upload.js';

// 中间件
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// ─────────────────────────────────────────────────────────────────────────────
// 全局中间件
// ─────────────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务（上传的图片）
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 请求日志（开发环境）
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// API 路由
// ─────────────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '心语社区 API 服务正在运行',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 错误处理
// ─────────────────────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─────────────────────────────────────────────────────────────────────────────
// 启动服务器
// ─────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║      心语社区 后端服务已启动              ║
║  http://localhost:${PORT}                    ║
║  环境: ${process.env.NODE_ENV || 'development'}                    ║
╚══════════════════════════════════════════╝
  `);
});

export default app;
