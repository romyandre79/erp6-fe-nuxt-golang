<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useApi } from '~/composables/useApi'

interface Option {
  label: string
  value: string | number
}

interface Props {
  component: {
    key: string
    label: string
    text?: string
    source?: string
    place?: string
    valueField?: string // opsional: jika value-nya beda dari key utama
  }
  formData: Ref<Record<string, any>>
  validationErrors: Record<string, string>
  validateField: (component: any, val: any) => void
}

const props = defineProps<Props>()
const Api = useApi()

// Pastikan key ada di formData
if (!(props.component.key in props.formData.value))
  props.formData.value[props.component.key] = ''

const options = ref<Option[]>([])
const loading = ref(false)

// 🔹 Ambil data dari API
onMounted(async () => {
  if (!props.component.source) return
  loading.value = true

  try {
    const dataForm = new FormData()
    dataForm.append('flow', props.component.source)
    dataForm.append('menu', 'admin')
    dataForm.append('search', 'true')

    const res = await Api.post('admin/execute-flow', dataForm)

    if (res.code === 200 && Array.isArray(res.data?.data)) {
      const labelField = props.component.label || 'label'
      const valueField = props.component.valueField || props.component.key || 'value'

      options.value = res.data.data.map((item: Record<string, any>) => ({
        label: item[labelField],
        value: item[valueField]
      }))

    } else {
      console.error('Gagal ambil data untuk select:', res?.message)
    }
  } catch (err) {
    console.error('Error fetch data select:', err)
  }

  loading.value = false
})

// 🔹 Computed dua arah
const modelSelect = computed({
  get: () => props.formData.value[props.component.key],
  set: (val) => {
    props.formData.value[props.component.key] =
      typeof val === 'string' && !isNaN(Number(val)) ? Number(val) : val
    props.validateField(props.component, val)
  }
})

// 🔹 Sinkronisasi value setelah options siap
watch(options, (newOptions) => {
  if (!newOptions.length) return

  const key = props.component.key
  const val = props.formData.value[key]

  if (val != null && val !== '') {
    const exists = newOptions.some(o => o.value == val)
    if (!exists) {
      console.warn(`⚠️ Value '${val}' tidak ditemukan di options untuk ${key}`)
      // Bisa direset kalau mau:
      // props.formData.value[key] = ''
    } else {
      // force reactivity update agar USelect sinkron
      props.formData.value[key] = val
    }
  }
})

// 🔹 Jika formData diubah dari luar (misal via ReadHandler)
watch(
  () => props.formData.value[props.component.key],
  (val) => {
    if (options.value.length > 0) {
      const exists = options.value.some(o => o.value == val)
      if (!exists && val) {
        console.warn(`⚠️ Value '${val}' belum ada di options saat ini untuk ${props.component.key}`)
      }
    }
  }
)
</script>

<template>
  <div class="flex flex-col mb-3">
    <label v-if="component.text" class="mb-1 text-gray-400 text-sm font-medium">
      {{ $t(component.text.toUpperCase()) }}
    </label>

    <USelect
      v-model="modelSelect"
      :items="options"
      :loading="loading"
      :placeholder="component.place || $t('CHOOSE')"
      class="w-full dark:bg-gray-900 dark:border-gray-700 px-3 py-2 focus:ring focus:ring-blue-200 outline-none border-gray-300"
      :disabled="loading"
    />

    <span v-if="validationErrors[component.key]" class="text-xs text-red-500 mt-1">
      {{ validationErrors[component.key] }}
    </span>
  </div>
</template>
