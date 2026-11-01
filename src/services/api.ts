import axios from 'axios'

export const TOKEN_KEY = 'token'

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
})

// the interceptor attaches the JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// when the token is rejected (expired, or the user has been deactivated) the app logs the user out
let unauthorizedHandler: (() => void) | null = null
export function onUnauthorized(handler: () => void) {
  unauthorizedHandler = handler
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? ''
    const isAuthCall = url.includes('/auth/login') || url.includes('/auth/register')
    if (error.response?.status === 401 && !isAuthCall && unauthorizedHandler) {
      unauthorizedHandler()
    }
    return Promise.reject(error)
  },
)

/** the message sent by the backend ({"message": ...}) or a default text */
export function errorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Cannot connect to the server. If it was idle, wait a minute and try again.'
    const data = error.response.data as { message?: string } | undefined
    return data?.message ?? fallback
  }
  return fallback
}

export default apiClient
