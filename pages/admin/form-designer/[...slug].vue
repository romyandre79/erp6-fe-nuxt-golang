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
    <!-- Global Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-100 bg-opacity-75 cursor-wait">
      <div class="flex flex-col items-center">
           <svg class="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-600 font-medium text-lg">Processing...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import draggable from 'vuedraggable';
import { availableComponents, layoutContainers } from '~/types/components';

// Lazy load heavy components for code splitting
const Sidebar = defineAsyncComponent(() => import('~/components/form/FormSidebar.vue'));
const RenderNode = defineAsyncComponent(() => import('~/components/RenderNode.vue'));
const TreeView = defineAsyncComponent(() => import('~/components/TreeView.vue'));
const PropertyEditor = defineAsyncComponent(() => import('~/components/PropertyEditor.vue'));

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

const isLoading = ref(false);

const clearSchema = async () => {
  canvasComponents.value = [];
};

const saveSchema = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
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
    const res = await Api.post('api/admin/execute-flow', dataForm);
    if (res?.code == 200) {
      toast.add({ title: 'Success', description: 'Runtime schema saved successfully', color: 'success' });
    } else {
      toast.add({ title: 'Error', description: res.message, color: 'error' });
    }
  } catch (err) {
    toast.add({ title: 'Error', description: err, color: 'error' });
  } finally {
    isLoading.value = false;
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

const hydrateNodeProps = (nodes: NodeSchema[]) => {
  nodes.forEach((node) => {
    const defaults = getDefaultProps(node.type);
    // Merge defaults with existing props, preserving existing values but adding missing keys
    node.props = { ...defaults, ...node.props };
    
    // Explicitly ensure key exists if it's in defaults, even if it was lost
    if ('key' in defaults && !('key' in node.props)) {
      node.props.key = defaults.key;
    }

    if (node.children && node.children.length > 0) {
      hydrateNodeProps(node.children);
    }
  });
  return nodes;
};

// 🔒 LOCK SCHEMA (METADATA LOCK)
const acquireLock = async (menuId: number) => {
  try {
    const res = await Api.post('api/admin/lock-record', {
      tablename: 'sys_menu',
      recordid: Number(menuId),
      locktype: 'design'
    });
    
    if (res.code === 200) {
      toast.add({ title: 'Design Mode', description: 'Schema locked for editing', color: 'success' });
    } else {
      toast.add({ title: 'Lock Failed', description: res.message || 'Could not acquire lock', color: 'error' });
    }
  } catch (err) {
    console.error('Lock error:', err);
  }
};

const releaseLock = async () => {
  if (!dataMenu.menuAccessId) return;
  try {
    await Api.post('api/admin/unlock-record', {
      tablename: 'sys_menu',
      recordid: Number(dataMenu.menuAccessId)
    });
  } catch (err) {
    console.error('Unlock error:', err);
  }
};

const loadSchema = async () => {
  isLoading.value = true;
  try {
    const res = await getMenuForm(route.params.slug, true);
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
      
      // Acquire Lock
      await acquireLock(dataMenu.menuAccessId as number);

      if (res?.data.data.menuform != '') {
        formSchema.value = res?.data?.data.menuform;
        let parsed = JSON.parse(res?.data?.data.menuform);
        canvasComponents.value = hydrateNodeProps(parsed);
      }
    } else if (res?.code == 423 || res?.message === 'SCHEMA_LOCKED') {
       toast.add({ 
          title: 'Schema Locked', 
          description: res.message || 'This form is being designed by another user', 
          color: 'error', 
          timeout: 0 
       });
    } else {
      console.error('Invalid response from ', res);
    }
  } catch (err) {
    console.error('Error loading :', err);
  } finally {
    isLoading.value = false;
  }
};

const copySchema = async () => {
  const name = window.prompt('Copy Schema From ? ');
  if (name) {
    isLoading.value = true;
    try {
      const res = await getMenuForm(name);
      if (res?.code == 200) {
        if (res?.data.data.menuform != '') {
          const raw = res.data.data.menuform;

          // escape string agar aman jadi regex
          const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

          // replace ignore case + global
          const text = raw.replace(
            new RegExp(escapedName, 'gi'),
            route.params.slug
          );

          formSchema.value = text;

          let parsed;
          try {
            parsed = JSON.parse(text);
          } catch (e) {
            console.error('Invalid JSON after replace', e);
            return;
          }
          canvasComponents.value = hydrateNodeProps(parsed);
        }
      } else {
        console.error('Invalid response from ', res);
      }
    } catch (err) {
      console.error('Error loading :', err);
    } finally {
      isLoading.value = false;
    }
  } else {
    console.warn('Empty');
  }
};

const heartbeatInterval = ref<NodeJS.Timer | null>(null);

onBeforeUnmount(() => {
  if (heartbeatInterval.value) clearInterval(heartbeatInterval.value);
  releaseLock();
});

onMounted(async () => {
  await loadSchema();
  
  // Start Heartbeat to refresh lock every 60s
  if (dataMenu.menuAccessId) {
    heartbeatInterval.value = setInterval(() => {
      acquireLock(dataMenu.menuAccessId as number);
    }, 60000);
  }
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
