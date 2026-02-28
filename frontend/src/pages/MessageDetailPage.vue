<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Send, MoreVertical } from 'lucide-vue-next'
import { messageApi, userApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const rawId = route.params.id as string          // 可能是 userId 或 conv_xxx
const messagesEndRef = ref<HTMLDivElement | null>(null)

interface Msg { id: string; senderId: string; content: string; createdAt: string }
interface OtherUser { id: string; nickname: string; avatar?: string }

const messages = ref<Msg[]>([])
const otherUser = ref<OtherUser | null>(null)
const input = ref('')
const isSending = ref(false)
const isLoading = ref(true)

// 实际使用的 conversationId（可能在首次发消息后才确定）
let convId = rawId.startsWith('conv_') ? rawId : ''
// 当 rawId 是 userId 时使用：
const targetUserId = rawId.startsWith('conv_') ? '' : rawId

onMounted(async () => {
  try {
    if (convId) {
      // 已有 convId，直接加载消息
      await loadMessages(convId)
    } else {
      // rawId 是 userId，先查找现有会话
      const findRes = await messageApi.getConversationWith(targetUserId)
      const found = (findRes.data as { conversationId: string | null }).conversationId
      if (found) {
        convId = found
        await loadMessages(convId)
      } else {
        // 无现有会话，需要加载对方用户信息
        try {
          const userRes = await userApi.getUser(targetUserId)
          const u = userRes.data as any
          otherUser.value = { id: u.id, nickname: u.nickname ?? u.name ?? '用户', avatar: u.avatar }
        } catch { /* ignore */ }
      }
    }
  } catch { toast.error('加载失败') }
  finally { isLoading.value = false; scrollToBottom() }
})

async function loadMessages(cid: string) {
  const res = await messageApi.getMessages(cid)
  const rawList = res.data as any[]
  messages.value = rawList.map(m => ({
    id: m.id,
    senderId: m.sender?.id ?? m.senderId,
    content: m.content,
    createdAt: m.createdAt ?? m.created_at,
  }))
  // 推断对方用户
  const other = rawList.find(m => (m.sender?.id ?? m.senderId) !== auth.user?.id)
  if (other) otherUser.value = { id: other.sender?.id, nickname: other.sender?.name ?? '对方', avatar: other.sender?.avatar }
}

function scrollToBottom() { nextTick(() => messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' })) }

async function handleSend() {
  if (!input.value.trim() || isSending.value) return
  const text = input.value.trim(); input.value = ''
  isSending.value = true
  const tmpMsg: Msg = { id: Date.now().toString(), senderId: auth.user?.id || '', content: text, createdAt: new Date().toISOString() }
  messages.value.push(tmpMsg); scrollToBottom()
  try {
    let res: any
    if (convId) {
      // 已有会话
      res = await messageApi.sendToConversation(convId, text)
      const idx = messages.value.findIndex(m => m.id === tmpMsg.id)
      if (idx !== -1) messages.value[idx] = res.data as Msg
    } else {
      // 首次发消息，自动创建会话
      res = await messageApi.sendMessage(targetUserId, text)
      const newConvId = (res.data as any).conversationId
      if (newConvId) {
        convId = newConvId
        router.replace(`/messages/${convId}`)
      }
      const idx = messages.value.findIndex(m => m.id === tmpMsg.id)
      if (idx !== -1) messages.value[idx] = { ...tmpMsg, id: (res.data as any).id ?? tmpMsg.id }
    }
    scrollToBottom()
  } catch { messages.value = messages.value.filter(m => m.id !== tmpMsg.id); toast.error('发送失败') }
  finally { isSending.value = false }
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- 顶部 -->
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
      <div class="flex items-center gap-3">
        <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()"><ArrowLeft class="w-5 h-5" /></button>
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center overflow-hidden flex-shrink-0">
          <img v-if="otherUser?.avatar" :src="otherUser.avatar" alt="" class="w-full h-full object-cover" />
          <span v-else class="text-primary font-medium">{{ otherUser?.nickname?.[0] ?? '?' }}</span>
        </div>
        <div class="flex-1">
          <p class="font-medium">{{ otherUser?.nickname ?? '...' }}</p>
        </div>
        <button class="p-2 hover:bg-secondary rounded-lg transition-colors"><MoreVertical class="w-5 h-5" /></button>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="flex-1 overflow-y-auto px-6 py-4">
      <div v-if="isLoading" class="flex items-center justify-center py-8">
        <div class="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
      <div v-else class="space-y-3">
        <div v-for="msg in messages" :key="msg.id" class="flex gap-3" :class="{ 'flex-row-reverse': msg.senderId === auth.user?.id }">
          <div v-if="msg.senderId !== auth.user?.id" class="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center flex-shrink-0">
            <span class="text-primary text-sm font-medium">{{ otherUser?.nickname?.[0] }}</span>
          </div>
          <div class="max-w-[70%]">
            <div class="rounded-2xl px-4 py-3" :class="msg.senderId === auth.user?.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border/50'">
              <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
            </div>
            <span class="text-xs text-muted-foreground mt-1 block" :class="{ 'text-right': msg.senderId === auth.user?.id }">
              {{ formatTime(msg.createdAt) }}
            </span>
          </div>
        </div>
        <div ref="messagesEndRef" />
      </div>
    </div>

    <!-- 输入区 -->
    <div class="sticky bottom-0 bg-background border-t border-border/50 px-6 py-4">
      <div class="flex gap-3">
        <input v-model="input" type="text" placeholder="输入消息..."
          class="flex-1 px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          @keydown.enter="handleSend" />
        <button :disabled="!input.trim() || isSending"
          class="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
          @click="handleSend"><Send class="w-4 h-4" /></button>
      </div>
    </div>
  </div>
</template>
