<template>
    <div class="flex items-center justify-between sticky top-0 z-50 px-6 py-3 transition-colors duration-300 backdrop-blur-md">
        <TablePagination 
      title="Language"
      endPoint="/admin/language"
      :columns="columns"
      :actions="actions"
      :rowActions="rowActions"
      @action="handleAction"
      @row-action="handleRowAction"
      @fetch-params="onFetchParams"
        />

    </div>


</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import TablePagination from '~/components/TablePagination.vue';

type Language = {
    languageid: number
    languagename: string
    recordstatus: boolean    
}

definePageMeta({
  layout: 'auth',                
  middleware: ['auth'] 
})

const columns = [
  { key: 'languageid', label: 'ID' },
  { key: 'languagename', label: 'Language Name' },
  { key: 'recordstatus', label: 'Status' }
]

const actions = [
  { label: 'New', icon: 'fa fa-plus', class: 'btn-primary' }
]

const rowActions = [
  { label: 'View', icon: 'fa fa-eye', class: 'btn-info' },
  { label: 'Edit', icon: 'fa fa-edit', class: 'btn-warning' },
  { label: 'Delete', icon: 'fa fa-trash', class: 'btn-error' }
]

const handleAction = (action: any) => {
  console.log('Toolbar Action:', action)
}

const handleRowAction = ({ action, row }: any) => {
  console.log('Row Action:', action.label, 'on row', row)
}

const onFetchParams = (params: any) => console.log('Fetching with params:', params)
</script>