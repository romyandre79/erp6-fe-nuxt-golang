<template>
      <div class="flex">
        <button class="text-black dark:text-white w-full py-1 rounded cursor-pointer" @click="saveSchema">
          💾 Save Schema
        </button>
        <button class=" text-black dark:text-white w-full py-1 rounded cursor-pointer" @click="loadSchema">
          📂 Load Schema
        </button>
        <button class=" text-black dark:text-white w-full py-1 rounded cursor-pointer" @click="copySchema">
          📂 Copy From ...
        </button>
        <button class=" text-black dark:text-white w-full py-1 rounded cursor-pointer" @click="togglePreview">
          {{ previewMode ? '🧱 Edit Mode' : '👁 Preview' }}
        </button>
        <button class=" text-black dark:text-white w-full py-1 rounded cursor-pointer" @click="toggleJson">
          {{ showJson ? '🧱 Debug Off' : '👁 Debug On' }}
        </button>
      </div>
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

    </aside>

    <!-- 🔹 Canvas Tengah -->
    <main class="flex-1 p-5 overflow-auto w-full bg-white dark:bg-black">
      <div v-if="previewMode" class="flex items-center justify-between sticky top-0 z-50 px-6 py-3 transition-colors duration-300 backdrop-blur-md">
        <FormRender  v-if="formSchema" :schema="formSchema" :menuName="dataMenu.menuName" :formType="dataMenu.menuType" :title="dataMenu.description"/>

      </div>
      <div v-if="!previewMode"
        class="min-h-[80vh] rounded-xl shadow-inner"
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

definePageMeta({
  middleware: ['auth'] 
})

const route = useRoute()

interface NodeSchema {
  id: string
  type: string
  label: string
  props: Record<string, any>
  children?: NodeSchema[]
}

const availableComponents = [    
   { 
    type: 'bool', 
    label: 'Boolean', 
    props: 
    { 
      type: 'bool', 
      key:'',
      label: '', 
      place: '', 
      text: '',
      enabled: true,
      required: false 
    } 
  },  {     
    type: 'button', 
    label: 'Button', 
    props: 
      { 
        type: 'button', 
        text: 'Button', 
        class: 'px-4 py-2 rounded text-white bg-gray-600 hover:bg-gray-700 transition',
        icon: 'heroicons:plus',
        onClick: ""
      }
  },
    { 
    type: 'color', 
    label: 'Color', 
    props: 
    { 
      type: 'color', 
      key:'',
      text: 'Color', 
      place: 'Enter a color', 
      enabled: true,
      required: false 
    } 
  },
    { 
    type: 'date', 
    label: 'Date', 
    props: 
    { 
      type: 'date', 
      key:'',
      text: 'Date', 
      place: 'Enter a date', 
      enabled: true,
      required: false 
    } 
  },
    { 
    type: 'datetime', 
    label: 'Date Time', 
    props: 
    { 
      type: 'datetime', 
      key:'',
      text: 'Date Time', 
      place: 'Enter a date time', 
      enabled: true,
      required: false 
    } 
  },
    { 
    type: 'email', 
    label: 'Email', 
    props: 
    { 
    type: 'email', 
      key:'',
      label: 'Email', 
      place: 'example@mail.com', 
      required: false 
    } 
  },
    { 
    type: 'file', 
    label: 'File', 
    props: 
    { 
      type: 'file', 
      key:'',
      text: 'File', 
      place: 'Enter a file', 
      enabled: true,
      required: false 
    } 
  },
  { 
    type: 'hidden', 
    label: 'Hidden', 
    props: 
    { 
      type: 'hidden', 
      text: 'Hidden Text', 
      place: 'Enter a text', 
      key:'',
      enabled: true,
      required: false 
    } 
  },
    { 
    type: 'image', 
    label: 'Image', 
    props: 
    { 
      type: 'image', 
      key:'',
      text: 'Image', 
      place: 'Enter a image', 
      enabled: true,
      required: false 
    } 
  },
    { 
    type: 'longtext', 
    label: 'Long Text', 
    props: 
      { 
        type: 'longtext', 
        key:'',
        label: 'Long Text', 
        place: 'Enter long text', 
        enabled: true,
        required: false 
      } 
  },
    { 
    type: 'month', 
    label: 'Month', 
    props: 
    { 
      type: 'month', 
      key:'',
      text: 'Month', 
      place: 'Enter a month', 
      enabled: true,
      required: false 
    } 
  },
    { 
    type: 'number', 
    label: 'Number', 
    props: 
      { 
        type: 'number', 
        key:'',
        label: 'Number', 
        place: 'enter a number', 
        required: false 
      } 
  },
    { 
    type: 'radio', 
    label: 'Radio', 
    props: 
    { 
      type: 'radio', 
      key:'',
      text: 'Radio', 
      place: 'Enter a radio', 
      enabled: true,
      required: false 
    } 
  },
  { 
    type: 'range', 
    label: 'Range', 
    props: 
    { 
      type: 'range', 
      key:'',
      text: 'Range', 
      place: 'Enter a range', 
      enabled: true,
      required: false 
    } 
  },
    { 
    type: 'reset', 
    label: 'Reset', 
    props: 
    { 
      type: 'reset', 
      key:'',
      text: 'Reset', 
      place: 'Enter a reset', 
      enabled: true,
      required: false 
    } 
  },
    { 
    type: 'select', 
    label: 'Select', 
    props: 
    { 
      type: 'select', 
      key:'',
      text: '', 
      source: '',
      label: '',
      place: 'Choose a data', 
      enabled: true,
      required: false 
    } 
  },
  { 
    type: 'tel', 
    label: 'Tel', 
    props: 
    { 
      type: 'tel', 
      key:'',
      text: 'Tel', 
      place: 'Enter a tel', 
      enabled: true,
      required: false 
    } 
  },
  { 
    type: 'text', 
    label: 'Text', 
    props: 
    { 
      type: 'text', 
      key:'',
      text: 'Text', 
      place: 'Enter a text', 
      enabled: true,
      required: false 
    } 
  },
  { 
    type: 'time', 
    label: 'Time', 
    props: 
    { 
      type: 'time', 
      key:'',
      text: 'Time', 
      place: 'Enter a time', 
      enabled: true,
      required: false 
    } 
  },
  { 
    type: 'url', 
    label: 'Url', 
    props: 
    { 
      type: 'url', 
      key:'',
      text: 'Url', 
      place: 'Enter a url', 
      enabled: true,
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
    type: 'master', 
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
      },
      children:[]
  },
  { 
    type: 'buttons', 
    label: 'Buttons', 
    props: 
      { 
        type: 'buttons', 
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
        type: 'table', 
        key: 'table0', 
        primary: '',
        text: '',
        source: '',
        class:'flex flex-wrap gap-2 mb-3' 
      }, 
      search: [], 
      columns: [] 
  },
  { 
    type: 'tables', 
    label: 'Tables', 
    props: 
      { 
    type: 'tables', 
        key: '', 
        class:'flex flex-wrap gap-2 mb-3',
      }, 
      tables: [],
      search: [] 
  },
  { 
    type: 'search', 
    label: 'Search', 
    props: 
      { 
    type: 'search', 
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
    type: 'columns', 
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
    type: 'modals', 
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
    type: 'modal', 
        key: '', 
        class:'flex flex-wrap gap-2 mb-3' 
      }, 
      children: [] 
  }
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

const onDropChild = ([parentId, newComp]) => {
  const findAndInsert = (nodes) => {
    for (const node of nodes) {   
      if (node.id === parentId) {
        if (!Array.isArray(node.children)) node.children = []
        node.children.push(newComp)
        return true
      }
      if (node.children && findAndInsert(node.children)) return true
    }
    return false
  }
  findAndInsert(canvasComponents.value)
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
  const designJson = canvasComponents.value
  const runtimeJson = designerToDbSchema(designJson)
  formSchema.value = runtimeJson
}

const toggleJson = () => {
  showJson.value = !showJson.value
}

const saveSchema = async () => {
  const designJson = canvasComponents.value
  const runtimeJson = designerToDbSchema(designJson)

  const dataForm = new FormData()
  dataForm.append('flow', 'modifmenuaccess')
  dataForm.append('menu', 'admin')
  dataForm.append('search', 'true')
  dataForm.append('menuaccessid', dataMenu.menuAccessId)
  dataForm.append('menuname', dataMenu.menuName)
  dataForm.append('description', dataMenu.description)
  dataForm.append('menucode', dataMenu.menuCode)
  dataForm.append('menuurl', dataMenu.menuUrl)
  dataForm.append('menuicon', dataMenu.menuIcon)
  dataForm.append('moduleiId', dataMenu.moduleId)
  dataForm.append('sortorder', dataMenu.sortOrder)
  dataForm.append('menuversion', dataMenu.menuVersion)
  dataForm.append('menutype', dataMenu.menuType)
  dataForm.append('recordstatus', dataMenu.recordStatus)
  dataForm.append('menuform', JSON.stringify(runtimeJson))
  try {
    const res = await Api.post('admin/execute-flow', dataForm)
    if (res?.code == 200) {
      alert('Runtime schema saved successfully')
    } else {
      alert(res.message)
    }
  } catch (err) {
          alert(err)
  }
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
      dataMenu.menuAccessId = res?.data.data.menuaccessid
      dataMenu.menuName = res?.data.data.menuname
      dataMenu.description = res?.data.data.description,
      dataMenu.menuCode = res?.data.data.menucode,
      dataMenu.menuUrl = res?.data.data.menuurl,
      dataMenu.menuIcon = res?.data.data.menuicon,
      dataMenu.moduleId = res?.data.data.moduleid,
      dataMenu.sortOrder = res?.data.data.sortorder,
      dataMenu.menuVersion = res?.data.data.menuversion,
      dataMenu.menuType = res?.data.data.menutype
      dataMenu.recordStatus = res?.data.data.recordstatus
      if (res?.data.data.menuform != '') {
        formSchema.value = res?.data?.data.menuform
        canvasComponents.value = dbSchemaToDesigner(JSON.parse(res?.data?.data.menuform))
      }
    } else {
      console.error('Invalid response from ', res)
    }
  } catch (err) {
    console.error('Error loading :', err)
  }
}

const copySchema = async() => {
  const name = window.prompt('Copy Schema From ? ')
  if (name) {
    try {
      const res = await getMenuForm(name)
      if (res?.code == 200) {
        if (res?.data.data.menuform != '') {
          formSchema.value = res?.data?.data.menuform
          canvasComponents.value = dbSchemaToDesigner(JSON.parse(res?.data?.data.menuform))
        }
      } else {
        console.error('Invalid response from ', res)
      }
    } catch (err) {
      console.error('Error loading :', err)
    }
  } else {
    console.log('Empty')
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

function getSearch(node: any): any[] {
  if (!Array.isArray(node)) return [];

  const res = node
    .filter((child) => child?.type === 'search')
    .flatMap((child) =>
      (child.children || []).map((nodeChild: any) => ({
        type: nodeChild.props?.type || 'text',
        key: nodeChild.props?.key || '',
        text: nodeChild.props?.text || '',
        place: nodeChild.props?.place || '',
        enabled: nodeChild.props?.enabled ?? true,
        required: nodeChild.props?.required ?? false,
      }))
    );
  return res;
}

function getColumns(node: any): any[] {
  if (!Array.isArray(node)) return [];

  const res = node
    .filter((child) => child?.type === 'columns')
    .flatMap((child) =>
      (child.children || []).map((nodeChild: any) => ({
        type: nodeChild.props?.type || 'text',
        key: nodeChild.props?.key || '',
        text: nodeChild.props?.text || '',
        primary: nodeChild.props?.primary ?? false,
      }))
    );
  return res;
}

function recursiveDesignerToDbSchema(node: any, result:any): any {
  (node.children || []).forEach((child) => {
    switch (child.type) {
      case "buttons":
        result.buttons = {
          class: child.class || "flex flex-wrap gap-2 mb-3",
          components: (child.children || []).map((nextchild) => ({
            text : nextchild.props.text || '',
            class : nextchild.props.class || '',
            icon : nextchild.props.icon || '',
            onClick : nextchild.props.onClick || '',
          }))
        };
        break;

      case "tables":
        result.tables = (child.children || []).map((tbl) => ({
          type: "table",
          text: tbl.props.text || '',
          key: tbl.props.key || '',
          primary: tbl.props.primary,
          source: tbl.props.source,
          search: getSearch(tbl.children),
          columns: getColumns(tbl.children)
        }));
        break;

      case "modals":
        result.modals = (child.children || []).map((modal) => ({
          type: modal.type || 'modal',
          key: modal.key || 'modalForm',
          components: (modal.children || []).map((nextchild) => ({
            type: nextchild.props.type || 'text',
            key: nextchild.props.key || '',
            text: nextchild.props.text || '',
            length: nextchild.props.length || 0,
            place: nextchild.props.place || '',
            source: nextchild.props.source || '',
            label: nextchild.props.label || '',
            enable: nextchild.props.enable || true,
            validated: nextchild.props.validated
          })),
        }));
        break;
    }
  });
  return result
}


function designerToDbSchema(designer: NodeSchema[]): any {
  if (!designer?.length) return
  const master = designer[0]

  const result = {
    type: master.type || "master",
    class: master.props.class || "",
    layout: master.props.layout || "",
    primary: master.props.primary || "",
    title: master.props.title || null,
    subtitle: master.props.subtitle || null,
    action: master.props.action || {},
    buttons: [],
    tables: [],
    modals: [],
  };

  // Loop semua children level pertama

  return recursiveDesignerToDbSchema(master, result);
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
