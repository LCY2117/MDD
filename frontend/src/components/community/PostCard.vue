<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Heart, MessageCircle, Pin } from 'lucide-vue-next'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import Avatar from '@/components/ui/Avatar.vue'
import Badge from '@/components/ui/Badge.vue'

export interface Post {
  id: string
  author: { id?: string; name: string; avatar?: string; isAnonymous: boolean }
  content: string
  tags?: string[]
  images?: string[]
  likes: number
  comments: number
  isLiked: boolean
  isFavorited?: boolean
  isPinned?: boolean
  createdAt: string
}

const props = defineProps<{
  post: Post
}>()

const emit = defineEmits<{
  like: [postId: string]
}>()

const router = useRouter()

const timeAgo = computed(() =>
  formatDistanceToNow(new Date(props.post.createdAt), { addSuffix: true, locale: zhCN }),
)

function goToDetail() {
  router.push(`/post/${props.post.id}`)
}
</script>

<template>
  <div
    class="bg-card rounded-2xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-shadow cursor-pointer"
    @click="goToDetail"
  >
    <!-- 置顶标记 -->
    <div v-if="post.isPinned" class="flex items-center gap-1 text-xs text-primary mb-3">
      <Pin class="w-3 h-3" />
      <span>置顶</span>
    </div>

    <!-- 作者信息 -->
    <div class="flex items-center gap-3 mb-3">
      <Avatar
        :src="post.author.isAnonymous ? undefined : post.author.avatar"
        :fallback="post.author.name"
        size="sm"
      />
      <div>
        <p class="font-medium text-sm">{{ post.author.name }}</p>
        <p class="text-xs text-muted-foreground">{{ timeAgo }}</p>
      </div>
    </div>

    <!-- 内容 -->
    <p class="text-sm leading-relaxed text-foreground mb-3 line-clamp-4">
      {{ post.content }}
    </p>

    <!-- 图片 -->
    <div v-if="post.images && post.images.length" class="grid grid-cols-3 gap-1.5 mb-3">
      <div
        v-for="(img, i) in post.images.slice(0, 3)"
        :key="i"
        class="aspect-square rounded-xl overflow-hidden bg-secondary"
      >
        <img :src="img" class="w-full h-full object-cover" />
      </div>
    </div>

    <!-- 标签 -->
    <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-1.5 mb-3">
      <Badge v-for="tag in post.tags" :key="tag" class="text-xs">#{{ tag }}</Badge>
    </div>

    <!-- 互动栏 -->
    <div class="flex items-center gap-4 pt-2 border-t border-border/30">
      <button
        class="flex items-center gap-1.5 text-sm transition-colors"
        :class="post.isLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'"
        @click.stop="emit('like', post.id)"
      >
        <Heart class="w-4 h-4" :fill="post.isLiked ? 'currentColor' : 'none'" />
        <span>{{ post.likes }}</span>
      </button>
      <div class="flex items-center gap-1.5 text-sm text-muted-foreground">
        <MessageCircle class="w-4 h-4" />
        <span>{{ post.comments }}</span>
      </div>
    </div>
  </div>
</template>
