<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Save, Trash2, Lock, Globe } from 'lucide-vue-next'
import { diaryApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const entryId = route.params.id as string
const isEditing = entryId && entryId !== 'new'

const title = ref('')
const content = ref('')
const mood = ref<string | null>(null)
const isPrivate = ref(true)
const isSaving = ref(false)
const isLoading = ref(isEditing)

const moods = [
  { id: 'sunny', emoji: '☀️', label: '开心' },
  { id: 'cloudy', emoji: '⛅', label: '平静' },
  { id: 'rainy', emoji: '🌧️', label: '难过' },
]

const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })

onMounted(async () => {
  if (!isEditing) return
  try {
    const res = await diaryApi.getDiary(entryId)
    const entry = res.data as { title: string; content: string; mood: string; isPrivate: boolean }
    title.value = entry.title
    content.value = entry.content
    mood.value = entry.mood
    isPrivate.value = entry.isPrivate
  } catch { toast.error('加载日记失败') }
  finally { isLoading.value = false }
})

async function handleSave() {
  if (!auth.isAuthenticated) { toast.info('请先登录'); return }
  if (!content.value.trim()) { toast.error('请输入日记内容'); return }
  isSaving.value = true
  try {
    const payload = { title: title.value || today, content: content.value, mood: mood.value, isPrivate: isPrivate.value }
    if (isEditing) await diaryApi.updateDiary(entryId, payload as any)
    else await diaryApi.createDiary(payload)
    toast.success(isEditing ? '日记已更新' : '日记已保存 ✍️')
    router.back()
  } catch { toast.error('保存失败，请重试') }
  finally { isSaving.value = false }
}

async function handleDelete() {
  if (!isEditing) return
  if (!confirm('确定删除这篇日记吗？')) return
  try { await diaryApi.deleteDiary(entryId); toast.success('日记已删除'); router.back() }
  catch { toast.error('删除失败') }
}
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- 顶部 -->
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50 flex items-center justify-between">
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()"><ArrowLeft class="w-5 h-5" /></button>
      <h3>{{ isEditing ? '编辑日记' : '写日记' }}</h3>
      <div class="flex items-center gap-2">
        <button v-if="isEditing" class="p-2 hover:bg-secondary rounded-lg transition-colors text-destructive" @click="handleDelete"><Trash2 class="w-5 h-5" /></button>
        <button :disabled="isSaving || !content.trim()"
          class="px-5 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          @click="handleSave">
          <Save class="w-4 h-4" /><span>{{ isSaving ? '保存中...' : '保存' }}</span>
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="flex-1 flex items-center justify-center"><div class="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" /></div>

    <div v-else class="flex-1 flex flex-col px-6 py-4">
      <!-- 日期 -->
      <p class="text-sm text-muted-foreground mb-4">{{ today }}</p>

      <!-- 心情选择 -->
      <div class="mb-4">
        <p class="text-sm text-muted-foreground mb-2">今天的心情</p>
        <div class="flex gap-2">
          <button v-for="m in moods" :key="m.id"
            class="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all"
            :class="mood === m.id ? 'bg-primary/10 border-2 border-primary' : 'bg-secondary border-2 border-transparent'"
            @click="mood = m.id">
            <span class="text-xl">{{ m.emoji }}</span>
            <span class="text-xs" :class="mood === m.id ? 'text-primary font-medium' : 'text-muted-foreground'">{{ m.label }}</span>
          </button>
        </div>
      </div>

      <!-- 标题 -->
      <input v-model="title" type="text" :placeholder="`标题（默认：${today}）`"
        class="w-full mb-3 py-2 bg-transparent focus:outline-none text-lg font-medium placeholder:text-muted-foreground/60 border-b border-border/50" />

      <!-- 内容 -->
      <textarea v-model="content" placeholder="今天发生了什么？有什么感受？&#10;&#10;这里是属于你的私密空间，自由倾诉吧..."
        class="flex-1 w-full bg-transparent focus:outline-none resize-none text-sm leading-relaxed min-h-48" />

      <!-- 底部设置 -->
      <div class="pt-4 border-t border-border/50 flex items-center justify-between">
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{{ content.length }} 字</span>
        </div>
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors"
          :class="isPrivate ? 'bg-secondary text-muted-foreground' : 'bg-primary/10 text-primary'"
          @click="isPrivate = !isPrivate">
          <component :is="isPrivate ? Lock : Globe" class="w-4 h-4" />
          <span>{{ isPrivate ? '私密' : '公开' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
