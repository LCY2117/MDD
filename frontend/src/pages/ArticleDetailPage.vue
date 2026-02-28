<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Bot, BookOpen, Clock } from 'lucide-vue-next'
import { articleApi } from '@/lib/api'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const articleId = route.params.id as string

interface Article {
  id: string
  title: string
  category: string
  content: string
  readTime: number
  publishedAt: string
  author?: string
}

const article = ref<Article | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const res = await articleApi.getArticle(articleId)
    const raw = res.data as any
    article.value = {
      ...raw,
      readTime: raw.read_time ?? Math.max(1, Math.round((raw.content?.length ?? 0) / 400)),
    }
  } catch { toast.error('文章加载失败') }
  finally { isLoading.value = false }
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50 flex items-center justify-between">
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()"><ArrowLeft class="w-5 h-5" /></button>
      <button class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:bg-primary/90 transition-colors"
        @click="router.push('/ai-chat')">
        <Bot class="w-4 h-4" /><span>AI 助理</span>
      </button>
    </div>

    <div v-if="isLoading" class="p-6 space-y-4">
      <div class="h-8 w-2/3 bg-card rounded-xl animate-pulse border border-border/50" />
      <div class="h-4 w-1/2 bg-card rounded-xl animate-pulse border border-border/50" />
      <div class="space-y-2 mt-4">
        <div v-for="i in 8" :key="i" class="h-3 bg-card rounded animate-pulse border border-border/50" />
      </div>
    </div>

    <article v-else-if="article" class="px-6 py-5">
      <span class="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{{ article.category }}</span>
      <h1 class="mt-3 mb-3">{{ article.title }}</h1>
      <div class="flex items-center gap-4 mb-6 text-xs text-muted-foreground">
        <div class="flex items-center gap-1"><BookOpen class="w-3.5 h-3.5" /><span>{{ article.author ?? '心语社区' }}</span></div>
        <div class="flex items-center gap-1"><Clock class="w-3.5 h-3.5" /><span>约{{ article.readTime }}分钟</span></div>
      </div>
      <div class="prose prose-sm max-w-none leading-relaxed text-foreground whitespace-pre-wrap">{{ article.content }}</div>

      <!-- AI 助理入口 -->
      <div class="mt-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-5 border border-primary/20">
        <h4 class="mb-2">有疑问？问问 AI 助理</h4>
        <p class="text-sm text-muted-foreground mb-4">AI 助理可以帮你解答阅读中遇到的任何问题，提供个性化解释。</p>
        <button class="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors text-sm"
          @click="router.push('/ai-chat')">
          <Bot class="w-4 h-4" />开始对话
        </button>
      </div>
    </article>

    <div v-else class="text-center py-12 text-muted-foreground">文章不存在</div>
  </div>
</template>
