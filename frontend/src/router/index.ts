import { createRouter, createWebHistory } from 'vue-router'

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
const UserProfilePage = () => import('@/pages/UserProfilePage.vue')
const FamilyModePage = () => import('@/pages/FamilyModePage.vue')
const FamilyBindingPage = () => import('@/pages/FamilyBindingPage.vue')
const MoodPage = () => import('@/pages/MoodPage.vue')
const AIChatPage = () => import('@/pages/AIChatPage.vue')
const SearchPage = () => import('@/pages/SearchPage.vue')
const SettingsPage = () => import('@/pages/SettingsPage.vue')
const NotificationsPage = () => import('@/pages/NotificationsPage.vue')
const DiaryEditorPage = () => import('@/pages/DiaryEditorPage.vue')
const DiaryListPage = () => import('@/pages/DiaryListPage.vue')
const HelpPage = () => import('@/pages/HelpPage.vue')
const SubscriptionPage = () => import('@/pages/SubscriptionPage.vue')
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
    { path: '/user/:id', component: UserProfilePage },
    { path: '/family', redirect: '/family/mode' },
    { path: '/family/mode', component: FamilyModePage },
    { path: '/family/binding', component: FamilyBindingPage },
    { path: '/mood', component: MoodPage },
    { path: '/ai-chat', component: AIChatPage },
    { path: '/search', component: SearchPage },
    { path: '/settings', component: SettingsPage },
    { path: '/notifications', component: NotificationsPage },
    { path: '/diary', component: DiaryListPage },
    { path: '/diary/new', component: DiaryEditorPage },
    { path: '/diary/:id', component: DiaryEditorPage },
    { path: '/help', component: HelpPage },
    { path: '/subscription', component: SubscriptionPage },
    { path: '/:pathMatch(.*)*', component: NotFoundPage },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})
