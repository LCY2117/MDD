<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Save, User, Heart, FileText, Lock, Camera, Loader2 } from 'lucide-vue-next'
import { userApi, familyApi, uploadApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const auth = useAuthStore()

const nickname = ref(auth.user?.nickname ?? '')
const bio = ref(auth.user?.bio ?? '')
const userMode = ref<'patient' | 'caregiver'>(auth.user?.userMode ?? 'patient')
const isSaving = ref(false)
const isRoleLocked = ref(false)
const isUploadingAvatar = ref(false)
const avatarPreview = ref(auth.user?.avatar ?? '')
let fileInputEl: HTMLInputElement | null = null

function pickAvatar() {
  if (!fileInputEl) {
    fileInputEl = document.createElement('input')
    fileInputEl.type = 'file'
    fileInputEl.accept = 'image/*'
    fileInputEl.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      if (file.size > 5 * 1024 * 1024) { toast.error('图片不能超过 5MB'); return }
      isUploadingAvatar.value = true
      // 本地预览
      avatarPreview.value = URL.createObjectURL(file)
      try {
        const res = await uploadApi.uploadImage(file)
        const url = (res.data as any).url
        // 立即更新用户头像
        const updateRes = await userApi.updateMe({ avatar: url })
        auth.updateUser(updateRes.data as any)
        avatarPreview.value = url
        toast.success('头像已更新')
      } catch {
        avatarPreview.value = auth.user?.avatar ?? ''
        toast.error('上传失败，请重试')
      } finally {
        isUploadingAvatar.value = false
      }
    }
  }
  fileInputEl.click()
}

onMounted(async () => {
  if (!auth.isAuthenticated) return
  try {
    const res = await familyApi.hasBindings()
    isRoleLocked.value = (res.data as any).hasBindings
  } catch { /* 查询失败时放行，不阻止正常使用 */ }
})

async function handleSave() {
  if (!nickname.value.trim()) { toast.error('昵称不能为空'); return }
  if (nickname.value.trim().length > 20) { toast.error('昵称最多20个字符'); return }
  if (bio.value.length > 100) { toast.error('个人简介最多100个字符'); return }

  isSaving.value = true
  try {
    const payload: Record<string, string> = {
      nickname: nickname.value.trim(),
      bio: bio.value.trim(),
    }
    if (!isRoleLocked.value) payload.userMode = userMode.value
    const res = await userApi.updateMe(payload)
    auth.updateUser(res.data as any)
    toast.success('资料已保存')
    router.back()
  } catch (e: any) {
    toast.error(e?.message || '保存失败，请重试')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部 -->
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50 flex items-center justify-between">
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h3>编辑资料</h3>
      <button
        :disabled="isSaving"
        class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        @click="handleSave"
      >
        <Save class="w-4 h-4" />
        <span>{{ isSaving ? '保存中...' : '保存' }}</span>
      </button>
    </div>

    <div class="px-6 py-6 space-y-5">
      <!-- 头像区域 -->
      <div class="flex flex-col items-center gap-3 pb-2">
        <div class="relative">
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary text-3xl font-medium overflow-hidden border-2 border-primary/30">
            <img v-if="avatarPreview" :src="avatarPreview" alt="" class="w-full h-full object-cover" />
            <span v-else>{{ (nickname || '？')[0] }}</span>
          </div>
          <div v-if="isUploadingAvatar" class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <Loader2 class="w-6 h-6 text-white animate-spin" />
          </div>
          <button
            class="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
            :class="{ 'opacity-50 pointer-events-none': isUploadingAvatar }"
            type="button"
            @click="pickAvatar"
          >
            <Camera class="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
        <p class="text-xs text-muted-foreground">点击相机图标上传头像（最大5MB）</p>
      </div>

      <!-- 昵称 -->
      <div class="bg-card rounded-2xl p-5 border border-border/50 space-y-3">
        <div class="flex items-center gap-2 text-sm font-medium">
          <User class="w-4 h-4 text-primary" />
          <span>昵称</span>
          <span class="ml-auto text-xs text-muted-foreground">{{ nickname.length }}/20</span>
        </div>
        <input
          v-model="nickname"
          type="text"
          maxlength="20"
          placeholder="请输入昵称"
          class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      <!-- 个人简介 -->
      <div class="bg-card rounded-2xl p-5 border border-border/50 space-y-3">
        <div class="flex items-center gap-2 text-sm font-medium">
          <FileText class="w-4 h-4 text-primary" />
          <span>个人简介</span>
          <span class="ml-auto text-xs text-muted-foreground">{{ bio.length }}/100</span>
        </div>
        <textarea
          v-model="bio"
          maxlength="100"
          placeholder="介绍一下自己吧..."
          rows="3"
          class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-sm leading-relaxed"
        />
      </div>

      <!-- 身份模式 -->
      <div class="bg-card rounded-2xl p-5 border border-border/50 space-y-3">
        <div class="flex items-center gap-2 text-sm font-medium">
          <Heart class="w-4 h-4 text-primary" />
          <span>我的身份</span>
          <span v-if="isRoleLocked" class="ml-auto flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
            <Lock class="w-3 h-3" />已锁定
          </span>
        </div>
        <!-- 已绑定时的提示 -->
        <div v-if="isRoleLocked" class="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
          <Lock class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p class="text-xs text-amber-700 dark:text-amber-400">已绑定家庭关系，无法修改身份。如需修改，请先前往「家庭关怀」解除所有绑定。</p>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <button
            class="py-4 rounded-xl border-2 transition-all text-center"
            :class="[
              userMode === 'patient' ? 'border-primary bg-primary/10' : 'border-border bg-background',
              isRoleLocked ? 'opacity-60 cursor-not-allowed' : 'hover:bg-secondary'
            ]"
            :disabled="isRoleLocked"
            @click="!isRoleLocked && (userMode = 'patient')"
          >
            <div class="text-2xl mb-1">🌱</div>
            <div class="text-sm font-medium" :class="userMode === 'patient' ? 'text-primary' : ''">患者本人</div>
            <div class="text-xs text-muted-foreground mt-0.5">正在经历或康复中</div>
          </button>
          <button
            class="py-4 rounded-xl border-2 transition-all text-center"
            :class="[
              userMode === 'caregiver' ? 'border-primary bg-primary/10' : 'border-border bg-background',
              isRoleLocked ? 'opacity-60 cursor-not-allowed' : 'hover:bg-secondary'
            ]"
            :disabled="isRoleLocked"
            @click="!isRoleLocked && (userMode = 'caregiver')"
          >
            <div class="text-2xl mb-1">🤝</div>
            <div class="text-sm font-medium" :class="userMode === 'caregiver' ? 'text-primary' : ''">家属/照护者</div>
            <div class="text-xs text-muted-foreground mt-0.5">陪伴身边的人</div>
          </button>
        </div>
      </div>

      <!-- 只读信息 -->
      <div class="bg-card rounded-2xl p-5 border border-border/50 space-y-3">
        <p class="text-sm font-medium text-muted-foreground">其他信息</p>
        <div class="flex items-center justify-between py-1">
          <span class="text-sm text-muted-foreground">用户名</span>
          <span class="text-sm">{{ auth.user?.username }}</span>
        </div>
        <div class="flex items-center justify-between py-1 border-t border-border/30">
          <span class="text-sm text-muted-foreground">加入时间</span>
          <span class="text-sm">{{ auth.user?.joinDate ? new Date(auth.user.joinDate).toLocaleDateString('zh-CN') : '-' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
