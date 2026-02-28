<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Sun, Cloud, CloudRain, TrendingUp } from 'lucide-vue-next'
import { familyApi, userApi } from '@/lib/api'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const patientId = route.params.id as string

interface MoodEntry {
  id: string
  mood: 'sunny' | 'cloudy' | 'rainy'
  score: number
  date: string
  note?: string
  createdAt: string
}

interface MoodStats {
  avgScore: string
  sunnyDays: number
  cloudyDays: number
  rainyDays: number
}

const entries = ref<MoodEntry[]>([])
const stats = ref<MoodStats | null>(null)
const patientName = ref('')
const isLoading = ref(true)

const moodIcon = { sunny: Sun, cloudy: Cloud, rainy: CloudRain }
const moodColor = { sunny: 'text-yellow-500', cloudy: 'text-gray-500', rainy: 'text-blue-400' }
const moodBg = {
  sunny: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200/50 dark:border-yellow-800/30',
  cloudy: 'bg-gray-50 dark:bg-gray-900/30 border-gray-200/50 dark:border-gray-700/30',
  rainy: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-800/30'
}
const moodLabel = { sunny: '不错', cloudy: '一般', rainy: '难受' }

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 86400000 * 1.5) return '今天'
  if (diff < 86400000 * 2.5) return '昨天'
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

onMounted(async () => {
  try {
    // 并行拉取情绪数据和用户信息
    const [moodRes, userRes] = await Promise.allSettled([
      familyApi.getMemberMood(patientId, 7),
      userApi.getUser(patientId),
    ])
    if (moodRes.status === 'fulfilled') {
      const d = (moodRes.value.data as any)
      entries.value = d.entries ?? []
      stats.value = d.stats ?? null
    } else {
      toast.error('无法查看情绪数据，可能对方未开启共享')
    }
    if (userRes.status === 'fulfilled') {
      patientName.value = (userRes.value.data as any).nickname ?? '家人'
    }
  } catch { toast.error('加载失败') }
  finally { isLoading.value = false }
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50 flex items-center gap-3">
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h3>{{ patientName ? `${patientName}的情绪动态` : '情绪趋势' }}</h3>
    </div>

    <div class="px-6 py-4 space-y-4">
      <!-- 加载中 -->
      <div v-if="isLoading" class="space-y-3">
        <div class="h-24 bg-card rounded-2xl animate-pulse border border-border/50" />
        <div v-for="i in 5" :key="i" class="h-16 bg-card rounded-2xl animate-pulse border border-border/50" />
      </div>

      <template v-else>
        <!-- 统计概览 -->
        <div v-if="stats && entries.length" class="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-5 border border-primary/20">
          <div class="flex items-center gap-2 mb-4">
            <TrendingUp class="w-4 h-4 text-primary" />
            <h4 class="text-primary">近7天情绪概览</h4>
          </div>
          <div class="grid grid-cols-4 gap-3 text-center">
            <div>
              <div class="text-2xl font-bold text-primary">{{ stats.avgScore }}</div>
              <div class="text-xs text-muted-foreground mt-0.5">平均分</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-yellow-500">{{ stats.sunnyDays }}</div>
              <div class="flex items-center justify-center gap-0.5 mt-0.5">
                <Sun class="w-3 h-3 text-yellow-500" />
                <span class="text-xs text-muted-foreground">天好</span>
              </div>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-400">{{ stats.cloudyDays }}</div>
              <div class="flex items-center justify-center gap-0.5 mt-0.5">
                <Cloud class="w-3 h-3 text-gray-400" />
                <span class="text-xs text-muted-foreground">天一般</span>
              </div>
            </div>
            <div>
              <div class="text-2xl font-bold text-blue-400">{{ stats.rainyDays }}</div>
              <div class="flex items-center justify-center gap-0.5 mt-0.5">
                <CloudRain class="w-3 h-3 text-blue-400" />
                <span class="text-xs text-muted-foreground">天难受</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 情绪条目列表 -->
        <div v-if="entries.length" class="space-y-2">
          <h4 class="text-muted-foreground">情绪记录（{{ entries.length }} 条）</h4>
          <div v-for="entry in [...entries].reverse()" :key="entry.id"
            class="rounded-2xl p-4 border flex items-start gap-3"
            :class="moodBg[entry.mood]">
            <div class="w-10 h-10 rounded-full flex items-center justify-center bg-white/50 dark:bg-black/10 flex-shrink-0">
              <component :is="moodIcon[entry.mood]" class="w-5 h-5" :class="moodColor[entry.mood]" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span class="font-medium text-sm">{{ moodLabel[entry.mood] }}</span>
                <span class="text-xs text-muted-foreground">{{ formatDate(entry.date) }}</span>
              </div>
              <p v-if="entry.note" class="text-sm text-muted-foreground line-clamp-2">{{ entry.note }}</p>
              <p v-else class="text-xs text-muted-foreground italic">没有留下备注</p>
            </div>
          </div>
        </div>

        <!-- 无数据 -->
        <div v-else class="text-center py-16">
          <div class="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <Cloud class="w-10 h-10 text-muted-foreground/40" />
          </div>
          <h3 class="mb-2 text-muted-foreground">最近7天暂无情绪记录</h3>
          <p class="text-sm text-muted-foreground">{{ patientName || '家人' }}还没有在这段时间内记录情绪</p>
        </div>
      </template>
    </div>
  </div>
</template>
