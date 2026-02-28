<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Shield, Eye, EyeOff } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const authStore = useAuthStore()

const tab = ref<'login' | 'register'>('login')
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirm = ref(false)

const loginForm = ref({ username: '', password: '' })
const registerForm = ref({ username: '', nickname: '', password: '', confirm: '' })

async function handleLogin() {
  const { username, password } = loginForm.value
  if (!username.trim() || !password) { toast.error('请填写用户名和密码'); return }
  isLoading.value = true
  try {
    await authStore.login(username.trim(), password)
    toast.success('登录成功，欢迎回来！')
    router.push('/')
  } catch (e: any) {
    toast.error(e?.message || '用户名或密码错误')
  } finally {
    isLoading.value = false
  }
}

async function handleRegister() {
  const { username, nickname, password, confirm } = registerForm.value
  if (!username.trim() || !nickname.trim() || !password) { toast.error('请填写所有字段'); return }
  if (username.trim().length < 3) { toast.error('用户名至少 3 个字符'); return }
  if (password.length < 6) { toast.error('密码至少 6 位'); return }
  if (password !== confirm) { toast.error('两次密码不一致'); return }
  isLoading.value = true
  try {
    await authStore.register(username.trim(), nickname.trim(), password)
    toast.success('注册成功，欢迎加入！')
    router.push('/')
  } catch (e: any) {
    toast.error(e?.message || '注册失败，请重试')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col items-center justify-center p-6">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="mb-8 text-center">
        <div class="w-20 h-20 rounded-3xl bg-primary mx-auto flex items-center justify-center shadow-lg mb-4">
          <Shield class="w-10 h-10 text-primary-foreground" />
        </div>
        <h1>心语社区</h1>
        <p class="text-muted-foreground mt-2">用温暖的方式，开始陪伴之旅</p>
      </div>

      <!-- Tab 切换 -->
      <div class="flex bg-secondary rounded-2xl p-1 mb-6">
        <button
          class="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
          :class="tab === 'login' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'"
          @click="tab = 'login'"
        >登录</button>
        <button
          class="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
          :class="tab === 'register' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'"
          @click="tab = 'register'"
        >注册</button>
      </div>

      <!-- 登录表单 -->
      <div v-if="tab === 'login'" class="bg-card rounded-3xl p-6 shadow-md border border-border/50 space-y-4">
        <div>
          <label class="text-sm text-muted-foreground mb-1.5 block">用户名</label>
          <input v-model="loginForm.username" type="text" placeholder="请输入用户名"
            class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            @keydown.enter="handleLogin" />
        </div>
        <div>
          <label class="text-sm text-muted-foreground mb-1.5 block">密码</label>
          <div class="relative">
            <input v-model="loginForm.password" :type="showPassword ? 'text' : 'password'" placeholder="请输入密码"
              class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-12"
              @keydown.enter="handleLogin" />
            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              @click="showPassword = !showPassword">
              <EyeOff v-if="showPassword" class="w-5 h-5" /><Eye v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
        <button :disabled="isLoading"
          class="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          @click="handleLogin">
          <div v-if="isLoading" class="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          <span v-else>登录</span>
        </button>
        <p class="text-center text-sm text-muted-foreground">
          没有账号？<button class="text-primary hover:underline font-medium ml-1" @click="tab = 'register'">立即注册</button>
        </p>
      </div>

      <!-- 注册表单 -->
      <div v-if="tab === 'register'" class="bg-card rounded-3xl p-6 shadow-md border border-border/50 space-y-4">
        <div>
          <label class="text-sm text-muted-foreground mb-1.5 block">用户名 <span class="text-xs">（登录用，至少3位）</span></label>
          <input v-model="registerForm.username" type="text" placeholder="设置用户名"
            class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <div>
          <label class="text-sm text-muted-foreground mb-1.5 block">昵称 <span class="text-xs">（显示给其他人看）</span></label>
          <input v-model="registerForm.nickname" type="text" placeholder="设置昵称"
            class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <div>
          <label class="text-sm text-muted-foreground mb-1.5 block">密码 <span class="text-xs">（至少6位）</span></label>
          <div class="relative">
            <input v-model="registerForm.password" :type="showPassword ? 'text' : 'password'" placeholder="设置密码"
              class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-12" />
            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              @click="showPassword = !showPassword">
              <EyeOff v-if="showPassword" class="w-5 h-5" /><Eye v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
        <div>
          <label class="text-sm text-muted-foreground mb-1.5 block">确认密码</label>
          <div class="relative">
            <input v-model="registerForm.confirm" :type="showConfirm ? 'text' : 'password'" placeholder="再次输入密码"
              class="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-12"
              @keydown.enter="handleRegister" />
            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              @click="showConfirm = !showConfirm">
              <EyeOff v-if="showConfirm" class="w-5 h-5" /><Eye v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
        <button :disabled="isLoading"
          class="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          @click="handleRegister">
          <div v-if="isLoading" class="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          <span v-else>注册</span>
        </button>
        <p class="text-center text-sm text-muted-foreground">
          已有账号？<button class="text-primary hover:underline font-medium ml-1" @click="tab = 'login'">去登录</button>
        </p>
      </div>

      <p class="text-xs text-muted-foreground text-center mt-6 leading-relaxed">
        登录或注册即表示同意
        <span class="text-primary">《用户协议》</span>和<span class="text-primary">《隐私政策》</span>
      </p>
    </div>
  </div>
</template>
