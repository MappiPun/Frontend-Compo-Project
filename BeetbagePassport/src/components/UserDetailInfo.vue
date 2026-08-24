<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  user?: User | null
}>()

const authStore = useAuthStore()
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

const activeUser = computed(() => props.user || authStore.currentUser)

function triggerFileInput() {
  fileInput.value?.click()
}

function compressImage(file: File, maxWidth = 200, maxHeight = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = (error) => reject(error)
    }
    reader.onerror = (error) => reject(error)
  })
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  const currentUserObj = activeUser.value
  if (!file || !currentUserObj || !currentUserObj.username) {
    alert('ไม่พบข้อมูล username ของผู้ใช้งาน')
    return
  }

  isUploading.value = true

  try {
    const base64Image = await compressImage(file)
    
    await authStore.updateProfile(currentUserObj.username, {
      profileImage: base64Image
    })
  } catch (error) {
    console.error('Upload profile image error:', error)
    alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ')
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div v-if="activeUser" class="flex flex-col md:flex-row items-center md:items-start gap-10 pl-4 pt-2">
    <div class="flex flex-col items-center gap-2">
      <div 
        @click="triggerFileInput" 
        class="relative w-48 h-48 min-w-48 bg-slate-400 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-inner overflow-hidden cursor-pointer group"
      >
        <img
          v-if="activeUser.profileImage"
          :src="activeUser.profileImage"
          alt="Profile"
          class="w-full h-full object-cover"
        />
        <span v-else>Profile pic</span>

        <div class="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          {{ isUploading ? 'Uploading...' : 'Change Photo' }}
        </div>
      </div>

      <input 
        ref="fileInput" 
        type="file" 
        accept="image/*" 
        class="hidden" 
        @change="handleFileUpload" 
      />

      <button 
        @click="triggerFileInput" 
        :disabled="isUploading"
        class="text-xs text-purple-600 hover:text-purple-700 font-medium hover:underline mt-1"
      >
        Upload new photo
      </button>
    </div>

    <div class="space-y-3 text-slate-800 text-sm md:text-base pt-2">
      <p>
        <span class="font-bold">Full Name:</span> {{ activeUser.name }} {{ activeUser.surname }}
      </p>
      <p>
        <span class="font-bold">Email:</span> {{ activeUser.email || 'N/A' }}
      </p>
      <p>
        <span class="font-bold">Phone:</span> {{ activeUser.phonenumber ? activeUser.phonenumber.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3') : 'N/A' }}
      </p>
      <p>
        <span class="font-bold">Province:</span> {{ activeUser.province || 'Bangkok' }}
      </p>
      <p>
        <span class="font-bold">Registered:</span> 15 August 2026
      </p>
    </div>
  </div>

  <div v-else class="p-8 text-slate-400 text-center">
    Loading user details...
  </div>
</template>