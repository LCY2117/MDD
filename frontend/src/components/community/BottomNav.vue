<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router'
import { Home, Users, BookOpen, Bot, User } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { icon: Home, label: '首页', to: '/' },
  { icon: Users, label: '社区', to: '/community' },
  { icon: Bot, label: 'AI', to: '/ai-chat' },
  { icon: BookOpen, label: '资源', to: '/resources' },
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
        <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
        <span class="text-xs font-medium truncate">{{ item.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
