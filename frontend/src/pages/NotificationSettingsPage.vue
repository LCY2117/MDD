<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部导航 -->
    <div class="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
      <button @click="router.back()" class="p-2 hover:bg-secondary rounded-full transition-colors">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h1 class="font-semibold text-lg">通知设置</h1>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <Loader2 class="w-6 h-6 animate-spin text-primary" />
    </div>

    <div v-else class="px-4 py-4 space-y-3">
      <!-- 互动通知 -->
      <div class="bg-card rounded-2xl overflow-hidden">
        <div class="px-4 py-2.5 border-b border-border/50">
          <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">互动通知</p>
        </div>
        <div class="flex items-center justify-between px-4 py-4">
          <div class="flex-1 min-w-0 pr-4">
            <p class="font-medium text-sm">点赞通知</p>
            <p class="text-xs text-muted-foreground mt-0.5">有人点赞你的帖子时通知</p>
          </div>
          <button :class="['relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0', settings.notify_likes ? 'bg-primary' : 'bg-muted']" @click="save('notify_likes', !settings.notify_likes)">
            <span :class="['absolute left-0.5 top-0.5 w-5 h-5 rounded-full shadow-sm transition-transform duration-200', settings.notify_likes ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white/90']" />
          </button>
        </div>
        <div class="flex items-center justify-between px-4 py-4 border-t border-border/50">
          <div class="flex-1 min-w-0 pr-4">
            <p class="font-medium text-sm">评论通知</p>
            <p class="text-xs text-muted-foreground mt-0.5">有人评论你的帖子时通知</p>
          </div>
          <button :class="['relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0', settings.notify_comments ? 'bg-primary' : 'bg-muted']" @click="save('notify_comments', !settings.notify_comments)">
            <span :class="['absolute left-0.5 top-0.5 w-5 h-5 rounded-full shadow-sm transition-transform duration-200', settings.notify_comments ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white/90']" />
          </button>
        </div>
        <div class="flex items-center justify-between px-4 py-4 border-t border-border/50">
          <div class="flex-1 min-w-0 pr-4">
            <p class="font-medium text-sm">关注通知</p>
            <p class="text-xs text-muted-foreground mt-0.5">有人关注你时通知</p>
          </div>
          <button :class="['relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0', settings.notify_follows ? 'bg-primary' : 'bg-muted']" @click="save('notify_follows', !settings.notify_follows)">
            <span :class="['absolute left-0.5 top-0.5 w-5 h-5 rounded-full shadow-sm transition-transform duration-200', settings.notify_follows ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white/90']" />
          </button>
        </div>
      </div>

      <!-- 特殊通知 -->
      <div class="bg-card rounded-2xl overflow-hidden">
        <div class="px-4 py-2.5 border-b border-border/50">
          <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">特殊通知</p>
        </div>
        <div class="flex items-center justify-between px-4 py-4">
          <div class="flex-1 min-w-0 pr-4">
            <p class="font-medium text-sm">家属通知</p>
            <p class="text-xs text-muted-foreground mt-0.5">来自绑定家属的消息通知</p>
          </div>
          <button :class="['relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0', settings.notify_family ? 'bg-primary' : 'bg-muted']" @click="save('notify_family', !settings.notify_family)">
            <span :class="['absolute left-0.5 top-0.5 w-5 h-5 rounded-full shadow-sm transition-transform duration-200', settings.notify_family ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white/90']" />
          </button>
        </div>
        <div class="flex items-center justify-between px-4 py-4 border-t border-border/50">
          <div class="flex-1 min-w-0 pr-4">
            <p class="font-medium text-sm">系统通知</p>
            <p class="text-xs text-muted-foreground mt-0.5">平台公告与重要提醒</p>
          </div>
          <button :class="['relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0', settings.notify_system ? 'bg-primary' : 'bg-muted']" @click="save('notify_system', !settings.notify_system)">
            <span :class="['absolute left-0.5 top-0.5 w-5 h-5 rounded-full shadow-sm transition-transform duration-200', settings.notify_system ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white/90']" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Loader2 } from 'lucide-vue-next'
import { userApi } from '@/lib/api'
import { toast } from 'vue-sonner'

const router = useRouter()
const loading = ref(true)

const settings = ref({
  notify_likes: 1,
  notify_comments: 1,
  notify_follows: 1,
  notify_family: 1,
  notify_system: 1,
})

onMounted(async () => {
  try {
    const res = await userApi.getSettings()
    const s = res.data as Record<string, number>
    settings.value.notify_likes = s.notify_likes ?? 1
    settings.value.notify_comments = s.notify_comments ?? 1
    settings.value.notify_follows = s.notify_follows ?? 1
    settings.value.notify_family = s.notify_family ?? 1
    settings.value.notify_system = s.notify_system ?? 1
  } catch {
    toast.error('加载设置失败', { description: '请检查网络连接' })
  } finally {
    loading.value = false
  }
})

async function save(key: string, value: boolean) {
  const numVal = value ? 1 : 0
  ;(settings.value as Record<string, number>)[key] = numVal
  try {
    await userApi.updateSettings({ [key]: numVal })
  } catch {
    toast.error('保存失败')
    ;(settings.value as Record<string, number>)[key] = numVal ? 0 : 1
  }
}
</script>


