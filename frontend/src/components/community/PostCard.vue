<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Heart, MessageCircle, Pin, Bookmark, MoreVertical, MessageSquare, Flag, Trash2 } from 'lucide-vue-next'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import Avatar from '@/components/ui/Avatar.vue'
import Badge from '@/components/ui/Badge.vue'
import { useAuthStore } from '@/stores/auth'

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

const props = defineProps<{ post: Post; canDelete?: boolean }>()
const emit = defineEmits<{
  like: [postId: string]
  favorite: [postId: string]
  message: [authorId: string]
  delete: [postId: string]
}>()

const router = useRouter()
const auth = useAuthStore()
const showMenu = ref(false)

const timeAgo = computed(() =>
  formatDistanceToNow(new Date(props.post.createdAt), { addSuffix: true, locale: zhCN }),
)

function goToDetail() { router.push(`/post/${props.post.id}`) }
function toggleMenu(e: Event) { e.stopPropagation(); showMenu.value = !showMenu.value }
function menuAction(action: string, e: Event) {
  e.stopPropagation(); showMenu.value = false
  if (action === 'favorite') emit('favorite', props.post.id)
  else if (action === 'message' && props.post.author.id) emit('message', props.post.author.id)
  else if (action === 'delete') emit('delete', props.post.id)
}
</script>

<template>
  <div
    class="bg-card rounded-2xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-shadow cursor-pointer relative"
    @click="goToDetail"
  >
    <Teleport to="body">
      <div v-if="showMenu" class="fixed inset-0 z-10" @click.stop="showMenu = false" />
    </Teleport>

    <div v-if="post.isPinned" class="flex items-center gap-1 text-xs text-primary mb-3">
      <Pin class="w-3 h-3" /><span>置顶</span>
    </div>

    <!-- 作者 + 三点 -->
    <div class="flex items-center gap-3 mb-3">
      <Avatar :src="post.author.isAnonymous ? undefined : post.author.avatar" :fallback="post.author.name" size="sm" />
      <div class="flex-1">
        <p class="font-medium text-sm">{{ post.author.name }}</p>
        <p class="text-xs text-muted-foreground">{{ timeAgo }}</p>
      </div>
      <div class="relative">
        <button class="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground" @click="toggleMenu">
          <MoreVertical class="w-4 h-4" />
        </button>
        <Transition enter-active-class="transition-all duration-150" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-100" leave-to-class="opacity-0 scale-95">
          <div v-if="showMenu" class="absolute right-0 top-8 z-20 w-36 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
            <button class="w-full flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-secondary transition-colors" @click="menuAction('favorite', $event)">
              <Bookmark class="w-4 h-4" :class="post.isFavorited ? 'text-amber-500 fill-amber-500' : ''" />
              {{ post.isFavorited ? '取消收藏' : '收藏帖子' }}
            </button>
            <button v-if="!post.author.isAnonymous && post.author.id && post.author.id !== auth.user?.id" class="w-full flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-secondary transition-colors" @click="menuAction('message', $event)">
              <MessageSquare class="w-4 h-4" />私信博主
            </button>
            <button v-if="canDelete" class="w-full flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-secondary transition-colors text-destructive" @click="menuAction('delete', $event)">
              <Trash2 class="w-4 h-4" />删除帖子
            </button>
            <button v-else class="w-full flex items-center gap-2.5 px-4 py-3 text-sm hover:bg-secondary transition-colors text-rose-500" @click.stop="showMenu = false">
              <Flag class="w-4 h-4" />举报
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <p class="text-sm leading-relaxed text-foreground mb-3 line-clamp-4">{{ post.content }}</p>

    <div v-if="post.images && post.images.length" class="grid grid-cols-3 gap-1.5 mb-3">
      <div v-for="(img, i) in post.images.slice(0, 3)" :key="i" class="aspect-square rounded-xl overflow-hidden bg-secondary">
        <img :src="img" class="w-full h-full object-cover" />
      </div>
    </div>

    <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-1.5 mb-3">
      <Badge v-for="tag in post.tags" :key="tag" class="text-xs">#{{ tag }}</Badge>
    </div>

    <!-- 互动栏 -->
    <div class="flex items-center gap-4 pt-2 border-t border-border/30">
      <button class="flex items-center gap-1.5 text-sm transition-colors" :class="post.isLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'" @click.stop="emit('like', post.id)">
        <Heart class="w-4 h-4" :fill="post.isLiked ? 'currentColor' : 'none'" /><span>{{ post.likes }}</span>
      </button>
      <div class="flex items-center gap-1.5 text-sm text-muted-foreground">
        <MessageCircle class="w-4 h-4" /><span>{{ post.comments }}</span>
      </div>
      <button class="flex items-center gap-1.5 text-sm transition-colors ml-auto" :class="post.isFavorited ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'" @click.stop="emit('favorite', post.id)">
        <Bookmark class="w-4 h-4" :fill="post.isFavorited ? 'currentColor' : 'none'" />
      </button>
    </div>
  </div>
</template>
