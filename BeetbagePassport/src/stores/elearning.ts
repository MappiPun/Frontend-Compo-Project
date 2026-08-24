import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export interface ELearningContent {
  id: string
  title: string
  description: string
  level: number
  videoUrl: string
}

const API_URL = 'http://localhost:3000/elearning'

export const useELearningStore = defineStore('elearning', () => {
  const contents = ref<ELearningContent[]>([])

  async function fetchContents() {
    try {
      const res = await axios.get<ELearningContent[]>(API_URL)
      contents.value = res.data
    } catch (err) {
      console.error('Failed to fetch elearning contents:', err)
    }
  }

  async function addContent(content: Omit<ELearningContent, 'id'>) {
    try {
      const res = await axios.post<ELearningContent>(API_URL, content)
      contents.value.push(res.data)
    } catch (err) {
      console.error('Failed to add elearning content:', err)
    }
  }

  async function deleteContent(id: string) {
    try {
      await axios.delete(`${API_URL}/${id}`)
      contents.value = contents.value.filter((item) => item.id !== id)
    } catch (err) {
      console.error('Failed to delete elearning content:', err)
    }
  }

  return { contents, fetchContents, addContent, deleteContent }
})