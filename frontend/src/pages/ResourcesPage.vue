<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Search, BookOpen, Video, FileText, Star, ChevronRight, ExternalLink } from 'lucide-vue-next'
import BottomNav from '@/components/community/BottomNav.vue'
import { articleApi } from '@/lib/api'
import { toast } from 'vue-sonner'

const router = useRouter()

interface Article {
  id: string
  title: string
  summary: string
  category: string
  type: 'article' | 'video' | 'guide'
  readTime: number
  isFeatured?: boolean
}

const categories = ['全部', '基础知识', '自我照顾', '家属指南', '用药指南', '心理咨询', '康复故事']
const activeCategory = ref('全部')
const articles = ref<Article[]>([])
const isLoading = ref(true)
const searchQuery = ref('')

const typeIcon = { article: BookOpen, video: Video, guide: FileText }

onMounted(() => loadArticles())

async function loadArticles() {
  isLoading.value = true
  try {
    const res = await articleApi.getArticles(activeCategory.value === '全部' ? undefined : activeCategory.value)
    articles.value = (res.data as { articles: Article[] }).articles
  } catch { toast.error('加载失败') }
  finally { isLoading.value = false }
}

function selectCategory(cat: string) { activeCategory.value = cat; loadArticles() }

const filteredArticles = ref<Article[]>([])
import { watch, computed } from 'vue'
const displayArticles = computed(() =>
  searchQuery.value
    ? articles.value.filter(a => a.title.includes(searchQuery.value) || a.summary.includes(searchQuery.value))
    : articles.value
)
</script>

<template>
  <div class="min-h-screen bg-background pb-20">
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 pt-6 pb-3 border-b border-border/50">
      <h1 class="mb-4">资源库</h1>
      <div class="relative mb-4">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input v-model="searchQuery" type="text" placeholder="搜索文章、指南..."
          class="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
      </div>
      <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button v-for="cat in categories" :key="cat"
          class="flex-shrink-0 px-4 py-2 rounded-full text-sm transition-colors"
          :class="activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-accent'"
          @click="selectCategory(cat)">{{ cat }}</button>
      </div>
    </div>

    <div class="px-6 py-4">
      <!-- 精选推荐 -->
      <div v-if="!searchQuery" class="mb-5">
        <div class="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-5 text-primary-foreground mb-4">
          <div class="flex items-center gap-2 mb-2"><Star class="w-5 h-5" /><span class="text-sm opacity-90">精选推荐</span></div>
          <h3 class="mb-2 text-primary-foreground">理解与支持抑郁症患者指南</h3>
          <p class="text-sm opacity-80 mb-4">给家属、朋友和照顾者的全面指南，学会如何提供有效的支持</p>
          <button class="px-4 py-2 bg-white/20 rounded-xl text-sm hover:bg-white/30 transition-colors"
            @click="router.push('/resources/article/support-guide')">立即阅读</button>
        </div>
      </div>

      <!-- 文章列表 -->
      <div v-if="isLoading" class="space-y-3">
        <div v-for="i in 4" :key="i" class="h-20 bg-card rounded-2xl animate-pulse border border-border/50" />
      </div>
      <div v-else-if="displayArticles.length" class="space-y-3">
        <button v-for="article in displayArticles" :key="article.id"
          class="w-full bg-card rounded-2xl p-4 border border-border/50 hover:shadow-md transition-all text-left group"
          @click="router.push(`/resources/article/${article.id}`)">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"
              :class="article.type === 'video' ? 'bg-red-100 text-red-500' : article.type === 'guide' ? 'bg-amber-100 text-amber-500' : 'bg-primary/10 text-primary'">
              <component :is="typeIcon[article.type]" class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <span class="text-xs px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">{{ article.category }}</span>
              <h4 class="mt-1.5 mb-1">{{ article.title }}</h4>
              <p class="text-sm text-muted-foreground line-clamp-2">{{ article.summary }}</p>
              <div class="mt-2 flex items-center justify-between">
                <span class="text-xs text-muted-foreground">约{{ article.readTime }}分钟阅读</span>
                <div class="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink class="w-3 h-3" /><span>阅读</span>
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>
      <div v-else class="text-center py-12 text-muted-foreground text-sm">暂无相关内容</div>
    </div>

    <BottomNav />
  </div>
</template>
