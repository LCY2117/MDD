<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  src?: string
  alt?: string
  fallback?: string
  class?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), { size: 'md', fallback: '?' })
</script>

<template>
  <div
    :class="cn(
      'rounded-full flex items-center justify-center overflow-hidden bg-primary/10 text-primary font-medium flex-shrink-0',
      { 'w-8 h-8 text-sm': size === 'sm', 'w-10 h-10 text-base': size === 'md', 'w-16 h-16 text-xl': size === 'lg' },
      props.class,
    )"
  >
    <img v-if="src" :src="src" :alt="alt" class="w-full h-full object-cover" />
    <span v-else>{{ fallback.charAt(0).toUpperCase() }}</span>
  </div>
</template>
