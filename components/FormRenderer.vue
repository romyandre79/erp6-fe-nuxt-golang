<script setup lang="ts">
import { h } from 'vue'
import TablePagination from './TablePagination.vue'

const props = defineProps({
  formtype: {
    type: String,
    required: true
  },
  schema: { type: Object, required: true }
})

// Fungsi untuk render satu komponen
function renderComponent(component: any) {
  switch (component.type) {
    case 'button':
      return h('button', {
        class: 'px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1',
        onClick: () => console.log(`${component.key} clicked`)
      }, [
        component.leftIcon ? h('i', { class: component.leftIcon }) : null,
        component.label
      ])

    case 'textfield':
      return h('div', { class: 'flex flex-col mb-3' }, [
        h('label', { class: 'text-sm mb-1 font-medium text-gray-700' }, component.label),
        h('input', {
          class: 'border rounded px-3 py-2 focus:ring focus:ring-blue-200 outline-none',
          placeholder: component.label,
          type: 'text'
        })
      ])

    case 'select':
      return h('div', { class: 'flex flex-col mb-3' }, [
        h('label', { class: 'text-sm mb-1 font-medium text-gray-700' }, component.label),
        h('select', {
          class: 'border rounded px-3 py-2 focus:ring focus:ring-blue-200 outline-none'
        }, component.data?.values?.map((opt: any) =>
          h('option', { value: opt.value }, opt.label)
        ))
      ])

    case 'checkbox':
      return h('label', { class: 'flex items-center gap-2 mb-3' }, [
        h('input', { type: 'checkbox' }),
        h('span', component.label)
      ])

    default:
      return h('div', { class: 'text-gray-500 italic' }, `Unsupported: ${component.type}`)
  }
}

// Render kontainer (table, panel, datagrid)
function renderContainer(component: any) {
  switch (component.type) {
    case 'table':
      return h('div', { class: 'grid grid-cols-6 gap-2 mb-4' },
        component.rows?.[0]?.map((cell: any, idx: number) =>
          h('div', { key: idx },
            cell.components?.map((child: any) => renderComponent(child))
          )
        )
      )

    case 'panel':
      return h('fieldset', { class: 'border rounded p-4 mb-4 bg-gray-50' }, [
        component.title
          ? h('legend', { class: 'font-semibold text-gray-800 px-2' }, component.title)
          : null,
        component.components?.map((child: any) =>
          child.type === 'table' || child.type === 'datagrid'
            ? renderContainer(child)
            : renderComponent(child)
        )
      ])

    case 'datagrid':
     return h(TablePagination, {
        title: component.label ?? 'Data Grid',
        columns: component.components?.[0]?.columns?.map((col: any) => ({
          label: col.components?.[0]?.label ?? '',
          key: col.components?.[0]?.key ?? '',
          type: col.components?.[0]?.type ?? 'textfield'
        })),
        data: component.defaultValue ?? [],
        bordered: true,
        striped: true,
        hover: true,
        perPage: 10
      })

    default:
      return renderComponent(component)
  }
}
</script>

<template>
  <div>
    <div
      v-for="(comp, index) in schema.components"
      :key="index"
    >
      <component :is="renderContainer(comp)" />
    </div>
  </div>
</template>

<style scoped>
fieldset legend {
  padding: 0 6px;
}
</style>
