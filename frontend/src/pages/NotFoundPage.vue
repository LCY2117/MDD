<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Home, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
    <div class="text-8xl mb-6">🌫️</div>
    <h1 class="text-6xl font-medium text-muted-foreground/50 mb-4">404</h1>
    <h2 class="mb-3">页面找不到了</h2>
    <p class="text-muted-foreground mb-8 max-w-sm">你访问的页面可能已移动或不存在，请检查网址是否正确。</p>
    <div class="flex gap-3">
      <button class="flex items-center gap-2 px-6 py-3 bg-secondary rounded-xl hover:bg-accent transition-colors"
        @click="router.back()"><ArrowLeft class="w-4 h-4" />返回上一页</button>
      <button class="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
        @click="router.push('/')"><Home class="w-4 h-4" />回到首页</button>
    </div>
  </div>
</template>
