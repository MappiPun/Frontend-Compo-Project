import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface LevelItem {
  id: string
  level: number
  title: string
  passScore: number
  benefits?: Array<{ id: string; description: string }>
  services?: Array<{ id: string; name: string; badge: string; description: string }>
}

export const useLevelStore = defineStore('level', () => {
  const levels = ref<LevelItem[]>([
    { id: '1', level: 1, title: 'Beginner Passport', passScore: 2 },
    { id: '2', level: 2, title: 'Intermediate Passport', passScore: 2 },
    { id: '3', level: 3, title: 'Advanced Passport', passScore: 2 },
    { id: '4', level: 4, title: 'Expert Passport', passScore: 2 }
  ])

  return { levels }
})