<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const model = defineModel<string | number | undefined>()
withDefaults(defineProps<{ label?: string; error?: string; multiline?: boolean }>(), {
  label: '',
  error: '',
  multiline: false,
})
</script>

<template>
  <div>
    <label v-if="label" class="mb-1 block text-xs font-semibold text-slate-600">{{ label }}</label>
    <textarea
      v-if="multiline"
      v-bind="$attrs"
      v-model="model"
      rows="3"
      class="input"
      :class="{ 'input-error': error }"
    />
    <input v-else v-bind="$attrs" v-model="model" class="input" :class="{ 'input-error': error }" />
    <p v-if="error" class="mt-1 text-xs font-medium text-rose-600">{{ error }}</p>
  </div>
</template>
