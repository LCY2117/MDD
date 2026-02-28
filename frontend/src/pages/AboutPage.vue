<template>
  <div class="min-h-screen bg-background pb-8">
    <!-- 顶部 -->
    <div class="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
      <button @click="router.back()" class="p-2 hover:bg-secondary rounded-full transition-colors">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h1 class="font-semibold text-lg">关于心语</h1>
    </div>

    <div class="px-6 py-8 space-y-6">
      <!-- Logo + 应用名 -->
      <div class="flex flex-col items-center gap-4 py-4">
        <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
          <Heart class="w-10 h-10 text-white" />
        </div>
        <div class="text-center">
          <h2 class="text-2xl font-bold">心语</h2>
          <p class="text-sm text-muted-foreground mt-1">MDD 抑郁症互助社区</p>
          <span class="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full mt-2 inline-block">版本 1.0.0</span>
        </div>
      </div>

      <!-- 产品介绍 -->
      <div class="bg-card rounded-2xl p-5 border border-border/50 space-y-3">
        <h4 class="font-semibold flex items-center gap-2">
          <Sparkles class="w-4 h-4 text-primary" />
          我们的使命
        </h4>
        <p class="text-sm text-muted-foreground leading-relaxed">
          心语是一个专注于抑郁症（MDD）患者及其家属的温暖互助社区。我们希望通过专业的内容资源、真实的社区连接和智能的 AI 支持，让每一位正在经历抑郁的人都能感受到「你不孤单」。
        </p>
      </div>

      <!-- 核心功能 -->
      <div class="bg-card rounded-2xl p-5 border border-border/50 space-y-4">
        <h4 class="font-semibold flex items-center gap-2">
          <Layers class="w-4 h-4 text-primary" />
          核心功能
        </h4>
        <div class="space-y-3">
          <div v-for="feature in features" :key="feature.title" class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="feature.bg">
              <component :is="feature.icon" class="w-4 h-4" :class="feature.color" />
            </div>
            <div>
              <p class="text-sm font-medium">{{ feature.title }}</p>
              <p class="text-xs text-muted-foreground mt-0.5">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 友情提示 -->
      <div class="bg-destructive/5 border border-destructive/20 rounded-2xl p-5 space-y-2">
        <h4 class="font-semibold text-destructive flex items-center gap-2 text-sm">
          <Phone class="w-4 h-4" />
          危机援助热线
        </h4>
        <p class="text-xs text-muted-foreground leading-relaxed">
          如果你或身边的人正处于危机状态，请立即拨打专业援助热线。心语的 AI 助手无法替代专业医疗救助。
        </p>
        <div class="space-y-1.5 mt-1">
          <a href="tel:400-161-9995" class="flex items-center gap-2 text-sm text-destructive font-medium">
            <span>📞</span>北京心理危机研究院：400-161-9995
          </a>
          <a href="tel:010-82951332" class="flex items-center gap-2 text-sm text-destructive font-medium">
            <span>📞</span>希望24热线：010-82951332
          </a>
          <a href="tel:120" class="flex items-center gap-2 text-sm text-destructive font-medium">
            <span>📞</span>急救电话：120
          </a>
        </div>
      </div>

      <!-- 法律 -->
      <div class="bg-card rounded-2xl px-5 py-4 border border-border/50">
        <p class="text-xs text-muted-foreground text-center leading-relaxed">
          © 2026 心语团队 · 本应用内容仅供参考，不构成医疗建议<br/>
          如需专业帮助，请咨询持证心理咨询师或精神科医生
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft, Heart, Sparkles, Layers, Phone, BookOpen, Bot, Users, Smile, BookMarked } from 'lucide-vue-next'

const router = useRouter()

const features = [
  {
    icon: BookOpen,
    title: '专业内容资源',
    desc: '精选抑郁症科普文章、治疗指南与康复故事',
    bg: 'bg-blue-100 dark:bg-blue-950/30',
    color: 'text-blue-500',
  },
  {
    icon: Users,
    title: '互助社区',
    desc: '匿名或实名发帖，与有相同经历的人交流',
    bg: 'bg-green-100 dark:bg-green-950/30',
    color: 'text-green-500',
  },
  {
    icon: Bot,
    title: 'AI 心理助手',
    desc: '随时提供情绪支持、解答疑问，陪伴你度过难关',
    bg: 'bg-purple-100 dark:bg-purple-950/30',
    color: 'text-purple-500',
  },
  {
    icon: Smile,
    title: '情绪追踪',
    desc: '记录每日心情变化，发现规律，感受成长',
    bg: 'bg-yellow-100 dark:bg-yellow-950/30',
    color: 'text-yellow-500',
  },
  {
    icon: Heart,
    title: '家庭关怀模式',
    desc: '家属与患者绑定，共同关注彼此的情绪健康',
    bg: 'bg-rose-100 dark:bg-rose-950/30',
    color: 'text-rose-500',
  },
  {
    icon: BookMarked,
    title: '私密日记',
    desc: '记录内心世界，只属于自己的安全空间',
    bg: 'bg-amber-100 dark:bg-amber-950/30',
    color: 'text-amber-500',
  },
]
</script>
