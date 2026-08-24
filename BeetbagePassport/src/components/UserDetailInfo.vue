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
const isEditing = ref(false)

const activeUser = computed(() => props.user || authStore.currentUser)
const isAdmin = computed(() => authStore.isAdmin)

const editForm = ref({
  name: '',
  surname: '',
  email: '',
  phonenumber: '',
  province: ''
})

function triggerFileInput() {
  if (isAdmin.value) return
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
  if (isAdmin.value) return
  
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

function openEditModal() {
  if (!activeUser.value) return
  editForm.value = {
    name: activeUser.value.name || '',
    surname: activeUser.value.surname || '',
    email: activeUser.value.email || '',
    phonenumber: activeUser.value.phonenumber || '',
    province: activeUser.value.province || 'Bangkok'
  }
  isEditing.value = true
}

async function saveProfileEdit() {
  if (!activeUser.value?.username) return

  try {
    await authStore.updateProfile(activeUser.value.username, {
      ...editForm.value
    })
    isEditing.value = false
  } catch (error) {
    console.error('Update profile error:', error)
    alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูลโปรไฟล์')
  }
}
</script>

<template>
  <div v-if="activeUser" class="flex flex-col md:flex-row items-center md:items-start gap-10 pl-4 pt-2">
    <div class="flex flex-col items-center gap-3">
      <div 
        @click="triggerFileInput" 
        :class="[
          'relative w-44 h-44 bg-slate-300 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-inner overflow-hidden border-2 border-slate-200',
          !isAdmin ? 'cursor-pointer group' : ''
        ]"
      >
        <img
          v-if="activeUser.profileImage"
          :src="activeUser.profileImage"
          alt="Profile"
          class="w-full h-full object-cover"
        />
        <span v-else class="text-slate-600 font-semibold text-sm">Profile pic</span>

        <div 
          v-if="!isAdmin"
          class="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {{ isUploading ? 'Uploading...' : 'Change Photo' }}
        </div>
      </div>

      <input 
        v-if="!isAdmin"
        ref="fileInput" 
        type="file" 
        accept="image/*" 
        class="hidden" 
        @change="handleFileUpload" 
      />

      <button 
        v-if="!isAdmin"
        @click="triggerFileInput" 
        :disabled="isUploading"
        type="button"
        class="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg border border-purple-200 transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        {{ isUploading ? 'Uploading...' : 'Upload new photo' }}
      </button>
    </div>

    <div class="flex-1 space-y-3 text-slate-800 text-sm md:text-base pt-1 w-full">
      <div class="flex items-center justify-between pb-2 border-b border-slate-200">
        <h3 class="font-bold text-slate-900 text-lg">Profile Details</h3>
        <button 
          @click="openEditModal"
          class="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
        >
          Edit Profile
        </button>
      </div>

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

    <!-- Edit Profile Modal -->
    <div v-if="isEditing" class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4">
        <h3 class="text-lg font-bold text-slate-900">Edit Profile</h3>
        
        <div class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-medium text-slate-600 mb-1">First Name</label>
              <input v-model="editForm.name" type="text" class="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>
            <div>
              <label class="block font-medium text-slate-600 mb-1">Surname</label>
              <input v-model="editForm.surname" type="text" class="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>
          </div>
          <div>
            <label class="block font-medium text-slate-600 mb-1">Email</label>
            <input v-model="editForm.email" type="email" class="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500" />
          </div>
          <div>
            <label class="block font-medium text-slate-600 mb-1">Phone Number</label>
            <input v-model="editForm.phonenumber" type="text" class="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500" />
          </div>
          <div>
            <label class="block font-medium text-slate-600 mb-1">Province</label>
            <input v-model="editForm.province" type="text" class="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500" />
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button @click="isEditing = false" class="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
          <button @click="saveProfileEdit" class="px-4 py-1.5 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-xs">Save Changes</button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="p-8 text-slate-400 text-center">
    Loading user details...
  </div>
</template>