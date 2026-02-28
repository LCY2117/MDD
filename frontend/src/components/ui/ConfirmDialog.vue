<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle, Info } from 'lucide-vue-next'

interface Props {
  open: boolean
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: '确认',
  cancelText: '取消',
  variant: 'danger',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const iconStyle = computed(() => ({
  danger: { bg: 'bg-destructive/10', text: 'text-destructive' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-500' },
  info: { bg: 'bg-primary/10', text: 'text-primary' },
}[props.variant]))

const confirmBtnClass = computed(() => ({
  danger: 'bg-destructive text-white hover:bg-destructive/90',
  warning: 'bg-amber-500 text-white hover:bg-amber-600',
  info: 'bg-primary text-primary-foreground hover:bg-primary/90',
}[props.variant]))
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="emit('cancel')"
      >
        <!-- 背景遮罩 -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <!-- 对话框 -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-2"
        >
          <div v-if="open" class="relative w-full max-w-sm bg-card rounded-3xl shadow-xl border border-border/50 p-6">
            <!-- 图标 -->
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" :class="iconStyle.bg">
                <AlertTriangle v-if="variant === 'danger' || variant === 'warning'" class="w-6 h-6" :class="iconStyle.text" />
                <Info v-else class="w-6 h-6" :class="iconStyle.text" />
              </div>
              <h3 class="text-base font-semibold leading-snug">{{ title }}</h3>
            </div>

            <!-- 内容 -->
            <p v-if="message" class="text-sm text-muted-foreground mb-6 leading-relaxed">{{ message }}</p>

            <!-- 按钮区 -->
            <div class="flex gap-3">
              <button
                v-if="cancelText"
                class="flex-1 py-2.5 rounded-xl border border-border bg-background text-sm font-medium hover:bg-secondary transition-colors"
                @click="emit('cancel')"
              >{{ cancelText }}</button>
              <button
                class="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
                :class="confirmBtnClass"
                @click="emit('confirm')"
              >{{ confirmText }}</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
