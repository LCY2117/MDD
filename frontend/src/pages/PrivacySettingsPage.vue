<template>
  <div class="min-h-screen bg-background pb-8">
    <!-- 顶部导航 -->
    <div class="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 px-4 py-3 flex items-center gap-3">
      <button @click="router.back()" class="p-2 hover:bg-secondary rounded-full transition-colors">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h1 class="font-semibold text-lg">隐私与安全</h1>
    </div>

    <div v-if="loading" class="flex justify-center py-16">
      <Loader2 class="w-6 h-6 animate-spin text-primary" />
    </div>

    <div v-else class="px-4 py-4 space-y-3">
      <!-- 主页可见性 -->
      <div class="bg-card rounded-2xl overflow-hidden">
        <div class="px-4 py-2.5 border-b border-border/50">
          <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">主页设置</p>
        </div>
        <div class="flex items-center justify-between px-4 py-4">
          <div class="flex-1 min-w-0 pr-4">
            <p class="font-medium text-sm">隐藏我的主页</p>
            <p class="text-xs text-muted-foreground mt-0.5">开启后，其他用户无法查看你的主页</p>
          </div>
          <button :class="['relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0', settings.privacy_hide_profile ? 'bg-primary' : 'bg-muted']" @click="save('privacy_hide_profile', !settings.privacy_hide_profile)">
            <span :class="['absolute left-0.5 top-0.5 w-5 h-5 rounded-full shadow-sm transition-transform duration-200', settings.privacy_hide_profile ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white/90']" />
          </button>
        </div>
        <div class="flex items-center justify-between px-4 py-4 border-t border-border/50">
          <div class="flex-1 min-w-0 pr-4">
            <p class="font-medium text-sm">显示我点赞的帖子</p>
            <p class="text-xs text-muted-foreground mt-0.5">允许其他人在你的主页看到你点赞的内容</p>
          </div>
          <button :class="['relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0', settings.privacy_show_posts ? 'bg-primary' : 'bg-muted']" @click="save('privacy_show_posts', !settings.privacy_show_posts)">
            <span :class="['absolute left-0.5 top-0.5 w-5 h-5 rounded-full shadow-sm transition-transform duration-200', settings.privacy_show_posts ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white/90']" />
          </button>
        </div>
      </div>

      <!-- 互动权限 -->
      <div class="bg-card rounded-2xl overflow-hidden">
        <div class="px-4 py-2.5 border-b border-border/50">
          <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">互动权限</p>
        </div>
        <div class="flex items-center justify-between px-4 py-4">
          <div class="flex-1 min-w-0 pr-4">
            <p class="font-medium text-sm">允许他人关注我</p>
            <p class="text-xs text-muted-foreground mt-0.5">关闭后，其他用户将无法关注你</p>
          </div>
          <button :class="['relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0', settings.privacy_allow_follow ? 'bg-primary' : 'bg-muted']" @click="save('privacy_allow_follow', !settings.privacy_allow_follow)">
            <span :class="['absolute left-0.5 top-0.5 w-5 h-5 rounded-full shadow-sm transition-transform duration-200', settings.privacy_allow_follow ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white/90']" />
          </button>
        </div>
        <div class="flex items-center justify-between px-4 py-4 border-t border-border/50">
          <div class="flex-1 min-w-0 pr-4">
            <p class="font-medium text-sm">允许陌生人私信</p>
            <p class="text-xs text-muted-foreground mt-0.5">关闭后，只有互相关注的人才能给你发消息</p>
          </div>
          <button :class="['relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0', settings.privacy_allow_message ? 'bg-primary' : 'bg-muted']" @click="save('privacy_allow_message', !settings.privacy_allow_message)">
            <span :class="['absolute left-0.5 top-0.5 w-5 h-5 rounded-full shadow-sm transition-transform duration-200', settings.privacy_allow_message ? 'translate-x-6 bg-white' : 'translate-x-0 bg-white/90']" />
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Loader2 } from 'lucide-vue-next'
import { userApi } from '@/lib/api'
import { toast } from 'vue-sonner'

const router = useRouter()
const loading = ref(true)

const settings = ref({
  privacy_hide_profile: 0,
  privacy_show_posts: 1,
  privacy_allow_follow: 1,
  privacy_allow_message: 1,
})

onMounted(async () => {
  try {
    const res = await userApi.getSettings()
    const s = res.data as Record<string, number>
    settings.value.privacy_hide_profile = s.privacy_hide_profile ?? 0
    settings.value.privacy_show_posts = s.privacy_show_posts ?? 1
    settings.value.privacy_allow_follow = s.privacy_allow_follow ?? 1
    settings.value.privacy_allow_message = s.privacy_allow_message ?? 1
  } catch {
    toast.error('加载设置失败', { description: '请检查网络连接' })
  } finally {
    loading.value = false
  }
})

async function save(key: string, value: boolean) {
  const numVal = value ? 1 : 0
  ;(settings.value as Record<string, number>)[key] = numVal
  try {
    await userApi.updateSettings({ [key]: numVal })
  } catch {
    toast.error('保存失败')
    ;(settings.value as Record<string, number>)[key] = numVal ? 0 : 1
  }
}




</script>


