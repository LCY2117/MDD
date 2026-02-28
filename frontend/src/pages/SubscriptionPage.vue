<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft, Crown, Check, Sparkles, Bot, BookOpen, Heart } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const plans = [
  {
    id: 'free', label: '免费版', price: '¥0', period: '/月',
    features: ['内容浏览', '情绪记录（7天）', '参与社区讨论', 'AI基础对话（每天5次）'],
    isCurrent: true,
  },
  {
    id: 'pro', label: '心语会员', price: '¥18', period: '/月',
    features: ['所有免费功能', '无限情绪记录', '无限日记', 'AI助理无限次对话', '家属关怀模式', '专属会员徽章', '每月3次专家答疑'],
    recommended: true, isCurrent: false,
  },
]

function handleSubscribe(planId: string) {
  if (planId === 'free') return
  if (!auth.isAuthenticated) { toast.info('请先登录'); return }
  toast.info('支付功能即将上线，敬请期待 💙')
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50 flex items-center gap-3">
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()"><ArrowLeft class="w-5 h-5" /></button>
      <h3>会员订阅</h3>
    </div>

    <div class="px-6 py-4 space-y-4">
      <!-- 头部介绍 -->
      <div class="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
        <div class="flex items-center gap-2 mb-2"><Crown class="w-6 h-6" /><h3 class="text-primary-foreground">心语会员</h3></div>
        <p class="opacity-90 text-sm">解锁所有功能，让心情陪伴更完整</p>
      </div>

      <!-- 订阅计划 -->
      <div class="grid gap-3">
        <div v-for="plan in plans" :key="plan.id"
          class="bg-card rounded-2xl p-5 border-2 transition-all"
          :class="plan.recommended ? 'border-primary' : 'border-border/50'">
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h4>{{ plan.label }}</h4>
                <span v-if="plan.recommended" class="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1">
                  <Sparkles class="w-3 h-3" />推荐
                </span>
                <span v-if="plan.isCurrent" class="px-2 py-0.5 bg-secondary text-muted-foreground text-xs rounded-full">当前使用</span>
              </div>
              <div class="flex items-baseline gap-1">
                <span class="text-2xl font-medium" :class="plan.recommended ? 'text-primary' : ''">{{ plan.price }}</span>
                <span class="text-sm text-muted-foreground">{{ plan.period }}</span>
              </div>
            </div>
          </div>
          <div class="space-y-2 mb-5">
            <div v-for="feature in plan.features" :key="feature" class="flex items-center gap-2 text-sm">
              <Check class="w-4 h-4 text-primary flex-shrink-0" />
              <span>{{ feature }}</span>
            </div>
          </div>
          <button :disabled="plan.isCurrent"
            class="w-full py-3 rounded-xl transition-colors text-sm"
            :class="plan.recommended ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary hover:bg-accent disabled:cursor-not-allowed'"
            @click="handleSubscribe(plan.id)">
            {{ plan.isCurrent ? '当前版本' : '立即订阅' }}
          </button>
        </div>
      </div>

      <!-- 功能说明 -->
      <div class="grid grid-cols-3 gap-3">
        <div v-for="feat in [{ icon: Bot, label: 'AI助理', desc: '无限对话' }, { icon: Heart, label: '家属关怀', desc: '情绪共享' }, { icon: BookOpen, label: '专家答疑', desc: '每月3次' }]" :key="feat.label"
          class="bg-card rounded-2xl p-4 text-center border border-border/50">
          <component :is="feat.icon" class="w-7 h-7 text-primary mx-auto mb-2" />
          <p class="text-sm font-medium">{{ feat.label }}</p>
          <p class="text-xs text-muted-foreground">{{ feat.desc }}</p>
        </div>
      </div>

      <p class="text-xs text-muted-foreground text-center pb-4">订阅自动续费，可随时取消 · 支持支付宝/微信支付</p>
    </div>
  </div>
</template>
