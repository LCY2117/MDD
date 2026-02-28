<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft, Plus, Heart, Sun, Cloud, CloudRain,
  MessageCircle, Siren, BookOpen, TriangleAlert,
  Send, Sparkles, Unlink, ChevronRight
} from 'lucide-vue-next'
import { familyApi, messageApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const router = useRouter()
const auth = useAuthStore()

interface FamilyMember {
  id: string
  userId: string
  nickname: string
  avatar?: string
  relation: string
  role: 'patient' | 'caregiver'
  todayMood?: string | null
  lastMoodAt?: string | null
  shareMood: boolean
}

const members = ref<FamilyMember[]>([])
const isLoading = ref(true)
const showSosDialog = ref(false)
const isSendingSOS = ref(false)
const sosMessage = ref('')
const encourageTargetId = ref<string | null>(null)
const encourageText = ref('')
const isSendingEncourage = ref(false)
const showUnbindDialog = ref(false)
const unbindTarget = ref<FamilyMember | null>(null)

const isPatient = computed(() => auth.user?.userMode === 'patient')

const moodIcon = { sunny: Sun, cloudy: Cloud, rainy: CloudRain }
const moodColor = { sunny: 'text-yellow-500', cloudy: 'text-gray-500', rainy: 'text-blue-400' }
const moodLabel = { sunny: '今天不错 ', cloudy: '一般般 ', rainy: '有点难受 ' }

const alertMembers = computed(() =>
  members.value.filter(m => m.role === 'patient' && (m.todayMood === 'rainy' || !m.todayMood))
)

function formatMoodTime(dateStr?: string | null) {
  if (!dateStr) return '暂无记录'
  const d = new Date(dateStr)
  const diff = Date.now() - d.getTime()
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return d.toLocaleDateString('zh-CN')
}

function getMoodIcon(mood?: string | null) {
  if (!mood) return null
  return moodIcon[mood as keyof typeof moodIcon]
}

onMounted(async () => {
  if (!auth.isAuthenticated) { isLoading.value = false; return }
  try {
    const res = await familyApi.getMembers()
    members.value = res.data as unknown as FamilyMember[]
  } catch { toast.error('加载失败') }
  finally { isLoading.value = false }
})

async function handleSOS() {
  isSendingSOS.value = true
  showSosDialog.value = false
  try {
    await familyApi.sendSOS(sosMessage.value || undefined)
    toast.success('求救信号已发送给所有家属！', { duration: 4000 })
    sosMessage.value = ''
  } catch (e: any) { toast.error(e?.message || '发送失败') }
  finally { isSendingSOS.value = false }
}

async function startChat(member: FamilyMember) {
  try {
    // 先查找已有会话，没有则跳转到对方 userId（MessageDetailPage 会按需创建）
    const res = await messageApi.getConversationWith(member.userId)
    const convId = (res.data as any).conversationId
    router.push(convId ? `/messages/${convId}` : `/messages/${member.userId}`)
  } catch {
    // 即使查询失败也直接跳转，让聊天页处理
    router.push(`/messages/${member.userId}`)
  }
}

function toggleEncourage(userId: string) {
  encourageTargetId.value = encourageTargetId.value === userId ? null : userId
  if (encourageTargetId.value) encourageText.value = ''
}

async function sendEncourage(member: FamilyMember) {
  if (!encourageText.value.trim()) { toast.error('请输入鼓励内容'); return }
  isSendingEncourage.value = true
  try {
    await familyApi.sendEncouragement(member.userId, encourageText.value.trim())
    toast.success(`已向 ${member.nickname} 发送鼓励 `)
    encourageTargetId.value = null
  } catch (e: any) { toast.error(e?.message || '发送失败') }
  finally { isSendingEncourage.value = false }
}

function confirmUnbind(member: FamilyMember) {
  unbindTarget.value = member
  showUnbindDialog.value = true
}

async function handleUnbind() {
  if (!unbindTarget.value) return
  showUnbindDialog.value = false
  try {
    await familyApi.unbind(unbindTarget.value.id)
    members.value = members.value.filter(m => m.id !== unbindTarget.value!.id)
    toast.success('已解除绑定')
  } catch (e: any) { toast.error(e?.message || '解除失败') }
  finally { unbindTarget.value = null }
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50 flex items-center justify-between">
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h3>{{ isPatient ? '我的家庭守护' : '家属关怀模式' }}</h3>
      <div class="flex items-center gap-1">
        <button class="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"
          @click="router.push('/family/intro')">
          <BookOpen class="w-5 h-5" />
        </button>
        <button class="p-2 hover:bg-secondary rounded-lg transition-colors"
          @click="router.push('/family/binding')">
          <Plus class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="px-6 py-4 space-y-4">
      <div v-if="isLoading" class="space-y-3">
        <div v-for="i in 2" :key="i" class="h-28 bg-card rounded-2xl animate-pulse border border-border/50" />
      </div>

      <template v-else>

        <!-- ===== 患者视图 ===== -->
        <template v-if="isPatient">

          <!-- SOS 求救 -->
          <div class="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 rounded-2xl p-5 border border-red-200/60 dark:border-red-800/30">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                <Siren class="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h4 class="text-red-700 dark:text-red-300">紧急求助</h4>
                <p class="text-xs text-red-600/70 dark:text-red-400/70">当你需要帮助时，一键通知所有家属</p>
              </div>
            </div>
            <textarea
              v-model="sosMessage"
              placeholder="附上需要说的话（可选）"
              rows="2"
              class="w-full px-3 py-2.5 mb-2 bg-white/70 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-300/40 resize-none placeholder:text-red-400/60"
            />
            <button
              :disabled="isSendingSOS || members.length === 0"
              class="w-full py-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              @click="showSosDialog = true"
            >
              <Siren class="w-5 h-5" />
              {{ isSendingSOS ? '发送中...' : '发送求救信号' }}
            </button>
            <p v-if="members.length === 0" class="text-xs text-center mt-2 text-red-400/70">
              请先绑定家属才能使用此功能
            </p>
          </div>

          <!-- 家属列表 -->
          <div v-if="members.length" class="space-y-3">
            <h4 class="text-muted-foreground">守护我的家属（{{ members.length }}）</h4>
            <div v-for="member in members" :key="member.id"
              class="bg-card rounded-2xl p-4 border border-border/50">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-medium overflow-hidden flex-shrink-0 border-2 border-primary/20">
                  <img v-if="member.avatar" :src="member.avatar" class="w-full h-full object-cover" alt="" />
                  <span v-else>{{ member.nickname[0] }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ member.nickname }}</span>
                    <span class="text-xs px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">{{ member.relation }}</span>
                  </div>
                  <p class="text-xs text-muted-foreground mt-0.5">家属守护者</p>
                </div>
                <div class="flex items-center gap-1">
                  <button class="p-2 hover:bg-secondary rounded-lg transition-colors text-primary"
                    @click="startChat(member)">
                    <MessageCircle class="w-4 h-4" />
                  </button>
                  <button class="p-2 hover:bg-secondary rounded-lg transition-colors text-destructive/60 hover:text-destructive"
                    @click="confirmUnbind(member)">
                    <Unlink class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="text-center py-12">
            <div class="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center mx-auto mb-4">
              <Heart class="w-10 h-10 text-rose-300" />
            </div>
            <h3 class="mb-2">还没有家属守护你</h3>
            <p class="text-muted-foreground text-sm mb-6">邀请家人绑定账号，让他们在你需要时能第一时间知道</p>
            <button class="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
              @click="router.push('/family/binding')">
              邀请家人
            </button>
          </div>
        </template>

        <!-- ===== 家属视图 ===== -->
        <template v-else>

          <!-- 预警卡片 -->
          <div v-if="alertMembers.length" class="space-y-2">
            <div v-for="m in alertMembers" :key="`alert-${m.id}`"
              class="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-4 border border-amber-300/60 dark:border-amber-700/40">
              <div class="flex items-start gap-3">
                <TriangleAlert class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-amber-800 dark:text-amber-300">
                    <span v-if="m.todayMood === 'rainy'">{{ m.nickname }} 今日情绪低落 </span>
                    <span v-else>{{ m.nickname }} 今日还未记录情绪</span>
                  </p>
                  <p class="text-xs text-amber-600/80 dark:text-amber-400/70 mt-0.5">
                    {{ m.todayMood === 'rainy' ? '建议主动联系，给予关怀和陪伴' : '他/她今天还没有记录情绪，可以关心一下' }}
                  </p>
                </div>
                <button class="text-xs px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors shrink-0"
                  @click="startChat(m)">
                  联系TA
                </button>
              </div>
            </div>
          </div>

          <!-- 患者列表 -->
          <div v-if="members.length" class="space-y-3">
            <h4 class="text-muted-foreground">关怀的家人（{{ members.length }}）</h4>
            <div v-for="member in members" :key="member.id"
              class="bg-card rounded-2xl p-5 border border-border/50 space-y-3">

              <div class="flex items-start gap-3">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-medium overflow-hidden flex-shrink-0 border-2 border-primary/20">
                  <img v-if="member.avatar" :src="member.avatar" class="w-full h-full object-cover" alt="" />
                  <span v-else>{{ member.nickname[0] }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-medium">{{ member.nickname }}</span>
                    <span class="text-xs px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">{{ member.relation }}</span>
                  </div>
                  <template v-if="member.shareMood">
                    <div v-if="member.todayMood" class="flex items-center gap-1.5">
                      <component :is="getMoodIcon(member.todayMood)" class="w-4 h-4" :class="moodColor[member.todayMood as keyof typeof moodColor]" />
                      <span class="text-sm">{{ moodLabel[member.todayMood as keyof typeof moodLabel] }}</span>
                      <span class="text-xs text-muted-foreground"> {{ formatMoodTime(member.lastMoodAt) }}</span>
                    </div>
                    <p v-else class="text-sm text-muted-foreground">今日还未记录情绪</p>
                  </template>
                  <p v-else class="text-xs text-muted-foreground">对方未开启情绪共享</p>
                </div>
                <div class="flex flex-col gap-1">
                  <button class="p-2 hover:bg-secondary rounded-lg transition-colors text-primary"
                    title="发送消息" @click="startChat(member)">
                    <MessageCircle class="w-4 h-4" />
                  </button>
                  <button class="p-2 hover:bg-secondary rounded-lg transition-colors text-destructive/60 hover:text-destructive"
                    title="解除绑定" @click="confirmUnbind(member)">
                    <Unlink class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- 情绪趋势 -->
              <button v-if="member.shareMood"
                class="w-full flex items-center justify-between px-4 py-2.5 bg-secondary/60 rounded-xl hover:bg-secondary transition-colors text-sm"
                @click="router.push(`/family/mood/${member.userId}`)">
                <span class="text-muted-foreground">查看近7天情绪趋势</span>
                <ChevronRight class="w-4 h-4 text-muted-foreground" />
              </button>

              <!-- 发送鼓励 -->
              <div class="border-t border-border/40 pt-3">
                <button v-if="encourageTargetId !== member.userId"
                  class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/60 hover:bg-secondary transition-colors text-sm text-muted-foreground"
                  @click="toggleEncourage(member.userId)">
                  <Sparkles class="w-4 h-4" />发送鼓励给 {{ member.nickname }}
                </button>
                <div v-else class="space-y-2">
                  <textarea
                    v-model="encourageText"
                    :placeholder="`写下对 ${member.nickname} 的鼓励...`"
                    rows="2"
                    class="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                  <div class="flex gap-2">
                    <button class="flex-1 py-2 rounded-lg bg-background border border-border text-sm hover:bg-secondary transition-colors"
                      @click="encourageTargetId = null">取消</button>
                    <button class="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 flex items-center justify-center gap-1.5 disabled:opacity-50"
                      :disabled="isSendingEncourage" @click="sendEncourage(member)">
                      <Send class="w-3.5 h-3.5" />{{ isSendingEncourage ? '发送中...' : '发送' }}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="text-center py-12">
            <div class="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center mx-auto mb-4">
              <Heart class="w-10 h-10 text-rose-300" />
            </div>
            <h3 class="mb-2">还没有关联的家人</h3>
            <p class="text-muted-foreground text-sm mb-6">绑定家人账号后，可以查看他们的情绪动态</p>
            <button class="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
              @click="router.push('/family/binding')">
              绑定家人
            </button>
          </div>
        </template>

        <!-- 底部按钮 -->
        <div class="flex gap-3 pt-2">
          <button class="flex-1 py-3 bg-secondary rounded-xl hover:bg-accent transition-colors text-sm flex items-center justify-center gap-2"
            @click="router.push('/family/binding')">
            <Plus class="w-4 h-4" />{{ isPatient ? '邀请家属' : '添加家人' }}
          </button>
          <button class="flex-1 py-3 bg-secondary rounded-xl hover:bg-accent transition-colors text-sm flex items-center justify-center gap-2"
            @click="router.push('/family/intro')">
            <BookOpen class="w-4 h-4" />功能介绍
          </button>
        </div>

      </template>
    </div>
  </div>

  <!-- SOS 确认对话框 -->
  <ConfirmDialog
    :open="showSosDialog"
    title="确认发送求救信号？"
    :message="sosMessage.trim() ? `将向你的 ${members.length} 位家属发送：「${sosMessage.trim()}」` : `将立即通知你的 ${members.length} 位家属`"
    confirm-text="立即发送"
    cancel-text="再想想"
    variant="danger"
    @confirm="handleSOS"
    @cancel="showSosDialog = false"
    @update:open="(v: boolean) => { if (!v) showSosDialog = false }"
  />

  <!-- 解除绑定确认 -->
  <ConfirmDialog
    :open="showUnbindDialog"
    :title="`解除与「${unbindTarget?.nickname}」的绑定`"
    message="解除后对方将无法查看你的情绪动态，确认继续？"
    confirm-text="确认解除"
    cancel-text="取消"
    variant="danger"
    @confirm="handleUnbind"
    @cancel="showUnbindDialog = false; unbindTarget = null"
    @update:open="(v: boolean) => { if (!v) { showUnbindDialog = false; unbindTarget = null } }"
  />
</template>
