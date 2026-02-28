<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  variant?: 'default' | 'secondary' | 'destructive'
  class?: string
}

const props = withDefaults(defineProps<Props>(), { variant: 'secondary' })
</script>

<template>
  <span
    :class="cn(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
      {
        'bg-primary text-primary-foreground': variant === 'default',
        'bg-secondary text-foreground': variant === 'secondary',
        'bg-destructive/10 text-destructive': variant === 'destructive',
      },
      props.class,
    )"
  >
    <slot />
  </span>
</template>
