<script setup lang="ts">
import { h, reactive, watch, onMounted } from 'vue'
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
let formData = ref<Record<string,any>>({})
const tableDataMap = reactive<Record<string, any[]>>({}) // untuk menyimpan data tiap table

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
        set: (val) => (formData.value[component.key] = val)
      })
      return h('div', { class: 'flex flex-col mb-3' }, [
        component.text
          ? h('label', { class: 'text-sm mb-1 font-medium text-gray-400' }, component.text)
          : null,
        h('input', {
          type: component.type,
          class:
            'border rounded px-3 py-2 focus:ring focus:ring-blue-200 outline-none ' +
            (component.type === 'number' ? 'text-right' : ''),
          placeholder: component.place || '',
          value: model.value,
          onInput: (e: any) => (model.value = e.target.value)
        })
      ])

    case 'button':
      const color = component.color || (component.type === 'clear' ? 'gray' : 'blue')
      return h(
        'button',
        {
          class: `px-4 py-2 rounded mr-2 text-white bg-${color}-600 hover:bg-${color}-700 transition`,
          onClick: () => {
            const eventName = (component.event || component.type).toUpperCase()
            if (eventName == "ONCREATE") {
              CreateHandler({ ...formData })
            } else if (eventName == "ONUPDATE") {
              UpdateHandler({ ...formData })
            } else if (eventName == "ONDELETE") {
              DeleteHandler({ ...formData })
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
          // Ambil data dari tableDataMap berdasarkan key unik (misal key atau text)
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

const CreateHandler = async (data: any) => {
  console.log('CreateHandler:', data)
}

const UpdateHandler = async (data: any) => {
  const flow = parsedSchema.action?.onUpdate
  if (flow) {
    res = await Api.post('admin/execute-flow', {
      flow,
      menu: 'admin',
      ...data
    })
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
    formData.value = {} // reset

    // ✅ Setelah data diterima, langsung assign ke reactive state
    if (res?.data?.data) {
      const tableData = res?.data?.data // biasanya array

        // 🧠 Reset dan assign dengan cara reactive
        const firstRow = tableData
        for (const key in firstRow) {
          formData.value[key] = firstRow[key]
        }

      // Kalau ada komponen table di schema → isi tableDataMap
      const tableComponent = parsedSchema.components?.find(
        (x: any) => x.type === 'table'
      )
      if (tableComponent) {
        const key = tableComponent.key || tableComponent.text || 'table'
        tableDataMap[key] = tableData
      }
    } else {
      console.warn('Empty Data or Invalid structure: ', res)
    }
  } else {
    console.warn('No onRead flow defined.')
  }
}


const DeleteHandler = async (data: any) => {
  console.log('DeleteHandler:', data)
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
