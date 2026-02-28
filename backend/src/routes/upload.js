import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { authenticate } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../uploads');
mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('只支持 JPG, PNG, GIF, WebP 格式'));
    }
  },
});

const router = Router();

/**
 * POST /api/upload/image
 * 上传图片
 */
router.post('/image', authenticate, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: '请选择要上传的图片' });
  }

  const url = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    message: '上传成功',
    data: { url, filename: req.file.filename },
  });
});

/**
 * POST /api/upload/images
 * 批量上传图片（最多9张）
 */
router.post('/images', authenticate, upload.array('images', 9), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: '请选择要上传的图片' });
  }

  const urls = req.files.map(f => `/uploads/${f.filename}`);
  res.json({
    success: true,
    message: '上传成功',
    data: { urls },
  });
});

export default router;
