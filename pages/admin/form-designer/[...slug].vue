<template>
  <div class="flex">
    <button class="text-black dark:text-white w-full py-1 rounded cursor-pointer" @click="saveSchema">
      💾 Save Schema
    </button>
    <button class="text-black dark:text-white w-full py-1 rounded cursor-pointer" @click="clearSchema">
      Clear Schema
    </button>
    <button class="text-black dark:text-white w-full py-1 rounded cursor-pointer" @click="loadSchema">
      📂 Load Schema
    </button>
    <button class="text-black dark:text-white w-full py-1 rounded cursor-pointer" @click="copySchema">
      📂 Copy From ...
    </button>
    <button class="text-black dark:text-white w-full py-1 rounded cursor-pointer" @click="togglePreview">
      {{ previewMode ? '🧱 Edit Mode' : '👁 Preview' }}
    </button>
    <button class="text-black dark:text-white w-full py-1 rounded cursor-pointer" @click="toggleJson">
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
        :key="'grp-' + idx"
        class="border rounded p-2 mb-2 cursor-move hover:bg-gray-100 dark:hover:bg-white dark:hover:text-black"
        draggable="true"
        @dragstart="onDragStart(group)"
      >
        {{ group.label }}
      </div>
    </aside>

    <!-- 🔹 Canvas Tengah -->
    <main class="flex-1 p-5 overflow-auto w-full bg-white dark:bg-black">
      <div
        v-if="previewMode"
        class="flex items-center justify-between sticky top-0 z-50 px-6 py-3 transition-colors duration-300 backdrop-blur-md"
      >
        <FormRender
          v-if="formSchema"
          :schema="formSchema"
          :menuName="dataMenu.menuName"
          :formType="dataMenu.menuType"
          :title="dataMenu.description"
        />
      </div>
      <div v-if="!previewMode" class="min-h-[80vh] rounded-xl shadow-inner" @dragover.prevent @drop="onDropRoot">
        <div v-if="!canvasComponents?.length" class="text-gray-400 text-center py-20">
          Drag components or containers here
        </div>

        <draggable v-model="canvasComponents" group="components" item-key="id" class="space-y-3">
          <template #item="{ element }">
            <div
              class="panel border rounded p-3 cursor-pointer relative group"
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
        <!-- 🔍 JSON Debug View -->
        <div v-if="showJson && !previewMode" class="panel font-mono text-sm rounded-xl p-4 overflow-auto max-h-[80vh]">
          <h1>Debug</h1>
          <textarea
  v-model="debugText"
  class="w-full h-120 p-3 border rounded font-mono text-sm"
></textarea>
        </div>
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
import { ref } from 'vue';
import draggable from 'vuedraggable';
import RenderNode from '~/components/RenderNode.vue';
import TreeView from '~/components/TreeView.vue';
import PropertyEditor from '~/components/PropertyEditor.vue';

definePageMeta({
  middleware: ['auth'],
});

const route = useRoute();
const toast = useToast();

interface NodeSchema {
  id: string;
  type: string;
  label: string;
  props: Record<string, any>;
  children?: NodeSchema[];
}

const availableComponents = [
  {
    type: 'bool',
    label: 'Boolean',
    props: {
      key: '',
      label: '',
      place: '',
      text: '',
      primary: false,
      enabled: true,
      required: false,
    },
  },
  {
    type: 'button',
    label: 'Button',
    props: {
      text: 'Button',
      class: 'px-4 py-2 rounded transition',
      icon: 'heroicons:plus',
      onClick: '',
    },
  },
  {
    type: 'color',
    label: 'Color',
    props: {
      key: '',
      text: 'Color',
      place: 'Enter a color',
      primary: false,
      enabled: true,
      required: false,
    },
  },
  {
    type: 'date',
    label: 'Date',
    props: {
      key: '',
      text: 'Date',
      place: 'Enter a date',
      primary: false,
      enabled: true,
      required: false,
    },
  },
  {
    type: 'datetime',
    label: 'Date Time',
    props: {
      key: '',
      text: 'Date Time',
      place: 'Enter a date time',
      primary: false,
      enabled: true,
      required: false,
    },
  },
  {
    type: 'email',
    label: 'Email',
    props: {
      key: '',
      label: 'Email',
      place: 'example@mail.com',
      primary: false,
      enabled: true,
      required: false,
    },
  },
  {
    type: 'file',
    label: 'File',
    props: {
      key: '',
      text: 'File',
      place: 'Enter a file',
      primary: false,
      enabled: true,
      required: false,
    },
  },
  {
    type: 'hidden',
    label: 'Hidden',
    props: {
      text: 'Hidden Text',
      place: 'Enter a text',
      key: '',
      primary: false,
      enabled: true,
      required: false,
    },
  },
  {
    type: 'image',
    label: 'Image',
    props: {
      key: '',
      text: 'Image',
      place: 'Enter a image',
      primary: false,
      enabled: true,
      required: false,
    },
  },
  {
    type: 'longtext',
    label: 'Long Text',
    props: {
      key: '',
      label: 'Long Text',
      place: 'Enter long text',
      primary: false,
      enabled: true,
      required: false,
    },
  },
  {
    type: 'month',
    label: 'Month',
    props: {
      key: '',
      text: 'Month',
      place: 'Enter a month',
      primary: false,
      enabled: true,
      required: false,
    },
  },
  {
    type: 'number',
    label: 'Number',
    props: {
      key: '',
      label: 'Number',
      place: 'enter a number',
      text: '',
      primary: false,
      enabled: true,
      required: false,
    },
  },
  {
    type: 'radio',
    label: 'Radio',
    props: {
      key: '',
      text: 'Radio',
      place: 'Enter a radio',
      primary: false,
      enabled: true,
      required: false,
    },
  },
  {
    type: 'range',
    label: 'Range',
    props: {
      key: '',
      text: 'Range',
      place: 'Enter a range',
      primary: false,
      enabled: true,
      required: false,
    },
  },
  {
    type: 'reset',
    label: 'Reset',
    props: {
      key: '',
      text: 'Reset',
      place: 'Enter a reset',
      primary: false,
      enabled: true,
      required: false,
    },
  },
  {
    type: 'select',
    label: 'Select',
    props: {
      key: '',
      text: '',
      source: '',
      label: '',
      place: 'Choose a data',
      primary: false,
      enabled: true,
      required: false,
    },
  },
  {
    type: 'tel',
    label: 'Tel',
    props: {
      key: '',
      text: 'Tel',
      place: 'Enter a tel',
      primary: false,
      enabled: true,
      required: false,
    },
  },
  {
    type: 'text',
    label: 'Text',
    props: {
      key: '',
      text: 'Text',
      place: 'Enter a text',
      primary: false,
      enabled: true,
      required: false,
    },
  },
  {
    type: 'time',
    label: 'Time',
    props: {
      key: '',
      text: 'Time',
      place: 'Enter a time',
      primary: false,
      enabled: true,
      required: false,
    },
  },
  {
    type: 'url',
    label: 'Url',
    props: {
      key: '',
      text: 'Url',
      place: 'Enter a url',
      primary: false,
      enabled: true,
      required: false,
    },
  },
  {
    type: 'title',
    label: 'Title',
    props: {
      text: 'title',
      class: 'tracking-tight mb-4',
    },
  },
  {
    type: 'subtitle',
    label: 'Sub Title',
    props: {
      text: 'Sub Title',
      class: 'tracking-tight mb-4',
    },
  },
  {
    type: 'action',
    label: 'Action',
    props: {
      onNew: '',
      onGet: '',
      onGetDetail: [],
      onCreate: '',
      onUpdate: '',
      onUpload: '',
      onPurge: '',
      onPdf: '',
      onXls: '',
    },
  },
];

const formattedJson = ref('');


const layoutContainers = [
  {
    type: 'master',
    label: 'Master',
    props: {
      class: 'w-full',
      layout: 'standard',
      key: 'master',
      primary: '',
    },
    children: [],
  },
  {
    type: 'buttons',
    label: 'Buttons',
    props: {
      key: '',
      class: 'flex flex-wrap gap-2 mb-3',
    },
    children: [],
  },
  {
    type: 'table',
    label: 'Table',
    props: {
      key: 'table0',
      primary: '',
      relationkey: '',
      text: '',
      source: '',
      class: 'w-full mb-4',
    },
    children: [],
  },
  {
    type: 'tables',
    label: 'Tables',
    props: {
      key: '',
      class: 'flex flex-wrap gap-2 mb-3',
    },
    children: [],
  },
  {
    type: 'search',
    label: 'Search',
    props: {
      key: '',
      class: '',
    },
    children: [],
  },
  {
    type: 'columns',
    label: 'Columns',
    props: {
      key: '',
      class: 'flex flex-wrap gap-2 mb-3',
    },
    children: [],
  },
  {
    type: 'modals',
    label: 'Modals',
    props: {
      key: '',
      class: 'flex flex-wrap gap-2 mb-3',
    },
    children: [],
  },
  {
    type: 'modal',
    label: 'Modal',
    props: {
      key: '',
      text: '',
      class: 'flex flex-wrap gap-2 mb-3',
    },
    children: [],
  },
];

const canvasComponents = ref<NodeSchema[]>([]);
const selected = ref<NodeSchema | null>(null);
const formSchema = ref<Record<string, any> | null>(null);
const previewMode = ref(false);
const showJson = ref(true);
const { getMenuForm } = useAuth();
const Api = useApi();

const onDragStart = (comp: any) => {
  event?.dataTransfer?.setData('component', JSON.stringify(comp));
  window.draggingComponent = comp; // ✅ simpan global
};

const onDropRoot = (event: DragEvent) => {
  const data = event.dataTransfer?.getData('component');
  if (!data) return;
  const comp = JSON.parse(data);
  const newComp: NodeSchema = {
    id: Math.random().toString(36).substr(2, 9),
    ...comp,
  };
  canvasComponents.value.push(newComp);
  window.draggingComponent = null; // ✅ reset
};

const onDropChild = ([parentId, newComp]) => {
  const findAndInsert = (nodes) => {
    for (const node of nodes) {
      if (node.id === parentId) {
        if (!Array.isArray(node.children)) node.children = [];
        node.children.push(newComp);
        return true;
      }
      if (node.children && findAndInsert(node.children)) return true;
    }
    return false;
  };
  findAndInsert(canvasComponents.value);
};

const deleteNode = (target: NodeSchema) => {
  if (!confirm(`Are you sure you want to delete "${target.label}"?`)) return;

  const removeFrom = (nodes: NodeSchema[]): boolean => {
    const index = nodes.findIndex((n) => n.id === target.id);
    if (index !== -1) {
      nodes.splice(index, 1);
      return true;
    }
    for (const node of nodes) {
      if (node.children && removeFrom(node.children)) return true;
    }
    return false;
  };

  removeFrom(canvasComponents.value);
  selected.value = null;
};

const selectComponent = (node: NodeSchema) => {
  selected.value = node;
};

const togglePreview = () => {
  previewMode.value = !previewMode.value;
};

const toggleJson = () => {
  showJson.value = !showJson.value;
};

const clearSchema = async () => {
  canvasComponents.value = []
}

const saveSchema = async () => {
  const dataForm = new FormData();
  dataForm.append('flowname', 'modifmenuaccess');
  dataForm.append('menu', 'admin');
  dataForm.append('search', 'true');
  dataForm.append('menuaccessid', dataMenu.menuAccessId);
  dataForm.append('menuname', dataMenu.menuName);
  dataForm.append('description', dataMenu.description);
  dataForm.append('menucode', dataMenu.menuCode);
  dataForm.append('menuurl', dataMenu.menuUrl);
  dataForm.append('menuicon', dataMenu.menuIcon);
  dataForm.append('moduleiId', dataMenu.moduleId);
  dataForm.append('sortorder', dataMenu.sortOrder);
  dataForm.append('menuversion', dataMenu.menuVersion);
  dataForm.append('menutype', dataMenu.menuType);
  dataForm.append('recordstatus', dataMenu.recordStatus);
  dataForm.append('menuform', JSON.stringify(formattedJson.value));
  try {
    const res = await Api.post('admin/execute-flow', dataForm);
    if (res?.code == 200) {
      toast.add({ title: 'Success', description: 'Runtime schema saved successfully', color: 'ssuccess' });
    } else {
      toast.add({ title: 'Error', description: res.message, color: 'error' });
    }
  } catch (err) {
    toast.add({ title: 'Error', description: err, color: 'error' });
  }
};

const dataMenu = reactive({
  menuAccessId: Number,
  menuName: String,
  description: String,
  menuCode: String,
  menuUrl: String,
  menuIcon: String,
  moduleId: Number,
  sortOrder: Number,
  menuVersion: String,
  menuType: String,
  recordStatus: Number,
});

const loadSchema = async () => {
  try {
    const res = await getMenuForm(route.params.slug);
    if (res?.code == 200) {
      dataMenu.menuAccessId = res?.data.data.menuaccessid;
      dataMenu.menuName = res?.data.data.menuname;
      ((dataMenu.description = res?.data.data.description),
        (dataMenu.menuCode = res?.data.data.menucode),
        (dataMenu.menuUrl = res?.data.data.menuurl),
        (dataMenu.menuIcon = res?.data.data.menuicon),
        (dataMenu.moduleId = res?.data.data.moduleid),
        (dataMenu.sortOrder = res?.data.data.sortorder),
        (dataMenu.menuVersion = res?.data.data.menuversion),
        (dataMenu.menuType = res?.data.data.menutype));
      dataMenu.recordStatus = res?.data.data.recordstatus;
      if (res?.data.data.menuform != '') {
        formSchema.value = res?.data?.data.menuform;
        canvasComponents.value = JSON.parse(res?.data?.data.menuform);
      }
    } else {
      console.error('Invalid response from ', res);
    }
  } catch (err) {
    console.error('Error loading :', err);
  }
};

const copySchema = async () => {
  const name = window.prompt('Copy Schema From ? ');
  if (name) {
    try {
      const res = await getMenuForm(name);
      if (res?.code == 200) {
        if (res?.data.data.menuform != '') {
          formSchema.value = res?.data?.data.menuform;
          canvasComponents.value = res?.data?.data.menuform;
        }
      } else {
        console.error('Invalid response from ', res);
      }
    } catch (err) {
      console.error('Error loading :', err);
    }
  } else {
    console.log('Empty');
  }
};

onMounted(async () => {
  loadSchema();
});

const debugText = computed({
  get() {
    return JSON.stringify(canvasComponents.value, null, 2)
  },
  set(v: string) {
    try {
      canvasComponents.value = JSON.parse(v)
    } catch {}
  }
})

watch(
  canvasComponents,
  (newVal) => {
    formattedJson.value = newVal;
    formSchema.value = newVal;
  },
  { deep: true, immediate: true },
);
</script>
