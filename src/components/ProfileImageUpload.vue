<script setup lang="ts">
import { ref } from 'vue'
import UploadService from '@/services/UploadService'
import { errorMessage } from '@/services/api'
import AppAvatar from '@/components/AppAvatar.vue'

/** v-model = the url of the image. The file is uploaded to the cloud storage as soon as it is selected. */
const model = defineModel<string>({ default: '' })
withDefaults(defineProps<{ name?: string; surname?: string; error?: string }>(), { name: '', surname: '', error: '' })

const uploading = ref(false)
const message = ref('')

async function onFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  message.value = ''
  if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
    message.value = 'Only JPG, PNG, GIF or WEBP images are allowed'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    message.value = 'The image must be smaller than 5 MB'
    return
  }
  uploading.value = true
  try {
    model.value = await UploadService.uploadImage(file)
  } catch (e) {
    message.value = errorMessage(e, 'Cannot upload the image')
  } finally {
    uploading.value = false
    input.value = ''
  }
}
</script>

<template>
  <div class="flex items-center gap-4">
    <AppAvatar :src="model" :name="name" :surname="surname" :size="72" />
    <div>
      <label class="btn-secondary" :class="{ 'pointer-events-none opacity-50': uploading }">
        {{ uploading ? 'Uploading...' : 'Choose profile image' }}
        <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" class="hidden" @change="onFile" />
      </label>
      <p class="mt-1 text-xs text-slate-400">JPG, PNG, GIF or WEBP, up to 5 MB</p>
      <p v-if="message || error" class="mt-1 text-xs font-medium text-rose-600">{{ message || error }}</p>
    </div>
  </div>
</template>
