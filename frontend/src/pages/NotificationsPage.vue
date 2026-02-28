<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, CheckCheck, Settings, Trash2 } from 'lucide-vue-next'
import BottomNav from '@/components/community/BottomNav.vue'
import { messageApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const auth = useAuthStore()

interface Notification {
  id: string
  type: string
  content: string
  createdAt: string
  isRead: boolean
  relatedPostId?: string | null
  from?: { id: string; name: string; avatar?: string } | null
}
const notifications = ref<Notification[]>([])
const isLoading = ref(true)

onMounted(async () => {
  if (!auth.isAuthenticated) { isLoading.value = false; return }
  try {
    const res = await messageApi.getNotifications()
    // 后端直接返回数组，不包在 {notifications} 里
    notifications.value = res.data as Notification[]
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

async function clearAll() {
  if (!notifications.value.length) return
  try {
    await messageApi.clearAllNotifications()
    notifications.value = []
    toast.success('已清空所有通知')
  } catch { toast.error('清空失败') }
}

function formatTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

function getNotifLink(notif: Notification): string | null {
  if ((notif.type === 'like' || notif.type === 'comment') && notif.relatedPostId) return `/post/${notif.relatedPostId}`
  if (notif.type === 'follow' && notif.from?.id) return `/user/${notif.from.id}`
  if (notif.type === 'message' && notif.from?.id) return `/messages/${notif.from.id}`
  if (notif.type === 'family') return '/family'
  return null
}

function handleNotifClick(notif: Notification) {
  const link = getNotifLink(notif)
  if (link) router.push(link)
}

const typeColors: Record<string, string> = {
  like: 'bg-rose-100 dark:bg-rose-950/40 text-rose-500',
  comment: 'bg-blue-100 dark:bg-blue-950/40 text-blue-500',
  follow: 'bg-green-100 dark:bg-green-950/40 text-green-500',
  family: 'bg-amber-100 dark:bg-amber-950/40 text-amber-500',
  message: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-500',
  system: 'bg-primary/10 text-primary',
}
const typeIcon: Record<string, string> = {
  like: '❤️', comment: '💬', follow: '➕', family: '🏠', message: '✉️', system: '🔔',
}
</script>

<template>
  <div class="min-h-screen bg-background pb-20">
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50 flex items-center justify-between">
      <h3>通知</h3>
      <div class="flex items-center gap-1">
        <button v-if="notifications.some(n => !n.isRead)" class="flex items-center gap-1 text-xs text-primary hover:text-primary/70 px-2 py-1" @click="markAllRead">
          <CheckCheck class="w-3.5 h-3.5" />全部已读
        </button>
        <button v-if="notifications.length" class="flex items-center gap-1 text-xs text-destructive hover:text-destructive/70 px-2 py-1" @click="clearAll">
          <Trash2 class="w-3.5 h-3.5" />清空
        </button>
        <button class="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground" @click="router.push('/settings/notifications')">
          <Settings class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="px-6 py-4">
      <div v-if="isLoading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="h-16 bg-card rounded-2xl animate-pulse border border-border/50" />
      </div>
      <div v-else-if="notifications.length" class="space-y-2">
        <div v-for="notif in notifications" :key="notif.id"
          class="bg-card rounded-2xl p-4 border transition-all"
          :class="[notif.isRead ? 'border-border/50' : 'border-primary/20 bg-primary/5', getNotifLink(notif) ? 'cursor-pointer hover:bg-secondary active:scale-[0.99]' : 'cursor-default']"
          @click="handleNotifClick(notif)">
          <div class="flex items-start gap-3">
            <!-- 头像或图标 -->
            <div v-if="notif.from?.avatar" class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img :src="notif.from.avatar" class="w-full h-full object-cover" alt="" />
            </div>
            <div v-else class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-base"
              :class="typeColors[notif.type] || typeColors.system">
              {{ typeIcon[notif.type] || typeIcon.system }}
            </div>
            <div class="flex-1 min-w-0">
              <p v-if="notif.from" class="text-xs font-medium text-muted-foreground mb-0.5">{{ notif.from.name }}</p>
              <p class="text-sm leading-relaxed">{{ notif.content }}</p>
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
    <BottomNav />
  </div>
</template>
