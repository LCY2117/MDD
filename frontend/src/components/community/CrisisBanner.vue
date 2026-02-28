<script setup lang="ts">
import { Phone } from 'lucide-vue-next'
</script>

<template>
  <div class="bg-destructive/10 rounded-2xl p-4 border border-destructive/20 flex items-center gap-3">
    <Phone class="w-4 h-4 text-destructive flex-shrink-0" />
    <p class="text-xs text-muted-foreground flex-1">
      如遇紧急心理危机，请拨打
      <a href="tel:400-161-9995" class="text-destructive font-medium">400-161-9995</a>
      （24小时）
    </p>
  </div>
</template>
