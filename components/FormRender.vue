<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import FormSelect from '~/components/FormSelect.vue'
import TablePagination from './TablePagination.vue'
import { UModal } from '#components'

const props = defineProps({
  title: { type: String, default: '' },
  menuName: { type: String, default: '' },
  schema: { type: [Object, String], required: true },
  formType: { type: String, default: 'form' }
})

const modalTitle = ref('')
const modalRefs = shallowReactive<Record<string, any>>({})
const tableRef = ref()
const Api = useApi()
const toast = useToast()
let selectedRows = ref<any[]>([])

const emit = defineEmits([])

// 🧩 Parse schema
const parsedSchema = computed(() => 
  typeof props.schema === 'string' ? JSON.parse(props.schema) : props.schema
)

const buttons = computed(() => parsedSchema.value?.buttons || {})
const modals = computed(() => parsedSchema.value?.modals || [])
const tables = computed(() => parsedSchema.value?.tables || [])

// 🔥 Ketika selectedRows berubah
watch(
  () => selectedRows.value,
  (newVal) => {
    if (!newVal || newVal.length === 0) return
    // 🔄 Loop semua tabel di schema
    tables.value.forEach((tbl) => {
      if (tbl.key !== 'table0') {
        // update relation key untuk table child
        tbl.selectionKeyData = newVal[0][tbl.relationkey] + ''
      }
    })

    if (tableRef.value?.refreshTable) {
      tableRef.value.refreshTable()
    }
  },
  { deep: true }
)


// 🧩 Rebuild modalRefs setiap kali modals berubah
watch(
  modals,
  async (newVal) => {
    await nextTick()
    for (const key of Object.keys(modalRefs)) delete modalRefs[key]
    for (const m of newVal || []) {
      modalRefs[m.key] = ref(false)
    }
  },
  { immediate: true }
)

// 🧩 Modal actions
function open(key: string) {
  if (modalRefs[key]) {
    modalRefs[key].value = true
    modalTitle.value = "New Data"
    formData.value = {} 
  } else {
    console.warn('❌ Modal not found:', key)
  }
}

async function edit(key: string) {
  const flow = parsedSchema.value.action?.onGet
  if (flow && selectedRows.length > 0) {
    modalTitle.value = 'Edit Data'
    modalRefs[key].value = true
    const dataForm = new FormData()
    dataForm.append('flowname', flow)
    dataForm.append('menu', 'admin')
    dataForm.append('search', 'true')
    dataForm.append(parsedSchema.value.primary,selectedRows.value[0][parsedSchema.value.primary])
    try {
      const res = await Api.post('admin/execute-flow', dataForm)
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

function close(key: string) {
  if (modalRefs.value[key]) modalRefs.value[key].value = false
  else console.warn('Modal not found:', key)
}

async function deleteData(table: any) {
  const flow = parsedSchema.value.action?.onPurge
  if (flow && selectedRows.length > 0) {  
    let dataForm = new FormData()
    for (let index = 0; index < selectedRows.length; index++) {
      dataForm.append('flowname', flow)
      dataForm.append('menu', 'admin')
      dataForm.append('search', 'true')
      dataForm.append(parsedSchema.value.primary,selectedRows[index][parsedSchema.value.primary])
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
    flow = parsedSchema.value.action?.onPdf
  } else
  if (mode == 'xlsx' || mode == 'xls') {
    flow = parsedSchema.value.action?.onXls
  } 
  if (flow) {  
    let dataForm = new FormData()
    dataForm.append('flowname', flow)
    dataForm.append('menu', 'admin')
    dataForm.append('search', 'true')
    for (let index = 0; index < selectedRows?.length; index++) {
      dataForm.append(parsedSchema.value.primary+ "["+index+"]",selectedRows[index][parsedSchema.value.primary])
    }
    await Api.donlotFile('/admin/execute-flow',dataForm,props.menuName[0]+'.'+mode)
  }
}

async function downTemplate() {
  let dataForm = new FormData()
  dataForm.append('menu', props.menuName[0])
  await Api.donlotFile('/admin/down-template',dataForm,props.menuName[0]+'.xlsx')
}

function navigate(key:any) {
  if (key.includes('form-designer') && selectedRows.value.length === 0) {
    toast.add({ title: 'Error', description: 'Please select one row', color: 'error' })
    return
  } else
  if (key.includes('widget-designer') && selectedRows.value.length === 0) {
    toast.add({ title: 'Error', description: 'Please select one row', color: 'error' })
    return
  } else
  if (key.includes('workflow-designer') && selectedRows.value.length === 0) {
    toast.add({ title: 'Error', description: 'Please select one row', color: 'error' })
    return
  } else
  if (key.includes('form-designer') && selectedRows.value.length > 0) {
    navigateTo(key+'/'+selectedRows.value[0]['menuname'])
  } else if (key.includes('widget-designer') && selectedRows.value.length > 0) {
    navigateTo(key+'/'+selectedRows.value[0]['widgetname'])
  } else   if (key.includes('workflow-designer') && selectedRows.value.length > 0) {
    navigateTo(key+'/'+selectedRows.value[0]['wfname'])
  }else {
    navigateTo(key)
  }
}

const actions = { open, close, edit, downForm, deleteData, downTemplate, navigate }

function runAction(code: string) {
  const match = code.match(/^(\w+)\((.*)\)$/)
  if (!match) return console.warn('Invalid action:', code)

  const fnName = match[1]
  const arg = match[2].replace(/['"]/g, '')

  const fn = actions[fnName]
  if (fn) fn(arg)
  else console.warn('Unknown function:', fnName)
}

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

let formData = ref<Record<string, any>>({})
const validationErrors = reactive<Record<string, string>>({})

function renderComponent(component: any) {
  switch (component.type) {
        case 'label':
      return h('div', { class: 'mb-2 text-gray-800 font-medium' }, $t(component.text.toUpperCase()))

    case 'longtext':
      if (!(component.key in formData.value)) formData.value[component.key] = ''
      const modelInputArea = computed({
        get: () => formData.value[component.key],
        set: (val) => {
          formData.value[component.key] = val
          //validateField(component, val)
        }
      })
      return h('div', { class: 'flex flex-col mb-3' }, [
        component.type != 'hidden' ? component.text
          ? h('label', { class: 'text-sm mb-1 font-medium text-gray-400' }, $t(component.text.toUpperCase()))
          : null : "",
        h('textarea', {
          type: component.type,
          class:
            'border rounded px-3 py-2 focus:ring focus:ring-blue-200 outline-none ' +
            (validationErrors[component.key] ? 'border-red-500' : 'border-gray-300') +
            ' ' +
            (component.type === 'number' ? 'text-right' : ''),
          placeholder: $t(component.place?.toUpperCase()) || '',
          maxlength: component.length,
          onInput: (e: Event) => (e.target as HTMLTextAreaElement).value,
          value: modelInputArea.value
        }),
        validationErrors[component.key]
          ? h('span', { class: 'text-xs text-red-500 mt-1' }, validationErrors[component.key])
          : null
      ])
    case 'text':
    case 'hidden':
    case 'password':
    case 'number':
      if (!(component.key in formData.value)) formData.value[component.key] = ''
      const modelInput = computed({
        get: () => formData.value[component.key],
        set: (val) => {
          formData.value[component.key] = val
          //validateField(component, val)
        }
      })
      return h('div', { class: 'flex flex-col mb-3' }, [
        component.type != 'hidden' ? component.text
          ? h('label', { class: 'text-sm mb-1 font-medium text-gray-400' }, $t(component.text.toUpperCase()))
          : null : "",
        h('input', {
          type: component.type,
          class:
            'border rounded px-3 py-2 focus:ring focus:ring-blue-200 outline-none dark:text-white text-black ' +
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
            const eventName = (component.event || component.onClick).toUpperCase()
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
  }
}

function renderContainer(container: any) {
  if (!container) return null

  console.log('contain ',container)

  let children = Array.isArray(container)
    ? container
    : container.components || []

  return h(
    'div',
    {
      class: ''
    },
    children.map((component: any, index: number) => {
      switch (component.type) {
        case 'table':
          return renderTable(component)
          break;
        
        case 'master':
        case 'masters':
        case 'buttons':
        case 'tables':
        case 'columns':
        case 'search':
        case 'modals':
        case 'detail':
        case 'modals':
        case 'components':
          return h('div', { class: 'ml-4 mt-2' }, [
            component.text
              ? h('div', { class: 'font-semibold mb-2 text-gray-700' }, component.text)
              : null,
            renderContainer(component)
          ])
      
        default:
          return renderComponent(component)
      }
    })
  )
}

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
  if (!parsedSchema.value.components) return true

  parsedSchema.value.components.forEach((comp: any) => {
    if (['text', 'password', 'number', 'email'].includes(comp.type)) {
      const value = formData.value[comp.key]
      const result = validateField(comp, value)
      if (!result) valid = false  // ✅ perbaikan: dibalik
    }
  })
  return valid
}

function renderTable(component: any) {
  if (!component) return null
  const key = component.key || component.text || `table0`

  return h('div', { key: key}, [
    h(TablePagination, {
      ref: tableRef,
      columns:
        component.columns?.map((col: any, i: number) => ({
          label: col.text ||  `Column ${i + 1}`,
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
      title: component.text || '',
      class: component.class || 'mb-4',
      rowKey: component.primary,
      isDetail: (key == `table0`) ? false : true,
      relationKey: component.relationkey,
      selectionKeyData: selectedRows.value,
      onSelectionChange: (selRows: any) => {
        selectedRows.value = selRows
      },
    })
  ])
}

const ReadHandler = async () => {
  const flow = parsedSchema.value.action?.onRead
  if (flow) {
    const dataForm = new FormData()
    dataForm.append('flowname', flow)
    dataForm.append('menu', 'admin')
    dataForm.append('search', 'true')

    const res = await Api.post('admin/execute-flow', dataForm)
    formData.value = {}
    if (res?.data?.data) {
      const firstRow = res?.data?.data
      for (const key in firstRow) formData.value[key] = firstRow[key]
      const tableComponent = parsedSchema.components?.find((x: any) => x.type === 'table')
    }
  }
}

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

    const res = await Api.post('admin/execute-flow', dataForm)
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
  const flow = parsedSchema.value.action?.onUpdate
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

    const res = await Api.post('admin/execute-flow', dataForm)
    if (res.code == 200) {     
      toast.add({
        title: $t('TITLE UPDATE'),
        description: $t(res.message.replaceAll("_"," "))
      }) 
    }
  } else {
    alert('Invalid Flow ' + flow)
  }
}

const DeleteHandler = async () => {
  const flow = parsedSchema.value.action?.onPurge
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
        title: $t('TITLE DELETE'),
        description: $t(res.message.replaceAll("_"," "))
      }) 
      //ReadHandler()
    }
  } else {
    alert('Invalid Flow ' + flow)
  }
}

onMounted(ReadHandler)

async function saveData(key:any) {
  try {
    let flow = ""

    if (modalTitle.value == 'New Data') {
      flow = parsedSchema.value.action?.onCreate
    } else {
      flow = parsedSchema.value.action?.onUpdate
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
    const res = await Api.post('admin/execute-flow', dataForm)
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
    modalRefs[key] = false
  } catch (err) {
    console.error('Gagal simpan data:', err)
  }
}
</script>

<template>
  <div v-if="parsedSchema?.type != 'widget'" :class="parsedSchema.class">
    <h1 :class="parsedSchema.title.class">{{ parsedSchema.title.text }}</h1>
    <h2 :class="parsedSchema.subtitle.class">{{ parsedSchema.subtitle.text }}</h2>

    <!-- 🔹 Buttons -->
    <div
      :class="parsedSchema.buttons?.class"
      v-if="buttons && (parsedSchema.type == 'master' || parsedSchema.type == 'master-detail' || parsedSchema.type == 'report')"
    >
      <div v-for="(value, index) in buttons.components" :key="index">
        <button
          class="px-4 py-2 rounded text-white bg-gray-600 hover:bg-gray-700 transition"
          @click="runAction(value.onClick)"
        >
          <Icon :name="value.icon" /> {{ value.text }}
        </button>
      </div>
    </div>

    <div v-for="(value, index) in modals" :key="index">
      <UModal
        v-if="modalRefs?.[value.key]"
        v-model:open="modalRefs[value.key].value"
        :title="modalTitle"
        :dismissible="false"
        :description="parsedSchema.menuname"
        :scrollable="false"
      >
      <template #body>
          <component :is="renderContainer(value.components)" />
    </template>
    <template #footer>
      <div class="flex gap-2">
        <UButton color="neutral" :label="$t('CLOSE')" @click="modalRefs[value.key].value = false" />
        <UButton :label="$t('SAVE')" @click="saveData(value.key)" />
      </div>
    </template>
      </UModal>
    </div>

    <div v-for="(value, index) in tables" :key="index">
        <component :is="renderTable(value)" />
    </div>
  </div>
  <div v-else :class="parsedSchema.class">
 <div class="w-full">
       <h1 :class="parsedSchema.title.class">{{ parsedSchema.title.text }}</h1>
    <h2 :class="parsedSchema.subtitle.class">{{ parsedSchema.subtitle.text }}</h2>

    <!-- Komponen utama -->
    <component :is="renderContainer(parsedSchema)" />

    <div v-for="(value, index) in tables" :key="index">
        <component :is="renderTable(value)" />
    </div>
    </div>
  </div>
</template>
