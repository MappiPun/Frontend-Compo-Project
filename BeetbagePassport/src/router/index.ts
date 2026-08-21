import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import LoginView from '@/views/LoginView.vue'
import AdminView from '@/views/AdminView.vue'
import UserDashboardView from '@/views/UserDashboardView.vue'
import UserDetailView from '@/views/UserDetailView.vue'
import ELearningView from '@/views/ELearningView.vue'
import ExamView from '@/views/ExamView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

import UserDetailInfo from '@/components/UserDetailInfo.vue'
import UserExamHistory from '@/components/UserExamHistory.vue'
import UserEdit from '@/components/UserEdit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/user',
      name: 'user-dashboard',
      component: UserDashboardView,
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/user/elearning',
      name: 'user-elearning',
      component: ELearningView,
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/user/exam',
      name: 'user-exam',
      component: ExamView,
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/users/:id',
      name: 'user-detail',
      component: UserDetailView,
      props: true,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'user-detail-info',
          component: UserDetailInfo
        },
        {
          path: 'history',
          name: 'user-detail-history',
          component: UserExamHistory
        },
        {
          path: 'edit',
          name: 'user-detail-edit',
          component: UserEdit
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView
    }
  ]
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.currentUser) {
    return next({ name: 'login' })
  }

  if (to.meta.role && authStore.currentUser?.role !== to.meta.role) {
    // Redirect if role doesn't match
    return next(authStore.currentUser?.role === 'admin' ? { name: 'admin' } : { name: 'user-dashboard' })
  }

  next()
})

export default router