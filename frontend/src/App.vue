<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
import { useThemeStore } from './stores/theme'
import { useAuthStore } from './stores/auth'
import { onMounted } from 'vue'

const themeStore = useThemeStore()
const authStore = useAuthStore()

onMounted(() => {
  themeStore.init()
  authStore.init()
})
</script>

<template>
  <RouterView />
  <Toaster position="top-center" :rich-colors="true" expand />
</template>
