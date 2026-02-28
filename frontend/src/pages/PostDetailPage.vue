<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Heart, MessageSquare, Send, MoreVertical } from 'lucide-vue-next'
import { postApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const postId = route.params.id as string

interface Comment { id: string; author: { id?: string; name: string; avatar?: string; isAnonymous?: boolean }; content: string; createdAt: string }
interface PostDetail { id: string; author: { id: string; name: string; avatar?: string; isAnonymous?: boolean }; content: string; images?: string[]; tags?: string[]; likes: number; isLiked?: boolean; comments: number; createdAt: string }

const post = ref<PostDetail | null>(null)
const comments = ref<Comment[]>([])
const isLoading = ref(true)
const commentInput = ref('')
const isSendingComment = ref(false)

onMounted(async () => {
  try {
    const [postRes, commentRes] = await Promise.all([postApi.getPost(postId), postApi.getComments(postId)])
    post.value = postRes.data as PostDetail
    comments.value = commentRes.data as Comment[]
  } catch { toast.error('加载失败') }
  finally { isLoading.value = false }
})

async function toggleLike() {
  if (!auth.isAuthenticated) { toast.info('请先登录'); return }
  if (!post.value) return
  try {
    const res = await postApi.toggleLike(postId)
    post.value.isLiked = (res.data as { isLiked: boolean }).isLiked
    post.value.likes += post.value.isLiked ? 1 : -1
  } catch { toast.error('操作失败') }
}

async function sendComment() {
  if (!commentInput.value.trim() || isSendingComment.value) return
  if (!auth.isAuthenticated) { toast.info('请先登录'); return }
  isSendingComment.value = true
  try {
    const res = await postApi.createComment(postId, { content: commentInput.value.trim() })
    comments.value.unshift(res.data as Comment)
    if (post.value) post.value.comments += 1
    commentInput.value = ''; toast.success('评论已发布')
  } catch { toast.error('评论失败') }
  finally { isSendingComment.value = false }
}

function formatTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return new Date(dateStr).toLocaleDateString('zh-CN')
}
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50 flex items-center justify-between">
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()"><ArrowLeft class="w-5 h-5" /></button>
      <h3>帖子详情</h3>
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors"><MoreVertical class="w-5 h-5" /></button>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div v-if="isLoading" class="p-6 space-y-4">
        <div class="h-8 w-3/4 bg-card rounded-xl animate-pulse border border-border/50" />
        <div class="h-24 bg-card rounded-2xl animate-pulse border border-border/50" />
      </div>
      <template v-else-if="post">
        <!-- 正文 -->
        <div class="px-6 py-5 border-b border-border/50">
          <div class="flex items-start gap-3 mb-4">
            <div class="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary font-medium overflow-hidden flex-shrink-0 cursor-pointer"
              @click="!post.author.isAnonymous && router.push(`/user/${post.author.id}`)">
              <img v-if="post.author.avatar && !post.author.isAnonymous" :src="post.author.avatar" alt="" class="w-full h-full object-cover" />
              <span v-else>{{ (post.author.isAnonymous ? '匿' : post.author.name[0]) }}</span>
            </div>
            <div>
              <p class="font-medium">{{ post.author.isAnonymous ? '匿名用户' : post.author.name }}</p>
              <p class="text-xs text-muted-foreground">{{ formatTime(post.createdAt) }}</p>
            </div>
          </div>
          <p class="leading-relaxed mb-4 whitespace-pre-wrap">{{ post.content }}</p>
          <div v-if="post.images?.length" class="grid grid-cols-2 gap-2 mb-4">
            <img v-for="(img, i) in post.images" :key="i" :src="img" alt="" class="w-full aspect-square object-cover rounded-xl" />
          </div>
          <div v-if="post.tags?.length" class="flex flex-wrap gap-2 mb-4">
            <span v-for="tag in post.tags" :key="tag" class="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">#{{ tag }}</span>
          </div>
          <div class="flex items-center gap-6">
            <button class="flex items-center gap-2 transition-colors" :class="post.isLiked ? 'text-rose-500' : 'text-muted-foreground'" @click="toggleLike">
              <Heart class="w-5 h-5" :class="{ 'fill-current': post.isLiked }" /><span class="text-sm">{{ post.likes }}</span>
            </button>
            <div class="flex items-center gap-2 text-muted-foreground">
              <MessageSquare class="w-5 h-5" /><span class="text-sm">{{ post.comments }}</span>
            </div>
          </div>
        </div>

        <!-- 评论列表 -->
        <div class="px-6 py-4">
          <h4 class="mb-4">评论（{{ comments.length }}）</h4>
          <div v-if="comments.length" class="space-y-4">
            <div v-for="comment in comments" :key="comment.id" class="flex gap-3">
              <div class="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-medium flex-shrink-0 overflow-hidden">
                <img v-if="comment.author.avatar && !comment.author.isAnonymous" :src="comment.author.avatar" alt="" class="w-full h-full object-cover" />
                <span v-else>{{ (comment.author.isAnonymous ? '匿' : comment.author.name[0]) }}</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-medium">{{ comment.author.isAnonymous ? '匿名用户' : comment.author.name }}</span>
                  <span class="text-xs text-muted-foreground">{{ formatTime(comment.createdAt) }}</span>
                </div>
                <p class="text-sm leading-relaxed">{{ comment.content }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-muted-foreground text-sm">还没有评论，来第一个留言吧</div>
        </div>
      </template>
    </div>

    <!-- 评论输入区 -->
    <div class="sticky bottom-0 bg-background border-t border-border/50 px-6 py-4">
      <div class="flex gap-3">
        <input v-model="commentInput" type="text" placeholder="写下你的感想..."
          class="flex-1 px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          @keydown.enter="sendComment" />
        <button :disabled="!commentInput.trim() || isSendingComment"
          class="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
          @click="sendComment"><Send class="w-4 h-4" /></button>
      </div>
    </div>
  </div>
</template>
