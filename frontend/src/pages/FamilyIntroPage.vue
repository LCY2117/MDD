<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft, Heart, Siren, Eye, MessageCircle,
  Sparkles, UserCheck, Link, BookOpen, ChevronDown, ChevronUp
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const isPatient = computed(() => auth.user?.userMode === 'patient')

const expandedSection = ref<string | null>(null)
function toggle(key: string) {
  expandedSection.value = expandedSection.value === key ? null : key
}

const faqs = [
  {
    id: 'faq1',
    q: '绑定后家属能看到我的什么信息？',
    a: '家属只能看到你每日记录的情绪状态（好/一般/难）和记录时间。你的日记、帖子等其他内容均完全私密，家属无法查看。你也可以随时关闭情绪共享。'
  },
  {
    id: 'faq2',
    q: '我可以绑定多少位家属？',
    a: '患者账号可以绑定多位家属（家属/照护者），所有绑定的家属均可查看你的情绪动态，并在你发出求救信号时同时收到通知。'
  },
  {
    id: 'faq3',
    q: '我的身份选错了，怎么修改？',
    a: '身份一旦有绑定关系后便会被锁定，需要先解除所有家庭绑定，再前往「编辑资料」修改身份。这是为了防止误操作破坏已建立的家庭关系。'
  },
  {
    id: 'faq4',
    q: '怎么解除绑定关系？',
    a: '进入「家庭关怀」页面，在家人列表中点击每张卡片右上角的"解除绑定"图标，确认后即可解除。患者和家属双方均可主动解除绑定。'
  },
  {
    id: 'faq5',
    q: '求救信号会发送给谁？',
    a: '求救信号会以应用内通知的形式发送给所有已绑定的家属账号，他们打开应用后会在通知中心看到你的求救消息。'
  },
]
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部 -->
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50 flex items-center gap-3">
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h3>家庭关怀功能介绍</h3>
    </div>

    <div class="px-4 sm:px-6 py-6 space-y-6 w-full max-w-5xl mx-auto">

      <!-- 主横幅 -->
      <div class="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-2xl p-6 border border-rose-200/50 dark:border-rose-800/30 text-center">
        <div class="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center mx-auto mb-4">
          <Heart class="w-8 h-8 text-rose-500" />
        </div>
        <h2 class="text-lg font-semibold text-rose-700 dark:text-rose-300 mb-2">家庭关怀</h2>
        <p class="text-sm text-rose-600/80 dark:text-rose-400/80 leading-relaxed">
          让家人成为你的心灵守护者。<br />患者与家属通过绑定，彼此关注情绪、互相陪伴。
        </p>
      </div>

      <!-- 两种角色说明 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="bg-card rounded-2xl p-4 border-2 transition-colors" :class="isPatient ? 'border-primary/40 bg-primary/5' : 'border-border/50'">
          <div class="text-2xl mb-2">🌱</div>
          <h4 class="font-medium mb-1">患者本人</h4>
          <ul class="text-xs text-muted-foreground space-y-1">
            <li>· 邀请家属绑定账号</li>
            <li>· 记录情绪供家属查看</li>
            <li>· 一键发送求救信号</li>
            <li>· 私信联系家属</li>
          </ul>
          <div v-if="isPatient" class="mt-3 text-xs font-medium text-primary flex items-center gap-1">
            <UserCheck class="w-3.5 h-3.5" />这是你的角色
          </div>
        </div>
        <div class="bg-card rounded-2xl p-4 border-2 transition-colors" :class="!isPatient ? 'border-primary/40 bg-primary/5' : 'border-border/50'">
          <div class="text-2xl mb-2">🤝</div>
          <h4 class="font-medium mb-1">家属/照护者</h4>
          <ul class="text-xs text-muted-foreground space-y-1">
            <li>· 绑定家人的账号</li>
            <li>· 查看每日情绪动态</li>
            <li>· 收到情绪预警提示</li>
            <li>· 发送鼓励与关怀</li>
          </ul>
          <div v-if="!isPatient" class="mt-3 text-xs font-medium text-primary flex items-center gap-1">
            <UserCheck class="w-3.5 h-3.5" />这是你的角色
          </div>
        </div>
      </div>

      <button
        class="w-full px-8 py-3 bg-secondary text-foreground rounded-xl hover:bg-accent transition-colors"
        @click="router.push('/profile/edit')"
      >
        前往个人资料修改身份
      </button>

      <!-- 功能详解 -->
      <div class="space-y-3">
        <h3 class="font-semibold">功能详解</h3>

        <!-- 绑定流程 -->
        <div class="bg-card rounded-2xl p-5 border border-border/50 space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Link class="w-4 h-4 text-blue-500" />
            </div>
            <h4>如何绑定家庭？</h4>
          </div>
          <ol class="space-y-2 text-sm text-muted-foreground">
            <li class="flex gap-2">
              <span class="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">1</span>
              <span>任意一方（患者或家属）进入「家人绑定」页面，点击「生成邀请码」</span>
            </li>
            <li class="flex gap-2">
              <span class="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">2</span>
              <span>将生成的6位邀请码告知另一方（有效期24小时）</span>
            </li>
            <li class="flex gap-2">
              <span class="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">3</span>
              <span>另一方在「家人绑定」页面下方输入邀请码，点击「绑定」完成</span>
            </li>
            <li class="flex gap-2">
              <span class="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">4</span>
              <span>绑定成功后，双方均可在「家庭关怀」页面看到彼此</span>
            </li>
          </ol>
        </div>

        <!-- 患者功能 -->
        <div class="bg-card rounded-2xl p-5 border border-border/50 space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Siren class="w-4 h-4 text-red-500" />
            </div>
            <h4>求救信号（患者专属）</h4>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed">
            当你情绪极度低落或遇到危机时，可以在「我的家庭守护」页面按下「发送求救信号」按钮。你的所有绑定家属会立即收到应用内通知，知道你需要帮助。
          </p>
          <p class="text-sm text-muted-foreground leading-relaxed">
            你还可以附上一段文字说明你当前的状态，帮助家属更好地了解情况。
          </p>
        </div>

        <!-- 家属功能 -->
        <div class="bg-card rounded-2xl p-5 border border-border/50 space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Eye class="w-4 h-4 text-amber-500" />
            </div>
            <h4>情绪监护（家属专属）</h4>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed">
            家属可以看到患者当天的情绪记录（好/一般/难受）和记录时间。当患者情绪低落（🌧️）或当天还未记录情绪时，家属页面顶部会出现<strong class="text-amber-600 dark:text-amber-400">预警提示</strong>，提醒家属主动关心。
          </p>
          <p class="text-sm text-muted-foreground leading-relaxed">
            点击「查看近7天情绪趋势」可以看到患者最近一周的情绪变化。
          </p>
        </div>

        <!-- 鼓励消息 -->
        <div class="bg-card rounded-2xl p-5 border border-border/50 space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Sparkles class="w-4 h-4 text-purple-500" />
            </div>
            <h4>发送鼓励（家属专属）</h4>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed">
            家属可以在患者卡片底部写下鼓励的话，点击发送后，患者会在通知中心收到你的温暖留言。一句简单的话，有时是最大的支持。
          </p>
        </div>

        <!-- 私信 -->
        <div class="bg-card rounded-2xl p-5 border border-border/50 space-y-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <MessageCircle class="w-4 h-4 text-green-500" />
            </div>
            <h4>私信联系</h4>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed">
            患者和家属都可以点击消息图标，直接跳转到双方的私信对话。比起电话，有时文字更容易表达情绪。
          </p>
        </div>
      </div>

      <!-- 隐私保障 -->
      <div class="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-5 border border-blue-200/50 dark:border-blue-800/30">
        <h4 class="mb-2 text-blue-700 dark:text-blue-300 flex items-center gap-2">
          <BookOpen class="w-4 h-4" />隐私保障
        </h4>
        <ul class="text-sm text-blue-600/80 dark:text-blue-400/80 space-y-1.5">
          <li>✓ 家属只能看到情绪状态，不能看到日记和帖子</li>
          <li>✓ 患者随时可以关闭情绪共享（进入「设置」）</li>
          <li>✓ 双方均可随时解除绑定关系</li>
          <li>✓ 绑定后身份被锁定，防止误操作</li>
        </ul>
      </div>

      <!-- 常见问题 -->
      <div class="space-y-2">
        <h3 class="font-semibold">常见问题</h3>
        <div v-for="faq in faqs" :key="faq.id"
          class="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <button
            class="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/50 transition-colors"
            @click="toggle(faq.id)"
          >
            <span class="text-sm font-medium pr-3">{{ faq.q }}</span>
            <component :is="expandedSection === faq.id ? ChevronUp : ChevronDown"
              class="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </button>
          <div v-if="expandedSection === faq.id"
            class="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
            {{ faq.a }}
          </div>
        </div>
      </div>

      <!-- 开始使用 -->
      <div class="pb-4 text-center">
        <button
          class="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          @click="router.push('/family/mode')"
        >
          前往家庭关怀页面
        </button>
      </div>

    </div>
  </div>
</template>
