<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { Home, Users, Bell, Bot, User } from 'lucide-vue-next'
import { messageApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const auth = useAuthStore()
const unreadCount = ref(0)

onMounted(async () => {
  if (!auth.isAuthenticated) return
  try {
    const res = await messageApi.getUnreadCount()
    const data = res.data as { notifications: number; messages: number }
    unreadCount.value = data.notifications + data.messages
  } catch { /* ignore */ }
})

const navItems = [
  { icon: Home, label: '首页', to: '/' },
  { icon: Users, label: '社区', to: '/community' },
  { icon: Bot, label: 'AI', to: '/ai-chat' },
  { icon: Bell, label: '消息', to: '/messages' },
  { icon: User, label: '我的', to: '/profile' },
]
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 z-50">
    <div class="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-0"
        :class="route.path === item.to || (item.to !== '/' && route.path.startsWith(item.to))
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground'"
      >
        <div class="relative">
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span v-if="item.to === '/messages' && unreadCount > 0"
            class="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </span>
        </div>
        <span class="text-xs font-medium truncate">{{ item.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
