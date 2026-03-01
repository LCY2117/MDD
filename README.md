# 心语社区 (MDD)

一个专为**抑郁症患者及其家属**设计的心理健康支持社区平台，提供情绪追踪、私密日记、社区互动、AI 心理助手及家庭陪伴模式等功能。

---

## 功能特性

| 模块 | 说明 |
|------|------|
| 社区广场 | 发布帖子、点赞、评论，支持图片上传 |
| 情绪追踪 | 每日情绪记录、可视化趋势图表 |
| 私密日记 | 个人加密日记，仅自己可见 |
| AI 心理助手 | 基于大模型的心理支持对话（心语小助手） |
| 家庭模式 | 家属绑定，查看亲人情绪动态，互相陪伴 |
| 私信系统 | 用户间一对一私信 |
| 资讯文章 | 心理健康科普文章 |
| 搜索 | 全站帖子 / 用户搜索 |
| 危机干预 | 自动识别高风险关键词，展示危机热线 |

---

## 技术栈

### 前端
- **框架**：Vue 3 + TypeScript
- **构建**：Vite 7
- **样式**：Tailwind CSS v4 + Radix Vue
- **状态管理**：Pinia
- **路由**：Vue Router 5
- **图表**：Chart.js + vue-chartjs
- **其他**：@vueuse/core、lucide-vue-next、marked、vue-sonner

### 后端
- **运行时**：Node.js (ESM)
- **框架**：Express 5
- **数据库**：SQLite（better-sqlite3，文件存储，无需额外数据库服务）
- **认证**：JWT（jsonwebtoken + bcryptjs）
- **文件上传**：Multer
- **AI 接口**：硅基流动（SiliconFlow）API，默认模型 `Qwen/Qwen2.5-72B-Instruct`

---

## 项目结构

```
MDD/
├── README.md
├── backend/                    # 后端服务
│   ├── package.json
│   ├── data/                   # SQLite 数据库文件（运行后自动生成）
│   ├── uploads/                # 用户上传文件（运行后自动生成）
│   └── src/
│       ├── index.js            # 入口文件
│       ├── db/
│       │   ├── database.js     # 数据库连接
│       │   └── init.js         # 数据库初始化 & 建表
│       ├── middleware/
│       │   ├── auth.js         # JWT 认证中间件
│       │   └── errorHandler.js # 统一错误处理
│       └── routes/             # API 路由
│           ├── auth.js         # 注册 / 登录
│           ├── users.js        # 用户信息
│           ├── posts.js        # 社区帖子
│           ├── mood.js         # 情绪记录
│           ├── diary.js        # 私密日记
│           ├── messages.js     # 私信
│           ├── ai.js           # AI 对话
│           ├── family.js       # 家庭绑定
│           ├── articles.js     # 文章资讯
│           ├── search.js       # 搜索
│           └── upload.js       # 文件上传
└── frontend/                   # 前端应用
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.ts
        ├── App.vue
        ├── components/         # 公共组件
        │   ├── community/      # 社区相关组件
        │   └── ui/             # 基础 UI 组件
        ├── pages/              # 页面组件
        ├── router/             # 路由配置
        ├── stores/             # Pinia 状态管理
        ├── lib/                # 工具函数 & API 客户端
        └── styles/             # 全局样式
```

---

## 快速开始

### 环境要求

- **Node.js** >= 18
- **npm** >= 9

### 1. 克隆项目

```bash
git clone https://github.com/your-username/MDD.git
cd MDD
```

### 2. 配置后端环境变量

```bash
cd backend
cp .env.example .env
```

编辑 `backend/.env`，至少填写以下必填项：

```
JWT_SECRET=your_strong_secret_key
SILICONFLOW_API_KEY=your_api_key   # AI 功能必填，可在 https://siliconflow.cn 申请
```

### 3. 启动后端

```bash
cd backend
npm install
npm run dev        # 开发模式（nodemon 热重载）
# 或
npm start          # 生产模式
```

后端默认运行在 `http://localhost:3001`，数据库和上传目录会自动创建。

### 4. 配置前端环境变量

```bash
cd frontend
cp .env.example .env.local
```

如需修改后端地址，编辑 `VITE_API_URL`（默认已指向 `http://localhost:3001/api`，本地开发无需修改）。

### 5. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端默认运行在 `http://localhost:5173`。

---

## API 概览

所有接口以 `/api` 为前缀，返回统一格式：

```json
{ "success": true, "data": { ... } }
{ "success": false, "message": "错误描述" }
```

健康检查：`GET /api/health`

| 前缀 | 功能 |
|------|------|
| `/api/auth` | 注册、登录 |
| `/api/users` | 用户信息、头像 |
| `/api/posts` | 帖子 CRUD、点赞、评论 |
| `/api/mood` | 情绪记录 |
| `/api/diary` | 日记 CRUD |
| `/api/messages` | 私信 |
| `/api/ai` | AI 对话 |
| `/api/family` | 家庭绑定 |
| `/api/articles` | 文章 |
| `/api/search` | 搜索 |
| `/api/upload` | 文件上传 |

---

## 生产部署

### 后端

```bash
cd backend
npm install --omit=dev
NODE_ENV=production npm start
```

建议使用 PM2 进行进程管理：

```bash
npm install -g pm2
pm2 start src/index.js --name mdd-backend
pm2 save
```

### 前端

```bash
cd frontend
npm install
npm run build   # 产物在 dist/ 目录
```

将 `dist/` 目录部署到任意静态文件服务器（Nginx、Vercel、Cloudflare Pages 等）。

#### Nginx 示例配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    root /var/www/mdd/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 反代后端 API
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 反代上传文件
    location /uploads/ {
        proxy_pass http://127.0.0.1:3001;
    }
}
```

---

## 注意事项

- 数据库文件位于 `backend/data/mdd.db`，请定期备份。
- 上传文件位于 `backend/uploads/`，生产环境建议挂载持久化存储或使用对象存储。
- AI 功能依赖硅基流动 API Key，未配置时 AI 对话接口会返回错误。
- 请勿将包含真实密钥的 `.env` 文件提交到版本控制。

---

## License

MIT
