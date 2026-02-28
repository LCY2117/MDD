<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Plus, Lock, BookOpen, Calendar } from 'lucide-vue-next'
import { diaryApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const auth = useAuthStore()

interface DiaryEntry {
  id: string
  title?: string
  content: string
  tags: string[]
  isPrivate: boolean
  mood?: string
  createdAt: string
  updatedAt: string
}

const entries = ref<DiaryEntry[]>([])
const isLoading = ref(true)

const moodLabel: Record<string, string> = { sunny: '😊 不错', cloudy: '😐 一般', rainy: '😔 有点难受' }

onMounted(async () => {
  if (!auth.isAuthenticated) { router.push('/login'); return }
  try {
    const res = await diaryApi.getDiaries()
    entries.value = (res.data as { entries: DiaryEntry[] }).entries ?? []
  } catch { toast.error('加载失败') }
  finally { isLoading.value = false }
})

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

function preview(content: string) {
  return content.replace(/\n/g, ' ').slice(0, 60) + (content.length > 60 ? '...' : '')
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()">
          <ArrowLeft class="w-5 h-5" />
        </button>
        <h3>我的日记</h3>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:bg-primary/90 transition-colors"
        @click="router.push('/diary/new')"
      >
        <Plus class="w-4 h-4" /><span>写日记</span>
      </button>
    </div>

    <div class="px-6 py-4">
      <!-- 加载中 -->
      <div v-if="isLoading" class="space-y-3">
        <div v-for="i in 4" :key="i" class="h-24 bg-card rounded-2xl animate-pulse border border-border/50" />
      </div>

      <!-- 日记列表 -->
      <div v-else-if="entries.length" class="space-y-3">
        <button
          v-for="entry in entries"
          :key="entry.id"
          class="w-full bg-card rounded-2xl p-4 border border-border/50 hover:shadow-md transition-all text-left"
          @click="router.push(`/diary/${entry.id}`)"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1.5">
                <h4 class="truncate">{{ entry.title || '无标题' }}</h4>
                <Lock v-if="entry.isPrivate" class="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              </div>
              <p class="text-sm text-muted-foreground line-clamp-2 mb-2">{{ preview(entry.content) }}</p>
              <div class="flex items-center gap-3 text-xs text-muted-foreground">
                <div class="flex items-center gap-1">
                  <Calendar class="w-3.5 h-3.5" />
                  <span>{{ formatDate(entry.createdAt) }}</span>
                </div>
                <span v-if="entry.mood">{{ moodLabel[entry.mood] ?? entry.mood }}</span>
              </div>
              <div v-if="entry.tags?.length" class="flex flex-wrap gap-1.5 mt-2">
                <span v-for="tag in entry.tags" :key="tag"
                  class="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">{{ tag }}</span>
              </div>
            </div>
            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <BookOpen class="w-5 h-5 text-primary" />
            </div>
          </div>
        </button>
      </div>

      <!-- 空状态 -->
      <div v-else class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <BookOpen class="w-8 h-8 text-primary" />
        </div>
        <h4 class="mb-2">还没有日记</h4>
        <p class="text-sm text-muted-foreground mb-6">记录每天的心情和感受，是了解自己的开始</p>
        <button
          class="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          @click="router.push('/diary/new')"
        >
          写第一篇日记
        </button>
      </div>
    </div>
  </div>
</template>
