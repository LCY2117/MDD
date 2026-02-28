<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Plus, Heart, Sun, Cloud, CloudRain, Share2, AlertCircle } from 'lucide-vue-next'
import { familyApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const auth = useAuthStore()

interface FamilyMember {
  id: string
  nickname: string
  avatar?: string
  relation: string
  todayMood?: string
  lastMoodAt?: string
}

const members = ref<FamilyMember[]>([])
const isLoading = ref(true)
const showAddAlert = ref(false)

const moodIcon = { sunny: Sun, cloudy: Cloud, rainy: CloudRain }
const moodColor = { sunny: 'text-yellow-500', cloudy: 'text-gray-400', rainy: 'text-blue-400' }
const moodLabel = { sunny: '还不错', cloudy: '一般般', rainy: '有点难' }

function formatMoodTime(dateStr?: string) {
  if (!dateStr) return '还未记录'
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return d.toLocaleDateString('zh-CN')
}

onMounted(async () => {
  if (!auth.isAuthenticated) { isLoading.value = false; return }
  try {
    const res = await familyApi.getMembers()
    members.value = (res.data as unknown as FamilyMember[])
  } catch { toast.error('加载失败') }
  finally { isLoading.value = false }
})

function getMoodIcon(mood?: string) {
  if (!mood) return null
  return moodIcon[mood as keyof typeof moodIcon]
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部 -->
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50 flex items-center justify-between">
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()"><ArrowLeft class="w-5 h-5" /></button>
      <h3>家属关怀模式</h3>
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.push('/family/binding')"><Plus class="w-5 h-5" /></button>
    </div>

    <div class="px-6 py-4 space-y-4">
      <!-- 说明卡片 -->
      <div class="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-2xl p-5 border border-rose-200/50 dark:border-rose-800/30">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center flex-shrink-0"><Heart class="w-5 h-5 text-rose-500" /></div>
          <div>
            <h4 class="mb-1 text-rose-700 dark:text-rose-300">关爱家人</h4>
            <p class="text-sm text-rose-600/80 dark:text-rose-400/80">绑定后可以查看家人每日的情绪动态，在他们需要时及时给予关怀和支持。</p>
          </div>
        </div>
      </div>

      <!-- 加载中 -->
      <div v-if="isLoading" class="space-y-3">
        <div v-for="i in 2" :key="i" class="h-24 bg-card rounded-2xl animate-pulse border border-border/50" />
      </div>

      <!-- 家人列表 -->
      <template v-else-if="members.length">
        <h4 class="text-muted-foreground">已关联的家人（{{ members.length }}）</h4>
        <div v-for="member in members" :key="member.id" class="bg-card rounded-2xl p-5 border border-border/50">
          <div class="flex items-start gap-4">
            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-medium text-lg overflow-hidden flex-shrink-0 border-2 border-primary/20">
              <img v-if="member.avatar" :src="member.avatar" alt="" class="w-full h-full object-cover" />
              <span v-else>{{ member.nickname[0] }}</span>
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <div>
                  <span class="font-medium">{{ member.nickname }}</span>
                  <span class="ml-2 text-xs px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">{{ member.relation }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <template v-if="member.todayMood">
                  <div class="flex items-center gap-1">
                    <component :is="getMoodIcon(member.todayMood)" class="w-4 h-4" :class="moodColor[member.todayMood as keyof typeof moodColor]" />
                    <span class="text-sm">{{ moodLabel[member.todayMood as keyof typeof moodLabel] }}</span>
                  </div>
                  <span class="text-xs text-muted-foreground">· {{ formatMoodTime(member.lastMoodAt) }}</span>
                </template>
                <span v-else class="text-sm text-muted-foreground">今日还未记录情绪</span>
              </div>
            </div>
            <button class="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-primary"
              @click="router.push(`/messages/${member.id}`)"><Share2 class="w-4 h-4" /></button>
          </div>

          <!-- 没有记录时的提醒 -->
          <div v-if="!member.todayMood" class="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 flex items-center gap-2">
            <AlertCircle class="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p class="text-xs text-amber-700 dark:text-amber-400">{{ member.nickname }} 今日尚未记录情绪，可以关心一下</p>
          </div>
        </div>
      </template>

      <!-- 无家人时 -->
      <div v-else class="text-center py-12">
        <div class="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center mx-auto mb-4">
          <Heart class="w-10 h-10 text-rose-300" />
        </div>
        <h3 class="mb-2">还没有关联的家人</h3>
        <p class="text-muted-foreground text-sm mb-6">绑定家人账号后，可以查看他们的情绪动态</p>
        <button class="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          @click="router.push('/family/binding')">
          添加家人
        </button>
      </div>

      <!-- 底部入口 -->
      <div class="flex gap-3">
        <button class="flex-1 py-3 bg-secondary rounded-xl hover:bg-accent transition-colors text-sm flex items-center justify-center gap-2"
          @click="router.push('/family/binding')">
          <Plus class="w-4 h-4" />邀请家人
        </button>
        <button class="flex-1 py-3 bg-secondary rounded-xl hover:bg-accent transition-colors text-sm flex items-center justify-center gap-2"
          @click="router.push('/settings')">
          <Heart class="w-4 h-4" />关怀设置
        </button>
      </div>
    </div>
  </div>
</template>
