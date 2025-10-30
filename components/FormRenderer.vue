<script setup lang="ts">
import { h, reactive, ref, computed, onMounted, toRaw } from 'vue'
import TablePagination from './TablePagination.vue'

const props = defineProps({
  schema: {
    type: [Object, String],
    required: true
  },
  formtype: {
    type: String,
    default: 'form'
  }
})

const emit = defineEmits([])

/* 🧩 Parsing schema JSON string jika perlu */
const parsedSchema = reactive(
  typeof props.schema === 'string'
    ? JSON.parse(props.schema)
    : props.schema
)

/* 🧠 State untuk menyimpan input form dan data tabel */
let formData = ref<Record<string, any>>({})
const tableDataMap = reactive<Record<string, any[]>>({})
const validationErrors = reactive<Record<string, string>>({})

/* 🧩 Fungsi validasi */
function validateField(component: any, value: any) {
  if (!component.validated || !Array.isArray(component.validated)) return null
  let message = ''

  for (const rule of component.validated) {
    const [ruleName, ruleValue] = rule.split(':')

    switch (ruleName.toLowerCase()) {
      case 'empty':
        if (value === null || value === undefined || value === '')
          message = $t(`INVALID_ENTRY_EMPTY`, { entry: component.text || component.key })
        break

      case 'number':
        if (value !== '' && isNaN(Number(value)))
          message = $t(`INVALID_ENTRY_NUMBER`, { entry: component.text || component.key })
        break

      case 'email':
        if (
          value &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase())
        )
          message = $t(`INVALID_ENTRY_EMAIL`, { entry : component.text || component.key })
        break

      // 🧩 min / max
      case 'min':
        if (value !== undefined && value !== null && value !== '') {
          if (!isNaN(Number(value))) {
            if (Number(value) < Number(ruleValue))
              message = $t(`INVALID_ENTRY_MIN`, {entry : component.text || component.key, value: ruleValue})          
            } else if (String(value).length < Number(ruleValue))
              message = $t(`INVALID_ENTRY_MIN_CHAR`, {entry : component.text || component.key, value: ruleValue})          
        }
        break

      case 'max':
        if (value !== undefined && value !== null && value !== '') {
          if (!isNaN(Number(value))) {
            if (Number(value) > Number(ruleValue))
              message = $t(`INVALID_ENTRY_MAX`, {entry : component.text || component.key, value: ruleValue})          
            } else if (String(value).length < Number(ruleValue))
              message = $t(`INVALID_ENTRY_MAX_CHAR`, {entry : component.text || component.key, value: ruleValue})          
        }
        break

      // 🧩 regex
      case 'regex':
        try {
          const pattern = new RegExp(ruleValue)
          if (!pattern.test(String(value || '')))
            message = $t(`INVALID_ENTRY_FORMAT`, {entry : component.text || component.key})
        } catch (e) {
          console.warn('Invalid regex:', ruleValue)
        }
        break

      // 🧩 match:<field> → nilai harus sama dengan field lain
      case 'match':
        const otherField = ruleValue
        const otherValue = formData.value[otherField]
        if (value !== otherValue)
          message = $t(`INVALID_ENTRY_MATCH`, {entry : component.text || component.key, field: otherField})
        break
    }

    if (message) break
  }

  validationErrors[component.key] = message
  return !message
}

/* 🧩 Validasi semua field */
function validateAllFields() {
  let valid = true
  if (!parsedSchema.components) return true

  parsedSchema.components.forEach((comp: any) => {
    if (['text', 'password', 'number'].includes(comp.type)) {
      const value = formData.value[comp.key]
      const result = validateField(comp, value)
      if (!result) valid = false
    }
  })
  return valid
}

/* 🎯 Render komponen dasar */
function renderComponent(component: any) {
  switch (component.type) {
    case 'label':
      return h('div', { class: 'mb-2 text-gray-800 font-medium' }, component.text)

    case 'text':
    case 'password':
    case 'number':
      if (!(component.key in formData.value)) formData.value[component.key] = ''
      const model = computed({
        get: () => formData.value[component.key],
        set: (val) => {
          formData.value[component.key] = val
          validateField(component, val)
        }
      })
      return h('div', { class: 'flex flex-col mb-3' }, [
        component.text
          ? h('label', { class: 'text-sm mb-1 font-medium text-gray-400' }, component.text)
          : null,
        h('input', {
          type: component.type,
          class:
            'border rounded px-3 py-2 focus:ring focus:ring-blue-200 outline-none ' +
            (validationErrors[component.key] ? 'border-red-500' : 'border-gray-300') +
            ' ' +
            (component.type === 'number' ? 'text-right' : ''),
          placeholder: component.place || '',
          value: model.value,
          onInput: (e: any) => (model.value = e.target.value)
        }),
        validationErrors[component.key]
          ? h('span', { class: 'text-xs text-red-500 mt-1' }, validationErrors[component.key])
          : null
      ])

    case 'button':
      const color = component.color || (component.type === 'clear' ? 'gray' : 'blue')
      return h(
        'button',
        {
          class: `px-4 py-2 rounded mr-2 text-white bg-${color}-600 hover:bg-${color}-700 transition`,
          onClick: async () => {
            const eventName = (component.event || component.type).toUpperCase()
            if (eventName === 'ONCREATE') {
              if (validateAllFields()) await CreateHandler()
              else alert('⚠️ Validasi gagal! Periksa input Anda.')
            } else if (eventName === 'ONUPDATE') {
              if (validateAllFields()) await UpdateHandler()
              else alert('⚠️ Validasi gagal! Periksa input Anda.')
            } else if (eventName === 'ONDELETE') {
              await DeleteHandler()
            } else {
              emit(eventName, { ...formData })
            }
          }
        },
        component.text || component.type
      )

    default:
      return h('div', { class: 'text-gray-400 italic' }, `Unsupported: ${component.type}`)
  }
}

/* 🧱 Render kontainer seperti form, table, details */
function renderContainer(container: any) {
  if (!container?.components) return null
  return h('div', {},
    container.components.map((component: any, index: number) => {
      switch (component.type) {
        case 'table':
          const key = component.key || component.text || `table-${index}`
          const currentData = tableDataMap[key] ?? component.defaultValue ?? []
          return h('div', { key: index, class: 'my-4' }, [
            h('h2', { class: 'text-lg font-semibold mb-2' }, component.text || 'Table'),
            h(TablePagination, {
              title: component.text ?? 'Data',
              columns:
                component.columns?.map((col: any, i: number) => ({
                  label: col.text || `Column ${i + 1}`,
                  key: col.key || `col${i + 1}`,
                  type: col.type || 'text'
                })) ?? [],
              data: currentData,
              bordered: true,
              striped: true,
              hover: true,
              perPage: 10
            })
          ])

        case 'details':
          return h('div', { key: index, class: 'border rounded p-4 bg-gray-50 mt-4' }, [
            h('h3', { class: 'text-md font-semibold mb-2' }, component.text || 'Details'),
            component.details?.map((detail: any, idx: number) =>
              h('div', { key: idx, class: 'mb-3' }, [
                detail.text ? h('div', { class: 'font-medium' }, detail.text) : null,
                detail.components?.map((child: any) =>
                  ['table', 'details'].includes(child.type)
                    ? renderContainer(child)
                    : renderComponent(child)
                )
              ])
            )
          ])

        default:
          return renderComponent(component)
      }
    })
  )
}

/* 🧠 API Handler */
const Api = useApi()
let res: any

const CreateHandler = async () => {
  console.log('Create triggered', toRaw(formData.value))
}

const UpdateHandler = async () => {
  const flow = parsedSchema.action?.onUpdate
  if (flow) {
    const payload = { ...toRaw(formData.value) }
    const dataForm = new FormData()
    dataForm.append('flow', flow)
    dataForm.append('menu', 'admin')
    dataForm.append('search', 'true')

    for (const key in payload) {
      const val = payload[key]
      if (val !== undefined && val !== null) {
        if (typeof val === 'object') dataForm.append(key, JSON.stringify(val))
        else dataForm.append(key, val)
      }
    }

    res = await Api.post('admin/execute-flow', dataForm)
    console.log('Update result:', res)
  } else {
    alert('Invalid Flow ' + flow)
  }
}

const ReadHandler = async () => {
  const flow = parsedSchema.action?.onRead
  if (flow) {
    const dataForm = new FormData()
    dataForm.append('flow', flow)
    dataForm.append('menu', 'admin')
    dataForm.append('search', 'true')

    const res = await Api.post('admin/execute-flow', dataForm)
    formData.value = {}
    if (res?.data?.data) {
      const tableData = res?.data?.data
      const firstRow = tableData
      for (const key in firstRow) formData.value[key] = firstRow[key]
      const tableComponent = parsedSchema.components?.find((x: any) => x.type === 'table')
      if (tableComponent) {
        const key = tableComponent.key || tableComponent.text || 'table'
        tableDataMap[key] = tableData
      }
    }
  }
}

const DeleteHandler = async () => {
  console.log('Delete triggered')
}

/* 🚀 Lifecycle */
onMounted(() => {
  ReadHandler()
})
</script>

<template>
  <div>
    <component :is="renderContainer(parsedSchema)" />
  </div>
</template>

<style scoped>
fieldset legend {
  padding: 0 6px;
}
</style>
