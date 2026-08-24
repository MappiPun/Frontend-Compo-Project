import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ELearningContent {
  id: string
  title: string
  description: string
  level: number
  videoUrl: string
}

export const useELearningStore = defineStore('elearning', () => {
  const contents = ref<ELearningContent[]>([
    {
      id: '1',
      title: 'Introduction to Core Foundations',
      description: 'บทเรียนพื้นฐานสำหรับผู้เริ่มต้น Level 1',
      level: 1,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ])

  function addContent(content: Omit<ELearningContent, 'id'>) {
    const newItem: ELearningContent = {
      ...content,
      id: String(Date.now())
    }
    contents.value.push(newItem)
  }

  function deleteContent(id: string) {
    contents.value = contents.value.filter((item) => item.id !== id)
  }

  return { contents, addContent, deleteContent }
})