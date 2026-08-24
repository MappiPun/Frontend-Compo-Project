import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import LandingView from '@/views/LandingView.vue'
import AdminView from '@/views/AdminView.vue'
import UserDashboardView from '@/views/UserDashboardView.vue'
import UserDetailView from '@/views/UserDetailView.vue'
import ELearningView from '@/views/ELearningView.vue'
import ExamView from '@/views/ExamView.vue'
import ServiceView from '@/views/ServiceView.vue'
import UserBadge from '@/components/UserBadge.vue'
import NotFoundView from '@/views/NotFoundView.vue'

import UserDetailInfo from '@/components/UserDetailInfo.vue'
import UserExamHistory from '@/components/UserExamHistory.vue'
import UserEdit from '@/components/UserEdit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      path: '/login',
      redirect: '/'
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/levels/:id',
      name: 'admin-level-detail',
      component: () => import('@/views/AdminLevelDetailView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/users/:id/info',
      name: 'admin-user-detail',
      component: UserDetailView,
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        {
          path: '',
          name: 'admin-user-detail-info',
          component: UserDetailInfo
        }
      ]
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
      path: '/user/services',
      name: 'user-services',
      component: ServiceView,
      meta: { requiresAuth: true, role: 'user' }
    },
    {
      path: '/users/profile',
      component: UserDetailView,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'user-detail',
          component: UserDetailInfo
        },
        {
          path: 'history',
          name: 'user-detail-history',
          component: UserExamHistory
        },
        {
          path: 'badges',
          name: 'user-detail-badges',
          component: UserBadge
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

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const user = authStore.currentUser

  if (to.name === 'register') {
    return next()
  }

  if (to.meta.requiresAuth && !user) {
    return next({ name: 'landing' })
  }

  if (to.name === 'landing' && user) {
    if (!user.name || !user.surname) {
      return next({ name: 'user-detail-edit' })
    }
    if (authStore.isAdmin) {
      return next({ name: 'admin' })
    } else {
      return next({ name: 'user-dashboard' })
    }
  }

  if (user && (!user.name || !user.surname) && to.name !== 'user-detail-edit') {
    return next({ name: 'user-detail-edit' })
  }

  if (to.meta.role && user?.role !== to.meta.role) {
    if (authStore.isAdmin) {
      return next({ name: 'admin' })
    } else {
      return next({ name: 'user-dashboard' })
    }
  }

  next()
})

export default router