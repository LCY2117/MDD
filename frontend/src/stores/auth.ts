import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi, authApi } from '@/lib/api'
import type { User } from '@/lib/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoading = ref(true)

  const isAuthenticated = computed(() => !!user.value && !!token.value)

  // 启动时从 localStorage 恢复 token 并校验
  async function init() {
    const saved = localStorage.getItem('token')
    if (!saved) {
      isLoading.value = false
      return
    }
    token.value = saved
    try {
      const res = await userApi.getMe()
      user.value = res.data as User
    } catch {
      localStorage.removeItem('token')
      token.value = null
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  async function register(username: string, nickname: string, password: string) {
    const res = await authApi.register(username, nickname, password)
    const data = res.data as { token: string; user: User }
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
  }

  async function login(username: string, password: string) {
    const res = await authApi.login(username, password)
    const data = res.data as { token: string; user: User }
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
  }

  async function refreshUser() {
    if (!token.value) return
    const res = await userApi.getMe()
    user.value = res.data as User
  }

  function updateUser(partial: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...partial }
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return { user, token, isLoading, isAuthenticated, init, login, register, refreshUser, updateUser, logout }
})
