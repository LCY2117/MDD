<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Copy, QrCode, CheckCircle2 } from 'lucide-vue-next'
import { familyApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const auth = useAuthStore()

const inviteCode = ref('')
const inputCode = ref('')
const isGenerating = ref(false)
const isBinding = ref(false)
const copied = ref(false)

async function generateCode() {
  if (!auth.isAuthenticated) { toast.info('请先登录'); return }
  isGenerating.value = true
  try {
    const res = await familyApi.createInvite()
    inviteCode.value = (res.data as { code: string }).code
  } catch { toast.error('生成邀请码失败') }
  finally { isGenerating.value = false }
}

async function bindFamily() {
  if (!inputCode.value.trim()) { toast.error('请输入邀请码'); return }
  if (!auth.isAuthenticated) { toast.info('请先登录'); return }
  isBinding.value = true
  try {
    await familyApi.bind(inputCode.value.trim())
    toast.success('绑定成功！')
    router.push('/family/mode')
  } catch (err: any) {
    toast.error(err?.message || '绑定失败，请检查邀请码是否正确')
  } finally { isBinding.value = false }
}

function copyCode() {
  navigator.clipboard.writeText(inviteCode.value)
  copied.value = true; setTimeout(() => { copied.value = false }, 2000)
  toast.success('邀请码已复制')
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50 flex items-center gap-3">
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()"><ArrowLeft class="w-5 h-5" /></button>
      <h3>家人绑定</h3>
    </div>

    <div class="px-6 py-4 space-y-5">
      <!-- 生成邀请码 -->
      <div class="bg-card rounded-2xl p-5 border border-border/50">
        <h4 class="mb-2">生成邀请码</h4>
        <p class="text-sm text-muted-foreground mb-4">生成邀请码并分享给家人，家人使用邀请码绑定后，可以查看你的情绪动态。</p>
        <div class="flex items-center gap-3 mb-4 p-4 bg-secondary rounded-xl">
          <div class="flex-1 text-center">
            <p v-if="inviteCode" class="text-2xl font-mono font-medium tracking-widest text-primary">{{ inviteCode }}</p>
            <p v-else class="text-muted-foreground text-sm">点击下方按钮生成邀请码</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <button :disabled="isGenerating"
            class="py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            @click="generateCode">
            <QrCode class="w-4 h-4" />{{ isGenerating ? '生成中...' : (inviteCode ? '重新生成' : '生成邀请码') }}
          </button>
          <button :disabled="!inviteCode"
            class="py-3 bg-secondary rounded-xl hover:bg-accent transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            @click="copyCode">
            <component :is="copied ? CheckCircle2 : Copy" class="w-4 h-4" :class="{ 'text-green-500': copied }" />
            {{ copied ? '已复制' : '复制邀请码' }}
          </button>
        </div>
        <p class="text-xs text-muted-foreground mt-3 text-center">邀请码有效期为24小时，仅可使用一次</p>
      </div>

      <!-- 输入分隔 -->
      <div class="flex items-center gap-3">
        <div class="flex-1 border-t border-border/50" />
        <span class="text-sm text-muted-foreground">或</span>
        <div class="flex-1 border-t border-border/50" />
      </div>

      <!-- 输入邀请码 -->
      <div class="bg-card rounded-2xl p-5 border border-border/50">
        <h4 class="mb-2">输入邀请码</h4>
        <p class="text-sm text-muted-foreground mb-4">输入家人分享给你的邀请码，建立关怀连接。</p>
        <input v-model="inputCode" type="text" placeholder="请输入6位邀请码" maxlength="6"
          class="w-full px-4 py-3 text-center text-xl font-mono tracking-widest bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mb-4 uppercase" />
        <button :disabled="!inputCode.trim() || isBinding"
          class="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
          @click="bindFamily">{{ isBinding ? '绑定中...' : '确认绑定' }}</button>
      </div>

      <!-- 安全说明 -->
      <div class="bg-secondary rounded-xl p-4">
        <h4 class="text-sm mb-2">隐私保护</h4>
        <ul class="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li>家人只能查看你的情绪记录（仅心情分类，不含日记），不可查看私密内容</li>
          <li>你随时可以在设置中解除绑定</li>
          <li>所有数据传输均加密保护</li>
        </ul>
      </div>
    </div>
  </div>
</template>
