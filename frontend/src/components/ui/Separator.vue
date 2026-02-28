<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  class?: string
}

const props = withDefaults(defineProps<Props>(), { orientation: 'horizontal' })
</script>

<template>
  <div
    :class="cn(
      'bg-border/50',
      orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
      props.class,
    )"
  />
</template>
