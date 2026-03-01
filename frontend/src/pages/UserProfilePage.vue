<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, MessageSquare } from 'lucide-vue-next'
import PostCard from '@/components/community/PostCard.vue'
import type { Post } from '@/components/community/PostCard.vue'
import { postApi, userApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const userId = route.params.id as string

interface UserInfo { id: string; nickname: string; avatar?: string; bio?: string; stats?: { posts: number; followers: number; following: number } }
const user = ref<UserInfo | null>(null)
const posts = ref<Post[]>([])
const isLoading = ref(true)
const isFollowing = ref(false)
const isFollowLoading = ref(false)

onMounted(async () => {
  try {
    const [userRes, postsRes] = await Promise.all([userApi.getUser(userId), postApi.getUserPosts(userId)])
    const userData = userRes.data as unknown as (UserInfo & { isFollowing?: boolean })
    user.value = userData
    isFollowing.value = !!userData.isFollowing
    posts.value = (postsRes.data as { posts: Post[] }).posts
  } catch { toast.error('加载失败') }
  finally { isLoading.value = false }
})

async function toggleFollow() {
  if (!auth.isAuthenticated) { toast.info('请先登录'); return }
  isFollowLoading.value = true
  try {
    const res = await userApi.toggleFollow(userId)
    isFollowing.value = (res.data as { isFollowing: boolean }).isFollowing
    if (user.value?.stats) {
      user.value.stats.followers += isFollowing.value ? 1 : -1
    }
  } catch { toast.error('操作失败') }
  finally { isFollowLoading.value = false }
}

async function handleLike(postId: string) {
  if (!auth.isAuthenticated) { toast.info('登录后可以点赞'); return }
  try {
    const res = await postApi.toggleLike(postId)
    const post = posts.value.find(p => p.id === postId)
    if (post) {
      post.isLiked = (res.data as { isLiked: boolean }).isLiked
      post.likes = post.isLiked ? post.likes + 1 : post.likes - 1
    }
  } catch { toast.error('操作失败') }
}

async function handleFavorite(postId: string) {
  if (!auth.isAuthenticated) { toast.info('登录后可以收藏'); return }
  try {
    const res = await postApi.toggleFavorite(postId)
    const post = posts.value.find(p => p.id === postId)
    if (post) post.isFavorited = (res.data as { isFavorited: boolean }).isFavorited
    toast.success(post?.isFavorited ? '已收藏' : '已取消收藏')
  } catch { toast.error('操作失败') }
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50 flex items-center gap-3">
      <button class="p-2 hover:bg-secondary rounded-lg transition-colors" @click="router.back()"><ArrowLeft class="w-5 h-5" /></button>
      <h3 class="flex-1">{{ user?.nickname ?? '用户主页' }}</h3>
    </div>

    <div v-if="isLoading" class="p-6 space-y-3">
      <div class="h-24 bg-card rounded-2xl animate-pulse border border-border/50" />
      <div v-for="i in 3" :key="i" class="h-20 bg-card rounded-2xl animate-pulse border border-border/50" />
    </div>
    <template v-else-if="user">
      <!-- 用户信息 -->
      <div class="px-6 py-5 border-b border-border/50">
        <div class="flex items-start gap-4 mb-4">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-xl font-medium text-primary overflow-hidden flex-shrink-0">
            <img v-if="user.avatar" :src="user.avatar" alt="" class="w-full h-full object-cover" />
            <span v-else>{{ user.nickname[0] }}</span>
          </div>
          <div class="flex-1">
            <h3 class="mb-1">{{ user.nickname }}</h3>
            <p v-if="user.bio" class="text-sm text-muted-foreground">{{ user.bio }}</p>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4 py-4 border-y border-border/50 mb-4">
          <div class="text-center"><div class="font-medium">{{ user.stats?.posts ?? 0 }}</div><div class="text-xs text-muted-foreground">帖子</div></div>
          <div class="text-center"><div class="font-medium">{{ user.stats?.followers ?? 0 }}</div><div class="text-xs text-muted-foreground">粉丝</div></div>
          <div class="text-center"><div class="font-medium">{{ user.stats?.following ?? 0 }}</div><div class="text-xs text-muted-foreground">关注</div></div>
        </div>
        <div class="flex gap-3" v-if="user.id !== auth.user?.id">
          <button :disabled="isFollowLoading"
            class="flex-1 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
            :class="isFollowing ? 'bg-secondary hover:bg-accent' : 'bg-primary text-primary-foreground hover:bg-primary/90'"
            @click="toggleFollow">{{ isFollowing ? '取消关注' : '关注' }}</button>
          <button class="flex-1 py-2.5 bg-secondary rounded-xl text-sm hover:bg-accent transition-colors flex items-center justify-center gap-2"
            @click="router.push(`/messages/${user.id}`)">
            <MessageSquare class="w-4 h-4" />私信
          </button>
        </div>
      </div>

      <!-- 帖子列表 -->
      <div class="px-6 py-4">
        <h4 class="mb-3">他的帖子（{{ posts.length }}）</h4>
        <div v-if="posts.length" class="space-y-3">
          <PostCard v-for="post in posts" :key="post.id" :post="post" :show-message-action="false" @like="handleLike" @favorite="handleFavorite" />
        </div>
        <div v-else class="text-center py-8 text-muted-foreground text-sm">还没有发帖</div>
      </div>
    </template>
  </div>
</template>
