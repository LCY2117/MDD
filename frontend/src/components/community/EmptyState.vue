<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon?: Component
  title?: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <div v-if="$props.icon" class="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
      <component :is="$props.icon" class="w-8 h-8 text-muted-foreground" />
    </div>
    <p class="font-medium mb-2">{{ title || '暂无内容' }}</p>
    <p class="text-sm text-muted-foreground">{{ description }}</p>
    <slot />
  </div>
</template>
