<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Filter, TrendingUp, Clock, Heart, BookOpen, Video, FileText, ExternalLink, Sparkles, PenLine } from 'lucide-vue-next'
import BottomNav from '@/components/community/BottomNav.vue'
import PostCard from '@/components/community/PostCard.vue'
import type { Post } from '@/components/community/PostCard.vue'
import EmptyState from '@/components/community/EmptyState.vue'
import LoadingState from '@/components/community/LoadingState.vue'
import { postApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = ref(authStore.isAuthenticated)

type Tab = 'hot' | 'latest' | 'following' | 'knowledge'
const activeTab = ref<Tab>('hot')
const searchQuery = ref('')
const showFilters = ref(false)
const activeFilter = ref('全部')
const posts = ref<Post[]>([])
const isLoading = ref(false)

const tabs = [
  { id: 'hot' as Tab, label: '热门', icon: TrendingUp },
  { id: 'latest' as Tab, label: '最新', icon: Clock },
  { id: 'following' as Tab, label: '关注', icon: Heart },
  { id: 'knowledge' as Tab, label: '知识', icon: BookOpen },
]

const knowledgeItems = [
  { title: '什么是抑郁症？', category: '基础知识', icon: BookOpen, summary: '了解抑郁症的症状、成因和常见误区', articleId: 'what-is-depression' },
  { title: '如何陪伴抑郁症患者', category: '家属指南', icon: Heart, summary: '给家属和朋友的实用建议', articleId: 'how-to-support' },
  { title: '认识常用抗抑郁药物', category: '用药指南', icon: FileText, summary: '药物作用、副作用和注意事项', articleId: 'medication-guide' },
  { title: '心理咨询有哪些类型', category: '治疗方式', icon: Video, summary: '了解不同的心理治疗方法', articleId: 'therapy-types' },
]

async function loadPosts() {
  if (activeTab.value === 'knowledge') return
  isLoading.value = true
  try {
    const res = await postApi.getPosts({ tab: activeTab.value })
    posts.value = (res.data as { posts: Post[] }).posts
  } catch {
    toast.error('加载失败，请重试')
  } finally {
    isLoading.value = false
  }
}

watch(activeTab, loadPosts, { immediate: true })

const filteredPosts = ref<Post[]>([])
watch([posts, searchQuery, activeFilter], () => {
  let base = posts.value
  if (activeFilter.value !== '全部') {
    base = base.filter(p => p.tags?.includes(activeFilter.value))
  }
  filteredPosts.value = searchQuery.value
    ? base.filter(p =>
        p.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        p.tags?.some(t => t.toLowerCase().includes(searchQuery.value.toLowerCase()))
      )
    : base
}, { immediate: true })

async function handleFavorite(postId: string) {
  if (!isAuthenticated.value) { toast.info('登录后可以收藏帖子'); return }
  try {
    const res = await postApi.toggleFavorite(postId)
    const post = posts.value.find(p => p.id === postId)
    if (post) post.isFavorited = (res.data as { isFavorited: boolean }).isFavorited
    toast.success(post?.isFavorited ? '已收藏' : '已取消收藏')
  } catch { toast.error('操作失败') }
}

function handleMessage(authorId: string) {
  router.push(`/messages/${authorId}`)
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
    <!-- 顶部搜索栏 -->
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 pt-6 pb-3 border-b border-border/50">
      <h1 class="mb-4">社区</h1>
      <div class="flex gap-2 mb-4">
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索话题或内容..."
            class="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
            readonly
            @focus="router.push('/search')"
          />
        </div>
        <button
          class="p-3 rounded-xl border transition-colors"
          :class="showFilters ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:bg-secondary'"
          @click="showFilters = !showFilters"
        >
          <Filter class="w-5 h-5" />
        </button>
      </div>

      <Transition enter-active-class="transition-all duration-200">
        <div v-if="showFilters" class="mb-4 p-4 bg-card rounded-xl border border-border">
          <h4 class="mb-3">话题筛选</h4>
          <div class="flex flex-wrap gap-2">
            <button v-for="f in ['全部','经验分享','自我照顾','求助','陪伴','康复日记']" :key="f"
              class="px-4 py-2 rounded-lg text-sm transition-colors"
              :class="activeFilter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-accent'"
              @click="activeFilter = f">
              {{ f }}
            </button>
          </div>
        </div>
      </Transition>

      <div class="flex gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors"
          :class="activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-accent'"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- 列表区域 -->
    <div class="px-6 mt-4">
      <!-- 知识板块 -->
      <div v-if="activeTab === 'knowledge'" class="space-y-3">
        <div class="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-4 border border-primary/20">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles class="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 class="mb-1">AI辅助阅读</h4>
              <p class="text-sm text-muted-foreground">点击文章后可以使用AI助手帮你理解和总结内容</p>
            </div>
          </div>
        </div>
        <button
          v-for="item in knowledgeItems"
          :key="item.articleId"
          class="w-full bg-card rounded-2xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-all text-left group"
          @click="router.push(`/resources/article/${item.articleId}`)"
        >
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
              <component :is="item.icon" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1">
              <span class="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground">{{ item.category }}</span>
              <h4 class="mt-2 mb-1">{{ item.title }}</h4>
              <p class="text-sm text-muted-foreground">{{ item.summary }}</p>
              <div class="mt-3 flex items-center gap-2 text-xs text-primary">
                <Sparkles class="w-3.5 h-3.5" />
                <span>支持AI辅助阅读</span>
              </div>
            </div>
            <ExternalLink class="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
          </div>
        </button>
      </div>

      <!-- 帖子列表 -->
      <template v-else>
        <LoadingState v-if="isLoading" />
        <div v-else-if="filteredPosts.length" class="space-y-3">
          <PostCard v-for="post in filteredPosts" :key="post.id" :post="post" @like="handleLike" @favorite="handleFavorite" @message="handleMessage" />
        </div>
        <EmptyState v-else :icon="Search" title="没有找到相关内容" description="试试其他关键词，或者浏览全部内容">
          <button v-if="searchQuery" class="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors text-sm" @click="searchQuery = ''">
            清空搜索
          </button>
        </EmptyState>
      </template>
    </div>

    <BottomNav />

    <!-- 发帖 FAB -->
    <button
      class="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center"
      @click="router.push('/publish')"
    >
      <PenLine class="w-6 h-6" />
    </button>
  </div>
</template>
