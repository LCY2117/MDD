<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, X, ImagePlus, EyeOff, Eye, Send } from 'lucide-vue-next'
import { postApi, uploadApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const authStore = useAuthStore()

const content = ref('')
const isAnonymous = ref(false)
const selectedTags = ref<string[]>([])
const images = ref<string[]>([])
const isSubmitting = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isUploadingImage = ref(false)

const allTags = [
  '经验分享', '自我照顾', '求助', '陪伴', '康复日记',
  '药物治疗', '心理咨询', '运动锻炼', '睡眠问题', '工作压力',
  '家庭关系', '学业困扰', '社交恐惧', '焦虑', '正向鼓励',
]

function toggleTag(tag: string) {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  } else if (selectedTags.value.length < 5) {
    selectedTags.value = [...selectedTags.value, tag]
  }
}

async function handleImageUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (images.value.length >= 4) { toast.info('最多添加4张图片'); return }
  if (!file.type.startsWith('image/')) { toast.error('只能上传图片文件'); return }
  if (file.size > 5 * 1024 * 1024) { toast.error('图片大小不能超过5MB'); return }
  isUploadingImage.value = true
  try {
    const res = await uploadApi.uploadImage(file)
    images.value = [...images.value, (res.data as { url: string }).url]
  } catch { toast.error('图片上传失败，请重试') }
  finally { isUploadingImage.value = false }
}

function removeImage(idx: number) { images.value = images.value.filter((_, i) => i !== idx) }

async function handleSubmit() {
  if (!authStore.isAuthenticated) { toast.info('请先登录后发帖'); return }
  if (!content.value.trim()) { toast.error('请输入内容'); return }
  if (content.value.trim().length < 10) { toast.error('内容至少10个字'); return }
  isSubmitting.value = true
  try {
    await postApi.createPost({ content: content.value.trim(), isAnonymous: isAnonymous.value, tags: selectedTags.value, images: images.value })
    toast.success('发布成功！')
    router.push('/community')
  } catch { toast.error('发布失败，请重试') }
  finally { isSubmitting.value = false }
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部 -->
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50 flex items-center justify-between">
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()"><ArrowLeft class="w-5 h-5" /></button>
      <h3>发帖</h3>
      <button :disabled="isSubmitting || !content.trim()"
        class="px-5 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
        @click="handleSubmit">
        <Send class="w-4 h-4" /><span>{{ isSubmitting ? '发布中...' : '发布' }}</span>
      </button>
    </div>

    <div class="px-6 py-4 space-y-5">
      <!-- 匿名开关 -->
      <div class="flex items-center justify-between bg-card rounded-2xl p-4 border border-border/50">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <component :is="isAnonymous ? EyeOff : Eye" class="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p class="font-medium">匿名发帖</p>
            <p class="text-xs text-muted-foreground">{{ isAnonymous ? '其他用户将看不到你的身份' : '将以你的头像和名字发布' }}</p>
          </div>
        </div>
        <button
          class="w-12 h-6 rounded-full transition-all relative"
          :class="isAnonymous ? 'bg-primary' : 'bg-secondary'"
          @click="isAnonymous = !isAnonymous">
          <span class="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
            :class="isAnonymous ? 'right-0.5' : 'left-0.5'" />
        </button>
      </div>

      <!-- 内容输入 -->
      <div class="bg-card rounded-2xl p-4 border border-border/50">
        <textarea
          v-model="content"
          placeholder="分享你的感受、经历或想法...&#10;&#10;在这里，你可以安全地表达自己，我们都在倾听。"
          rows="8"
          class="w-full bg-transparent focus:outline-none resize-none leading-relaxed"
          :maxlength="1000"
        />
        <div class="flex justify-end pt-2">
          <span class="text-xs text-muted-foreground">{{ content.length }}/1000</span>
        </div>
      </div>

      <!-- 图片 -->
      <div>
        <h4 class="mb-3">添加图片（可选）</h4>
        <div class="flex flex-wrap gap-3">
          <div v-for="(img, idx) in images" :key="idx" class="relative w-20 h-20">
            <img :src="img" alt="" class="w-full h-full object-cover rounded-xl" />
            <button
              class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
              @click="removeImage(idx)">
              <X class="w-3 h-3" />
            </button>
          </div>
          <button v-if="images.length < 4"
            class="w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary disabled:opacity-50"
            :disabled="isUploadingImage"
            @click="fileInputRef?.click()">
            <ImagePlus class="w-6 h-6" />
            <span class="text-xs">{{ isUploadingImage ? '上传中' : '添加图片' }}</span>
          </button>
          <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
        </div>
        <p class="text-xs text-muted-foreground mt-2">最多4张，每张不超过5MB</p>
      </div>

      <!-- 话题标签 -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h4>话题标签</h4>
          <span class="text-xs text-muted-foreground">{{ selectedTags.length }}/5</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <button v-for="tag in allTags" :key="tag"
            class="px-4 py-2 rounded-xl text-sm transition-all"
            :class="selectedTags.includes(tag) ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-secondary'"
            @click="toggleTag(tag)">
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- 发布须知 -->
      <div class="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-800/50">
        <h4 class="mb-2 text-amber-700 dark:text-amber-400">发布须知</h4>
        <ul class="text-sm text-amber-600 dark:text-amber-500 space-y-1 list-disc list-inside">
          <li>请勿发布具体的自伤或伤人方法</li>
          <li>尊重他人，避免歧视性语言</li>
          <li>鼓励专业帮助，不否定医疗建议</li>
        </ul>
      </div>
    </div>
  </div>
</template>
