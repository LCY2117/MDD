<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ChevronDown, Phone, MessageSquare, Bot } from 'lucide-vue-next'

const router = useRouter()

const faqs = [
  { q: '什么是抑郁症？', a: '抑郁症是一种常见的心理疾病，主要表现为持续的情绪低落、兴趣减退、疲乏无力等症状，持续超过两周并影响日常生活时，需要寻求专业帮助。' },
  { q: '心语社区能为我提供什么？', a: '心语社区提供同伴支持、情绪记录、AI辅助咨询、知识资源等服务。我们是辅助工具，不能替代专业诊断和治疗。' },
  { q: '我的隐私如何保护？', a: '所有数据均加密存储，匿名发帖时您的真实身份不会被其他用户看到。家人绑定功能只共享情绪状态，不共享日记等私密内容。' },
  { q: '如何使用家属关怀模式？', a: '在"我的"-"家人关怀"中，生成邀请码并分享给家人，或输入家人的邀请码完成绑定。绑定后可相互查看情绪状态。' },
  { q: '忘记密码怎么办？', a: '请联系我们。' },
  { q: 'AI助理是真人咨询师吗？', a: 'AI助理是人工智能系统，不是真人咨询师。它可以提供信息支持和情绪陪伴，但不能替代专业心理咨询或精神科诊疗。' },
]

const openIndex = ref<number | null>(null)
function toggle(i: number) { openIndex.value = openIndex.value === i ? null : i }
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50 flex items-center gap-3">
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()"><ArrowLeft class="w-5 h-5" /></button>
      <h3>帮助中心</h3>
    </div>

    <div class="px-6 py-4 space-y-5">
      <!-- 紧急求助 -->
      <div class="bg-destructive/10 rounded-2xl p-5 border border-destructive/20">
        <h4 class="text-destructive mb-2">需要紧急帮助？</h4>
        <p class="text-sm text-muted-foreground mb-4">如果你现在感到非常痛苦或有伤害自己的想法，请立即拨打热线。</p>
        <div class="space-y-2">
          <a href="tel:400-161-9995" class="flex items-center gap-3 p-3 bg-white dark:bg-background rounded-xl border border-destructive/20 hover:bg-secondary transition-colors">
            <Phone class="w-5 h-5 text-destructive" />
            <div><p class="font-medium text-destructive">400-161-9995</p><p class="text-xs text-muted-foreground">北京心理危机研究与干预中心</p></div>
          </a>
          <a href="tel:12320" class="flex items-center gap-3 p-3 bg-white dark:bg-background rounded-xl border border-destructive/20 hover:bg-secondary transition-colors">
            <Phone class="w-5 h-5 text-destructive" />
            <div><p class="font-medium text-destructive">12320</p><p class="text-xs text-muted-foreground">全国心理援助热线</p></div>
          </a>
        </div>
      </div>

      <!-- FAQ -->
      <div>
        <h4 class="mb-3">常见问题</h4>
        <div class="space-y-2">
          <div v-for="(faq, i) in faqs" :key="i" class="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <button class="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-secondary transition-colors"
              @click="toggle(i)">
              <span class="font-medium pr-4">{{ faq.q }}</span>
              <ChevronDown class="w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform"
                :class="{ 'rotate-180': openIndex === i }" />
            </button>
            <Transition enter-active-class="transition-all duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100">
              <div v-if="openIndex === i" class="px-4 pb-4">
                <p class="text-sm text-muted-foreground leading-relaxed">{{ faq.a }}</p>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- 联系方式 -->
      <div>
        <h4 class="mb-3">联系我们</h4>
        <div class="grid grid-cols-2 gap-3">
          <button class="bg-card rounded-2xl p-4 border border-border/50 flex flex-col items-center gap-2 hover:bg-secondary transition-colors"
            @click="router.push('/ai-chat')">
            <Bot class="w-7 h-7 text-primary" />
            <span class="text-sm">AI 助理</span>
            <p class="text-xs text-muted-foreground text-center">7×24小时在线</p>
          </button>
          <a href="mailto:2833699673@qq.com" class="bg-card rounded-2xl p-4 border border-border/50 flex flex-col items-center gap-2 hover:bg-secondary transition-colors no-underline">
            <MessageSquare class="w-7 h-7 text-primary" />
            <span class="text-sm">邮件反馈</span>
            <p class="text-xs text-muted-foreground text-center">工作日24小时内回复</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
