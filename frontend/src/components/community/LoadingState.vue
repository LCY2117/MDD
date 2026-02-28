<script setup lang="ts">
import Skeleton from '@/components/ui/Skeleton.vue'
</script>

<template>
  <div class="space-y-3 py-2">
    <div v-for="i in 3" :key="i" class="bg-card rounded-2xl p-5 border border-border/50">
      <div class="flex items-center gap-3 mb-3">
        <Skeleton class="w-8 h-8 rounded-full" />
        <div class="flex-1">
          <Skeleton class="h-3 w-24 mb-1" />
          <Skeleton class="h-2.5 w-16" />
        </div>
      </div>
      <Skeleton class="h-3 w-full mb-2" />
      <Skeleton class="h-3 w-4/5 mb-2" />
      <Skeleton class="h-3 w-3/5" />
    </div>
  </div>
</template>
