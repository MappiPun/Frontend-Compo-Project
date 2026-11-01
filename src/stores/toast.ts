import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: number
  type: 'success' | 'error'
  text: string
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  let next = 1

  function show(type: Toast['type'], text: string) {
    const id = next++
    toasts.value.push({ id, type, text })
    setTimeout(() => dismiss(id), 4000)
  }
  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }
  return {
    toasts,
    success: (text: string) => show('success', text),
    error: (text: string) => show('error', text),
    dismiss,
  }
})
