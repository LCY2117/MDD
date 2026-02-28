<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router'
import { Shield, Heart, Users } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-primary/10 to-background flex flex-col items-center justify-center p-6">
    <div class="text-center max-w-sm w-full">
      <div class="w-24 h-24 rounded-3xl bg-primary mx-auto flex items-center justify-center shadow-lg mb-8">
        <Shield class="w-12 h-12 text-primary-foreground" />
      </div>
      <h1 class="mb-3">心语社区</h1>
      <p class="text-muted-foreground mb-12 leading-relaxed">
        一个温暖、安全的抑郁症互助社区<br />陪伴你走过每一段旅程
      </p>

      <div class="grid grid-cols-3 gap-4 mb-12">
        <div v-for="feature in [{ icon: Heart, label: '情绪支持' }, { icon: Users, label: '互助社区' }, { icon: Shield, label: '安全隐私' }]"
          :key="feature.label"
          class="bg-card rounded-2xl p-4 text-center border border-border/50">
          <component :is="feature.icon" class="w-6 h-6 text-primary mx-auto mb-2" />
          <span class="text-xs text-muted-foreground">{{ feature.label }}</span>
        </div>
      </div>

      <RouterLink to="/login">
        <button class="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-medium hover:bg-primary/90 transition-colors mb-3">
          开始使用
        </button>
      </RouterLink>
      <RouterLink to="/">
        <button class="w-full py-3 text-muted-foreground hover:text-foreground transition-colors text-sm">
          先看看 →
        </button>
      </RouterLink>
    </div>
  </div>
</template>
