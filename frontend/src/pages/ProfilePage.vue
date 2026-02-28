<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Settings, BookOpen, Heart, Star, Edit3, Camera, Users, X } from 'lucide-vue-next'
import BottomNav from '@/components/community/BottomNav.vue'
import PostCard from '@/components/community/PostCard.vue'
import type { Post } from '@/components/community/PostCard.vue'
import { postApi, userApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'
import { useConfirm } from '@/lib/useConfirm'

const router = useRouter()
const auth = useAuthStore()
const { confirm } = useConfirm()

type ProfileTab = 'posts' | 'liked' | 'favorites'
const activeTab = ref<ProfileTab>('posts')
const posts = ref<Post[]>([])
const isLoading = ref(false)

const tabs = [
  { id: 'posts' as ProfileTab, label: '我的帖子', icon: BookOpen },
  { id: 'liked' as ProfileTab, label: '点赞', icon: Heart },
  { id: 'favorites' as ProfileTab, label: '收藏', icon: Star },
]

async function loadPosts(tab: ProfileTab) {
  isLoading.value = true
  try {
    const userId = auth.user?.id
    if (!userId) return
    let res
    if (tab === 'posts') res = await postApi.getUserPosts(userId)
    else if (tab === 'liked') res = await postApi.getUserLikedPosts(userId)
    else res = await postApi.getUserFavorites(userId)
    posts.value = (res.data as { posts: Post[] }).posts
  } catch { toast.error('加载失败') }
  finally { isLoading.value = false }
}

onMounted(() => { if (auth.isAuthenticated) loadPosts('posts') })

function handleTabChange(tab: ProfileTab) { activeTab.value = tab; loadPosts(tab) }

async function handleLike(postId: string) {
  try {
    const res = await postApi.toggleLike(postId)
    const post = posts.value.find(p => p.id === postId)
    if (post) {
      post.isLiked = (res.data as { isLiked: boolean }).isLiked
      post.likes = post.isLiked ? post.likes + 1 : post.likes - 1
    }
  } catch { toast.error('操作失败') }
}

async function handleFavorite(postId: string) {
  try {
    const res = await postApi.toggleFavorite(postId)
    const post = posts.value.find(p => p.id === postId)
    if (post) post.isFavorited = (res.data as { isFavorited: boolean }).isFavorited
    if (activeTab.value === 'favorites' && !posts.value.find(p => p.id === postId)?.isFavorited) {
      posts.value = posts.value.filter(p => p.id !== postId)
    }
    toast.success(post?.isFavorited ? '已收藏' : '已取消收藏')
  } catch { toast.error('操作失败') }
}

async function handleDelete(postId: string) {
  const ok = await confirm({ title: '删除帖子', message: '确定要删除这篇帖子吗？此操作无法撤销。', confirmText: '删除', cancelText: '取消', variant: 'danger' })
  if (!ok) return
  try {
    await postApi.deletePost(postId)
    posts.value = posts.value.filter(p => p.id !== postId)
    toast.success('帖子已删除')
  } catch { toast.error('删除失败') }
}

const stats = [
  { label: '帖子', value: auth.user?.stats?.posts ?? 0, action: () => handleTabChange('posts') },
  { label: '关注', value: auth.user?.stats?.following ?? 0, action: () => openUserList('following') },
  { label: '粉丝', value: auth.user?.stats?.followers ?? 0, action: () => openUserList('followers') },
]

// 用户列表覆层
type OverlayType = 'followers' | 'following'
const overlay = ref<{ type: OverlayType; title: string } | null>(null)
const overlayUsers = ref<{ id: string; nickname: string; avatar: string; bio?: string }[]>([])
const overlayLoading = ref(false)

async function openUserList(type: OverlayType) {
  const userId = auth.user?.id
  if (!userId) return
  overlay.value = { type, title: type === 'followers' ? '粉丝' : '关注的人' }
  overlayUsers.value = []
  overlayLoading.value = true
  try {
    const res = type === 'followers'
      ? await userApi.getFollowers(userId)
      : await userApi.getFollowing(userId)
    overlayUsers.value = res.data as { id: string; nickname: string; avatar: string; bio?: string }[]
  } catch { toast.error('加载失败') }
  finally { overlayLoading.value = false }
}
</script>

<template>
  <div class="min-h-screen bg-background pb-20">
    <!-- 顶部 -->
    <div class="px-6 pt-6 pb-4 flex items-center justify-between">
      <h1>我的</h1>
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.push('/settings')"><Settings class="w-5 h-5" /></button>
    </div>

    <!-- 用户信息 -->
    <div class="px-6 pb-4">
      <div class="bg-card rounded-2xl p-5 border border-border/50">
        <div class="flex items-start gap-4">
          <div class="relative flex-shrink-0">
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center overflow-hidden border-2 border-primary/30">
              <img v-if="auth.user?.avatar" :src="auth.user.avatar" alt="" class="w-full h-full object-cover" />
              <span v-else class="text-2xl text-primary">{{ (auth.user?.nickname || '？')[0] }}</span>
            </div>
            <button class="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow">
              <Camera class="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
          <div class="flex-1">
            <h3 class="mb-1">{{ auth.user?.nickname || '匿名用户' }}</h3>
            <p class="text-sm text-muted-foreground mb-3">{{ auth.user?.bio || '这个人很低调，什么都没留下～' }}</p>
            <button class="flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl text-sm hover:bg-accent transition-colors"
              @click="router.push('/profile/edit')">
              <Edit3 class="w-4 h-4" /><span>编辑资料</span>
            </button>
          </div>
        </div>

        <!-- 统计 -->
        <div class="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-border/50">
          <button v-for="stat in stats" :key="stat.label"
            class="text-center py-1 rounded-xl hover:bg-secondary transition-colors active:scale-95"
            @click="stat.action">
            <div class="text-xl font-medium">{{ stat.value }}</div>
            <div class="text-xs text-muted-foreground">{{ stat.label }}</div>
          </button>
        </div>
      </div>
    </div>

    <!-- 功能入口 -->
    <div class="px-6 pb-4">
      <div class="grid grid-cols-2 gap-3">
        <button class="bg-card rounded-xl p-4 border border-border/50 flex items-center gap-3 hover:bg-secondary transition-colors" @click="router.push('/diary')">
          <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><BookOpen class="w-5 h-5 text-primary" /></div>
          <span>我的日记</span>
        </button>
        <button class="bg-card rounded-xl p-4 border border-border/50 flex items-center gap-3 hover:bg-secondary transition-colors" @click="router.push('/mood')">
          <div class="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center"><span class="text-lg">😊</span></div>
          <span>情绪记录</span>
        </button>
        <button class="bg-card rounded-xl p-4 border border-border/50 flex items-center gap-3 hover:bg-secondary transition-colors" @click="router.push('/family')">
          <div class="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center"><Heart class="w-5 h-5 text-rose-500" /></div>
          <span>家人关怀</span>
        </button>
        <button class="bg-card rounded-xl p-4 border border-border/50 flex items-center gap-3 hover:bg-secondary transition-colors" @click="router.push('/subscription')">
          <div class="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center"><Star class="w-5 h-5 text-amber-500" /></div>
          <span>会员订阅</span>
        </button>
      </div>
    </div>

    <!-- 帖子列表 -->
    <div class="px-6">
      <div class="flex gap-2 mb-4">
        <button v-for="tab in tabs" :key="tab.id"
          class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors"
          :class="activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-accent'"
          @click="handleTabChange(tab.id)">
          <component :is="tab.icon" class="w-4 h-4" />
          <span>{{ tab.label }}</span>
        </button>
      </div>
      <div v-if="isLoading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="h-24 bg-card rounded-2xl animate-pulse border border-border/50" />
      </div>
      <div v-else-if="posts.length" class="space-y-3">
        <PostCard v-for="post in posts" :key="post.id" :post="post"
          :canDelete="activeTab === 'posts'"
          @like="handleLike"
          @favorite="handleFavorite"
          @delete="handleDelete"
        />
      </div>
      <div v-else class="text-center py-8 text-muted-foreground text-sm">暂无内容</div>
    </div>

    <BottomNav />

    <!-- 粉丝/关注 覆层 -->
    <Transition name="slide-up">
      <div v-if="overlay" class="fixed inset-0 z-50 flex flex-col justify-end">
        <!-- 阴影 -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="overlay = null" />
        <!-- 面板 -->
        <div class="relative bg-background rounded-t-2xl max-h-[70vh] flex flex-col">
          <div class="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <div class="flex items-center gap-2">
              <Users class="w-4 h-4 text-primary" />
              <span class="font-medium">{{ overlay.title }}</span>
              <span class="text-xs text-muted-foreground">({{ overlayUsers.length }})</span>
            </div>
            <button class="p-1.5 hover:bg-secondary rounded-lg transition-colors" @click="overlay = null">
              <X class="w-4 h-4" />
            </button>
          </div>
          <div class="overflow-y-auto flex-1 px-5 py-3 space-y-2">
            <div v-if="overlayLoading" class="space-y-3">
              <div v-for="i in 4" :key="i" class="h-14 bg-card rounded-xl animate-pulse border border-border/50" />
            </div>
            <div v-else-if="overlayUsers.length" v-for="u in overlayUsers" :key="u.id"
              class="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary cursor-pointer transition-colors"
              @click="overlay = null; router.push(`/user/${u.id}`)">
              <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img v-if="u.avatar" :src="u.avatar" class="w-full h-full object-cover" alt="" />
                <span v-else class="text-primary font-medium">{{ (u.nickname || '?')[0] }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm">{{ u.nickname }}</p>
                <p v-if="u.bio" class="text-xs text-muted-foreground truncate">{{ u.bio }}</p>
              </div>
            </div>
            <div v-else class="text-center py-8 text-muted-foreground text-sm">暂无用户</div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: opacity 0.2s, transform 0.25s; }
.slide-up-enter-from .relative, .slide-up-leave-to .relative { transform: translateY(100%); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; }
</style>
