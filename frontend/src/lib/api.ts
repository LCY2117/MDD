import api from './api-client';

// ─────────────────────────────────────────────────────────────────────────────
// 类型定义
// ─────────────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  bio: string;
  userMode: 'patient' | 'caregiver';
  isVip: boolean;
  joinDate: string;
  stats?: {
    posts: number;
    followers: number;
    following: number;
    likes: number;
  };
}

export interface Post {
  id: string;
  author: {
    id?: string;
    name: string;
    avatar?: string;
    isAnonymous: boolean;
  };
  content: string;
  tags: string[];
  images?: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  isFavorited?: boolean;
  isPinned?: boolean;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  mood: 'sunny' | 'cloudy' | 'rainy';
  score: number;
  note?: string;
  date: string;
  createdAt: string;
}

export interface DiaryEntry {
  id: string;
  title?: string;
  content: string;
  tags: string[];
  isPrivate: boolean;
  mood?: 'sunny' | 'cloudy' | 'rainy';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'system' | 'family';
  from?: { id: string; name: string; avatar?: string };
  content: string;
  relatedPost?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// ─────────────────────────────────────────────────────────────────────────────
// 认证 API
// ─────────────────────────────────────────────────────────────────────────────

export const authApi = {
  /** 微信模拟登录 */
  wechatLogin: () =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/wechat-mock'),

  /** 用户名密码登录 */
  login: (username: string, password: string) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', { username, password }),

  /** 注册 */
  register: (username: string, nickname: string, password: string) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', { username, nickname, password }),
};

// ─────────────────────────────────────────────────────────────────────────────
// 用户 API
// ─────────────────────────────────────────────────────────────────────────────

export const userApi = {
  /** 获取当前用户信息 */
  getMe: () => api.get<ApiResponse<User>>('/users/me'),

  /** 更新当前用户信息 */
  updateMe: (data: Partial<Pick<User, 'nickname' | 'bio' | 'avatar' | 'userMode'>>) =>
    api.put<ApiResponse<Partial<User>>>('/users/me', data),

  /** 获取指定用户公开信息 */
  getUser: (userId: string) => api.get<ApiResponse<User>>(`/users/${userId}`),

  /** 关注/取消关注 */
  toggleFollow: (userId: string) =>
    api.post<ApiResponse<{ isFollowing: boolean }>>(`/users/${userId}/follow`),

  /** 获取用户设置 */
  getSettings: () => api.get<ApiResponse<Record<string, number>>>('/users/me/settings'),

  /** 更新用户设置 */
  updateSettings: (settings: Record<string, boolean>) =>
    api.put<ApiResponse<Record<string, number>>>('/users/me/settings', settings),
};

// ─────────────────────────────────────────────────────────────────────────────
// 帖子 API
// ─────────────────────────────────────────────────────────────────────────────

export const postApi = {
  /** 获取帖子列表 */
  getPosts: (params?: { tab?: string; page?: number; limit?: number; tag?: string; search?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return api.get<ApiResponse<{ posts: Post[]; pagination: Record<string, number> }>>(`/posts${query ? `?${query}` : ''}`);
  },

  /** 获取单个帖子 */
  getPost: (id: string) => api.get<ApiResponse<Post>>(`/posts/${id}`),

  /** 发布帖子 */
  createPost: (data: { content: string; isAnonymous?: boolean; tags?: string[]; images?: string[] }) =>
    api.post<ApiResponse<Post>>('/posts', data),

  /** 删除帖子 */
  deletePost: (id: string) => api.delete<ApiResponse<null>>(`/posts/${id}`),

  /** 点赞/取消点赞 */
  toggleLike: (id: string) =>
    api.post<ApiResponse<{ isLiked: boolean }>>(`/posts/${id}/like`),

  /** 收藏/取消收藏 */
  toggleFavorite: (id: string) =>
    api.post<ApiResponse<{ isFavorited: boolean }>>(`/posts/${id}/favorite`),

  /** 获取帖子评论 */
  getComments: (id: string) => api.get<ApiResponse<unknown[]>>(`/posts/${id}/comments`),

  /** 发表评论 */
  createComment: (id: string, data: { content: string; isAnonymous?: boolean; parentId?: string }) =>
    api.post<ApiResponse<unknown>>(`/posts/${id}/comments`, data),

  /** 获取用户帖子 */
  getUserPosts: (userId: string, params?: { page?: number }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return api.get<ApiResponse<{ posts: Post[] }>>(`/posts/user/${userId}${query ? `?${query}` : ''}`);
  },

  /** 获取用户点赞的帖子 */
  getUserLikedPosts: (userId: string) =>
    api.get<ApiResponse<{ posts: Post[] }>>(`/posts/user/${userId}/liked`),

  /** 获取用户收藏的帖子 */
  getUserFavorites: (userId: string) =>
    api.get<ApiResponse<{ posts: Post[] }>>(`/posts/user/${userId}/favorites`),
};

// ─────────────────────────────────────────────────────────────────────────────
// 情绪 API
// ─────────────────────────────────────────────────────────────────────────────

export const moodApi = {
  /** 获取情绪记录 */
  getMoods: (days?: number) => api.get<ApiResponse<MoodEntry[]>>(`/mood${days ? `?days=${days}` : ''}`),

  /** 添加情绪记录 */
  addMood: (data: { mood: string; note?: string; date?: string }) =>
    api.post<ApiResponse<MoodEntry>>('/mood', data),

  /** 更新情绪记录 */
  updateMood: (id: string, data: Partial<MoodEntry>) =>
    api.put<ApiResponse<MoodEntry>>(`/mood/${id}`, data),

  /** 删除情绪记录 */
  deleteMood: (id: string) => api.delete<ApiResponse<null>>(`/mood/${id}`),

  /** 获取情绪统计 */
  getStats: (days?: number) =>
    api.get<ApiResponse<Record<string, unknown>>>(`/mood/stats${days ? `?days=${days}` : ''}`),
};

// ─────────────────────────────────────────────────────────────────────────────
// 日记 API
// ─────────────────────────────────────────────────────────────────────────────

export const diaryApi = {
  /** 获取日记列表 */
  getDiaries: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return api.get<ApiResponse<{ entries: DiaryEntry[] }>>(`/diary${query ? `?${query}` : ''}`);
  },

  /** 获取单篇日记 */
  getDiary: (id: string) => api.get<ApiResponse<DiaryEntry>>(`/diary/${id}`),

  /** 创建日记 */
  createDiary: (data: { title?: string; content: string; tags?: string[]; isPrivate?: boolean; mood?: string }) =>
    api.post<ApiResponse<DiaryEntry>>('/diary', data),

  /** 更新日记 */
  updateDiary: (id: string, data: Partial<DiaryEntry>) =>
    api.put<ApiResponse<DiaryEntry>>(`/diary/${id}`, data),

  /** 删除日记 */
  deleteDiary: (id: string) => api.delete<ApiResponse<null>>(`/diary/${id}`),
};

// ─────────────────────────────────────────────────────────────────────────────
// 消息 API
// ─────────────────────────────────────────────────────────────────────────────

export const messageApi = {
  /** 获取会话列表 */
  getConversations: () => api.get<ApiResponse<unknown[]>>('/messages/conversations'),

  /** 获取会话消息 */
  getMessages: (conversationId: string) =>
    api.get<ApiResponse<unknown[]>>(`/messages/conversations/${conversationId}`),

  /** 发送私信 */
  sendMessage: (userId: string, content: string) =>
    api.post<ApiResponse<unknown>>(`/messages/conversations/${userId}`, { content }),

  /** 获取通知 */
  getNotifications: () => api.get<ApiResponse<Notification[]>>('/messages/notifications'),

  /** 标记全部已读 */
  markAllRead: () => api.post<ApiResponse<null>>('/messages/notifications/read-all'),

  /** 获取未读数 */
  getUnreadCount: () =>
    api.get<ApiResponse<{ notifications: number; messages: number; total: number }>>('/messages/unread-count'),
};

// ─────────────────────────────────────────────────────────────────────────────
// AI 聊天 API
// ─────────────────────────────────────────────────────────────────────────────

export const aiApi = {
  /** 获取历史记录 */
  getHistory: () => api.get<ApiResponse<unknown[]>>('/ai/history'),

  /** 发送消息 */
  chat: (message: string) =>
    api.post<ApiResponse<{ userMessage: unknown; aiMessage: unknown }>>('/ai/chat', { message }),

  /** 清除历史 */
  clearHistory: () => api.delete<ApiResponse<null>>('/ai/history'),
};

// ─────────────────────────────────────────────────────────────────────────────
// 家庭 API
// ─────────────────────────────────────────────────────────────────────────────

export const familyApi = {
  /** 获取家庭成员 */
  getMembers: () => api.get<ApiResponse<unknown[]>>('/family/members'),

  /** 获取家庭成员情绪 */
  getMemberMood: (patientId: string, days?: number) =>
    api.get<ApiResponse<unknown>>(`/family/mood/${patientId}${days ? `?days=${days}` : ''}`),

  /** 生成邀请码 */
  createInvite: () =>
    api.post<ApiResponse<{ code: string; expiresAt: string }>>('/family/invite'),

  /** 使用邀请码绑定 */
  bind: (code: string, relation?: string) =>
    api.post<ApiResponse<null>>('/family/bind', { code, relation }),

  /** 解除绑定 */
  unbind: (memberId: string) => api.delete<ApiResponse<null>>(`/family/bind/${memberId}`),

  /** 发送鼓励 */
  sendEncouragement: (targetUserId: string, message: string) =>
    api.post<ApiResponse<null>>('/family/encourage', { targetUserId, message }),

  /** 更新情绪共享设置 */
  updateSettings: (shareMood: boolean, memberId?: string) =>
    api.put<ApiResponse<null>>('/family/settings', { shareMood, memberId }),
};

// ─────────────────────────────────────────────────────────────────────────────
// 文章 API
// ─────────────────────────────────────────────────────────────────────────────

export const articleApi = {
  /** 获取文章列表 */
  getArticles: (category?: string) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return api.get<ApiResponse<{ articles: unknown[]; categories: string[] }>>(`/articles${query}`);
  },

  /** 获取文章详情 */
  getArticle: (id: string) => api.get<ApiResponse<unknown>>(`/articles/${id}`),
};

// ─────────────────────────────────────────────────────────────────────────────
// 搜索 API
// ─────────────────────────────────────────────────────────────────────────────

export const searchApi = {
  search: (q: string, type?: string) => {
    const params = new URLSearchParams({ q });
    if (type) params.append('type', type);
    return api.get<ApiResponse<unknown>>(`/search?${params.toString()}`);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 上传 API
// ─────────────────────────────────────────────────────────────────────────────

export const uploadApi = {
  /** 上传单张图片（返回 { url: string }） */
  uploadImage: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';
    const serverOrigin = baseUrl.replace(/\/api$/, '');
    const response = await fetch(`${baseUrl}/upload/image`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!response.ok) throw new Error('上传失败');
    const result: ApiResponse<{ url: string }> = await response.json();
    // 将相对路径转为绝对 URL
    if (result.data?.url && result.data.url.startsWith('/')) {
      result.data.url = `${serverOrigin}${result.data.url}`;
    }
    return result;
  },
};
