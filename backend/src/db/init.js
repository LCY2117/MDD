import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.join(__dirname, '../../data');
const dbPath = path.join(dbDir, 'mdd.db');

// 确保数据目录存在
mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);

// 启用WAL模式提升性能
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// 初始化所有表
db.exec(`
  -- 用户表
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    nickname TEXT NOT NULL,
    avatar TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    user_mode TEXT DEFAULT 'patient' CHECK(user_mode IN ('patient', 'caregiver')),
    is_vip INTEGER DEFAULT 0,
    is_anonymous INTEGER DEFAULT 0,
    join_date TEXT NOT NULL,
    last_active TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  -- 帖子表
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    content TEXT NOT NULL,
    is_anonymous INTEGER DEFAULT 0,
    is_pinned INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users(id)
  );

  -- 帖子图片表
  CREATE TABLE IF NOT EXISTS post_images (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
  );

  -- 帖子标签表
  CREATE TABLE IF NOT EXISTS post_tags (
    post_id TEXT NOT NULL,
    tag TEXT NOT NULL,
    PRIMARY KEY (post_id, tag),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
  );

  -- 帖子点赞表
  CREATE TABLE IF NOT EXISTS post_likes (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
  );

  -- 评论表
  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    author_id TEXT NOT NULL,
    content TEXT NOT NULL,
    is_anonymous INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    parent_id TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES comments(id)
  );

  -- 评论点赞表
  CREATE TABLE IF NOT EXISTS comment_likes (
    user_id TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (user_id, comment_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
  );

  -- 关注关系表
  CREATE TABLE IF NOT EXISTS follows (
    follower_id TEXT NOT NULL,
    following_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (following_id) REFERENCES users(id)
  );

  -- 情绪记录表
  CREATE TABLE IF NOT EXISTS mood_entries (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    mood TEXT NOT NULL CHECK(mood IN ('sunny', 'cloudy', 'rainy')),
    score INTEGER NOT NULL CHECK(score BETWEEN 1 AND 3),
    note TEXT,
    date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- 日记表
  CREATE TABLE IF NOT EXISTS diary_entries (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    is_private INTEGER DEFAULT 1,
    mood TEXT CHECK(mood IN ('sunny', 'cloudy', 'rainy')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- 日记标签表
  CREATE TABLE IF NOT EXISTS diary_tags (
    diary_id TEXT NOT NULL,
    tag TEXT NOT NULL,
    PRIMARY KEY (diary_id, tag),
    FOREIGN KEY (diary_id) REFERENCES diary_entries(id) ON DELETE CASCADE
  );

  -- 私信会话表
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    user1_id TEXT NOT NULL,
    user2_id TEXT NOT NULL,
    last_message TEXT,
    last_message_time TEXT,
    created_at TEXT NOT NULL,
    UNIQUE(user1_id, user2_id),
    FOREIGN KEY (user1_id) REFERENCES users(id),
    FOREIGN KEY (user2_id) REFERENCES users(id)
  );

  -- 私信消息表
  CREATE TABLE IF NOT EXISTS direct_messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
  );

  -- 通知表
  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('like', 'comment', 'follow', 'system', 'family')),
    from_user_id TEXT,
    content TEXT NOT NULL,
    related_post_id TEXT,
    is_read INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (from_user_id) REFERENCES users(id),
    FOREIGN KEY (related_post_id) REFERENCES posts(id) ON DELETE SET NULL
  );

  -- AI聊天历史表
  CREATE TABLE IF NOT EXISTS ai_chat_history (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- 家庭绑定表
  CREATE TABLE IF NOT EXISTS family_bindings (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    caregiver_id TEXT NOT NULL,
    relation TEXT DEFAULT '家属',
    share_mood INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    UNIQUE(patient_id, caregiver_id),
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (caregiver_id) REFERENCES users(id)
  );

  -- 家庭邀请码表
  CREATE TABLE IF NOT EXISTS family_invites (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    is_used INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
  );

  -- 知识文章表
  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    author TEXT DEFAULT '心语编辑部',
    read_count INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  -- 收藏表
  CREATE TABLE IF NOT EXISTS favorites (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
  );

  -- 用户设置表
  CREATE TABLE IF NOT EXISTS user_settings (
    user_id TEXT PRIMARY KEY,
    notify_likes INTEGER DEFAULT 1,
    notify_comments INTEGER DEFAULT 1,
    notify_follows INTEGER DEFAULT 1,
    notify_system INTEGER DEFAULT 1,
    notify_family INTEGER DEFAULT 1,
    privacy_show_posts INTEGER DEFAULT 1,
    privacy_allow_message INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// 插入种子数据
const insertSeedData = db.transaction(() => {
  const now = new Date().toISOString();

  // 检查是否已有数据
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count > 0) {
    console.log('数据库已有数据，跳过种子数据插入');
    return;
  }

  // 插入示例用户
  const insertUser = db.prepare(`
    INSERT INTO users (id, username, nickname, avatar, bio, user_mode, join_date, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run('user_001', 'xiaoyu', '小雨', '', '慢慢来，一切都会好起来的', 'patient', '2024-01-15T00:00:00.000Z', now, now);
  insertUser.run('user_002', 'xiaoyun', '小云', '', '每天进步一点点', 'patient', '2024-02-10T00:00:00.000Z', now, now);
  insertUser.run('user_003', 'mama_01', '温柔的妈妈', '', '陪伴是最长情的告白', 'caregiver', '2024-03-05T00:00:00.000Z', now, now);
  insertUser.run('user_004', 'xiaoxing', '小星', '', '星光不问赶路人', 'patient', '2024-04-20T00:00:00.000Z', now, now);

  // 插入示例帖子
  const insertPost = db.prepare(`
    INSERT INTO posts (id, author_id, content, is_anonymous, is_pinned, like_count, comment_count, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const post1CreatedAt = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString();
  const post2CreatedAt = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
  const post3CreatedAt = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
  const post4CreatedAt = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();

  insertPost.run('post_001', 'user_002', '分享一个帮助我度过低谷期的方法：每天写下三件小确幸。可以很简单，比如今天的阳光很好，或者喝到了喜欢的咖啡。慢慢地，会发现生活中还是有很多美好的。', 0, 1, 256, 45, post1CreatedAt, post1CreatedAt);
  insertPost.run('post_002', 'user_001', '今天终于鼓起勇气去看了心理咨询师。虽然还是很紧张，但咨询师很温和，让我感觉被理解了。想告诉大家，寻求专业帮助不是软弱，是勇敢。', 1, 0, 342, 67, post2CreatedAt, post2CreatedAt);
  insertPost.run('post_003', 'user_004', '给大家推荐一些我常听的舒缓音乐，在焦虑的时候听会好一些。希望也能帮到你们。', 0, 0, 89, 12, post3CreatedAt, post3CreatedAt);
  insertPost.run('post_004', 'user_001', '今天第30天坚持吃药了。虽然效果还不是很明显，但我会继续坚持。相信会好起来的。', 1, 0, 178, 31, post4CreatedAt, post4CreatedAt);

  // 插入帖子标签
  const insertTag = db.prepare('INSERT INTO post_tags (post_id, tag) VALUES (?, ?)');
  insertTag.run('post_001', '自我照顾');
  insertTag.run('post_001', '经验分享');
  insertTag.run('post_002', '心理咨询');
  insertTag.run('post_002', '勇气');
  insertTag.run('post_003', '音乐分享');
  insertTag.run('post_003', '放松');
  insertTag.run('post_004', '每日打卡');
  insertTag.run('post_004', '坚持');

  // 插入知识文章
  const insertArticle = db.prepare(`
    INSERT INTO articles (id, title, category, summary, content, author, read_count, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertArticle.run(
    'what-is-depression',
    '什么是抑郁症？',
    '基础知识',
    '了解抑郁症的症状、成因和常见误区',
    `# 什么是抑郁症？

抑郁症是一种常见且严重的心理疾病，它会影响你的感觉、思维方式以及行为。

## 主要症状

- 持续的悲伤或空虚感
- 对原本喜欢的事物失去兴趣
- 睡眠改变（失眠或嗜睡）
- 食欲和体重变化
- 疲劳和精力不足
- 注意力、记忆力下降
- 感到无价值或过度内疚
- 有死亡或自杀的想法

## 常见误区

**误区1：抑郁症只是"想太多"**
抑郁症是真实的疾病，不是性格软弱或意志力不强的表现。

**误区2：只要振作起来就好了**
抑郁症需要专业治疗，就像糖尿病需要胰岛素一样。

## 治疗方式

抑郁症是可以治疗的！常见的治疗方式包括：
- 心理治疗（如认知行为疗法）
- 药物治疗
- 两者结合

如果你怀疑自己或身边人患有抑郁症，请尽快寻求专业帮助。`,
    '心语编辑部',
    1200,
    now,
    now
  );

  insertArticle.run(
    'how-to-support',
    '如何陪伴抑郁症患者',
    '家属指南',
    '给家属和朋友的实用建议',
    `# 如何陪伴抑郁症患者

陪伴抑郁症患者是一段充满爱与挑战的旅程。

## 应该做的

**倾听，不评判**
给他们空间表达感受，不要急于给建议或解决问题。

**鼓励就医**
温和地鼓励他们寻求专业帮助，必要时陪同就医。

**提供实际帮助**
帮助做饭、处理日常事务，减轻他们的负担。

**保持联系**
定期检查，让他们知道你在关心他们。

## 不要做的

- 不要说"想开点就好了"
- 不要忽视他们的痛苦
- 不要强迫他们"振作起来"
- 不要以为他们在寻求关注

## 照顾好自己

作为照顾者，你也需要照顾自己的心理健康。寻求支持团体或心理咨询也很重要。`,
    '心语编辑部',
    890,
    now,
    now
  );

  insertArticle.run(
    'medication-guide',
    '认识常用抗抑郁药物',
    '用药指南',
    '药物作用、副作用和注意事项',
    `# 认识常用抗抑郁药物

抗抑郁药物是治疗抑郁症的重要手段之一。

## 常见药物类型

**SSRIs（选择性5-羟色胺再摄取抑制剂）**
这是目前最常用的抗抑郁药，包括氟西汀、舍曲林等。

**SNRIs（5-羟色胺和去甲肾上腺素再摄取抑制剂）**
如文拉法辛、度洛西汀等。

## 重要注意事项

- 药物需要2-4周才能起效，请耐心等待
- 初期可能有轻微副作用（如恶心、困倦），通常会消失
- 不要突然停药，需要在医生指导下逐渐减量
- 如果遇到问题，及时联系你的医生

## 关于"上瘾"的担忧

抗抑郁药物不会导致"上瘾"，但需要规律服用才能发挥效果。

记住：药物治疗只是综合治疗的一部分，心理治疗同样重要。`,
    '心语编辑部',
    650,
    now,
    now
  );

  insertArticle.run(
    'therapy-types',
    '心理咨询有哪些类型',
    '治疗方式',
    '了解不同的心理治疗方法',
    `# 心理咨询有哪些类型

心理治疗是抑郁症综合治疗的重要组成部分。

## 认知行为疗法（CBT）

这是目前最有研究支持的心理治疗方法之一。
- 帮助识别和改变负面思维模式
- 学习新的应对技能
- 通常需要12-20次会谈

## 人际治疗（IPT）

专注于改善人际关系和社会功能。
- 处理人际冲突
- 应对生活变化
- 建立支持网络

## 正念认知疗法（MBCT）

结合认知疗法和正念冥想。
- 减少抑郁复发
- 增强自我意识
- 适合有复发史的患者

## 如何选择？

选择哪种治疗方式取决于你的具体情况、偏好和治疗师的专长。建议与专业人士详细讨论，找到最适合你的方案。`,
    '心语编辑部',
    780,
    now,
    now
  );

  // 插入家庭绑定
  const insertFamily = db.prepare(`
    INSERT INTO family_bindings (id, patient_id, caregiver_id, relation, share_mood, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertFamily.run('bind_001', 'user_001', 'user_003', '妈妈', 1, now);

  console.log('种子数据插入成功！');
});

insertSeedData();

console.log(`数据库初始化完成: ${dbPath}`);

export default db;
