<script setup lang="ts">
defineOptions({ inheritAttrs: false })

export interface SelectOption {
  value: string | number
  label: string
}

const model = defineModel<string | number | null | undefined>()
withDefaults(
  defineProps<{ options: SelectOption[]; label?: string; error?: string; placeholder?: string }>(),
  { label: '', error: '', placeholder: '' },
)
</script>

<template>
  <div>
    <label v-if="label" class="mb-1 block text-xs font-semibold text-slate-600">{{ label }}</label>
    <select v-bind="$attrs" v-model="model" class="input" :class="{ 'input-error': error }">
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
    <p v-if="error" class="mt-1 text-xs font-medium text-rose-600">{{ error }}</p>
  </div>
</template>
