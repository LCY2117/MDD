<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Sun, Moon, Monitor, Bell, Lock, HelpCircle, LogOut, ChevronRight, Heart, Info } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { toast } from 'vue-sonner'
import { useConfirm } from '@/lib/useConfirm'

const router = useRouter()
const auth = useAuthStore()
const themeStore = useThemeStore()
const { confirm } = useConfirm()

const themes = [
  { id: 'light', label: '浅色', icon: Sun },
  { id: 'dark', label: '深色', icon: Moon },
  { id: 'system', label: '系统', icon: Monitor },
] as const

async function handleLogout() {
  const ok = await confirm({ title: '退出登录', message: '确定要退出登录吗？退出后需要重新登录。', confirmText: '退出', cancelText: '取消', variant: 'warning' })
  if (!ok) return
  auth.logout()
  toast.success('已退出登录')
  router.push('/welcome')
}

const menuSections = computed(() => [
  {
    title: '账号',
    items: [
      { icon: Bell, label: '通知设置', action: () => router.push('/settings/notifications') },
      { icon: Lock, label: '隐私与安全', action: () => router.push('/settings/privacy') },
    ],
  },
  {
    title: '功能',
    items: [
      { icon: Heart, label: '家人关怀', action: () => router.push('/family') },
      { icon: Bell, label: '订阅管理', action: () => router.push('/subscription') },
    ],
  },
  {
    title: '支持',
    items: [
      { icon: HelpCircle, label: '帮助中心', action: () => router.push('/help') },
      { icon: Info, label: '关于心语社区', action: () => router.push('/about') },
    ],
  },
])
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50 flex items-center gap-3">
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()"><ArrowLeft class="w-5 h-5" /></button>
      <h3>设置</h3>
    </div>

    <div class="px-6 py-4 space-y-5">
      <!-- 用户信息 -->
      <div v-if="auth.isAuthenticated"
        class="w-full bg-card rounded-2xl p-4 border border-border/50 flex items-center gap-3">
        <div class="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center overflow-hidden flex-shrink-0">
          <img v-if="auth.user?.avatar" :src="auth.user.avatar" alt="" class="w-full h-full object-cover" />
          <span v-else class="text-primary font-medium text-xl">{{ (auth.user?.nickname || '？')[0] }}</span>
        </div>
        <div class="flex-1 text-left">
          <p class="font-medium">{{ auth.user?.nickname || '用户' }}</p>
          <p class="text-sm text-muted-foreground">{{ auth.user?.email || '' }}</p>
        </div>
      </div>
      <button v-else class="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors" @click="router.push('/login')">立即登录</button>

      <!-- 主题切换 -->
      <div class="bg-card rounded-2xl p-4 border border-border/50">
        <h4 class="mb-3">外观主题</h4>
        <div class="grid grid-cols-3 gap-2">
          <button v-for="t in themes" :key="t.id"
            class="flex flex-col items-center gap-2 py-3 rounded-xl transition-all border-2"
            :class="themeStore.theme === t.id ? 'border-primary bg-primary/10' : 'border-transparent bg-secondary hover:bg-accent'"
            @click="themeStore.setTheme(t.id)">
            <component :is="t.icon" class="w-5 h-5" :class="themeStore.theme === t.id ? 'text-primary' : 'text-muted-foreground'" />
            <span class="text-sm" :class="{ 'text-primary font-medium': themeStore.theme === t.id }">{{ t.label }}</span>
          </button>
        </div>
      </div>

      <!-- 功能设置菜单 -->
      <div v-for="section in menuSections" :key="section.title" class="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <div class="px-4 py-2 bg-secondary/50">
          <p class="text-xs text-muted-foreground uppercase tracking-wider">{{ section.title }}</p>
        </div>
        <div class="divide-y divide-border/30">
          <button v-for="item in section.items" :key="item.label"
            class="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary transition-colors"
            @click="item.action()">
            <component :is="item.icon" class="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span class="flex-1 text-left">{{ item.label }}</span>
            <ChevronRight class="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <!-- 退出登录 -->
      <button v-if="auth.isAuthenticated"
        class="w-full py-3 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2"
        @click="handleLogout">
        <LogOut class="w-5 h-5" /><span>退出登录</span>
      </button>

      <p class="text-center text-xs text-muted-foreground py-2">心语社区 v1.0.0</p>
    </div>
  </div>
</template>
