<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Send, Bot, User, Lightbulb, Phone, Trash2 } from 'lucide-vue-next'
import { aiApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const authStore = useAuthStore()
const messagesEndRef = ref<HTMLDivElement | null>(null)

interface Message { id: string; role: 'user' | 'assistant'; content: string; timestamp: Date }

const WELCOME: Message = {
  id: '0', role: 'assistant',
  content: '你好呀，我是心语小助手 💙\n\n我可以帮你解答关于抑郁症的疑问，提供情绪支持建议，或者陪你聊聊天。\n\n请随时告诉我你想了解什么，或者你现在的感受。',
  timestamp: new Date(),
}

const messages = ref<Message[]>([WELCOME])
const input = ref('')
const isTyping = ref(false)

const quickQuestions = ['什么是抑郁症？', '如何判断是否需要看医生？', '家人得了抑郁症，我该怎么办？', '抗抑郁药物有副作用吗？', '如何应对突然的情绪低落？']

function scrollToBottom() {
  nextTick(() => messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' }))
}

// 加载历史记录
onMounted(async () => {
  if (!authStore.isAuthenticated) return
  try {
    const res = await aiApi.getHistory()
    const history = res.data as Array<{ id: string; role: string; content: string; created_at: string }>
    if (history.length) {
      messages.value = [WELCOME, ...history.map(h => ({
        id: h.id, role: h.role as 'user' | 'assistant',
        content: h.content, timestamp: new Date(h.created_at),
      }))]
    }
  } catch { /* 静默处理 */ }
  scrollToBottom()
})

async function handleSend() {
  if (!input.value.trim() || isTyping.value) return
  const userText = input.value.trim()
  const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userText, timestamp: new Date() }
  messages.value.push(userMsg)
  input.value = ''; isTyping.value = true
  scrollToBottom()
  try {
    const res = await aiApi.chat(userText)
    const aiMsg = (res.data as { aiMessage: { content: string } }).aiMessage
    messages.value.push({
      id: (Date.now() + 1).toString(), role: 'assistant',
      content: aiMsg?.content ?? '...',
      timestamp: new Date(),
    })
  } catch {
    toast.error('发送失败，请重试')
    messages.value = messages.value.filter(m => m.id !== userMsg.id)
  } finally { isTyping.value = false; scrollToBottom() }
}

async function handleClearHistory() {
  if (!authStore.isAuthenticated) return
  try { await aiApi.clearHistory(); messages.value = [WELCOME]; toast.success('对话历史已清除') }
  catch { toast.error('清除失败') }
}
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- 顶部 -->
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
      <div class="flex items-center justify-between">
        <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()"><ArrowLeft class="w-5 h-5" /></button>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><Bot class="w-5 h-5 text-primary" /></div>
          <div><h3>AI小助手</h3><p class="text-xs text-muted-foreground">随时为你解答</p></div>
        </div>
        <button v-if="authStore.isAuthenticated" class="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-destructive" @click="handleClearHistory">
          <Trash2 class="w-5 h-5" />
        </button>
        <div v-else class="w-9" />
      </div>
    </div>

    <!-- 消息区 -->
    <div class="flex-1 overflow-y-auto px-6 py-4">
      <!-- 快捷问题 -->
      <div v-if="messages.length <= 1" class="mb-6">
        <div class="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <Lightbulb class="w-4 h-4" /><span>你可以问我：</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <button v-for="q in quickQuestions" :key="q"
            class="px-4 py-2 bg-card border border-border/50 rounded-xl text-sm hover:bg-secondary transition-colors"
            @click="input = q">{{ q }}</button>
        </div>
      </div>

      <!-- 消息列表 -->
      <div class="space-y-4">
        <div v-for="msg in messages" :key="msg.id" class="flex gap-3" :class="{ 'flex-row-reverse': msg.role === 'user' }">
          <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            :class="msg.role === 'assistant' ? 'bg-primary/20 text-primary' : 'bg-accent text-foreground'">
            <Bot v-if="msg.role === 'assistant'" class="w-5 h-5" />
            <User v-else class="w-5 h-5" />
          </div>
          <div class="flex-1 max-w-[80%]" :class="{ 'flex justify-end': msg.role === 'user' }">
            <div class="rounded-2xl p-4" :class="msg.role === 'assistant' ? 'bg-card border border-border/50' : 'bg-primary text-primary-foreground'">
              <p class="whitespace-pre-wrap leading-relaxed text-sm">{{ msg.content }}</p>
              <span class="text-xs mt-2 block" :class="msg.role === 'assistant' ? 'text-muted-foreground' : 'text-primary-foreground/70'">
                {{ msg.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }}
              </span>
            </div>
          </div>
        </div>

        <!-- 正在输入 -->
        <div v-if="isTyping" class="flex gap-3">
          <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0"><Bot class="w-5 h-5 text-primary" /></div>
          <div class="bg-card border border-border/50 rounded-2xl p-4">
            <div class="flex gap-1">
              <span v-for="i in 3" :key="i" class="w-2 h-2 bg-primary/50 rounded-full animate-bounce"
                :style="{ animationDelay: `${(i - 1) * 150}ms` }" />
            </div>
          </div>
        </div>
        <div ref="messagesEndRef" />
      </div>
    </div>

    <!-- 危机提示 -->
    <div class="px-6 py-2">
      <div class="bg-destructive/10 rounded-xl p-3 border border-destructive/20 flex items-center gap-3">
        <Phone class="w-4 h-4 text-destructive flex-shrink-0" />
        <p class="text-xs text-muted-foreground flex-1">如遇紧急情况，请拨打 <a href="tel:400-161-9995" class="text-destructive font-medium">400-161-9995</a></p>
      </div>
    </div>

    <!-- 输入区 -->
    <div class="sticky bottom-0 bg-background border-t border-border/50 px-6 py-4">
      <div class="flex gap-3">
        <input v-model="input" type="text" placeholder="说说你的想法..."
          class="flex-1 px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          @keydown.enter="handleSend" />
        <button :disabled="!input.trim() || isTyping"
          class="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleSend">
          <Send class="w-4 h-4" />
        </button>
      </div>
      <p class="text-xs text-muted-foreground mt-2 text-center">AI助手仅供参考，不能替代专业医疗建议</p>
    </div>
  </div>
</template>
