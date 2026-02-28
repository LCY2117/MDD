<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Bell, CheckCheck } from 'lucide-vue-next'
import { messageApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const auth = useAuthStore()

interface Notification { id: string; type: string; content: string; createdAt: string; isRead: boolean }
const notifications = ref<Notification[]>([])
const isLoading = ref(true)

onMounted(async () => {
  if (!auth.isAuthenticated) { isLoading.value = false; return }
  try {
    const res = await messageApi.getNotifications()
    notifications.value = (res.data as { notifications: Notification[] }).notifications
  } catch { toast.error('加载失败') }
  finally { isLoading.value = false }
})

async function markAllRead() {
  try {
    await messageApi.markAllRead()
    notifications.value = notifications.value.map(n => ({ ...n, isRead: true }))
    toast.success('已全部标为已读')
  } catch { toast.error('操作失败') }
}

function formatTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

const typeColors: Record<string, string> = {
  like: 'bg-rose-100 text-rose-500', comment: 'bg-blue-100 text-blue-500',
  follow: 'bg-green-100 text-green-500', system: 'bg-primary/10 text-primary',
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50 flex items-center justify-between">
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()"><ArrowLeft class="w-5 h-5" /></button>
      <h3>通知</h3>
      <button v-if="notifications.some(n => !n.isRead)" class="flex items-center gap-1 text-sm text-primary hover:text-primary/70" @click="markAllRead">
        <CheckCheck class="w-4 h-4" />全部已读
      </button>
      <div v-else class="w-16" />
    </div>

    <div class="px-6 py-4">
      <div v-if="isLoading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="h-16 bg-card rounded-2xl animate-pulse border border-border/50" />
      </div>
      <div v-else-if="notifications.length" class="space-y-2">
        <div v-for="notif in notifications" :key="notif.id"
          class="bg-card rounded-2xl p-4 border transition-colors"
          :class="notif.isRead ? 'border-border/50' : 'border-primary/20 bg-primary/5'">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              :class="typeColors[notif.type] || typeColors.system">
              <Bell class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <p class="text-sm">{{ notif.content }}</p>
              <span class="text-xs text-muted-foreground mt-1 block">{{ formatTime(notif.createdAt) }}</span>
            </div>
            <span v-if="!notif.isRead" class="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-1" />
          </div>
        </div>
      </div>
      <div v-else class="text-center py-12">
        <Bell class="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
        <p class="text-muted-foreground text-sm">暂无通知</p>
      </div>
    </div>
  </div>
</template>
