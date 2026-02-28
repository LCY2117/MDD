import { createRouter, createWebHistory } from 'vue-router'
import { watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

// 需要登录才能访问的路径前缀
const AUTH_REQUIRED = [
  '/messages', '/profile', '/family', '/mood', '/ai-chat',
  '/diary', '/settings', '/notifications', '/publish', '/subscription',
]

// 懒加载所有页面
const WelcomePage = () => import('@/pages/WelcomePage.vue')
const LoginPage = () => import('@/pages/LoginPage.vue')
const HomePage = () => import('@/pages/HomePage.vue')
const CommunityPage = () => import('@/pages/CommunityPage.vue')
const PostDetailPage = () => import('@/pages/PostDetailPage.vue')
const PublishPage = () => import('@/pages/PublishPage.vue')
const ResourcesPage = () => import('@/pages/ResourcesPage.vue')
const ArticleDetailPage = () => import('@/pages/ArticleDetailPage.vue')
const MessagesPage = () => import('@/pages/MessagesPage.vue')
const MessageDetailPage = () => import('@/pages/MessageDetailPage.vue')
const ProfilePage = () => import('@/pages/ProfilePage.vue')
const ProfileEditPage = () => import('@/pages/ProfileEditPage.vue')
const UserProfilePage = () => import('@/pages/UserProfilePage.vue')
const FamilyModePage = () => import('@/pages/FamilyModePage.vue')
const FamilyBindingPage = () => import('@/pages/FamilyBindingPage.vue')
const FamilyIntroPage = () => import('@/pages/FamilyIntroPage.vue')
const FamilyMoodPage = () => import('@/pages/FamilyMoodPage.vue')
const MoodPage = () => import('@/pages/MoodPage.vue')
const AIChatPage = () => import('@/pages/AIChatPage.vue')
const SearchPage = () => import('@/pages/SearchPage.vue')
const SettingsPage = () => import('@/pages/SettingsPage.vue')
const NotificationsPage = () => import('@/pages/NotificationsPage.vue')
const NotificationSettingsPage = () => import('@/pages/NotificationSettingsPage.vue')
const PrivacySettingsPage = () => import('@/pages/PrivacySettingsPage.vue')
const DiaryEditorPage = () => import('@/pages/DiaryEditorPage.vue')
const DiaryListPage = () => import('@/pages/DiaryListPage.vue')
const HelpPage = () => import('@/pages/HelpPage.vue')
const SubscriptionPage = () => import('@/pages/SubscriptionPage.vue')
const AboutPage = () => import('@/pages/AboutPage.vue')
const NotFoundPage = () => import('@/pages/NotFoundPage.vue')

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/welcome', component: WelcomePage },
    { path: '/login', component: LoginPage },
    { path: '/', component: HomePage },
    { path: '/community', component: CommunityPage },
    { path: '/post/:id', component: PostDetailPage },
    { path: '/publish', component: PublishPage },
    { path: '/resources', component: ResourcesPage },
    { path: '/resources/article/:id', component: ArticleDetailPage },
    { path: '/messages', component: MessagesPage },
    { path: '/messages/:id', component: MessageDetailPage },
    { path: '/profile', component: ProfilePage },
    { path: '/profile/edit', component: ProfileEditPage },
    { path: '/user/:id', component: UserProfilePage },
    { path: '/family', redirect: '/family/mode' },
    { path: '/family/mode', component: FamilyModePage },
    { path: '/family/binding', component: FamilyBindingPage },
    { path: '/family/intro', component: FamilyIntroPage },
    { path: '/family/mood/:id', component: FamilyMoodPage },
    { path: '/mood', component: MoodPage },
    { path: '/ai-chat', component: AIChatPage },
    { path: '/search', component: SearchPage },
    { path: '/settings', component: SettingsPage },
    { path: '/notifications', component: NotificationsPage },
    { path: '/settings/notifications', component: NotificationSettingsPage },
    { path: '/settings/privacy', component: PrivacySettingsPage },
    { path: '/diary', component: DiaryListPage },
    { path: '/diary/new', component: DiaryEditorPage },
    { path: '/diary/:id', component: DiaryEditorPage },
    { path: '/help', component: HelpPage },
    { path: '/subscription', component: SubscriptionPage },
    { path: '/about', component: AboutPage },
    { path: '/:pathMatch(.*)*', component: NotFoundPage },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  // 等待 auth.init() 完成，避免刷新时 isAuthenticated 还是 false
  if (auth.isLoading) {
    await new Promise<void>(resolve => {
      const stop = watch(() => auth.isLoading, loading => {
        if (!loading) { stop(); resolve() }
      })
    })
  }
  const needsAuth = AUTH_REQUIRED.some(p => to.path.startsWith(p))
  if (needsAuth && !auth.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})
