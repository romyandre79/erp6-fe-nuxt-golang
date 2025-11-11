<template>
  <div class="flex h-screen overflow-hidden bg-gray-100">
    <!-- 🔹 Sidebar kiri -->
    <aside class="w-1/5 bg-white border-r p-3 overflow-y-auto dark:bg-black">
      <h2 class="font-bold text-lg mb-3">Elements</h2>

      <!-- Komponen dasar -->
      <div
        v-for="(comp, idx) in availableComponents"
        :key="idx"
        class="border rounded p-2 mb-2 cursor-move hover:bg-gray-100 dark:hover:bg-white dark:hover:text-black"
        draggable="true"
        @dragstart="onDragStart(comp)"
      >
        {{ comp.label }}
      </div>

      <!-- Kontainer layout -->
      <h3 class="font-bold text-lg mb-3">Containers</h3>
      <div
        v-for="(group, idx) in layoutContainers"
        :key="'grp-'+idx"
        class="border rounded p-2 mb-2 cursor-move hover:bg-gray-100 dark:hover:bg-white dark:hover:text-black"
        draggable="true"
        @dragstart="onDragStart(group)"
      >
        {{ group.label }}
      </div>

      <div class="mt-5">
        <button class="bg-green-600 text-white w-full py-1 rounded cursor-pointer" @click="saveSchema">
          💾 Save Schema
        </button>
        <button class="bg-blue-600 text-white w-full py-1 rounded mt-2 cursor-pointer" @click="loadSchema">
          📂 Load Schema
        </button>
        <button class="bg-gray-700 text-white w-full py-1 rounded mt-2 cursor-pointer" @click="togglePreview">
          {{ previewMode ? '🧱 Edit Mode' : '👁 Preview' }}
        </button>
        <button class="bg-gray-700 text-white w-full py-1 rounded mt-2 cursor-pointer" @click="toggleJson">
          {{ showJson ? '🧱 Debug Off' : '👁 Debug On' }}
        </button>
      </div>
    </aside>

    <!-- 🔹 Canvas Tengah -->
    <main class="flex-1 p-5 overflow-auto w-full bg-white dark:bg-black">
      <div v-if="previewMode" class="flex items-center justify-between sticky top-0 z-50 px-6 py-3 transition-colors duration-300 backdrop-blur-md">
        <FormRender  v-if="formSchema" :schema="formSchema" :menuName="menuName" :formType="formType" :title="formTitle"/>

      </div>
      <div v-if="!previewMode"
        class="min-h-[80vh] rounded-xl shadow-inner p-6"
        @dragover.prevent
        @drop="onDropRoot"
      >
        <div v-if="!canvasComponents.length" class="text-gray-400 text-center py-20">
          Drag components or containers here
        </div>

<draggable
  v-model="canvasComponents"
  group="components"
  item-key="id"
  class="space-y-3"
>
  <template #item="{ element }">
    <div
      class="border rounded p-3 bg-gray-50 hover:border-blue-500 cursor-pointer relative group"
      :class="{ 'border-blue-600': selected?.id === element.id }"
      @click.stop="selectComponent(element)"
    >
      <RenderNode
        :node="element"
        :preview="previewMode"
        :showJson="showJson"
        :selected="selected"
        @select="selectComponent"
        @drop-child="onDropChild"
        @delete="deleteNode"
      />
    </div>
  </template>
</draggable>
      </div>
       <!-- 🔍 JSON Debug View -->
  <div v-if="showJson && !previewMode" class="bg-gray-900 text-green-400 font-mono text-sm rounded-xl p-4 overflow-auto max-h-[80vh]">
    <h1>Debug</h1>
    <pre>{{ formattedJson }}</pre>
  </div>

    </main>

    <!-- 🔹 Tree View + Property Panel -->
    <aside class="w-1/4 bg-white border-l p-4 overflow-y-auto dark:bg-black">
      <h3 class="font-semibold mb-3">Form Structure</h3>
      <TreeView :nodes="canvasComponents" :selected="selected" @select="selectComponent" />

      <hr class="my-4" />

      <div v-if="selected && !previewMode">
  <h3 class="font-semibold mb-3">Properties</h3>
  <PropertyEditor v-model="selected.props" />
</div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import draggable from 'vuedraggable'
import RenderNode from '~/components/RenderNode.vue'
import TreeView from '~/components/TreeView.vue'
import PropertyEditor from '~/components/PropertyEditor.vue'
const route = useRoute()
const toast = useToast()

const items = [
  {
    label: 'Menu Data',
    icon: 'i-ep-menu',
    slot: 'data'
  },
  {
    label: 'Form Designer',
    icon: 'fluent:form-multiple-20-filled',
    slot: 'form'
  }
]

interface NodeSchema {
  id: string
  type: string
  label: string
  props: Record<string, any>
  children?: NodeSchema[]
}

const availableComponents = [    
  {     
    type: 'button', 
    label: 'Button', 
    props: 
      { 
        text: 'Button', 
        class: 'px-4 py-2 rounded text-white bg-gray-600 hover:bg-gray-700 transition',
        icon: 'heroicons:plus',
        onClick: "open('modalForm')"
      }
  },
  { 
    type: 'hidden', 
    label: 'Hidden', 
    props: 
    { 
      text: 'Hidden Text', 
      place: 'Enter text', 
      enabled: true,
      required: false 
    } 
  },
  { 
    type: 'text', 
    label: 'Text', 
    props: 
    { 
      text: 'Text', 
      place: 'Enter text', 
      enabled: true,
      required: false 
    } 
  },
   { 
    type: 'bool', 
    label: 'Boolean', 
    props: 
    { 
      label: '', 
      place: '', 
      required: false 
    } 
  },
  { 
    type: 'longtext', 
    label: 'Long Text', 
    props: 
      { 
        label: 'Long Text', 
        place: 'Enter long text', 
        required: false 
      } 
  },
  { 
    type: 'number', 
    label: 'Number', 
    props: 
      { 
        label: 'Number', 
        place: '0', 
        required: false 
      } 
  },
  { 
    type: 'email', 
    label: 'Email', 
    props: 
    { 
      label: 'Email', 
      place: 'example@mail.com', 
      required: false 
    } 
  }
]


const formattedJson = ref('')

const layoutContainers = [
  { 
    type: 'master', 
    label: 'Master', 
    props: 
      { 
        class: 'w-full',
        layout: 'standard',
        primary: '',
        title: {
          text: '',
          class: 'text-2xl font-bold tracking-tight mb-4'
        },
         subtitle: {
          text: '',
          class: 'text-1xl tracking-tight mb-4'
        },
        action: {
          "onNew": "",
          "onGet": "",
          "onCreate": "",
          "onUpdate": "",
          "onUpload": "",
          "onPurge": "",
          "onPdf": "",
          "onXls": ""
        }
      } 
  },
  { 
    type: 'buttons', 
    label: 'Buttons', 
    props: 
      { 
        key: '', 
        class:'flex flex-wrap gap-2 mb-3' 
      }, 
      children: [] 
  },
  { 
    type: 'table', 
    label: 'Table', 
    props: 
      { 
        key: '', 
        class:'flex flex-wrap gap-2 mb-3' 
      }, 
      children: [] 
  },
  { 
    type: 'tables', 
    label: 'Tables', 
    props: 
      { 
        key: '', 
        class:'flex flex-wrap gap-2 mb-3' 
      }, 
      children: [] 
  },
  { 
    type: 'search', 
    label: 'Search', 
    props: 
      { 
        key:'',
        class:''
      }, 
    children: [] 
  },
  { 
    type: 'columns', 
    label: 'Columns', 
    props: 
      { 
        key: '', 
        class:'flex flex-wrap gap-2 mb-3' 
      }, 
      children: [] 
  },
    { 
    type: 'modals', 
    label: 'Modals', 
    props: 
      { 
        key: '', 
        class:'flex flex-wrap gap-2 mb-3' 
      }, 
      children: [] 
  },
    { 
    type: 'modal', 
    label: 'Modal', 
    props: 
      { 
        key: '', 
        class:'flex flex-wrap gap-2 mb-3' 
      }, 
      children: [] 
  },
  { 
    type: 'action', 
    label: 'Action', 
    props: 
      { 
        key: '' 
      }, 
      children: [] 
  },
]

const canvasComponents = ref<NodeSchema[]>([])
const selected = ref<NodeSchema | null>(null)
const formSchema = ref<Record<string, any> | null>(null)
const previewMode = ref(false)
const showJson = ref(true)
const { getMenuForm } = useAuth()
const Api = useApi()

const onDragStart = (comp: any) => {
  event?.dataTransfer?.setData('component', JSON.stringify(comp))
  window.draggingComponent = comp // ✅ simpan global
}

const onDropRoot = (event: DragEvent) => {
  const data = event.dataTransfer?.getData('component')
  if (!data) return
  const comp = JSON.parse(data)
  const newComp: NodeSchema = {
    id: Math.random().toString(36).substr(2, 9),
    ...comp
  }
  canvasComponents.value.push(newComp)
  window.draggingComponent = null // ✅ reset
}

const onDropChild = (parentId: string, comp: NodeSchema) => {
  const findNode = (nodes: NodeSchema[]): NodeSchema | null => {
    for (const node of nodes) {
      if (node.id === parentId) return node
      if (node.children) {
        const child = findNode(node.children)
        if (child) return child
      }
    }
    return null
  }

  const parent = findNode(canvasComponents.value)
  if (parent) {
    if (!parent.children) parent.children = []
    parent.children.push(comp)
  }
}

const deleteNode = (target: NodeSchema) => {
  if (!confirm(`Are you sure you want to delete "${target.label}"?`)) return

  const removeFrom = (nodes: NodeSchema[]): boolean => {
    const index = nodes.findIndex((n) => n.id === target.id)
    if (index !== -1) {
      nodes.splice(index, 1)
      return true
    }
    for (const node of nodes) {
      if (node.children && removeFrom(node.children)) return true
    }
    return false
  }

  removeFrom(canvasComponents.value)
  selected.value = null
}

const selectComponent = (node: NodeSchema) => {
  selected.value = node
}

const togglePreview = () => {
  previewMode.value = !previewMode.value
  selected.value = null
}

const toggleJson = () => {
  showJson.value = !showJson.value
}

const saveSchema = () => {
  const designJson = canvasComponents.value
  const runtimeJson = designerToDbSchema(designJson)

  const dataForm = new FormData()
  dataForm.append('flow', 'modifmenuaccess')
  dataForm.append('menu', 'admin')
  dataForm.append('search', 'true')
  dataForm.append('menuform', runtimeJson)
  toast.add({ title: 'Success', description: 'Runtime schema saved successfully' })
}

const dataMenu = reactive({
  menuAccessId : Number,
  menuName: String,
  description: String,
  menuCode: String,
  menuUrl: String,
  menuIcon: String,
  moduleId: Number,
  sortOrder: Number,
  menuVersion: String,
  menuType: String,
  recordStatus: Number
})

const loadSchema = async() => {
  try {
    const res = await getMenuForm(route.params.slug)
    if (res?.code == 200) {
      dataMenu.menuAccessId = res?.data.menuaccessid
      dataMenu.menuName = res?.data.menuname
      dataMenu.description = res?.data.description,
      dataMenu.menuCode = res?.data.menucode,
      dataMenu.menuUrl = res?.data.menuurl,
      dataMenu.menuIcon = res?.data.menuicon,
      dataMenu.moduleId = res?.data.moduleid,
      dataMenu.sortOrder = res?.data.sortorder,
      dataMenu.menuVersion = res?.data.menuversion,
      dataMenu.menuType = res?.data.menutype
      dataMenu.recordStatus = res?.data.recordstatus
      if (res?.data.menuform != '') {
        formSchema.value = res?.data?.menuform
        canvasComponents.value = dbSchemaToDesigner(JSON.parse(res?.data?.menuform))
      }
    } else {
      console.error('Invalid response from ', res)
    }
  } catch (err) {
    console.error('Error loading :', err)
  }
}

onMounted(async() => {
  loadSchema()
})

function dbSchemaToDesigner(dbSchema: any): any[] {
  const randomId = () => crypto.randomUUID()

  const masterContainer: any = {
    id: randomId(),
    type: 'master',
    label: dbSchema.title?.text || 'Master',
    props: {
      class: dbSchema.class,
      layout: dbSchema.layout,
      primary: dbSchema.primary,
      title: dbSchema.title,
      subtitle: dbSchema.subtitle,
      action: dbSchema.action || {},
    },
    children: [],
  }

  // === BUTTONS ===
  if (dbSchema.buttons?.components?.length) {
    const buttonsContainer = {
      id: randomId(),
      type: 'buttons',
      label: 'Buttons',
      props: { class: dbSchema.buttons.class },
      children: dbSchema.buttons.components.map((btn: any) => ({
        id: randomId(),
        type: 'button',
        label: btn.text,
        props: btn,
        children: [],
      })),
    }
    masterContainer.children.push(buttonsContainer)
  }

  // === TABLES ===
  if (Array.isArray(dbSchema.tables) && dbSchema.tables.length) {
    const tablesContainer = {
      id: randomId(),
      type: 'tables',
      label: 'Tables',
      props: {},
      children: dbSchema.tables.map((tbl: any) => {
        const tableNode = {
          id: randomId(),
          type: 'table',
          label: tbl.text || tbl.name || 'Table',
          props: tbl,
          children: [],
        }

         if (Array.isArray(tbl.search) && tbl.search.length) {
          const searchContainer = {
            id: randomId(),
            type: 'search',
            label: 'Search',
            props: {},
            children: tbl.search.map((s: any) => ({
              id: randomId(),
              type: s.type || 'field',
              label: s.label || s.name,
              props: s,
              children: [],
            })),
          }
          tableNode.children.push(searchContainer)
        }

        // 🧩 Tambahkan kolom jika ada
        if (Array.isArray(tbl.columns) && tbl.columns.length) {
           const columnsContainer = {
            id: randomId(),
            type: 'columns',
            label: 'Columns',
            props: {},
            children: tbl.columns.map((col: any) => ({
              id: randomId(),
              type: 'column',
              label: col.label || col.name,
              props: col,
              children: [],
            })),
          }
          tableNode.children.push(columnsContainer)
        }

        return tableNode
      }),
    }
    masterContainer.children.push(tablesContainer)
  }

  // === MODALS ===
  if (Array.isArray(dbSchema.modals) && dbSchema.modals.length) {
    const modalsContainer = {
      id: randomId(),
      type: 'modals',
      label: 'Modals',
      props: {},
      children: dbSchema.modals.map((mdl: any) => ({
        id: randomId(),
        type: 'modal',
        label: mdl.key,
        props: { key: mdl.key },
        children: mdl.components.map((cmp: any) => ({
          id: randomId(),
          type: cmp.type,
          label: cmp.text,
          props: cmp,
          children: [],
        })),
      })),
    }
    masterContainer.children.push(modalsContainer)
  }

  return [masterContainer]
}



function designerToDbSchema(designer: any[]): any {
  if (designer.length == 0) { 
    return
  }
  const master = designer.find((x: any) => x.type === 'master')
  console.log(master)
  const buttons = master.children.find((x: any) => x.type === 'buttons')
  const tables = master.children.find((x: any) => x.type === 'tables')
  const modals = master.children.find((x: any) => x.type === 'modals')

  if (master == undefined) 
    return

  return {
    type: master.type || 'master',
    class: master.props?.class || '',
    layout: master.props?.layout || 'standard',
    title: master.props?.title,
    subtitle: master.props?.subtitle,
    primary: master.props?.primary,
    buttons: buttons
      ? {
          class: buttons.props.class,
          components: buttons.children.map((c: any) => c.props)
        }
      : [],
    tables: tables
      ? tables.children.map((t: any) => {
          const searchNode = t.children?.find((c: any) => c.type === 'search')
          const columnsNode = t.children?.find((c: any) => c.type === 'columns')

          return {
            ...t.props,
            search: searchNode
              ? searchNode.children.map((s: any) => s.props)
              : [],
            columns: columnsNode
              ? columnsNode.children.map((c: any) => c.props)
              : [],
          }
        })
      : [],
    modals: modals
      ? modals.children.map((m: any) => ({
          key: m.label,
          components: m.children.map((cmp: any) => cmp.props)
        }))
      : [],
    action: master.props?.action || {
        "onNew": "",
        "onGet": "",
        "onCreate": "",
        "onUpdate": "",
        "onUpload": "",
        "onPurge": "",
        "onPdf": "",
        "onXls": ""
    }
  }
}


watch(
  canvasComponents,
  (newVal) => {
    const runtimeSchema = designerToDbSchema(newVal)
    formattedJson.value = JSON.stringify(runtimeSchema, null, 2)
    formSchema.value = runtimeSchema
  },
  { deep: true, immediate: true }
)

</script>
