<template>
  <!-- Designer Header/Toolbar (Sticky) -->
  <div class="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
    <!-- Left: Logo & Title -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <UIcon name="heroicons:cube" class="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 class="font-bold text-gray-800 dark:text-white text-sm">Form Designer - {{ dataMenu.description || 'Untitled Form' }}</h1>
        </div>
      </div>
    </div>

    <!-- Center: Action Buttons -->
    <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
      <button 
        @click="handleUndo"
        :disabled="!canUndo"
        class="toolbar-action-btn"
        :class="{ 'opacity-40 cursor-not-allowed': !canUndo }"
        title="Undo (Ctrl+Z)"
      >
        <UIcon name="heroicons:arrow-uturn-left" class="w-4 h-4" />
      </button>
      <button 
        @click="handleRedo"
        :disabled="!canRedo"
        class="toolbar-action-btn"
        :class="{ 'opacity-40 cursor-not-allowed': !canRedo }"
        title="Redo (Ctrl+Y)"
      >
        <UIcon name="heroicons:arrow-uturn-right" class="w-4 h-4" />
      </button>
      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
      <button 
        @click="togglePreview" 
        class="toolbar-action-btn"
        :class="{ 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400': previewMode }"
      >
        <UIcon :name="previewMode ? 'heroicons:eye' : 'heroicons:eye-slash'" class="w-4 h-4" />
        <span class="text-xs">{{ previewMode ? 'Editing' : 'Preview' }}</span>
      </button>
    </div>

    <!-- Right: Save Actions -->
    <div class="flex items-center gap-2">
      <button @click="loadSchema" class="btn-secondary">
        <UIcon name="heroicons:arrow-path" class="w-4 h-4" />
        <span>Reload</span>
      </button>
      <button @click="copySchema" class="btn-secondary">
        <UIcon name="heroicons:clipboard-document" class="w-4 h-4" />
        <span>Copy From</span>
      </button>
      <button @click="saveSchema" class="btn-primary" :disabled="isLoading">
        <UIcon v-if="isLoading" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
        <UIcon v-else name="heroicons:cloud-arrow-up" class="w-4 h-4" />
        <span>{{ isLoading ? 'Saving...' : 'Save' }}</span>
      </button>
    </div>
  </div>

  <!-- Main Designer Layout -->
  <div class="flex h-[calc(100vh-57px)] overflow-hidden bg-gray-100 dark:bg-gray-950">
    <!-- Left: Block Sidebar -->
    <div class="flex-none w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-10">
      <DesignerSidebar title="Blocks" designerType="form" />
    </div>

    <!-- Center: Canvas Area -->
    <main class="flex-1 overflow-auto relative">
      <!-- Preview Mode -->
      <div v-if="previewMode" class="p-6">
        <div class="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
          <FormRender
            v-if="formSchema"
            :schema="formSchema"
            :menuName="dataMenu.menuName"
            :formType="dataMenu.menuType"
            :title="dataMenu.description"
          />
        </div>
      </div>

      <!-- Edit Mode Canvas -->
      <div 
        v-else 
        class="min-h-full p-6"
        @dragover.prevent 
        @drop="onDropRoot"
      >
        <!-- Empty State -->
        <div 
          v-if="!canvasComponents?.length" 
          class="h-full flex items-center justify-center"
        >
          <div class="text-center max-w-md mx-auto p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-white/50 dark:bg-gray-900/50">
            <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
              <UIcon name="heroicons:plus" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Start Building</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm">Drag blocks from the sidebar and drop them here to build your form</p>
          </div>
        </div>

        <!-- Components Canvas -->
        <div v-else class="max-w-4xl mx-auto space-y-3">
          <draggable 
            v-model="canvasComponents" 
            group="components" 
            item-key="id" 
            class="space-y-3"
            ghost-class="dragging-ghost"
            chosen-class="dragging-chosen"
          >
            <template #item="{ element, index }">
              <div
                class="relative group"
                :class="{ 
                  'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-950 rounded-xl': selected?.id === element.id 
                }"
                @click.stop="selectComponent(element, $event, index)"
              >
                <RenderNode
                  :node="element"
                  :preview="previewMode"
                  :showJson="showJson"
                  :selected="selected"
                  @select="handleNodeSelect"
                  @drop-child="onDropChild"
                  @delete="deleteNode"
                  @duplicate="handleDuplicate"
                />
              </div>
            </template>
          </draggable>
        </div>

        <!-- Debug Panel -->
        <div v-if="showJson && !previewMode" class="max-w-4xl mx-auto mt-6">
          <div class="bg-gray-900 rounded-xl overflow-hidden">
            <div class="flex items-center justify-between px-4 py-2 bg-gray-800">
              <span class="text-xs font-medium text-gray-400">JSON Debug</span>
              <button @click="showJson = false" class="text-gray-400 hover:text-white">
                <UIcon name="heroicons:x-mark" class="w-4 h-4" />
              </button>
            </div>
            <textarea 
              v-model="debugText" 
              class="w-full h-80 p-4 bg-gray-900 text-green-400 font-mono text-xs border-0 focus:ring-0"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Block Toolbar (Floating) -->
      <BlockToolbar
        :visible="!!selected && !previewMode"
        :position="toolbarPosition"
        :nodeType="selected?.type || ''"
        :nodeIcon="getNodeIcon(selected?.type)"
        :canMoveUp="canMoveUp"
        :canMoveDown="canMoveDown"
        :showMore="true"
        @move-up="moveSelectedUp"
        @move-down="moveSelectedDown"
        @duplicate="handleDuplicate(selected)"
        @copy="handleCopyComponent"
        @settings="focusProperties"
        @delete="deleteNode(selected)"
        @wrap="wrapInContainer"
        @view-json="showJson = true"
      />
    </main>

    <!-- Right: Properties & Structure Panel -->
    <aside class="flex-none w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      <!-- Panel Tabs -->
      <div class="flex border-b border-gray-200 dark:border-gray-700">
        <button
          v-for="tab in rightPanelTabs"
          :key="tab.id"
          class="flex-1 px-4 py-3 text-sm font-medium transition-all relative"
          :class="[
            activeRightTab === tab.id 
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          ]"
          @click="activeRightTab = tab.id"
        >
          <div class="flex items-center justify-center gap-2">
            <UIcon :name="tab.icon" class="w-4 h-4" />
            <span>{{ tab.label }}</span>
          </div>
          <div 
            v-if="activeRightTab === tab.id"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          ></div>
        </button>
      </div>

      <!-- Structure Tab -->
      <div v-if="activeRightTab === 'structure'" class="flex-1 overflow-y-auto p-4">
        <TreeView :nodes="canvasComponents" :selected="selected" @select="selectComponent" />
      </div>

      <!-- Properties Tab -->
      <div v-if="activeRightTab === 'properties'" class="flex-1 overflow-y-auto">
        <PropertyPanel 
          v-model="selected" 
          @update:modelValue="updateSelectedProps"
        />
      </div>
    </aside>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 flex flex-col items-center shadow-2xl">
        <svg class="animate-spin h-10 w-10 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-600 dark:text-gray-300 font-medium">Processing...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue';
import draggable from 'vuedraggable';
import { availableComponents, layoutContainers } from '~/types/components';

// Lazy load components
const DesignerSidebar = defineAsyncComponent(() => import('~/components/designer/DesignerSidebar.vue'));
const RenderNode = defineAsyncComponent(() => import('~/components/RenderNode.vue'));
const TreeView = defineAsyncComponent(() => import('~/components/TreeView.vue'));
const PropertyPanel = defineAsyncComponent(() => import('~/components/designer/PropertyPanel.vue'));
const BlockToolbar = defineAsyncComponent(() => import('~/components/designer/BlockToolbar.vue'));

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
const showJson = ref(false);
const activeRightTab = ref('properties');
const toolbarPosition = ref({ x: 0, y: 0 });
const selectedIndex = ref(-1);

const { getMenuForm } = useAuth();
const Api = useApi();

// Undo/Redo functionality
const { canUndo, canRedo, record, undo, redo, reset } = useUndoRedo<NodeSchema[]>([], {
  historyLimit: 50,
  enableKeyboardShortcuts: false
});

const rightPanelTabs = [
  { id: 'properties', label: 'Properties', icon: 'heroicons:adjustments-horizontal' },
  { id: 'structure', label: 'Structure', icon: 'heroicons:list-bullet' },
];

const canMoveUp = computed(() => selectedIndex.value > 0);
const canMoveDown = computed(() => selectedIndex.value >= 0 && selectedIndex.value < canvasComponents.value.length - 1);

function getDefaultProps(type: string) {
  const found = availableComponents.find((x) => x.type === type) || layoutContainers.find((x) => x.type === type);
  return found ? JSON.parse(JSON.stringify(found.props || {})) : {};
}

function getNodeIcon(type?: string): string {
  if (!type) return 'heroicons:cube';
  const comp = availableComponents.find(c => c.type === type) || layoutContainers.find(c => c.type === type);
  return comp?.icon || 'heroicons:cube';
}

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

const onDropChild = ([parentId, newComp]: [string, NodeSchema]) => {
  const findAndInsert = (nodes: NodeSchema[]): boolean => {
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

const deleteNode = (target: NodeSchema | null) => {
  if (!target) return;
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

const generateNewId = (): string => Math.random().toString(36).substr(2, 9);

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

const handleDuplicate = (node: NodeSchema | null) => {
  if (!node) return;
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
    canvasComponents.value.push(newComp);
  }
  
  toast.add({ 
    title: 'Duplicated', 
    description: `"${newComp.label}" created`, 
    color: 'success',
    timeout: 2000
  });
};

const selectComponent = (node: NodeSchema, event?: MouseEvent, index?: number) => {
  selected.value = node;
  if (typeof index === 'number') {
    selectedIndex.value = index;
  } else {
    selectedIndex.value = canvasComponents.value.findIndex(n => n.id === node.id);
  }
  
  // Calculate toolbar position
  if (event) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    toolbarPosition.value = {
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    };
  }
  
  activeRightTab.value = 'properties';
};

const handleNodeSelect = (node: NodeSchema) => {
  selected.value = node;
  selectedIndex.value = canvasComponents.value.findIndex(n => n.id === node.id);
  activeRightTab.value = 'properties';
};

const updateSelectedProps = (updatedNode: NodeSchema) => {
  if (selected.value && updatedNode) {
    selected.value.props = { ...updatedNode.props };
  }
};

const moveSelectedUp = () => {
  if (!canMoveUp.value) return;
  const idx = selectedIndex.value;
  const temp = canvasComponents.value[idx];
  canvasComponents.value[idx] = canvasComponents.value[idx - 1];
  canvasComponents.value[idx - 1] = temp;
  selectedIndex.value = idx - 1;
};

const moveSelectedDown = () => {
  if (!canMoveDown.value) return;
  const idx = selectedIndex.value;
  const temp = canvasComponents.value[idx];
  canvasComponents.value[idx] = canvasComponents.value[idx + 1];
  canvasComponents.value[idx + 1] = temp;
  selectedIndex.value = idx + 1;
};

const focusProperties = () => {
  activeRightTab.value = 'properties';
};

const wrapInContainer = () => {
  if (!selected.value) return;
  const idx = canvasComponents.value.findIndex(n => n.id === selected.value?.id);
  if (idx === -1) return;
  
  const wrapper: NodeSchema = {
    id: generateNewId(),
    type: 'row',
    label: 'Row / Section',
    props: getDefaultProps('row'),
    children: [canvasComponents.value[idx]]
  };
  
  canvasComponents.value.splice(idx, 1, wrapper);
  selected.value = wrapper;
};

const togglePreview = () => {
  previewMode.value = !previewMode.value;
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

// Copy/Paste handlers
const copiedComponent = ref<NodeSchema | null>(null);

const handleCopyComponent = () => {
  if (!selected.value) return;
  copiedComponent.value = JSON.parse(JSON.stringify(selected.value));
  toast.add({ 
    title: 'Copied', 
    description: `"${selected.value.label}" copied`, 
    color: 'success',
    timeout: 2000
  });
};

const handlePasteComponent = () => {
  if (!copiedComponent.value) return;
  const newComponent = cloneComponentWithNewIds(copiedComponent.value);
  
  if (selected.value) {
    const findParentAndInsert = (nodes: NodeSchema[], targetId: string): boolean => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === targetId) {
          nodes.splice(i + 1, 0, newComponent);
          return true;
        }
        if (nodes[i].children && findParentAndInsert(nodes[i].children!, targetId)) {
          return true;
        }
      }
      return false;
    };
    
    if (!findParentAndInsert(canvasComponents.value, selected.value.id)) {
      canvasComponents.value.push(newComponent);
    }
  } else {
    canvasComponents.value.push(newComponent);
  }
  
  toast.add({ 
    title: 'Pasted', 
    description: `"${newComponent.label}" pasted`, 
    color: 'success',
    timeout: 2000
  });
  
  selected.value = newComponent;
};

// Keyboard shortcuts
const handleKeyDown = (event: KeyboardEvent) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const ctrlKey = isMac ? event.metaKey : event.ctrlKey;
  const target = event.target as HTMLElement;
  const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

  if (ctrlKey && event.key === 'z' && !event.shiftKey) {
    event.preventDefault();
    handleUndo();
  }

  if ((ctrlKey && event.key === 'y') || (ctrlKey && event.shiftKey && event.key === 'z')) {
    event.preventDefault();
    handleRedo();
  }

  if (ctrlKey && event.key === 'c' && !isTyping && selected.value) {
    event.preventDefault();
    handleCopyComponent();
  }

  if (ctrlKey && event.key === 'v' && !isTyping && copiedComponent.value) {
    event.preventDefault();
    handlePasteComponent();
  }
  
  if (ctrlKey && event.key === 'd' && !isTyping && selected.value) {
    event.preventDefault();
    handleDuplicate(selected.value);
  }
  
  if (event.key === 'Delete' && !isTyping && selected.value) {
    event.preventDefault();
    deleteNode(selected.value);
  }
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
  dataForm.append('menuaccessid', String(dataMenu.menuAccessId));
  dataForm.append('menuname', String(dataMenu.menuName));
  dataForm.append('description', String(dataMenu.description));
  dataForm.append('menucode', String(dataMenu.menuCode));
  dataForm.append('menuurl', String(dataMenu.menuUrl));
  dataForm.append('menuicon', String(dataMenu.menuIcon));
  dataForm.append('moduleid', String(dataMenu.moduleId));
  dataForm.append('parentid', String(dataMenu.parentId));
  dataForm.append('sortorder', String(dataMenu.sortOrder));
  dataForm.append('menuversion', String(dataMenu.menuVersion));
  dataForm.append('menutype', String(dataMenu.menuType));
  dataForm.append('recordstatus', String(dataMenu.recordStatus));
  dataForm.append('menuform', JSON.stringify(formattedJson.value));
  try {
    const res = await Api.post('api/admin/execute-flow', dataForm);
    if (res?.code == 200) {
      toast.add({ title: 'Saved', description: 'Form saved successfully', color: 'success' });
    } else {
      toast.add({ title: 'Error', description: res.message, color: 'error' });
    }
  } catch (err) {
    toast.add({ title: 'Error', description: String(err), color: 'error' });
  } finally {
    isLoading.value = false;
  }
};

const dataMenu = reactive({
  menuAccessId: 0 as number,
  menuName: '' as string,
  description: '' as string,
  menuCode: '' as string,
  menuUrl: '' as string,
  menuIcon: '' as string,
  moduleId: 0 as number,
  parentId: '' as string,
  sortOrder: 0 as number,
  menuVersion: '' as string,
  menuType: '' as string,
  recordStatus: 0 as number,
});

const hydrateNodeProps = (nodes: NodeSchema[]) => {
  nodes.forEach((node) => {
    const defaults = getDefaultProps(node.type);
    node.props = { ...defaults, ...node.props };
    
    if ('key' in defaults && !('key' in node.props)) {
      node.props.key = defaults.key;
    }

    if (node.children && node.children.length > 0) {
      hydrateNodeProps(node.children);
    }
  });
  return nodes;
};

const acquireLock = async (menuId: number) => {
  try {
    const res = await Api.post('api/admin/lock-record', {
      tablename: 'sys_menu',
      recordid: Number(menuId),
      locktype: 'design'
    });
    
    if (res.code === 200) {
      toast.add({ title: 'Editing', description: 'Form locked for editing', color: 'success', timeout: 2000 });
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
      dataMenu.parentId = res?.data.data.parentid;
      dataMenu.sortOrder = res?.data.data.sortorder;
      dataMenu.menuVersion = res?.data.data.menuversion;
      dataMenu.menuType = res?.data.data.menutype;
      dataMenu.recordStatus = res?.data.data.recordstatus;
      
      await acquireLock(dataMenu.menuAccessId);

      if (res?.data.data.menuform != '') {
        formSchema.value = res?.data?.data.menuform;
        let parsed = JSON.parse(res?.data?.data.menuform);
        canvasComponents.value = hydrateNodeProps(parsed);
      }
    } else if (res?.code == 423 || res?.message === 'SCHEMA_LOCKED') {
       toast.add({ 
          title: 'Locked', 
          description: res.message || 'Form is being edited by another user', 
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
  const name = window.prompt('Copy schema from which form?');
  if (name) {
    isLoading.value = true;
    try {
      const res = await getMenuForm(name);
      if (res?.code == 200) {
        if (res?.data.data.menuform != '') {
          const raw = res.data.data.menuform;
          const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
  }
};

const heartbeatInterval = ref<ReturnType<typeof setInterval> | null>(null);

onMounted(async () => {
  await loadSchema();
  
  if (dataMenu.menuAccessId) {
    heartbeatInterval.value = setInterval(() => {
      acquireLock(dataMenu.menuAccessId);
    }, 60000);
  }

  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
  if (heartbeatInterval.value) clearInterval(heartbeatInterval.value);
  releaseLock();
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
    formattedJson.value = newVal as any;
    formSchema.value = newVal;
    record(JSON.parse(JSON.stringify(newVal)));
  },
  { deep: true, immediate: false },
);

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

<style scoped>
.toolbar-action-btn {
  padding: 0.5rem 0.375rem;
  border-radius: 0.5rem;
  transition: background-color 0.15s ease;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #4b5563;
}
.toolbar-action-btn:hover {
  background-color: #e5e7eb;
}

.btn-primary {
  padding: 0.5rem 1rem;
  background: linear-gradient(to right, #2563eb, #4f46e5);
  color: white;
  border-radius: 0.75rem;
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.15s ease;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.25);
}
.btn-primary:hover {
  background: linear-gradient(to right, #1d4ed8, #4338ca);
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 0.5rem 0.75rem;
  background-color: #f3f4f6;
  color: #374151;
  border-radius: 0.75rem;
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.15s ease;
}
.btn-secondary:hover {
  background-color: #e5e7eb;
}

.dragging-ghost {
  opacity: 0.5;
  background-color: #dbeafe;
}

.dragging-chosen {
  box-shadow: 0 0 0 2px #3b82f6;
}
</style>
