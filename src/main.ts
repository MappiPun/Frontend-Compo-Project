import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { onUnauthorized } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useLevelStore } from '@/stores/level'
import { useToastStore } from '@/stores/toast'

import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// the backend rejected the token (expired, or the account has been deactivated) -> log out
onUnauthorized(() => {
  const auth = useAuthStore()
  if (!auth.user) return
  auth.logout()
  useLevelStore().reset()
  useToastStore().error('Your session has ended. Please sign in again.')
  router.push({ name: 'landing' })
})

app.mount('#app')
