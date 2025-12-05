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
    <div class="flex-none bg-white border-r z-10">
      <Sidebar />
    </div>

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
          <textarea v-model="debugText" class="w-full h-120 p-3 border rounded font-mono text-sm"></textarea>
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
import Sidebar from '~/components/form/Sidebar.vue';
import RenderNode from '~/components/RenderNode.vue';
import TreeView from '~/components/TreeView.vue';
import PropertyEditor from '~/components/PropertyEditor.vue';
import { availableComponents, layoutContainers } from '~/types/components';

definePageMeta({
  middleware: ['auth'],
  layout: 'auth'
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

const formattedJson = ref('');

const canvasComponents = ref<NodeSchema[]>([]);
const selected = ref<NodeSchema | null>(null);
const formSchema = ref<Record<string, any> | null>(null);
const previewMode = ref(false);
const showJson = ref(true);
const { getMenuForm } = useAuth();
const Api = useApi();

function getDefaultProps(type: string) {
  const found = availableComponents.find((x) => x.type === type) || layoutContainers.find((x) => x.type === type);

  return found ? JSON.parse(JSON.stringify(found.props || {})) : {};
}

const onDragStart = (comp: any) => {
  event?.dataTransfer?.setData('component', JSON.stringify(comp));
  window.draggingComponent = comp; // ✅ simpan global
};

const onDropRoot = (event: DragEvent) => {
  const data = event.dataTransfer?.getData('component');
  if (!data) return;

  const comp = JSON.parse(data);
  const defaults = getDefaultProps(comp.type);

  const newComp: NodeSchema = {
    id: Math.random().toString(36).substr(2, 9),
    type: comp.type,
    label: comp.label,
    props: { ...defaults },
    children: comp.children ? [] : undefined,
  };

  canvasComponents.value.push(newComp);
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
  canvasComponents.value = [];
};

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
      toast.add({ title: 'Success', description: 'Runtime schema saved successfully', color: 'success' });
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
      dataMenu.description = res?.data.data.description;
      dataMenu.menuCode = res?.data.data.menucode;
      dataMenu.menuUrl = res?.data.data.menuurl;
      dataMenu.menuIcon = res?.data.data.menuicon;
      dataMenu.moduleId = res?.data.data.moduleid;
      dataMenu.sortOrder = res?.data.data.sortorder;
      dataMenu.menuVersion = res?.data.data.menuversion;
      dataMenu.menuType = res?.data.data.menutype;
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
  console.log(name)
  if (name) {
    try {
      const res = await getMenuForm(name);
      if (res?.code == 200) {
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
  } else {
    console.warn('Empty');
  }
};

onMounted(async () => {
  loadSchema();
});

const debugText = computed({
  get() {
    return JSON.stringify(canvasComponents.value, null, 2);
  },
  set(v: string) {
    try {
      canvasComponents.value = JSON.parse(v);
    } catch (err) {
      console.error(err);
    }
  },
});

watch(
  canvasComponents,
  (newVal) => {
    formattedJson.value = newVal;
    formSchema.value = newVal;
  },
  { deep: true, immediate: true },
);
</script>
