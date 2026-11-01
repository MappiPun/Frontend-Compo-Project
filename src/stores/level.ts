import { defineStore } from 'pinia'
import { ref } from 'vue'
import LevelService from '@/services/LevelService'
import type { Level, LevelUpdatePayload } from '@/types'

export const useLevelStore = defineStore('level', () => {
  const levels = ref<Level[]>([])
  const loaded = ref(false)

  async function fetchLevels(force = false) {
    if (loaded.value && !force) return
    levels.value = (await LevelService.list()).data
    loaded.value = true
  }

  function getLevel(n: number): Level | undefined {
    return levels.value.find((l) => l.level === n)
  }

  async function updateLevel(n: number, payload: LevelUpdatePayload) {
    const updated = (await LevelService.update(n, payload)).data
    const index = levels.value.findIndex((l) => l.level === n)
    if (index >= 0) levels.value[index] = updated
    return updated
  }

  function reset() {
    levels.value = []
    loaded.value = false
  }

  return { levels, loaded, fetchLevels, getLevel, updateLevel, reset }
})
