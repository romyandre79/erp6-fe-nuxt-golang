<script setup lang="ts">
import { h, reactive, ref, computed, onMounted, toRaw } from 'vue'
import TablePagination from './TablePagination.vue'
import FormSelect from '~/components/FormSelect.vue'
import { UModal } from '#components'

const toast = useToast()

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  menuName: {
    type: String,
    required: true,
    default: ''
  },
  schema: {
    type: [Object, String],
    required: true
  },
  formType: {
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
  if (!component.validated || !Array.isArray(component.validated)) return true
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

    if (message != '') break
  }

  validationErrors[component.key] = message
  return !message
}

/* 🧩 Validasi semua field */
function validateAllFields() {
  let valid = true
  if (!parsedSchema.components) return true

  parsedSchema.components.forEach((comp: any) => {
    if (['text', 'password', 'number', 'email'].includes(comp.type)) {
      const value = formData.value[comp.key]
      const result = validateField(comp, value)
      if (!result) valid = false  // ✅ perbaikan: dibalik
    }
  })
  return valid
}

/* 🎯 Render komponen dasar */
function renderComponent(component: any) {
  switch (component.type) {
    case 'label':
      return h('div', { class: 'mb-2 text-gray-800 font-medium' }, $t(component.text.toUpperCase()))

    case 'text':
    case 'hidden':
    case 'password':
    case 'number':
      if (!(component.key in formData.value)) formData.value[component.key] = ''
      const modelInput = computed({
        get: () => formData.value[component.key],
        set: (val) => {
          formData.value[component.key] = val
          validateField(component, val)
        }
      })
      return h('div', { class: 'flex flex-col mb-3' }, [
        component.text
          ? h('label', { class: 'text-sm mb-1 font-medium text-gray-400' }, $t(component.text.toUpperCase()))
          : null,
        h('input', {
          type: component.type,
          class:
            'border rounded px-3 py-2 focus:ring focus:ring-blue-200 outline-none ' +
            (validationErrors[component.key] ? 'border-red-500' : 'border-gray-300') +
            ' ' +
            (component.type === 'number' ? 'text-right' : ''),
          placeholder: $t(component.place?.toUpperCase()) || '',
          maxlength: component.length,
          value: modelInput.value,
          onInput: (e: any) => (modelInput.value = e.target.value)
        }),
        validationErrors[component.key]
          ? h('span', { class: 'text-xs text-red-500 mt-1' }, validationErrors[component.key])
          : null
      ])
    case 'select':
      if (!(component.key in formData.value)) formData.value[component.key] = ''
      return h(FormSelect, {
        key: component.key,
        component,
        formData,
        validationErrors,
        validateField
      })

      case 'bool':
      case 'boolean':
      if (!(component.key in formData.value)) formData.value[component.key] = false
      const modelCheckbox = computed({
        get: () => formData.value[component.key],
        set: (val) => {
          formData.value[component.key] = val
          validateField(component, val)
        }
      })
      return h('div', { class: 'flex items-center mb-3 space-x-2' }, [
        h('input', {
          type: 'checkbox',
          checked: modelCheckbox.value,
          onChange: (e: any) => (modelCheckbox.value = e.target.checked),
          class:
            'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
        }),
        h(
          'label',
          { class: 'text-sm font-medium text-gray-700 cursor-pointer' },
          $t(component.text.toUpperCase()) || ''
        )
      ])

    case 'button':
      return h(
        'button',
        {
          class: `px-4 py-2 rounded mr-2 text-white bg-gray-600 hover:bg-gray-700 transition mb-3`,
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

  return h('div', { },
    container.components.map((component: any, index: number) => {
      switch (component.type) {
        case 'table':
        case 'datagrid':
          const key = component.key || component.text || `table-${index}`

          return h('div', { key: index}, [
            h(TablePagination, {
              ref: tableRef,
              columns:
                component.columns?.map((col: any, i: number) => ({
                  label: col.text || `Column ${i + 1}`,
                  key: col.key || `col${i + 1}`,
                  type: col.type || 'text'
                })) ?? [],
              searchColumn:
                component.search?.map((col: any, i: number) => ({
                  key: col.key || `col${i + 1}`,
                  type: col.type || 'text',
                  place: col.place || 'search ...'
                })) ?? [],
              method:"POST",
              endPoint: component.source,
              simpleSearch: false,
              rowKey: container.primary,
              onSelectionChange: (selRows: any) => {
                selectedRows = selRows
              },
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

                case "modal":
        modalSchema.value = component
        return 

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
  const flow = parsedSchema.action?.onCreate
  if (flow) {
    const payload = { ...toRaw(formData.value) }
    const dataForm = new FormData()
    dataForm.append('flowname', flow)
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
    if (res.code == 200) {
      toast.add({
        title: $t('TITLE UPDATE'),
        description: $t(res.message.replaceAll("_"," "))
      }) 
      ReadHandler()
    }
  } else {
    alert('Invalid Flow ' + flow)
  }
}

const UpdateHandler = async () => {
  const flow = parsedSchema.action?.onUpdate
  if (flow) {
    const payload = { ...toRaw(formData.value) }
    const dataForm = new FormData()
    dataForm.append('flowname', flow)
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
    if (res.code == 200) {     
      toast.add({
        title: $t('TITLE_UPDATE'),
        description: $t(res.message.replaceAll("_"," "))
      }) 
    }
  } else {
    alert('Invalid Flow ' + flow)
  }
}

let tableData : any
let selectedRows: any

const ReadHandler = async () => {
  const flow = parsedSchema.action?.onRead
  if (flow) {
    const dataForm = new FormData()
    dataForm.append('flowname', flow)
    dataForm.append('menu', 'admin')
    dataForm.append('search', 'true')

    const res = await Api.post('admin/execute-flow', dataForm)
    formData.value = {}
    if (res?.data?.data) {
      tableData = res?.data?.data
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
  const flow = parsedSchema.action?.onPurge
  if (flow) {
    const payload = { ...toRaw(formData.value) }
    const dataForm = new FormData()
    dataForm.append('flowname', flow)
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
    if (res.code == 200) {     
      toast.add({
        title: $t('TITLE_DELETE'),
        description: $t(res.message.replaceAll("_"," "))
      }) 
      //ReadHandler()
    }
  } else {
    alert('Invalid Flow ' + flow)
  }
}

/* 🚀 Lifecycle */
onMounted(async () => {
  await ReadHandler()
})


const openNew = ref(false)
const modalSchema = ref()

async function saveData() {
  try {
    let flow = ""

    if (modalTitle.value == 'New Data') {
      flow = parsedSchema.action?.onCreate
    } else {
      flow = parsedSchema.action?.onUpdate
    }
    const dataForm = new FormData()
    dataForm.append('flowname', flow)
    dataForm.append('menu', 'admin')
    dataForm.append('search', 'true')
    const payload = { ...toRaw(formData.value) }
    for (const key in payload) {
      const val = payload[key]
      if (val !== undefined && val !== null) {
        if (typeof val === 'object') {
          dataForm.append(key, JSON.stringify(val))
        } else if (typeof val === 'boolean') {
          // 🟢 ubah boolean ke 1 / 0 agar MySQL bisa terima
          dataForm.append(key, val ? 1 : 0)
        } else {
          dataForm.append(key, val)
        }
      }
    }
    res = await Api.post('admin/execute-flow', dataForm)
    if (res.code == 200) {
      toast.add({
        title: $t('TITLE UPDATE'),
        description: $t(res.message.replaceAll("_"," "))
      }) 
      tableRef.value.refreshTable()
    } else
    if (res.code == 401 && res.error == 'INVALID_TOKEN') {
      navigateTo('/login')
    }
    openNew.value = false
  } catch (err) {
    console.error('Gagal simpan data:', err)
  }
}

const modalTitle = ref('')
const tableRef = ref()

function openNewModal() {
  modalTitle.value = 'New Data'
  formData.value = {} // kosongkan form
  openNew.value = true
}

async function openEditModal() {
  const flow = parsedSchema.action?.onGet
  if (flow && selectedRows.length > 0) {
    modalTitle.value = 'Edit Data'
    openNew.value = true
    const dataForm = new FormData()
    dataForm.append('flowname', flow)
    dataForm.append('menu', 'admin')
    dataForm.append('search', 'true')
    dataForm.append(parsedSchema.primary,selectedRows[0][parsedSchema.primary])
    try {
      res = await Api.post('admin/execute-flow', dataForm)
      if (res.code == 200) {
        const record = res.data.data
        for (const key in record) {
          formData.value[key] = record[key]
        }
      } else
      if (res.code == 401 && res.error == 'INVALID_TOKEN') {
        navigateTo('/login')
      }
    } catch (err) {
      console.error('Gagal ambil data:', err)
    }
  }
}

async function deleteForm() {
  const flow = parsedSchema.action?.onPurge
  if (flow && selectedRows.length > 0) {  
    let dataForm = new FormData()
    for (let index = 0; index < selectedRows.length; index++) {
      dataForm.append('flowname', flow)
      dataForm.append('menu', 'admin')
      dataForm.append('search', 'true')
      dataForm.append(parsedSchema.primary,selectedRows[index][parsedSchema.primary])
      try {
        res = await Api.post('admin/execute-flow', dataForm)
        if (res.code == 200) {
          tableRef.value.refreshTable()
        } else
      if (res.code == 401 && res.error == 'INVALID_TOKEN') {
        navigateTo('/login')
      }
      } catch (err) {
        console.error('Gagal hapus data:', err)
      }      
    }
  }
}

async function downForm(mode: any) {
  let flow = ''
  if (mode == 'pdf') {
    flow = parsedSchema.action?.onPdf
  } else
  if (mode == 'xlsx') {
    flow = parsedSchema.action?.onXls
  } 
  if (flow) {  
    let dataForm = new FormData()
    dataForm.append('flowname', flow)
    dataForm.append('menu', 'admin')
    dataForm.append('search', 'true')
    for (let index = 0; index < selectedRows?.length; index++) {
      dataForm.append(parsedSchema.primary+ "["+index+"]",selectedRows[index][parsedSchema.primary])
    }
    await Api.donlotFile('/admin/execute-flow',dataForm,props.menuName[0]+'.'+mode)
  }
}

async function downTemplate() {
  let dataForm = new FormData()
  dataForm.append('menu', props.menuName[0])
  await Api.donlotFile('/admin/down-template',dataForm,props.menuName[0]+'.xlsx')
}

// 🔹 Upload state
const uploadProgress = ref(0)
const selectedFile = ref<File | null>(null)
const isUploading = ref(false)

// 🔹 Trigger input file
const fileInput = ref<HTMLInputElement | null>(null)
function triggerFileSelect() {
  fileInput.value?.click()
}

async function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files?.[0]
  if (!file) return

  // ✅ Validasi MIME type (opsional)
  const validTypes = [
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
  ]

  if (!validTypes.includes(file.type)) {
    toast.add({ title: 'Error', description: 'Hanya file Excel yang diizinkan (.xls / .xlsx)', color: 'red' })
    target.value = '' // reset input
    return
  }

  selectedFile.value = file

  const flow = parsedSchema.action?.onUpload
  if (!flow) {
    toast.add({ title: 'Error', description: 'Upload flow not defined.' })
    return
  }

  const form = new FormData()
  form.append('flowname', flow)
  form.append('menu', 'admin')
  form.append('search', false)
  form.append('file-modules', file)

  try {
    isUploading.value = true
    uploadProgress.value = 0

    const res = await Api.post('admin/execute-flow', form)

    if (res.code === 200) {
      toast.add({
        title: 'Upload Success',
        description: res.message || 'File uploaded successfully.'
      })
      uploadProgress.value = 0
      selectedFile.value = null
      tableRef.value?.refreshTable?.()
    } else {
      toast.add({
        title: 'Upload Failed',
        description: res.message || 'Unknown error.'
      })
    }
  } catch (err) {
    console.error('Upload error:', err)
    toast.add({ title: 'Error', description: 'Failed to upload file.' })
  } finally {
    isUploading.value = false
    target.value = ''
  }
}

function isButtonExist(mode: any) {
  for (let index = 0; index < parsedSchema.buttons.length; index++) {
    const element = parsedSchema.buttons[index];
    if (element.toLowerCase() == mode) {
      return true
    }
  }
}

</script>

<template>
 <div class="w-full">
    <!-- Judul di atas komponen -->
    <h1 class="text-2xl font-bold tracking-tight mb-4">
      {{ $t(props.title.toUpperCase()) }}
    </h1>

    <div class="flex flex-wrap gap-2 mb-3" v-if="formType.toUpperCase() == 'MASTER' || formType.toUpperCase() == 'MASTER-DETAIL'">
      <button v-if="isButtonExist('new')"       
        class="px-4 py-2 rounded text-white bg-gray-600 hover:bg-gray-700 transition"
        @click="openNewModal()"
      >
        <Icon name="heroicons:plus" /> New
      </button>

                    <button v-if="isButtonExist('edit')"
        class="px-4 py-2 rounded text-white bg-gray-600 hover:bg-gray-700 transition"
        @click="openEditModal()"
      >
        <Icon name="heroicons:pencil-square" /> Edit
      </button>
      
                    <button v-if="isButtonExist('delete')"
        class="px-4 py-2 rounded text-white bg-gray-600 hover:bg-gray-700 transition"
        @click="deleteForm()"
      >
        <Icon name="heroicons:trash" /> Delete
      </button>

  <UModal v-model:open="openNew" :title="$t(modalTitle)" :dismissible="false" :description="parsedSchema.menuname" :scrollable="false"
  :close="{ onClick: () => saveData('close-new') }"
  >
      <template #body>
          <component :is="renderContainer(modalSchema)" />
    </template>
            <template #footer>
      <div class="flex gap-2">
        <UButton color="neutral" :label="$t('CLOSE')" @click="openNew = false" />
        <UButton :label="$t('SAVE')" @click="saveData" />
      </div>
    </template>

      </UModal>

      <button v-if="isButtonExist('pdf')" class="px-4 py-2 rounded text-white bg-gray-600 hover:bg-gray-700 transition" @click="downForm('pdf')">
        <Icon name="heroicons:document-text" /> PDF
      </button>
      <button v-if="isButtonExist('xls')" class="px-4 py-2 rounded text-white bg-gray-600 hover:bg-gray-700 transition" @click="downForm('xlsx')">
        <Icon name="heroicons:table-cells" /> XLS
      </button>
      
      <button v-if="isButtonExist('upload')"
  class="px-4 py-2 rounded text-white bg-gray-600 hover:bg-gray-700 transition"
  @click="triggerFileSelect"
  :disabled="isUploading"
>
  <Icon name="heroicons:arrow-up-tray" />
  <span v-if="!isUploading && isButtonExist('upload')">Upload</span>
  <span v-else>Uploading...</span>
</button>

<!-- Input file hidden -->
<input
  ref="fileInput"
  type="file"
  class="hidden"
  accept=".xls,.xlsx"
  @change="handleFileChange"
/>

<div v-if="isUploading" class="w-64 bg-gray-200 rounded-full h-2 mt-2">
  <div
    class="bg-blue-600 h-2 rounded-full transition-all duration-300"
    :style="{ width: uploadProgress + '%' }"
  ></div>
</div>

      <button v-if="isButtonExist('download template')" class="px-4 py-2 rounded text-white bg-gray-600 hover:bg-gray-700 transition" @click="downTemplate()">
        <Icon name="heroicons:arrow-down-tray" /> Download Template
      </button>

    </div>
    <!-- Komponen utama -->
    <component :is="renderContainer(parsedSchema)" />
    </div>
</template>

<style scoped>
fieldset legend {
  padding: 0 6px;
}
</style>
