<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Sun, Cloud, CloudRain, TrendingUp, Plus, BookOpen, Edit3 } from 'lucide-vue-next'
import BottomNav from '@/components/community/BottomNav.vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from 'chart.js'
import { moodApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

const router = useRouter()
const authStore = useAuthStore()

interface MoodEntry {
  id: string
  mood: 'sunny' | 'cloudy' | 'rainy'
  note?: string
  date: string
  score: number
}

const moods = [
  { id: 'sunny', icon: Sun, label: '还不错', color: 'text-yellow-500', bgColor: 'bg-yellow-50', score: 3 },
  { id: 'cloudy', icon: Cloud, label: '一般般', color: 'text-gray-400', bgColor: 'bg-gray-50', score: 2 },
  { id: 'rainy', icon: CloudRain, label: '有点难受', color: 'text-blue-400', bgColor: 'bg-blue-50', score: 1 },
]

const entries = ref<MoodEntry[]>([])
const isLoading = ref(true)
const showAddForm = ref(false)
const selectedMood = ref<string | null>(null)
const note = ref('')
const isSaving = ref(false)

onMounted(() => {
  if (!authStore.isAuthenticated) { isLoading.value = false; return }
  moodApi.getMoods(7)
    .then(res => {
      const raw = res.data as Array<{ id: string; mood: string; note?: string; date: string; createdAt: string }>
      entries.value = raw.map(e => ({
        id: e.id, mood: e.mood as 'sunny' | 'cloudy' | 'rainy',
        note: e.note, date: e.date || e.createdAt,
        score: e.mood === 'sunny' ? 3 : e.mood === 'cloudy' ? 2 : 1,
      }))
    })
    .catch(() => toast.error('加载情绪记录失败'))
    .finally(() => { isLoading.value = false })
})

const chartData = computed(() => ({
  labels: [...entries.value].reverse().map(e =>
    new Date(e.date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
  ),
  datasets: [{ label: '心情指数', data: [...entries.value].reverse().map(e => e.score), borderColor: '#5FA9A3', backgroundColor: 'rgba(95,169,163,0.1)', tension: 0.4, fill: true, pointBackgroundColor: '#5FA9A3', pointRadius: 4 }],
}))

const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 3, ticks: { stepSize: 1 } } } }

const avgScore = computed(() => entries.value.length ? (entries.value.reduce((s, e) => s + e.score, 0) / entries.value.length).toFixed(1) : '0.0')
const sunnyDays = computed(() => entries.value.filter(e => e.mood === 'sunny').length)
const cloudyDays = computed(() => entries.value.filter(e => e.mood === 'cloudy').length)
const rainyDays = computed(() => entries.value.filter(e => e.mood === 'rainy').length)

function getMood(moodId: string) { return moods.find(m => m.id === moodId) }

async function handleAddMood() {
  if (!selectedMood.value) return
  if (!authStore.isAuthenticated) { toast.info('请先登录后记录心情'); return }
  const moodData = getMood(selectedMood.value)!
  isSaving.value = true
  try {
    const res = await moodApi.addMood({ mood: selectedMood.value, note: note.value.trim() || undefined })
    entries.value.unshift({
      id: (res.data as { id: string }).id,
      mood: selectedMood.value as 'sunny' | 'cloudy' | 'rainy',
      note: note.value.trim() || undefined,
      date: new Date().toISOString(),
      score: moodData.score,
    })
    selectedMood.value = null; note.value = ''; showAddForm.value = false
    toast.success('心情已记录 💙')
  } catch { toast.error('记录失败，请重试') }
  finally { isSaving.value = false }
}
</script>

<template>
  <div class="min-h-screen bg-background pb-20">
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50 flex items-center justify-between">
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()"><ArrowLeft class="w-5 h-5" /></button>
      <h3>情绪记录</h3>
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="showAddForm = !showAddForm"><Plus class="w-5 h-5" /></button>
    </div>

    <!-- 添加心情 -->
    <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0">
      <div v-if="showAddForm" class="px-6 pt-6 pb-4 border-b border-border/50">
        <div class="bg-card rounded-2xl p-5 border border-border/50">
          <h4 class="mb-4">今天感觉怎么样？</h4>
          <div class="flex gap-3 mb-4">
            <button v-for="mood in moods" :key="mood.id"
              class="flex-1 flex flex-col items-center gap-2 py-4 rounded-xl transition-all border-2"
              :class="selectedMood === mood.id ? 'bg-primary/10 border-primary' : `${mood.bgColor} border-transparent hover:border-border`"
              @click="selectedMood = mood.id">
              <component :is="mood.icon" class="w-7 h-7" :class="selectedMood === mood.id ? 'text-primary' : mood.color" />
              <span class="text-sm" :class="selectedMood === mood.id ? 'text-primary font-medium' : 'text-muted-foreground'">{{ mood.label }}</span>
            </button>
          </div>
          <textarea v-model="note" placeholder="记录一下今天发生了什么... (可选)" rows="3"
            class="w-full p-3 bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          <div class="flex gap-3 mt-4">
            <button class="flex-1 py-3 bg-secondary rounded-xl hover:bg-accent transition-colors"
              @click="showAddForm = false; selectedMood = null; note = ''">取消</button>
            <button :disabled="!selectedMood || isSaving"
              class="flex-1 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
              @click="handleAddMood">{{ isSaving ? '记录中...' : '记录' }}</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 写日记入口 -->
    <div class="px-6 pt-6 pb-4">
      <div class="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-5 border border-primary/20 cursor-pointer hover:border-primary/40 transition-all"
        @click="router.push('/diary/new')">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Edit3 class="w-6 h-6 text-primary" />
          </div>
          <div class="flex-1">
            <h4 class="mb-1 text-primary">写日记</h4>
            <p class="text-sm text-muted-foreground">记录生活点滴，感受成长的力量</p>
          </div>
          <BookOpen class="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>

    <!-- 图表 -->
    <div class="px-6 pt-2 pb-4">
      <div class="bg-card rounded-2xl p-5 border border-border/50">
        <div class="flex items-center justify-between mb-4">
          <h4>情绪趋势</h4>
          <div class="flex items-center gap-2 text-sm text-muted-foreground"><TrendingUp class="w-4 h-4" /><span>近7天</span></div>
        </div>
        <div class="h-48">
          <Line v-if="entries.length" :data="chartData" :options="chartOptions as object" />
          <div v-else class="h-full flex items-center justify-center text-muted-foreground text-sm">暂无数据</div>
        </div>
      </div>
    </div>

    <!-- 统计 -->
    <div class="px-6 py-4">
      <div class="grid grid-cols-4 gap-3">
        <div class="bg-card rounded-2xl p-4 text-center border border-border/50"><div class="text-2xl font-medium text-primary mb-1">{{ avgScore }}</div><div class="text-xs text-muted-foreground">平均分</div></div>
        <div class="bg-yellow-50 rounded-2xl p-4 text-center border border-yellow-200"><div class="text-2xl font-medium text-yellow-600 mb-1">{{ sunnyDays }}</div><div class="text-xs text-muted-foreground">还不错</div></div>
        <div class="bg-gray-50 rounded-2xl p-4 text-center border border-gray-200"><div class="text-2xl font-medium text-gray-600 mb-1">{{ cloudyDays }}</div><div class="text-xs text-muted-foreground">一般般</div></div>
        <div class="bg-blue-50 rounded-2xl p-4 text-center border border-blue-200"><div class="text-2xl font-medium text-blue-600 mb-1">{{ rainyDays }}</div><div class="text-xs text-muted-foreground">有点难受</div></div>
      </div>
    </div>

    <!-- 历史记录 -->
    <div class="px-6 py-4">
      <h4 class="mb-3">历史记录</h4>
      <div v-if="isLoading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="bg-card rounded-2xl p-4 border border-border/50 animate-pulse h-16" />
      </div>
      <div v-else-if="entries.length" class="space-y-3">
        <div v-for="entry in entries" :key="entry.id" class="bg-card rounded-2xl p-4 border border-border/50">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" :class="getMood(entry.mood)?.bgColor">
              <component :is="getMood(entry.mood)?.icon" class="w-5 h-5" :class="getMood(entry.mood)?.color" />
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span class="font-medium">{{ getMood(entry.mood)?.label }}</span>
                <span class="text-xs text-muted-foreground">{{ new Date(entry.date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }}</span>
              </div>
              <p v-if="entry.note" class="text-sm text-muted-foreground">{{ entry.note }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8 text-muted-foreground text-sm">暂无记录，点击右上角 + 开始记录</div>
    </div>

    <BottomNav />
  </div>
</template>
