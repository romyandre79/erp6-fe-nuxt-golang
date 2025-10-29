<script setup lang="ts">
import { h, reactive, watch } from 'vue'
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

const emit = defineEmits(['onRead', 'onCreate', 'onUpdate', 'onPurge', 'onClear'])

/* 🧩 Parsing schema JSON string jika perlu */
const parsedSchema = reactive(
  typeof props.schema === 'string'
    ? JSON.parse(props.schema)
    : props.schema
)

/* 🧠 State untuk menyimpan input form */
const formData = reactive({})

/* 🎯 Render komponen dasar */
function renderComponent(component: any) {
  switch (component.type) {
    case 'label':
      return h('div', { class: 'mb-2 text-gray-800 font-medium' }, component.text)

    case 'text':
    case 'number':
      return h('div', { class: 'flex flex-col mb-3' }, [
        component.text
          ? h('label', { class: 'text-sm mb-1 font-medium text-gray-700' }, component.text)
          : null,
        h('input', {
          type: component.type,
          class:
            'border rounded px-3 py-2 focus:ring focus:ring-blue-200 outline-none ' +
            (component.type === 'number' ? 'text-right' : ''),
          placeholder: component.place || '',
          value: formData[component.key] ?? '',
          onInput: (e: any) => (formData[component.key] = e.target.value)
        })
      ])

    case 'button':
    case 'save':
    case 'clear':
    case 'action':
      const color =
        component.color ||
        (component.type === 'clear' ? 'gray' : 'blue')
      return h(
        'button',
        {
          class: `px-4 py-2 rounded mr-2 text-white bg-${color}-600 hover:bg-${color}-700 transition`,
          onClick: () => {
            const eventName = component.event || component.type
            emit(eventName, { ...formData })
            if (component.type === 'clear') {
              Object.keys(formData).forEach(k => (formData[k] = ''))
              emit('onClear')
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
function renderContainer(components: any) {
    console.log(components.components)
  for (let index = 0; index < components.components.length; index++) {
    const component = components.components[index];
    console.log(component)
      switch (component.type) {
      case 'form':
        const sorted = component.components?.sort((a: any, b: any) => (a.row ?? 0) - (b.row ?? 0)) || []
        return h(
          'form',
          {
            class: 'p-4 border rounded bg-white shadow-sm',
            onSubmit: (e: Event) => e.preventDefault()
          },
          sorted.map((child: any) =>
            ['table', 'details'].includes(child.type)
              ? renderContainer(child)
              : renderComponent(child)
          )
        )

      case 'table':
        return h('div', { class: 'my-4' }, [
          h('h2', { class: 'text-lg font-semibold mb-2' }, component.text || 'Table'),
          h(TablePagination, {
            title: component.text ?? 'Data',
            columns:
              component.columns?.map((col: any, i: number) => ({
                label: col.text || `Column ${i + 1}`,
                key: col.key || `col${i + 1}`,
                type: col.type || 'text'
              })) ?? [],
            data: component.defaultValue ?? [],
            bordered: true,
            striped: true,
            hover: true,
            perPage: 10
          })
        ])

      case 'details':
        return h('div', { class: 'border rounded p-4 bg-gray-50 mt-4' }, [
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
  }
}

/* 🔁 Jika schema berubah, update parsedSchema */
watch(
  () => props.schema,
  newVal => {
    const parsed = typeof newVal === 'string' ? JSON.parse(newVal) : newVal
    Object.assign(parsedSchema, parsed)
  },
  { deep: true }
)
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
