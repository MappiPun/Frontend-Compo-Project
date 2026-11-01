import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import LandingView from '@/views/LandingView.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import UserLayout from '@/layouts/UserLayout.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
    role?: 'admin' | 'user'
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ------------------------------------------------------------ public
    { path: '/', name: 'landing', component: LandingView, meta: { guestOnly: true } },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guestOnly: true },
    },

    // ------------------------------------------------------------ admin
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, role: 'admin' },
      redirect: { name: 'admin-users' },
      children: [
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/views/admin/UserListView.vue'),
        },
        {
          path: 'users/:id',
          component: () => import('@/views/admin/UserDetailLayout.vue'),
          props: true,
          children: [
            { path: '', redirect: (to) => ({ name: 'admin-user-info', params: { id: to.params.id } }) },
            {
              path: 'info',
              name: 'admin-user-info',
              component: () => import('@/views/admin/UserInfoView.vue'),
            },
            {
              path: 'level',
              name: 'admin-user-level',
              component: () => import('@/views/admin/UserLevelView.vue'),
            },
            {
              path: 'edit',
              name: 'admin-user-edit',
              component: () => import('@/views/admin/UserEditView.vue'),
            },
          ],
        },
        {
          path: 'levels',
          name: 'admin-levels',
          component: () => import('@/views/admin/LevelListView.vue'),
        },
        {
          path: 'levels/:level',
          name: 'admin-level-detail',
          component: () => import('@/views/admin/LevelDetailView.vue'),
          props: true,
        },
        {
          path: 'levels/:level/edit',
          name: 'admin-level-edit',
          component: () => import('@/views/admin/LevelEditView.vue'),
          props: true,
        },
        {
          path: 'questions',
          name: 'admin-questions',
          component: () => import('@/views/admin/QuestionListView.vue'),
        },
        {
          path: 'questions/new',
          name: 'admin-question-new',
          component: () => import('@/views/admin/QuestionFormView.vue'),
        },
        {
          path: 'questions/:id/edit',
          name: 'admin-question-edit',
          component: () => import('@/views/admin/QuestionFormView.vue'),
          props: true,
        },
        {
          path: 'elearning',
          name: 'admin-elearning',
          component: () => import('@/views/admin/ELearningAdminView.vue'),
        },
      ],
    },

    // ------------------------------------------------------------ user
    {
      path: '/user',
      component: UserLayout,
      meta: { requiresAuth: true, role: 'user' },
      children: [
        { path: '', name: 'user-home', component: () => import('@/views/user/HomeView.vue') },
        { path: 'elearning', name: 'user-elearning', component: () => import('@/views/user/ELearningView.vue') },
        { path: 'exam', name: 'user-exam', component: () => import('@/views/user/ExamView.vue') },
        {
          path: 'profile',
          component: () => import('@/views/user/ProfileLayout.vue'),
          children: [
            { path: '', redirect: { name: 'user-profile-details' } },
            {
              path: 'details',
              name: 'user-profile-details',
              component: () => import('@/views/user/ProfileDetailsView.vue'),
            },
            {
              path: 'history',
              name: 'user-profile-history',
              component: () => import('@/views/user/ProfileHistoryView.vue'),
            },
            {
              path: 'badges',
              name: 'user-profile-badges',
              component: () => import('@/views/user/ProfileBadgesView.vue'),
            },
            {
              path: 'services',
              name: 'user-profile-services',
              component: () => import('@/views/user/ProfileServicesView.vue'),
            },
            {
              path: 'edit',
              name: 'user-profile-edit',
              component: () => import('@/views/user/ProfileEditView.vue'),
            },
          ],
        },
      ],
    },

    // ------------------------------------------------------------ 404
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

/** the navigation guard: login + role are checked before every navigation */
router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.restore() // keeps the login after the page is reloaded

  const home = auth.isAdmin ? { name: 'admin-users' } : { name: 'user-home' }

  if (to.meta.requiresAuth && !auth.user) {
    return { name: 'landing' }
  }
  if (to.meta.guestOnly && auth.user) {
    return home
  }
  if (to.meta.role && auth.user && auth.user.role !== to.meta.role) {
    return home // a user cannot open the admin pages and vice versa
  }
  return true
})

export default router
