import { createBrowserRouter } from 'react-router';
import { RootLayout } from './components/root-layout';

// 页面组件
import WelcomePage from './pages/welcome';
import LoginPage from './pages/login';
import HomePage from './pages/home';
import CommunityPage from './pages/community';
import PostDetailPage from './pages/post-detail';
import PublishPage from './pages/publish';
import ResourcesPage from './pages/resources';
import MessagesPage from './pages/messages';
import ProfilePage from './pages/profile';
import FamilyModePage from './pages/family-mode';
import FamilyPage from './pages/family';
import SubscriptionPage from './pages/subscription';
import NotFoundPage from './pages/not-found';

// 设置相关
import SettingsPage from './pages/settings';
import PrivacySettingsPage from './pages/settings/privacy';
import NotificationsSettingsPage from './pages/settings/notifications';
import AccountSettingsPage from './pages/settings/account';
import SecuritySettingsPage from './pages/settings/security';
import DisplaySettingsPage from './pages/settings/display';
import TermsPage from './pages/settings/terms';
import UserModeSettingsPage from './pages/settings/user-mode';

// 个人内容
import MyPostsPage from './pages/profile/posts';
import LikedPostsPage from './pages/profile/liked';
import MyCommentsPage from './pages/profile/comments';

// 其他页面
import MoodPage from './pages/mood';
import HelpPage from './pages/help';
import AIChatPage from './pages/ai-chat';
import ArticleDetailPage from './pages/resources/article';
import UserProfilePage from './pages/user-profile';
import MessageDetailPage from './pages/message-detail';
import SearchPage from './pages/search';
import NotificationsPage from './pages/notifications';
import DiaryEditorPage from './pages/diary-editor';
import FamilyBindingPage from './pages/family-binding';
import FamilyAlertsPage from './pages/family-alerts';
import MessageSettingsPage from './pages/message-settings';
import FamilyInvitePage from './pages/family/invite';
import FamilySettingsPage from './pages/family/settings';
import FamilyEncouragePage from './pages/family/encourage';
import FamilyMoodDetailPage from './pages/family/mood-detail';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/welcome',
        element: <WelcomePage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/community',
        element: <CommunityPage />,
      },
      {
        path: '/post/:id',
        element: <PostDetailPage />,
      },
      {
        path: '/publish',
        element: <PublishPage />,
      },
      {
        path: '/resources',
        element: <ResourcesPage />,
      },
      {
        path: '/resources/article/:id',
        element: <ArticleDetailPage />,
      },
      {
        path: '/messages',
        element: <MessagesPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/profile/posts',
        element: <MyPostsPage />,
      },
      {
        path: '/profile/liked',
        element: <LikedPostsPage />,
      },
      {
        path: '/profile/comments',
        element: <MyCommentsPage />,
      },
      {
        path: '/family-mode',
        element: <FamilyModePage />,
      },
      {
        path: '/family',
        element: <FamilyPage />,
      },
      {
        path: '/subscription',
        element: <SubscriptionPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      {
        path: '/settings/privacy',
        element: <PrivacySettingsPage />,
      },
      {
        path: '/settings/notifications',
        element: <NotificationsSettingsPage />,
      },
      {
        path: '/settings/account',
        element: <AccountSettingsPage />,
      },
      {
        path: '/settings/security',
        element: <SecuritySettingsPage />,
      },
      {
        path: '/settings/display',
        element: <DisplaySettingsPage />,
      },
      {
        path: '/settings/terms',
        element: <TermsPage />,
      },
      {
        path: '/settings/user-mode',
        element: <UserModeSettingsPage />,
      },
      {
        path: '/mood',
        element: <MoodPage />,
      },
      {
        path: '/help',
        element: <HelpPage />,
      },
      {
        path: '/ai-chat',
        element: <AIChatPage />,
      },
      {
        path: '/user/:id',
        element: <UserProfilePage />,
      },
      {
        path: '/messages/:id',
        element: <MessageDetailPage />,
      },
      {
        path: '/search',
        element: <SearchPage />,
      },
      {
        path: '/notifications',
        element: <NotificationsPage />,
      },
      {
        path: '/diary/new',
        element: <DiaryEditorPage />,
      },
      {
        path: '/diary/:id',
        element: <DiaryEditorPage />,
      },
      {
        path: '/family-binding',
        element: <FamilyBindingPage />,
      },
      {
        path: '/family-alerts',
        element: <FamilyAlertsPage />,
      },
      {
        path: '/message-settings',
        element: <MessageSettingsPage />,
      },
      {
        path: '/family/invite',
        element: <FamilyInvitePage />,
      },
      {
        path: '/family/settings',
        element: <FamilySettingsPage />,
      },
      {
        path: '/family/encourage',
        element: <FamilyEncouragePage />,
      },
      {
        path: '/family/mood-detail',
        element: <FamilyMoodDetailPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);