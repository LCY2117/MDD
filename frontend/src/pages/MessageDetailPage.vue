<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Send, MoreVertical } from 'lucide-vue-next'
import { messageApi, userApi } from '@/lib/api'
import { useConfirm } from '@/lib/useConfirm'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const { confirm } = useConfirm()
const rawId = route.params.id as string          // 可能是 userId 或 conv_xxx
const messagesEndRef = ref<HTMLDivElement | null>(null)

interface Msg { id: string; senderId: string; content: string; createdAt: string }
interface OtherUser { id: string; nickname: string; avatar?: string }

const messages = ref<Msg[]>([])
const otherUser = ref<OtherUser | null>(null)
const input = ref('')
const isSending = ref(false)
const isLoading = ref(true)
const showMoreMenu = ref(false)
const blockedByMe = ref(false)
const blockedByOther = ref(false)
const isUpdatingBlock = ref(false)
const canSend = computed(() => !blockedByMe.value && !blockedByOther.value)

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

watch(() => otherUser.value?.id, async (id) => {
  if (!id) return
  try {
    const res = await messageApi.getBlockStatus(id)
    blockedByMe.value = !!(res.data as any).blockedByMe
    blockedByOther.value = !!(res.data as any).blockedByOther
  } catch {
    blockedByMe.value = false
    blockedByOther.value = false
  }
}, { immediate: true })

function scrollToBottom() { nextTick(() => messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' })) }

function openProfile() {
  showMoreMenu.value = false
  if (!otherUser.value?.id) return
  router.push(`/user/${otherUser.value.id}`)
}

function clearCurrentMessages() {
  showMoreMenu.value = false
  messages.value = []
  toast.success('已清空当前会话内容')
}

async function copyConversationId() {
  showMoreMenu.value = false
  if (!convId) {
    toast.info('当前会话尚未生成 ID')
    return
  }
  try {
    await navigator.clipboard.writeText(convId)
    toast.success('会话 ID 已复制')
  } catch {
    toast.error('复制失败')
  }
}

async function toggleBlockUser() {
  showMoreMenu.value = false
  if (!otherUser.value?.id || isUpdatingBlock.value) return
  const nextBlocked = !blockedByMe.value
  const ok = await confirm({
    title: nextBlocked ? '确认屏蔽该用户？' : '确认取消屏蔽该用户？',
    message: nextBlocked ? '屏蔽后双方无法互发私信。' : '取消后你们可以重新互发私信。',
    confirmText: nextBlocked ? '确认屏蔽' : '确认取消',
    cancelText: '再想想',
    variant: nextBlocked ? 'warning' : 'info',
  })
  if (!ok) return

  isUpdatingBlock.value = true
  try {
    const res = await messageApi.setBlocked(otherUser.value.id, nextBlocked)
    blockedByMe.value = !!(res.data as any).blockedByMe
    blockedByOther.value = !!(res.data as any).blockedByOther
    toast.success(nextBlocked ? '已屏蔽该用户' : '已取消屏蔽')
  } catch {
    toast.error('操作失败')
  } finally {
    isUpdatingBlock.value = false
  }
}

async function handleSend() {
  if (!input.value.trim() || isSending.value) return
  if (!canSend.value) {
    toast.info(blockedByMe.value ? '你已屏蔽对方，无法发送消息' : '对方已屏蔽你，无法发送消息')
    return
  }
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
    <button v-if="showMoreMenu" class="fixed inset-0 z-20" @click="showMoreMenu = false" aria-label="关闭菜单" />

    <!-- 顶部 -->
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-30 px-6 py-4 border-b border-border/50">
      <div class="flex items-center gap-3">
        <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()"><ArrowLeft class="w-5 h-5" /></button>
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center overflow-hidden flex-shrink-0">
          <img v-if="otherUser?.avatar" :src="otherUser.avatar" alt="" class="w-full h-full object-cover" />
          <span v-else class="text-primary font-medium">{{ otherUser?.nickname?.[0] ?? '?' }}</span>
        </div>
        <div class="flex-1">
          <p class="font-medium">{{ otherUser?.nickname ?? '...' }}</p>
        </div>
        <div class="relative">
          <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="showMoreMenu = !showMoreMenu">
            <MoreVertical class="w-5 h-5" />
          </button>
          <div v-if="showMoreMenu" class="absolute right-0 mt-2 w-44 bg-card border border-border/50 rounded-xl shadow-sm py-1 z-30">
            <button class="w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors" @click="openProfile">查看对方主页</button>
            <button class="w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors" @click="copyConversationId">复制会话ID</button>
            <button class="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-secondary transition-colors" @click="toggleBlockUser">
              {{ blockedByMe ? '取消屏蔽' : '屏蔽对方' }}
            </button>
            <button class="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-secondary transition-colors" @click="clearCurrentMessages">清空当前会话</button>
          </div>
        </div>
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
      <p v-if="!canSend" class="text-xs text-destructive mb-2">
        {{ blockedByMe ? '你已屏蔽对方，已禁用消息发送' : '对方已屏蔽你，已禁用消息发送' }}
      </p>
      <div class="flex gap-3">
        <input v-model="input" type="text" :placeholder="canSend ? '输入消息...' : '当前无法发送消息'"
          class="flex-1 px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          :disabled="!canSend"
          @keydown.enter="handleSend" />
        <button :disabled="!canSend || !input.trim() || isSending"
          class="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
          @click="handleSend"><Send class="w-4 h-4" /></button>
      </div>
    </div>
  </div>
</template>
