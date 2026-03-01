<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Bot, BookOpen, Clock } from 'lucide-vue-next'
import { articleApi } from '@/lib/api'
import { toast } from 'vue-sonner'
import { marked } from 'marked'

// 配置 marked：安全模式，不转义 HTML
marked.setOptions({ breaks: true, gfm: true })

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

const parsedContent = computed(() => {
  if (!article.value?.content) return ''
  return marked.parse(article.value.content) as string
})

function goAiChat() {
  const q = article.value
    ? [
        `请帮我解读下面这篇文章，用通俗易懂的语言讲解主要内容和关键知识点，并给出可执行的建议。`,
        `文章标题：${article.value.title}`,
        `文章分类：${article.value.category}`,
        `文章全文：`,
        article.value.content,
      ].join('\n\n')
    : ''
  router.push(q ? `/ai-chat?q=${encodeURIComponent(q)}` : '/ai-chat')
}

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
        @click="goAiChat()">
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
      <div class="markdown-body leading-relaxed text-foreground" v-html="parsedContent" />

      <!-- AI 助理入口 -->
      <div class="mt-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-5 border border-primary/20">
        <h4 class="mb-2">有疑问？问问 AI 助理</h4>
        <p class="text-sm text-muted-foreground mb-4">AI 助理可以帮你解答阅读中遇到的任何问题，提供个性化解释。</p>
        <button class="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors text-sm"
          @click="goAiChat()">
          <Bot class="w-4 h-4" />AI 解读此文章
        </button>
      </div>
    </article>

    <div v-else class="text-center py-12 text-muted-foreground">文章不存在</div>
  </div>
</template>

<style scoped>
.markdown-body {
  font-size: 0.9375rem;
  line-height: 1.75;
}
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  line-height: 1.3;
}
.markdown-body :deep(h1) { font-size: 1.4em; }
.markdown-body :deep(h2) { font-size: 1.2em; border-bottom: 1px solid hsl(var(--border)); padding-bottom: 0.3em; }
.markdown-body :deep(h3) { font-size: 1.05em; }
.markdown-body :deep(p) { margin-top: 0.75em; margin-bottom: 0.75em; }
.markdown-body :deep(ul),
.markdown-body :deep(ol) { padding-left: 1.5em; margin: 0.75em 0; }
.markdown-body :deep(ul) { list-style-type: disc; }
.markdown-body :deep(ol) { list-style-type: decimal; }
.markdown-body :deep(li) { margin: 0.35em 0; }
.markdown-body :deep(blockquote) {
  border-left: 3px solid hsl(var(--primary) / 0.5);
  padding: 0.6em 1em;
  margin: 1em 0;
  background: hsl(var(--primary) / 0.05);
  border-radius: 0 0.5rem 0.5rem 0;
  color: hsl(var(--muted-foreground));
  font-style: italic;
}
.markdown-body :deep(code) {
  background: hsl(var(--secondary));
  padding: 0.15em 0.4em;
  border-radius: 0.3em;
  font-size: 0.875em;
  font-family: ui-monospace, monospace;
}
.markdown-body :deep(pre) {
  background: hsl(var(--secondary));
  padding: 1em;
  border-radius: 0.75rem;
  overflow-x: auto;
  margin: 1em 0;
}
.markdown-body :deep(pre code) { background: none; padding: 0; }
.markdown-body :deep(strong) { font-weight: 600; }
.markdown-body :deep(em) { font-style: italic; }
.markdown-body :deep(hr) { border: none; border-top: 1px solid hsl(var(--border)); margin: 1.5em 0; }
.markdown-body :deep(a) { color: hsl(var(--primary)); text-decoration: underline; text-underline-offset: 2px; }
.markdown-body :deep(table) { width: 100%; border-collapse: collapse; margin: 1em 0; font-size: 0.875em; }
.markdown-body :deep(th),
.markdown-body :deep(td) { border: 1px solid hsl(var(--border)); padding: 0.5em 0.75em; text-align: left; }
.markdown-body :deep(th) { background: hsl(var(--secondary)); font-weight: 600; }
</style>
