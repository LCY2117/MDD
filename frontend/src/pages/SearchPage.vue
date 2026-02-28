<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Search as SearchIcon, User, FileText } from 'lucide-vue-next'
import PostCard from '@/components/community/PostCard.vue'
import type { Post } from '@/components/community/PostCard.vue'
import { searchApi } from '@/lib/api'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()

const query = ref((route.query.q as string) || '')
const activeTab = ref<'all' | 'posts' | 'users' | 'articles'>('all')
const isLoading = ref(false)

interface ArticleResult { id: string; title: string; category: string; summary?: string }
interface UserResult { id: string; nickname: string; avatar?: string; bio?: string }

const posts = ref<Post[]>([])
const users = ref<UserResult[]>([])
const articles = ref<ArticleResult[]>([])

const hasResults = computed(() => posts.value.length > 0 || users.value.length > 0 || articles.value.length > 0)

const hotSearches = ['抑郁症', '焦虑', '睡眠', '心理咨询', '用药经验', '家人支持', '复学复工', '康复日记']

async function doSearch() {
  if (!query.value.trim()) {
    posts.value = []; users.value = []; articles.value = []; return
  }
  isLoading.value = true
  try {
    const res = await searchApi.search(query.value.trim())
    const data = res.data as any
    // 后端返回 posts / users / articles 三个数组
    posts.value = (data.posts ?? []).map((p: any) => ({
      ...p,
      isLiked: false,
    }))
    users.value = data.users ?? []
    articles.value = data.articles ?? []
  } catch { toast.error('搜索失败') }
  finally { isLoading.value = false }
}

let debounceTimer: ReturnType<typeof setTimeout>
watch(query, (val) => {
  clearTimeout(debounceTimer)
  if (val) debounceTimer = setTimeout(doSearch, 350)
  else { posts.value = []; users.value = []; articles.value = [] }
})

function handleHotSearch(term: string) { query.value = term; doSearch() }
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部搜索框 -->
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
      <div class="flex items-center gap-3">
        <button class="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0" @click="router.back()">
          <ArrowLeft class="w-5 h-5" />
        </button>
        <div class="flex-1 relative">
          <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input v-model="query" type="text" placeholder="搜索帖子、用户、文章..."
            class="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            autofocus @keydown.enter="doSearch" />
        </div>
      </div>
    </div>

    <!-- 未输入时：热门话题 -->
    <div v-if="!query" class="px-6 py-4">
      <h4 class="mb-3">热门话题</h4>
      <div class="flex flex-wrap gap-2">
        <button v-for="term in hotSearches" :key="term"
          class="px-4 py-2 bg-card border border-border/50 rounded-xl text-sm hover:bg-secondary transition-colors"
          @click="handleHotSearch(term)">
          <span class="text-muted-foreground mr-1">#</span>{{ term }}
        </button>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-else class="px-6 py-4">
      <!-- 加载中 -->
      <div v-if="isLoading" class="space-y-3">
        <div v-for="i in 4" :key="i" class="h-16 bg-card rounded-2xl animate-pulse border border-border/50" />
      </div>

      <template v-else>
        <!-- 分类标签页 -->
        <div class="flex gap-2 mb-4 overflow-x-auto pb-1">
          <button v-for="t in [{ id: 'all', label: '全部' }, { id: 'posts', label: `帖子 ${posts.length}` }, { id: 'users', label: `用户 ${users.length}` }, { id: 'articles', label: `文章 ${articles.length}` }]" :key="t.id"
            class="px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors flex-shrink-0"
            :class="activeTab === t.id ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-accent'"
            @click="activeTab = (t.id as typeof activeTab.value)">{{ t.label }}</button>
        </div>

        <!-- 帖子 -->
        <div v-if="(activeTab === 'all' || activeTab === 'posts') && posts.length" class="mb-5">
          <h4 class="text-muted-foreground mb-2">帖子</h4>
          <div class="space-y-3">
            <PostCard
              v-for="post in (activeTab === 'all' ? posts.slice(0, 3) : posts)"
              :key="post.id"
              :post="post"
            />
          </div>
          <button v-if="activeTab === 'all' && posts.length > 3"
            class="mt-2 w-full py-2 text-sm text-primary hover:text-primary/70 transition-colors"
            @click="activeTab = 'posts'">
            查看全部 {{ posts.length }} 条帖子 
          </button>
        </div>

        <!-- 用户 -->
        <div v-if="(activeTab === 'all' || activeTab === 'users') && users.length" class="mb-5">
          <h4 class="text-muted-foreground mb-2">用户</h4>
          <div class="space-y-2">
            <button
              v-for="user in (activeTab === 'all' ? users.slice(0, 3) : users)"
              :key="user.id"
              class="w-full bg-card rounded-xl p-3 border border-border/50 flex items-center gap-3 hover:bg-secondary transition-colors"
              @click="router.push(`/user/${user.id}`)">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img v-if="user.avatar" :src="user.avatar" alt="" class="w-full h-full object-cover" />
                <span v-else class="text-primary font-medium">{{ user.nickname[0] }}</span>
              </div>
              <div class="flex-1 text-left">
                <p class="font-medium">{{ user.nickname }}</p>
                <p v-if="user.bio" class="text-sm text-muted-foreground truncate">{{ user.bio }}</p>
              </div>
              <User class="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <button v-if="activeTab === 'all' && users.length > 3"
            class="mt-2 w-full py-2 text-sm text-primary hover:text-primary/70 transition-colors"
            @click="activeTab = 'users'">
            查看全部 {{ users.length }} 个用户 
          </button>
        </div>

        <!-- 文章 -->
        <div v-if="(activeTab === 'all' || activeTab === 'articles') && articles.length" class="mb-5">
          <h4 class="text-muted-foreground mb-2">相关文章</h4>
          <div class="space-y-2">
            <button
              v-for="article in (activeTab === 'all' ? articles.slice(0, 3) : articles)"
              :key="article.id"
              class="w-full bg-card rounded-xl p-4 border border-border/50 flex items-start gap-3 hover:bg-secondary transition-colors text-left"
              @click="router.push(`/resources/article/${article.id}`)">
              <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileText class="w-4 h-4 text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm leading-snug mb-1">{{ article.title }}</p>
                <div class="flex items-center gap-2">
                  <span class="text-xs px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">{{ article.category }}</span>
                  <p v-if="article.summary" class="text-xs text-muted-foreground truncate">{{ article.summary }}</p>
                </div>
              </div>
            </button>
          </div>
          <button v-if="activeTab === 'all' && articles.length > 3"
            class="mt-2 w-full py-2 text-sm text-primary hover:text-primary/70 transition-colors"
            @click="activeTab = 'articles'">
            查看全部 {{ articles.length }} 篇文章 
          </button>
        </div>

        <!-- 无结果 -->
        <div v-if="!hasResults" class="text-center py-12">
          <SearchIcon class="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p class="text-muted-foreground">没有找到「{{ query }}」的相关结果</p>
          <p class="text-sm text-muted-foreground/60 mt-1">试试换个关键词？</p>
        </div>
      </template>
    </div>
  </div>
</template>
