<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Search as SearchIcon, User, FileText, Hash } from 'lucide-vue-next'
import PostCard from '@/components/community/PostCard.vue'
import type { Post } from '@/components/community/PostCard.vue'
import { searchApi } from '@/lib/api'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()

const query = ref((route.query.q as string) || '')
const activeTab = ref<'all' | 'posts' | 'users' | 'tags'>('all')
const isLoading = ref(false)
const results = ref<{ posts: Post[]; users: Array<{ id: string; nickname: string; avatar?: string; bio?: string }>; tags: string[] }>({ posts: [], users: [], tags: [] })

const hotSearches = ['抑郁症', '焦虑', '睡眠', '心理咨询', '用药经验', '家人支持', '复学复工', '康复日记']

async function doSearch() {
  if (!query.value.trim()) { results.value = { posts: [], users: [], tags: [] }; return }
  isLoading.value = true
  try {
    const res = await searchApi.search(query.value.trim())
    results.value = res.data as typeof results.value
  } catch { toast.error('搜索失败') }
  finally { isLoading.value = false }
}

watch(query, (val) => { if (val) doSearch() }, { debounce: 300 } as any)

function handleHotSearch(term: string) { query.value = term; doSearch() }
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部 -->
    <div class="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border/50">
      <div class="flex items-center gap-3">
        <button class="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0" @click="router.back()"><ArrowLeft class="w-5 h-5" /></button>
        <div class="flex-1 relative">
          <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input v-model="query" type="text" placeholder="搜索帖子、用户、话题..."
            class="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            autofocus @keydown.enter="doSearch" />
        </div>
      </div>
    </div>

    <!-- 未搜索时展示热搜 -->
    <div v-if="!query" class="px-6 py-4">
      <h4 class="mb-3">热门话题</h4>
      <div class="flex flex-wrap gap-2">
        <button v-for="term in hotSearches" :key="term"
          class="px-4 py-2 bg-card border border-border/50 rounded-xl text-sm hover:bg-secondary transition-colors"
          @click="handleHotSearch(term)">
          <span class="text-muted-foreground mr-1">#</span>{{ term }}
        </button>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-else class="px-6 py-4">
      <!-- 加载中 -->
      <div v-if="isLoading" class="space-y-3">
        <div v-for="i in 4" :key="i" class="h-16 bg-card rounded-2xl animate-pulse border border-border/50" />
      </div>

      <!-- 结果 -->
      <template v-else>
        <!-- 标签页 -->
        <div class="flex gap-2 mb-4">
          <button v-for="t in [{ id: 'all', label: '全部' }, { id: 'posts', label: '帖子' }, { id: 'users', label: '用户' }, { id: 'tags', label: '话题' }]" :key="t.id"
            class="px-4 py-2 rounded-xl text-sm transition-colors"
            :class="activeTab === t.id ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-accent'"
            @click="activeTab = (t.id as typeof activeTab.value)">{{ t.label }}</button>
        </div>

        <!-- 帖子 -->
        <div v-if="(activeTab === 'all' || activeTab === 'posts') && results.posts.length" class="mb-4">
          <h4 class="text-muted-foreground mb-2">帖子</h4>
          <div class="space-y-3">
            <PostCard v-for="post in results.posts.slice(0, activeTab === 'all' ? 3 : results.posts.length)" :key="post.id" :post="post" />
          </div>
        </div>

        <!-- 用户 -->
        <div v-if="(activeTab === 'all' || activeTab === 'users') && results.users.length" class="mb-4">
          <h4 class="text-muted-foreground mb-2">用户</h4>
          <div class="space-y-2">
            <button v-for="user in results.users.slice(0, activeTab === 'all' ? 3 : results.users.length)" :key="user.id"
              class="w-full bg-card rounded-xl p-3 border border-border/50 flex items-center gap-3 hover:bg-secondary transition-colors"
              @click="router.push(`/user/${user.id}`)">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img v-if="user.avatar" :src="user.avatar" alt="" class="w-full h-full object-cover" />
                <span v-else class="text-primary font-medium">{{ user.nickname[0] }}</span>
              </div>
              <div class="flex-1 text-left">
                <p class="font-medium">{{ user.nickname }}</p>
                <p v-if="user.bio" class="text-sm text-muted-foreground truncate">{{ user.bio }}</p>
              </div>
              <User class="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <!-- 话题标签 -->
        <div v-if="(activeTab === 'all' || activeTab === 'tags') && results.tags.length" class="mb-4">
          <h4 class="text-muted-foreground mb-2">相关话题</h4>
          <div class="flex flex-wrap gap-2">
            <button v-for="tag in results.tags" :key="tag"
              class="px-4 py-2 bg-card border border-border/50 rounded-xl text-sm hover:bg-secondary transition-colors flex items-center gap-1"
              @click="query = tag; doSearch()">
              <Hash class="w-3.5 h-3.5 text-muted-foreground" />{{ tag }}
            </button>
          </div>
        </div>

        <!-- 无结果 -->
        <div v-if="!results.posts.length && !results.users.length && !results.tags.length" class="text-center py-12">
          <SearchIcon class="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p class="text-muted-foreground">没有找到"{{ query }}"的相关结果</p>
        </div>
      </template>
    </div>
  </div>
</template>
