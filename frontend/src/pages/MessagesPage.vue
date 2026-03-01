<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, MessageSquare, Bell, ChevronRight } from 'lucide-vue-next'
import BottomNav from '@/components/community/BottomNav.vue'
import { messageApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const auth = useAuthStore()

interface Conversation {
  id: string
  otherUser: { id: string; nickname: string; avatar?: string }
  lastMessage: { content: string; createdAt: string }
  unreadCount: number
}

const conversations = ref<Conversation[]>([])
interface NotificationItem {
  id: string
  type: string
  content: string
  createdAt: string
  isRead: boolean
  relatedPostId?: string | null
  from?: { id: string; name: string; avatar?: string } | null
}

const notifications = ref<NotificationItem[]>([])
const isLoading = ref(true)
const activeTab = ref<'messages' | 'notifications'>('messages')
const unreadCount = ref(0)

function updateUnreadCount() {
  unreadCount.value = notifications.value.filter(n => !n.isRead).length
}

onMounted(async () => {
  if (!auth.isAuthenticated) { isLoading.value = false; return }
  try {
    const [convRes, notifRes] = await Promise.all([messageApi.getConversations(), messageApi.getNotifications()])
    // backend returns array directly; map field names (user→otherUser, lastMessageTime→createdAt)
    const rawConvs = convRes.data as any[]
    conversations.value = rawConvs.map(c => ({
      id: c.id,
      otherUser: { id: c.user?.id ?? '', nickname: c.user?.name ?? c.otherUser?.nickname ?? '用户', avatar: c.user?.avatar ?? c.otherUser?.avatar },
      lastMessage: { content: c.lastMessage ?? c.last_message ?? '', createdAt: c.lastMessageTime ?? c.last_message_time ?? '' },
      unreadCount: c.unreadCount ?? 0,
    }))
    notifications.value = (notifRes.data as NotificationItem[]) ?? []
    updateUnreadCount()
  } catch { toast.error('加载失败') }
  finally { isLoading.value = false }
})

async function markAllRead() {
  if (!unreadCount.value) return
  try {
    await messageApi.markAllRead()
    notifications.value = notifications.value.map(n => ({ ...n, isRead: true }))
    updateUnreadCount()
    toast.success('已全部标为已读')
  } catch {
    toast.error('操作失败')
  }
}

function getNotifLink(notif: NotificationItem): string | null {
  if ((notif.type === 'like' || notif.type === 'comment') && notif.relatedPostId) return `/post/${notif.relatedPostId}`
  if (notif.type === 'follow' && notif.from?.id) return `/user/${notif.from.id}`
  if (notif.type === 'family') return '/family'
  return null
}

function handleNotifClick(notif: NotificationItem) {
  const link = getNotifLink(notif)
  if (link) router.push(link)
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}
</script>

<template>
  <div class="min-h-screen bg-background pb-20">
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
      <div class="flex items-center justify-between mb-3">
        <h1>消息</h1>
        <div class="flex items-center gap-2">
          <button v-if="unreadCount" class="px-3 py-1 bg-primary/10 rounded-full text-xs text-primary">{{ unreadCount }} 条未读</button>
          <button
            v-if="activeTab === 'notifications' && unreadCount"
            class="px-3 py-1 bg-secondary rounded-full text-xs hover:bg-accent transition-colors"
            @click="markAllRead"
          >
            全部已读
          </button>
        </div>
      </div>
      <div class="flex gap-2">
        <button v-for="tab in [{ id: 'messages', label: '私信', icon: MessageSquare }, { id: 'notifications', label: '通知', icon: Bell }]" :key="tab.id"
          class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors"
          :class="activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-accent'"
          @click="activeTab = (tab.id as 'messages' | 'notifications')">
          <component :is="tab.icon" class="w-4 h-4" /><span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <div class="px-6 py-4">
      <div v-if="isLoading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="h-16 bg-card rounded-2xl animate-pulse border border-border/50" />
      </div>

      <!-- 私信列表 -->
      <template v-else-if="activeTab === 'messages'">
        <div v-if="conversations.length" class="space-y-2">
          <button v-for="conv in conversations" :key="conv.id"
            class="w-full bg-card rounded-2xl p-4 border border-border/50 hover:bg-secondary transition-colors flex items-center gap-3"
            @click="router.push(`/messages/${conv.id}`)">
            <div class="relative flex-shrink-0">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-medium overflow-hidden">
                <img v-if="conv.otherUser.avatar" :src="conv.otherUser.avatar" alt="" class="w-full h-full object-cover" />
                <span v-else>{{ conv.otherUser.nickname[0] }}</span>
              </div>
              <span v-if="conv.unreadCount" class="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                {{ conv.unreadCount }}
              </span>
            </div>
            <div class="flex-1 min-w-0 text-left">
              <div class="flex items-center justify-between mb-1">
                <span class="font-medium">{{ conv.otherUser.nickname }}</span>
                <span class="text-xs text-muted-foreground flex-shrink-0">{{ formatTime(conv.lastMessage.createdAt) }}</span>
              </div>
              <p class="text-sm text-muted-foreground truncate">{{ conv.lastMessage.content }}</p>
            </div>
            <ChevronRight class="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </button>
        </div>
        <div v-else class="text-center py-12 text-muted-foreground text-sm">暂无私信</div>
      </template>

      <!-- 通知列表 -->
      <template v-else>
        <div v-if="notifications.length" class="space-y-2">
          <div
            v-for="notif in notifications"
            :key="notif.id"
            class="bg-card rounded-2xl p-4 border border-border/50 flex items-start gap-3 transition-colors"
            :class="[
              { 'border-primary/20 bg-primary/5': !notif.isRead },
              getNotifLink(notif) ? 'cursor-pointer hover:bg-secondary' : 'cursor-default'
            ]"
            @click="handleNotifClick(notif)"
          >
            <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              :class="notif.type === 'like' ? 'bg-rose-100 text-rose-500' : notif.type === 'comment' ? 'bg-blue-100 text-blue-500' : 'bg-primary/10 text-primary'">
              <Bell class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <p v-if="notif.from?.name" class="text-xs text-muted-foreground mb-0.5">{{ notif.from.name }}</p>
              <p class="text-sm">{{ notif.content }}</p>
              <span class="text-xs text-muted-foreground mt-1 block">{{ formatTime(notif.createdAt) }}</span>
            </div>
            <span v-if="!notif.isRead" class="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
          </div>
        </div>
        <div v-else class="text-center py-12 text-muted-foreground text-sm">暂无通知</div>
      </template>
    </div>

    <BottomNav />
  </div>
</template>
