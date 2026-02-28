<script setup lang="ts">
import { cn } from '@/lib/utils'
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'secondary' | 'ghost' | 'destructive' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
})

const emit = defineEmits<{ click: [e: MouseEvent] }>()

const classes = computed(() =>
  cn(
    'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50',
    {
      'bg-primary text-primary-foreground hover:bg-primary/90': props.variant === 'default',
      'bg-secondary text-foreground hover:bg-accent': props.variant === 'secondary',
      'hover:bg-secondary': props.variant === 'ghost',
      'bg-destructive text-white hover:bg-destructive/90': props.variant === 'destructive',
      'border border-border bg-background hover:bg-secondary': props.variant === 'outline',
      'h-10 px-4 py-2 text-sm': props.size === 'default',
      'h-8 px-3 text-xs': props.size === 'sm',
      'h-12 px-6 text-base': props.size === 'lg',
      'h-10 w-10': props.size === 'icon',
    },
    props.class,
  ),
)
</script>

<template>
  <button :class="classes" :disabled="disabled" @click="emit('click', $event)">
    <slot />
  </button>
</template>
