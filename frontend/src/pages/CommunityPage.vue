<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Filter, TrendingUp, Clock, Heart, PenLine } from 'lucide-vue-next'
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

type Tab = 'hot' | 'latest' | 'following'
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
]

async function loadPosts() {
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
      <LoadingState v-if="isLoading" />
      <div v-else-if="filteredPosts.length" class="space-y-3">
        <PostCard v-for="post in filteredPosts" :key="post.id" :post="post" @like="handleLike" @favorite="handleFavorite" @message="handleMessage" />
      </div>
      <EmptyState v-else :icon="Search" title="没有找到相关内容" description="试试其他关键词，或者浏览全部内容">
        <button v-if="searchQuery" class="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors text-sm" @click="searchQuery = ''">
          清空搜索
        </button>
      </EmptyState>
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
