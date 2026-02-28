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
    privacy_hide_profile INTEGER DEFAULT 0,
    privacy_allow_follow INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// 迁移：旧库可能缺少新增列
try { db.exec(`ALTER TABLE user_settings ADD COLUMN privacy_hide_profile INTEGER DEFAULT 0`); } catch {}
try { db.exec(`ALTER TABLE user_settings ADD COLUMN privacy_allow_follow INTEGER DEFAULT 1`); } catch {}

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

  insertUser.run('user_001', 'xiaoyu', '小雨', 'https://api.dicebear.com/9.x/lorelei/svg?seed=xiaoyu&backgroundColor=b6e3f4', '慢慢来，一切都会好起来的', 'patient', '2024-01-15T00:00:00.000Z', now, now);
  insertUser.run('user_002', 'xiaoyun', '小云', 'https://api.dicebear.com/9.x/lorelei/svg?seed=xiaoyun&backgroundColor=c0aede', '每天进步一点点', 'patient', '2024-02-10T00:00:00.000Z', now, now);
  insertUser.run('user_003', 'mama_01', '温柔的妈妈', 'https://api.dicebear.com/9.x/lorelei/svg?seed=mama01&backgroundColor=d1f7c4', '陪伴是最长情的告白', 'caregiver', '2024-03-05T00:00:00.000Z', now, now);
  insertUser.run('user_004', 'xiaoxing', '小星', 'https://api.dicebear.com/9.x/lorelei/svg?seed=xiaoxing&backgroundColor=ffd5dc', '星光不问赶路人', 'patient', '2024-04-20T00:00:00.000Z', now, now);

  // 插入示例帖子
  const insertPost = db.prepare(`
    INSERT INTO posts (id, author_id, content, is_anonymous, is_pinned, like_count, comment_count, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const post1CreatedAt = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString();
  const post2CreatedAt = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
  const post3CreatedAt = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
  const post4CreatedAt = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();

  insertPost.run('post_001', 'user_002', '分享一个帮助我度过低谷期的方法：每天写下三件小确幸。可以很简单，比如今天的阳光很好，或者喝到了喜欢的咖啡。慢慢地，会发现生活中还是有很多美好的。', 0, 1, 256, 10, post1CreatedAt, post1CreatedAt);
  insertPost.run('post_002', 'user_001', '今天终于鼓起勇气去看了心理咨询师。虽然还是很紧张，但咨询师很温和，让我感觉被理解了。想告诉大家，寻求专业帮助不是软弱，是勇敢。', 1, 0, 342, 12, post2CreatedAt, post2CreatedAt);
  insertPost.run('post_003', 'user_004', '给大家推荐一些我常听的舒缓音乐，在焦虑的时候听会好一些。希望也能帮到你们。', 0, 0, 89, 8, post3CreatedAt, post3CreatedAt);
  insertPost.run('post_004', 'user_001', '今天第30天坚持吃药了。虽然效果还不是很明显，但我会继续坚持。相信会好起来的。', 1, 0, 178, 10, post4CreatedAt, post4CreatedAt);

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

  // 插入评论
  const insertComment = db.prepare(`
    INSERT INTO comments (id, post_id, author_id, content, is_anonymous, like_count, parent_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const m = 60 * 1000;
  const h = 3600 * 1000;

  // post_001 评论（10条）
  insertComment.run('cmt_101', 'post_001', 'user_001', '谢谢分享！我也要试试这个方法，感觉很简单又实在。', 0, 8, null, new Date(Date.now() - 55 * m).toISOString());
  insertComment.run('cmt_102', 'post_001', 'user_003', '我也让孩子试过这个，真的慢慢会发现生活里有很多美好。', 0, 5, null, new Date(Date.now() - 50 * m).toISOString());
  insertComment.run('cmt_103', 'post_001', 'user_004', '今天的小确幸是阳台的花开了一朵，哈哈。', 0, 12, null, new Date(Date.now() - 47 * m).toISOString());
  insertComment.run('cmt_104', 'post_001', 'user_002', '坚持写了两周，感觉真的有些不一样了，推荐大家试试！', 0, 7, null, new Date(Date.now() - 43 * m).toISOString());
  insertComment.run('cmt_105', 'post_001', 'user_001', '写着写着发现好多小美好以前都被自己忽略了。', 0, 4, null, new Date(Date.now() - 38 * m).toISOString());
  insertComment.run('cmt_106', 'post_001', 'user_003', '作为家属也很推荐这个方法，简单又好坚持。', 0, 6, null, new Date(Date.now() - 32 * m).toISOString());
  insertComment.run('cmt_107', 'post_001', 'user_004', '今天写的是喝到了一杯好喝的奶茶，好开心～', 0, 9, null, new Date(Date.now() - 28 * m).toISOString());
  insertComment.run('cmt_108', 'post_001', 'user_001', '谢谢楼主分享，这篇帖子被置顶真的很有意义。', 0, 3, null, new Date(Date.now() - 22 * m).toISOString());
  insertComment.run('cmt_109', 'post_001', 'user_002', '感觉这个方法让我更关注当下了，而不是一直担心未来。', 0, 11, null, new Date(Date.now() - 15 * m).toISOString());
  insertComment.run('cmt_110', 'post_001', 'user_004', '继续加油！我们一起找生活里的小美好。', 0, 5, null, new Date(Date.now() - 8 * m).toISOString());

  // post_002 评论（12条）
  insertComment.run('cmt_201', 'post_002', 'user_002', '太勇敢了！为你鼓掌👏 第一步是最难的，你做到了！', 0, 14, null, new Date(Date.now() - 2 * h - 50 * m).toISOString());
  insertComment.run('cmt_202', 'post_002', 'user_004', '寻求帮助真的是勇气的表现，不是软弱。支持你！', 0, 10, null, new Date(Date.now() - 2 * h - 40 * m).toISOString());
  insertComment.run('cmt_203', 'post_002', 'user_003', '作为家属看到这条很感动，希望更多人能鼓起这个勇气。', 0, 8, null, new Date(Date.now() - 2 * h - 30 * m).toISOString());
  insertComment.run('cmt_204', 'post_002', 'user_002', '我也预约了很久但一直没去，看到这条帖子决定下周去了。', 1, 16, null, new Date(Date.now() - 2 * h - 20 * m).toISOString());
  insertComment.run('cmt_205', 'post_002', 'user_001', '第一次咨询确实紧张，之后会越来越顺的，加油！', 0, 7, null, new Date(Date.now() - 2 * h - 10 * m).toISOString());
  insertComment.run('cmt_206', 'post_002', 'user_004', '希望你们的咨询顺利，慢慢来。', 0, 4, null, new Date(Date.now() - 1 * h - 55 * m).toISOString());
  insertComment.run('cmt_207', 'post_002', 'user_003', '找对合适的咨询师很重要，祝你遇到good match！', 0, 6, null, new Date(Date.now() - 1 * h - 40 * m).toISOString());
  insertComment.run('cmt_208', 'post_002', 'user_004', '我第一次去的时候手都在发抖，但聊完出来感觉轻松多了。', 1, 13, null, new Date(Date.now() - 1 * h - 25 * m).toISOString());
  insertComment.run('cmt_209', 'post_002', 'user_001', '这条帖子给了我很大勇气，谢谢你分享。', 0, 9, null, new Date(Date.now() - 1 * h - 10 * m).toISOString());
  insertComment.run('cmt_210', 'post_002', 'user_002', '一起加油！你不是一个人在走这段路。', 0, 11, null, new Date(Date.now() - 55 * m).toISOString());
  insertComment.run('cmt_211', 'post_002', 'user_003', '感谢你愿意分享，很多在犹豫的人都需要这样的正能量。', 0, 8, null, new Date(Date.now() - 40 * m).toISOString());
  insertComment.run('cmt_212', 'post_002', 'user_004', '帖子内容说到心坎里了，寻求帮助就是在帮助自己。', 0, 6, null, new Date(Date.now() - 25 * m).toISOString());

  // post_003 评论（8条）
  insertComment.run('cmt_301', 'post_003', 'user_001', '求歌单！！我焦虑的时候最需要这个。', 0, 7, null, new Date(Date.now() - 5 * h - 30 * m).toISOString());
  insertComment.run('cmt_302', 'post_003', 'user_002', '音乐真的很有治愈效果，有时候比什么都管用。', 0, 5, null, new Date(Date.now() - 5 * h - 10 * m).toISOString());
  insertComment.run('cmt_303', 'post_003', 'user_003', '我也给孩子放舒缓音乐，睡前听特别有效。', 0, 4, null, new Date(Date.now() - 4 * h - 40 * m).toISOString());
  insertComment.run('cmt_304', 'post_003', 'user_004', '我最喜欢听古典钢琴曲，特别放松，推荐肖邦！', 0, 8, null, new Date(Date.now() - 4 * h - 10 * m).toISOString());
  insertComment.run('cmt_305', 'post_003', 'user_001', '昨晚试了一下，真的睡得好多了，谢谢推荐！', 0, 6, null, new Date(Date.now() - 3 * h - 30 * m).toISOString());
  insertComment.run('cmt_306', 'post_003', 'user_002', '推荐班得瑞的专辑，那种空灵感很治愈。', 0, 9, null, new Date(Date.now() - 2 * h - 50 * m).toISOString());
  insertComment.run('cmt_307', 'post_003', 'user_004', '还有久石让的音乐，《Summer》和《Encore》超级治愈！', 0, 12, null, new Date(Date.now() - 2 * h).toISOString());
  insertComment.run('cmt_308', 'post_003', 'user_003', '谢谢大家推荐，都记下来了，今晚就试试。', 0, 3, null, new Date(Date.now() - 1 * h).toISOString());

  // post_004 评论（10条）
  insertComment.run('cmt_401', 'post_004', 'user_002', '坚持住！你很棒，30天真的不容易！', 0, 10, null, new Date(Date.now() - 11 * h - 30 * m).toISOString());
  insertComment.run('cmt_402', 'post_004', 'user_004', '加油！效果会慢慢来的，给自己多一些时间和耐心。', 0, 7, null, new Date(Date.now() - 11 * h).toISOString());
  insertComment.run('cmt_403', 'post_004', 'user_001', '我也在坚持，咱们一起打卡！今天第18天。', 0, 9, null, new Date(Date.now() - 10 * h - 20 * m).toISOString());
  insertComment.run('cmt_404', 'post_004', 'user_003', '规律服药很重要，你做得很好！作为家人看到这条很欣慰。', 0, 8, null, new Date(Date.now() - 9 * h - 40 * m).toISOString());
  insertComment.run('cmt_405', 'post_004', 'user_002', '我第45天的时候真的感觉到变化了，加油，快了！', 1, 14, null, new Date(Date.now() - 8 * h - 30 * m).toISOString());
  insertComment.run('cmt_406', 'post_004', 'user_004', '药物需要一些时间积累才能显效，不要因为暂时没感觉就放弃。', 0, 6, null, new Date(Date.now() - 7 * h).toISOString());
  insertComment.run('cmt_407', 'post_004', 'user_001', '每坚持一天都是一个小胜利！为自己鼓掌。', 0, 11, null, new Date(Date.now() - 6 * h).toISOString());
  insertComment.run('cmt_408', 'post_004', 'user_003', '看到大家这样互相鼓励，真的很温暖。', 0, 5, null, new Date(Date.now() - 5 * h).toISOString());
  insertComment.run('cmt_409', 'post_004', 'user_002', '我们都在这里，你不是一个人在坚持。', 0, 13, null, new Date(Date.now() - 3 * h).toISOString());
  insertComment.run('cmt_410', 'post_004', 'user_004', '经历过那段等待期真的很难，但过来了就不一样了，撑住！', 1, 16, null, new Date(Date.now() - 1 * h - 30 * m).toISOString());

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

  // 插入情绪记录（今日数据，用于家庭关怀展示）
  const todayDate = new Date().toISOString().slice(0, 10);
  const insertMood = db.prepare(`
    INSERT INTO mood_entries (id, user_id, mood, score, note, date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const moodAt1 = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  const moodAt4 = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString();
  insertMood.run('mood_001', 'user_001', 'cloudy', 2, '今天情绪一般，但还好', todayDate, moodAt1);
  insertMood.run('mood_002', 'user_004', 'sunny', 3, '今天感觉不错！', todayDate, moodAt4);

  // 插入家庭绑定
  const insertFamily = db.prepare(`
    INSERT INTO family_bindings (id, patient_id, caregiver_id, relation, share_mood, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertFamily.run('bind_001', 'user_001', 'user_003', '妈妈', 1, now);
  insertFamily.run('bind_002', 'user_004', 'user_003', '孩子', 1, now);

  console.log('种子数据插入成功！');
});

insertSeedData();

console.log(`数据库初始化完成: ${dbPath}`);

export default db;
