<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Sun, Cloud, CloudRain, Heart, BookOpen, Phone, ChevronRight, Bot, LogIn } from 'lucide-vue-next'
import BottomNav from '@/components/community/BottomNav.vue'
import CrisisBanner from '@/components/community/CrisisBanner.vue'
import PostCard from '@/components/community/PostCard.vue'
import type { Post } from '@/components/community/PostCard.vue'
import { useAuthStore } from '@/stores/auth'
import { postApi, moodApi } from '@/lib/api'
import { toast } from 'vue-sonner'

const authStore = useAuthStore()
const router = useRouter()
const user = computed(() => authStore.user)
const isAuthenticated = computed(() => authStore.isAuthenticated)

const moodToday = ref<string | null>(null)
const isMoodSaving = ref(false)
const posts = ref<Post[]>([])
const isLoadingPosts = ref(true)

const moods = [
  { id: 'sunny', icon: Sun, label: '还不错', color: 'text-yellow-500' },
  { id: 'cloudy', icon: Cloud, label: '一般般', color: 'text-gray-400' },
  { id: 'rainy', icon: CloudRain, label: '有点难受', color: 'text-blue-400' },
]

const quickActionsAll = [
  { icon: Bot, label: 'AI问答', to: '/ai-chat', color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20' },
  { icon: Heart, label: '情绪记录', to: '/mood', color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20' },
  { icon: BookOpen, label: '知识科普', to: '/community', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' },
  { icon: Phone, label: '紧急求助', to: '/help', color: 'bg-primary/10 text-primary' },
]
const quickActions = computed(() => isAuthenticated.value
  ? quickActionsAll
  : quickActionsAll.filter(a => ['/community', '/help'].includes(a.to))
)

onMounted(() => {
  postApi.getPosts({ tab: 'hot', limit: 3 })
    .then(res => { posts.value = (res.data as { posts: Post[] }).posts })
    .catch(() => {
      posts.value = [{
        id: 'f1', author: { name: '小雨', isAnonymous: false },
        content: '今天第一次尝试冥想，虽然只有5分钟，但感觉心里平静了一些。',
        tags: ['自我照顾'], likes: 42, comments: 8, isLiked: false,
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      }]
    })
    .finally(() => { isLoadingPosts.value = false })
})

async function handleMoodSelect(moodId: string) {
  if (!isAuthenticated.value) {
    moodToday.value = moodId
    toast.info('登录后可以保存你的情绪记录')
    return
  }
  if (moodToday.value === moodId || isMoodSaving.value) return
  isMoodSaving.value = true
  try {
    await moodApi.addMood({ mood: moodId })
    moodToday.value = moodId
  } catch {
    toast.error('记录失败，请重试')
  } finally {
    isMoodSaving.value = false
  }
}

async function handleLike(postId: string) {
  if (!isAuthenticated.value) { toast.info('登录后可以点赞帖子'); return }
  try {
    const res = await postApi.toggleLike(postId)
    const post = posts.value.find(p => p.id === postId)
    if (post) {
      post.isLiked = (res.data as { isLiked: boolean }).isLiked
      post.likes = post.isLiked ? post.likes + 1 : post.likes - 1
    }
  } catch { toast.error('操作失败') }
}
</script>

<template>
  <div class="min-h-screen bg-background pb-20">
    <!-- 顶部欢迎区 -->
    <div class="bg-gradient-to-b from-primary/5 to-transparent px-6 pt-12 pb-6">
      <div>
        <h1 class="mb-2">{{ user ? `你好呀，${user.nickname}` : '你好呀' }}</h1>
        <p class="text-muted-foreground">今天感觉怎么样？</p>
      </div>

      <!-- 未登录：登录引导卡 -->
      <div v-if="!isAuthenticated" class="mt-6 bg-card rounded-2xl p-5 border border-primary/20 flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <LogIn class="w-6 h-6 text-primary" />
        </div>
        <div class="flex-1">
          <p class="font-medium text-sm">加入心语社区</p>
          <p class="text-xs text-muted-foreground mt-0.5">登录后可记录心情、使用 AI 助手等更多功能</p>
        </div>
        <button class="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-xl hover:bg-primary/90 transition-colors flex-shrink-0" @click="router.push('/login')">
          登录
        </button>
      </div>

      <!-- 已登录：今日心情 -->
      <div v-else class="mt-6 bg-card rounded-2xl p-5 shadow-sm border border-border/50">
        <h3 class="mb-4">今日心情</h3>
        <div class="flex gap-3">
          <button
            v-for="mood in moods"
            :key="mood.id"
            :disabled="isMoodSaving"
            class="flex-1 flex flex-col items-center gap-2 py-4 rounded-xl transition-all border-2 disabled:opacity-50"
            :class="moodToday === mood.id ? 'bg-primary/10 border-primary' : 'bg-secondary border-transparent hover:border-border'"
            @click="handleMoodSelect(mood.id)"
          >
            <component :is="mood.icon" class="w-7 h-7" :class="moodToday === mood.id ? 'text-primary' : mood.color" />
            <span class="text-sm" :class="moodToday === mood.id ? 'text-primary font-medium' : 'text-muted-foreground'">
              {{ mood.label }}
            </span>
          </button>
        </div>
        <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0">
          <p v-if="moodToday" class="mt-4 text-sm text-muted-foreground text-center">
            记录了你的心情，继续保持关注自己的感受 💙
          </p>
        </Transition>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="px-6 mt-6">
      <div :class="isAuthenticated ? 'grid grid-cols-4 gap-3' : 'grid grid-cols-2 gap-3'">
        <RouterLink v-for="action in quickActions" :key="action.label" :to="action.to">
          <div class="bg-card rounded-2xl p-3 text-center shadow-sm border border-border/50 hover:shadow-md transition-shadow">
            <div class="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" :class="action.color">
              <component :is="action.icon" class="w-5 h-5" />
            </div>
            <span class="text-xs text-foreground">{{ action.label }}</span>
          </div>
        </RouterLink>
      </div>
    </div>

    <!-- 危机支持横幅 -->
    <div class="px-6 mt-6">
      <CrisisBanner />
    </div>

    <!-- 推荐内容 -->
    <div class="px-6 mt-6">
      <div class="flex items-center justify-between mb-4">
        <h3>为你推荐</h3>
        <RouterLink to="/community" class="flex items-center gap-1 text-sm text-primary hover:underline">
          查看更多
          <ChevronRight class="w-4 h-4" />
        </RouterLink>
      </div>

      <div v-if="isLoadingPosts" class="space-y-3">
        <div v-for="i in 3" :key="i" class="bg-card rounded-2xl p-5 border border-border/50 animate-pulse">
          <div class="flex gap-3 mb-3">
            <div class="w-8 h-8 rounded-full bg-secondary" />
            <div class="flex-1"><div class="h-3 bg-secondary rounded w-24 mb-1" /><div class="h-2.5 bg-secondary rounded w-16" /></div>
          </div>
          <div class="space-y-2"><div class="h-3 bg-secondary rounded" /><div class="h-3 bg-secondary rounded w-4/5" /></div>
        </div>
      </div>
      <div v-else class="space-y-3">
        <PostCard v-for="post in posts" :key="post.id" :post="post" @like="handleLike" />
      </div>

      <RouterLink to="/community">
        <button class="w-full mt-4 py-3 text-primary bg-secondary rounded-xl hover:bg-accent transition-colors">
          浏览社区更多内容
        </button>
      </RouterLink>
    </div>

    <BottomNav />
  </div>
</template>
