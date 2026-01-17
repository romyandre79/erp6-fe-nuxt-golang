<template>
  <div class="flex">
    <button 
      class="text-black dark:text-white w-full py-1 rounded cursor-pointer" 
      @click="handleUndo"
      :disabled="!canUndo"
      :class="{ 'opacity-50 cursor-not-allowed': !canUndo }"
      title="Undo (Ctrl+Z)"
    >
      ↶ Undo
    </button>
    <button 
      class="text-black dark:text-white w-full py-1 rounded cursor-pointer" 
      @click="handleRedo"
      :disabled="!canRedo"
      :class="{ 'opacity-50 cursor-not-allowed': !canRedo }"
      title="Redo (Ctrl+Y)"
    >
      ↷ Redo
    </button>
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
    <main class="flex-1 p-5 overflow-auto w-full">
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
                @duplicate="handleDuplicate"
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
    <aside class="w-1/4 border-l p-4 overflow-y-auto">
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
import { ref } from 'vue';
import draggable from 'vuedraggable';
import Sidebar from '~/components/widget/WidgetSidebar.vue';
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
const { getWidgetForm } = useWidgets();
const Api = useApi();

// Undo/Redo functionality
const { canUndo, canRedo, record, undo, redo, reset } = useUndoRedo<NodeSchema[]>([], {
  historyLimit: 50,
  enableKeyboardShortcuts: false // We'll handle this manually to sync with canvasComponents
});

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



const generateNewId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const cloneComponentWithNewIds = (component: NodeSchema): NodeSchema => {
  const cloned: NodeSchema = {
    ...component,
    id: generateNewId(),
    props: { ...component.props }
  };
  
  if (component.children && component.children.length > 0) {
    cloned.children = component.children.map(child => cloneComponentWithNewIds(child));
  }
  
  return cloned;
};

const handleDuplicate = (node: NodeSchema) => {
  const newComp = cloneComponentWithNewIds(node);
  
  const findParentAndInsert = (nodes: NodeSchema[], targetId: string): boolean => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === targetId) {
        nodes.splice(i + 1, 0, newComp);
        return true;
      }
      if (nodes[i].children && findParentAndInsert(nodes[i].children!, targetId)) {
        return true;
      }
    }
    return false;
  };

  if (!findParentAndInsert(canvasComponents.value, node.id)) {
      // Fallback if not found
      canvasComponents.value.push(newComp);
  }
  
  toast.add({ 
    title: 'Component Duplicated', 
    description: `"${newComp.label}" duplicated successfully`, 
    color: 'success',
    timeout: 2000
  });
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

// Undo/Redo handlers
const handleUndo = () => {
  const previousState = undo();
  if (previousState) {
    canvasComponents.value = JSON.parse(JSON.stringify(previousState));
  }
};

const handleRedo = () => {
  const nextState = redo();
  if (nextState) {
    canvasComponents.value = JSON.parse(JSON.stringify(nextState));
  }
};

// Keyboard shortcuts for undo/redo
const handleKeyDown = (event: KeyboardEvent) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const ctrlKey = isMac ? event.metaKey : event.ctrlKey;

  // Undo: Ctrl+Z
  if (ctrlKey && event.key === 'z' && !event.shiftKey) {
    event.preventDefault();
    handleUndo();
  }

  // Redo: Ctrl+Y or Ctrl+Shift+Z
  if ((ctrlKey && event.key === 'y') || (ctrlKey && event.shiftKey && event.key === 'z')) {
    event.preventDefault();
    handleRedo();
  }
};

const clearSchema = async () => {
  canvasComponents.value = [];
};

import { useUnsavedChanges } from '~/composables/useUnsavedChanges';

const { isDirty, markDirty, markClean } = useUnsavedChanges();

const isLoading = ref(false);

const saveSchema = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  const dataForm = new FormData();
  dataForm.append('flowname', 'modifwidget');
  dataForm.append('menu', 'admin');
  dataForm.append('search', 'true');
  dataForm.append('widgetid', dataMenu.widgetid);
  dataForm.append('widgetname', dataMenu.widgetname);
  dataForm.append('description', dataMenu.description);
  dataForm.append('widgettitle', dataMenu.widgettitle);
  dataForm.append('widgetversion', dataMenu.widgetversion);
  dataForm.append('widgetby', dataMenu.widgetby);
  dataForm.append('moduleid', dataMenu.moduleid);
  dataForm.append('recordstatus', dataMenu.recordStatus);
  dataForm.append('widgetform', JSON.stringify(formattedJson.value));
  try {
    const res = await Api.post('api/admin/execute-flow', dataForm);
    if (res?.code == 200) {
      toast.add({ title: 'Success', description: 'Runtime schema saved successfully', color: 'success' });
      markClean();
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
  widgetid: Number,
  widgetname: String,
  widgettitle: String,
  widgetversion: String,
  widgetform: String,
  description: String,
  moduleid: Number,
  modulename: String,
  widgetby: String,
  installdate: String,
  recordStatus: Number,
});

const getDefaultProps = (type: string) => {
  const found = availableComponents.find((x) => x.type === type) || layoutContainers.find((x) => x.type === type);
  return found ? JSON.parse(JSON.stringify(found.props || {})) : {};
};

const hydrateNodeProps = (nodes: NodeSchema[]) => {
  nodes.forEach((node) => {
    const defaults = getDefaultProps(node.type);
    node.props = { ...defaults, ...node.props };
        
    // Explicitly ensure key exists if it's in defaults
    if ('key' in defaults && !('key' in node.props)) {
      node.props.key = defaults.key;
    }

    if (node.children && node.children.length > 0) {
      hydrateNodeProps(node.children);
    }
  });
  return nodes;
};

const loadSchema = async () => {
  isLoading.value = true;
  try {
    const res = await getWidgetForm(route.params.slug);
    if (res?.code == 200) {
      dataMenu.widgetid = res?.data.data.widgetid;
      dataMenu.widgetname = res?.data.data.widgetname;
      dataMenu.description = res?.data.data.description;
      ((dataMenu.widgettitle = res?.data.data.widgettitle),
        (dataMenu.widgetversion = res?.data.data.widgetversion),
        (dataMenu.moduleid = res?.data.data.moduleid),
        (dataMenu.modulename = res?.data.data.modulename),
        (dataMenu.widgetby = res?.data.data.widgetby),
        (dataMenu.installdate = res?.data.data.installdate),
        (dataMenu.recordStatus = res?.data.data.recordstatus));
      if (res?.data.data.widgetform != '') {
        formSchema.value = res?.data?.data.widgetform;
        let parsed = JSON.parse(res?.data?.data.widgetform);
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
};

const copySchema = async () => {
  const name = window.prompt('Copy Schema From ? ');
  if (name) {
    isLoading.value = true;
    try {
      const res = await getWidgetForm(name);
      if (res?.code == 200) {
        if (res?.data.data.widgetform != '') {
          formSchema.value = res?.data?.data.widgetform;
          let parsed = JSON.parse(res?.data?.data.widgetform);
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

onMounted(async () => {
  loadSchema();
  
  // Register keyboard shortcuts
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  // Remove keyboard listener
  window.removeEventListener('keydown', handleKeyDown);
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
    markDirty();
    // Record state for undo/redo
    record(JSON.parse(JSON.stringify(newVal)));
  },
  { deep: true, immediate: false }, // Changed to false to avoid recording initial state
);

// Reset undo/redo history when schema is loaded
watch(
  () => formSchema.value,
  (newVal) => {
    if (newVal && canvasComponents.value.length > 0) {
      reset(JSON.parse(JSON.stringify(canvasComponents.value)));
    }
  },
  { immediate: false }
);

</script>
