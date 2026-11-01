<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import type { User, UserUpdatePayload } from '@/types'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import ProfileImageUpload from '@/components/ProfileImageUpload.vue'
import { MAX_LEVEL, PROVINCES } from '@/utils/constants'

/**
 * The form to edit the details of a user. The same component is used by the admin (user edit tab, with the level)
 * and by the user (own profile).
 */
const props = withDefaults(defineProps<{ user: User; showLevel?: boolean; saving?: boolean }>(), {
  showLevel: false,
  saving: false,
})
const emit = defineEmits<{ (e: 'save', payload: UserUpdatePayload): void; (e: 'cancel'): void }>()

const schema = toTypedSchema(
  yup.object({
    name: yup.string().trim().required('Name is required').max(100),
    surname: yup.string().trim().required('Surname is required').max(100),
    email: yup.string().trim().required('Email is required').email('Email is not valid'),
    phone: yup
      .string()
      .trim()
      .matches(/^$|^[0-9+\- ]{9,15}$/, 'Phone number is not valid (9-15 digits)')
      .default(''),
    province: yup.string().required('Please select a province'),
    profileImage: yup.string().default(''),
    level: yup.number().min(1).max(MAX_LEVEL).default(1),
  }),
)

function valuesOf(u: User) {
  return {
    name: u.name,
    surname: u.surname,
    email: u.email,
    phone: u.phone ?? '',
    province: u.province ?? '',
    profileImage: u.profileImage ?? '',
    level: u.level,
  }
}

const { defineField, handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
  initialValues: valuesOf(props.user),
})
watch(() => props.user, (u) => resetForm({ values: valuesOf(u) }))

const [name, nameAttrs] = defineField('name')
const [surname, surnameAttrs] = defineField('surname')
const [email, emailAttrs] = defineField('email')
const [phone, phoneAttrs] = defineField('phone')
const [province, provinceAttrs] = defineField('province')
const [profileImage] = defineField('profileImage')
const [level] = defineField('level')

const provinceOptions = computed(() => {
  const list = [...PROVINCES]
  if (props.user.province && !list.includes(props.user.province)) list.push(props.user.province)
  return list.sort().map((p) => ({ value: p, label: p }))
})
const levelOptions = Array.from({ length: MAX_LEVEL }, (_, i) => ({ value: i + 1, label: `Level ${i + 1}` }))

const submitted = ref(false)
const onSubmit = handleSubmit((values) => {
  submitted.value = true
  emit('save', {
    name: values.name,
    surname: values.surname,
    email: values.email,
    phone: values.phone ?? '',
    province: values.province,
    profileImage: values.profileImage ?? '',
    ...(props.showLevel ? { level: Number(values.level) } : {}),
  })
})
</script>

<template>
  <form class="card space-y-5" novalidate @submit.prevent="onSubmit">
    <ProfileImageUpload v-model="profileImage" :name="name" :surname="surname" />

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <BaseInput v-model="name" v-bind="nameAttrs" label="Name" placeholder="Name" :error="errors.name" />
      <BaseInput
        v-model="surname"
        v-bind="surnameAttrs"
        label="Surname"
        placeholder="Surname"
        :error="errors.surname"
      />
      <BaseInput
        v-model="email"
        v-bind="emailAttrs"
        type="email"
        label="Email"
        placeholder="name@example.com"
        :error="errors.email"
      />
      <BaseInput
        v-model="phone"
        v-bind="phoneAttrs"
        label="Phone number"
        placeholder="0812345678"
        :error="errors.phone"
      />
      <BaseSelect
        v-model="province"
        v-bind="provinceAttrs"
        label="Province"
        placeholder="Select a province"
        :options="provinceOptions"
        :error="errors.province"
      />
      <BaseSelect v-if="showLevel" v-model="level" label="Level" :options="levelOptions" />
    </div>

    <div class="flex justify-end gap-2">
      <button type="button" class="btn-secondary" @click="emit('cancel')">Cancel</button>
      <button type="submit" class="btn-primary" :disabled="saving">{{ saving ? 'Saving...' : 'Save changes' }}</button>
    </div>
  </form>
</template>
