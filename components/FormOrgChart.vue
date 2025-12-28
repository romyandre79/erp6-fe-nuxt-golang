<template>
  <div
    class="w-full h-[600px] border border-gray-200 rounded-lg bg-gray-50 overflow-hidden relative flex flex-col"
    ref="containerRef"
  >
    <!-- Toolbar -->
    <div class="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-white p-2 rounded shadow-sm border border-gray-200">
      <UButton icon="i-heroicons-plus" color="white" variant="ghost" size="sm" @click="zoomIn" title="Zoom In" />
      <UButton icon="i-heroicons-minus" color="white" variant="ghost" size="sm" @click="zoomOut" title="Zoom Out" />
      <UButton icon="i-heroicons-arrow-path" color="white" variant="ghost" size="sm" @click="resetZoom" title="Reset" />
      <div class="h-px bg-gray-200 my-1"></div>
      <UButton
        :icon="isFullscreen ? 'i-heroicons-arrows-pointing-in' : 'i-heroicons-arrows-pointing-out'"
        color="white"
        variant="ghost"
        size="sm"
        @click="toggleFullscreen"
        :title="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'"
      />
    </div>

    <div v-if="loading" class="absolute inset-0 z-50 flex items-center justify-center bg-white/80">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <!-- Canvas -->
    <div
      class="flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing"
      @mousedown="startPan"
      @mousemove="pan"
      @mouseup="endPan"
      @mouseleave="endPan"
      @wheel.prevent="handleWheel"
    >
      <div
        class="absolute top-0 left-0 transition-transform duration-75 ease-linear origin-top-left"
        :style="{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }"
      >
        <!-- Connections Layer (SVG) -->
        <svg
          class="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible"
          style="min-width: 1px; min-height: 1px"
        >
          <path
            v-for="conn in connections"
            :key="conn.id"
            :d="conn.path"
            fill="none"
            stroke="#9CA3AF"
            stroke-width="2"
            class="transition-all duration-300"
          />
        </svg>

        <!-- Nodes Layer -->
        <div class="relative items-center justify-center p-20 min-w-max min-h-max" ref="nodesContainerRef">
          <div class="flex justify-center">
            <RecursiveNode
              v-if="rootNode"
              :node="rootNode"
              :config="config"
              :level="0"
              @node-click="handleNodeClick"
              @node-add="handleNodeAdd"
              @node-edit="handleNodeEdit"
              @node-delete="handleNodeDelete"
              @node-drop="handleNodeDrop"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useApi, useToast } from '#imports';
import RecursiveNode from './OrgChart/RecursiveNode.vue'; // We need a recursive wrapper or component

const props = defineProps({
  source: { type: String, default: '' },
  config: {
    type: Object,
    default: () => ({
      nodeKey: 'id',
      parentKey: 'parent_id',
      labelKey: 'name',
      titleKey: 'title',
      imageKey: 'avatar',
    }),
  },
  onCreate: { type: String, default: '' },
  onUpdate: { type: String, default: '' },
  onDelete: { type: String, default: '' },
  modalKey: { type: String, default: '' },
});

const emit = defineEmits(['open:modal', 'edit:node']);

const api = useApi();
const toast = useToast();
const containerRef = ref(null);
const nodesContainerRef = ref(null);

const loading = ref(false);
const rawData = ref([]);
const transform = ref({ x: 0, y: 0, scale: 1 });
const isPanning = ref(false);
const lastMousePos = ref({ x: 0, y: 0 });
const isFullscreen = ref(false);

const rootNode = computed(() => {
  if (!rawData.value || rawData.value.length === 0) return null;
  return buildTree(rawData.value);
});

const connections = ref([]);

// --- Data Fetching ---

async function fetchData() {
  if (!props.source) return;
  loading.value = true;
  try {
    // Simplified fetch, assuming generic response structure
    const res = await api.get(props.source);
    // Need to adapt based on actual API return signature for 'source' dataflow
    // Usually execute-flow pattern returns { data: [...] }
    if (res.data) {
      rawData.value = Array.isArray(res.data) ? res.data : res.data.data || [];
    } else {
      rawData.value = [];
    }
  } catch (e) {
    console.error('Failed to fetch OrgChart data', e);
    // Mock data for dev if fetch fails or empty (optional)
    if (rawData.value.length === 0) {
      console.warn('Using mock data for OrgChart');
      rawData.value = [
        { id: 1, parent_id: null, name: 'CEO', title: 'Chief Executive Officer', status: 'active' },
        { id: 2, parent_id: 1, name: 'CTO', title: 'Chief Technology Officer', status: 'active' },
        { id: 3, parent_id: 1, name: 'CFO', title: 'Chief Financial Officer', status: 'active' },
        { id: 4, parent_id: 2, name: 'Eng Manager', title: 'Engineering Manager', status: 'active' },
        { id: 5, parent_id: 2, name: 'Product Owner', title: 'Product', status: 'vacant' },
        { id: 6, parent_id: 3, name: 'Accountant', title: 'Senior Accountant', status: 'active' },
      ];
    }
  } finally {
    loading.value = false;
    await nextTick();
    updateConnections();
  }
}

function buildTree(items) {
  const nodeKey = props.config.nodeKey || 'id';
  const parentKey = props.config.parentKey || 'parent_id';

  const itemMap = {};
  items.forEach((item) => {
    itemMap[item[nodeKey]] = { ...item, children: [] };
  });

  let root = null;
  items.forEach((item) => {
    const node = itemMap[item[nodeKey]];
    if (item[parentKey] && itemMap[item[parentKey]]) {
      itemMap[item[parentKey]].children.push(node);
    } else {
      root = node; // Accessing the first root found
    }
  });

  return root;
}

// --- Interaction Handlers ---

function handleNodeClick(node) {
  // Select node?
}

function handleNodeEdit(node) {
  emit('edit:node', node);
  if (props.modalKey) {
    // Trigger modal open in parent FormRender
    emit('open:modal', props.modalKey, node);
  }
}

async function handleNodeAdd(parentNode) {
  const flow = props.onCreate;
  if (!flow) {
    toast.add({ title: 'Configuration Error', description: 'onCreate flow not defined', color: 'orange' });
    return;
  }

  // Add logic: typically open a modal to create a new record, pre-filling parent_id
  // OR create directly with defaults.
  // Here we assume we want to open a modal with parent_id set.
  if (props.modalKey) {
    emit('open:modal', props.modalKey, { [props.config.parentKey]: parentNode[props.config.nodeKey] }, true); // true for 'isNew'
  }
}

async function handleNodeDelete(node) {
  if (!confirm(`Delete ${node[props.config.labelKey]}?`)) return;

  const flow = props.onDelete;
  if (!flow) {
    toast.add({ title: 'Configuration Error', description: 'onDelete flow not defined', color: 'orange' });
    return;
  }

  // Execute generic flow
  const form = new FormData();
  form.append('flowname', flow);
  form.append(props.config.nodeKey, node[props.config.nodeKey]);

  try {
    await api.post('api/admin/execute-flow', form);
    await fetchData(); // Refresh
    toast.add({ title: 'Success', description: 'Node deleted' });
  } catch (e) {
    toast.add({ title: 'Error', description: 'Failed to delete node', color: 'red' });
  }
}

async function handleNodeDrop({ target, source }) {
  // Move source to be child of target
  if (source[props.config.parentKey] === target[props.config.nodeKey]) return; // No change

  const flow = props.onUpdate;
  if (!flow) {
    toast.add({ title: 'Configuration Error', description: 'onUpdate flow not defined', color: 'orange' });
    return;
  }

  // Execute update flow
  const form = new FormData();
  form.append('flowname', flow);
  form.append(props.config.nodeKey, source[props.config.nodeKey]);
  form.append(props.config.parentKey, target[props.config.nodeKey]);

  try {
    await api.post('api/admin/execute-flow', form);
    await fetchData(); // Refresh
    toast.add({ title: 'Success', description: 'Node moved successfully' });
  } catch (e) {
    toast.add({ title: 'Error', description: 'Failed to move node', color: 'red' });
  }
}

// --- Canvas Navigation ---

function startPan(e) {
  if (e.button !== 0) return; // Only left click
  isPanning.value = true;
  lastMousePos.value = { x: e.clientX, y: e.clientY };
  containerRef.value.style.cursor = 'grabbing';
}

function pan(e) {
  if (!isPanning.value) return;
  const dx = e.clientX - lastMousePos.value.x;
  const dy = e.clientY - lastMousePos.value.y;
  transform.value.x += dx;
  transform.value.y += dy;
  lastMousePos.value = { x: e.clientX, y: e.clientY };
}

function endPan() {
  isPanning.value = false;
  if (containerRef.value) containerRef.value.style.cursor = 'grab';
}

function handleWheel(e) {
  if (e.ctrlKey || e.metaKey) {
    // Zoom
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    transform.value.scale = Math.max(0.2, Math.min(3, transform.value.scale * delta));
  } else {
    // Pan
    transform.value.x -= e.deltaX;
    transform.value.y -= e.deltaY;
  }
}

function zoomIn() {
  transform.value.scale = Math.min(3, transform.value.scale * 1.2);
}
function zoomOut() {
  transform.value.scale = Math.max(0.2, transform.value.scale * 0.8);
}
function resetZoom() {
  transform.value = { x: 0, y: 0, scale: 1 };
  centerRoot();
}
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    containerRef.value.requestFullscreen().catch((err) => console.log(err));
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
}

function centerRoot() {
  // Logic to center the root node in the view
  // Requires getting bbox of root element and container
  if (nodesContainerRef.value && containerRef.value) {
    const containerRect = containerRef.value.getBoundingClientRect();
    // Simple reset for now
    transform.value.x = containerRect.width / 2 - 300; // Approx
    transform.value.y = 50;
  }
}

// --- Connection Drawing ---

function updateConnections() {
  // This is tricky in a recursive structure without fixed positions.
  // For a CSS-based tree where the DOM handles layout, we can use getBoundingClientRect
  // but we need to do it after DOM update.
  nextTick(() => {
    calculateConnections();
  });
}

// We will use a ResizeObserver on the container to redraw lines when layout changes
let resizeObserver;
onMounted(() => {
  fetchData();
  resizeObserver = new ResizeObserver(() => {
    updateConnections();
  });
  if (nodesContainerRef.value) {
    resizeObserver.observe(nodesContainerRef.value);
  }
  window.addEventListener('resize', updateConnections);
});

function calculateConnections() {
  // Find all elements with data-node-id
  // This requires Traversing the DOM to find parent-child pairs
  // Since we don't have direct ref map, we can rely on DOM structure if we mark elements
  // RecursiveNode should mark the div with data-id
  const lines = [];
  const containerRect = nodesContainerRef.value?.getBoundingClientRect();
  if (!containerRect) return;

  // We can't easily query selectors across components scoped styles unless we use global classes or data attributes
  // Strategy: Each RecursiveNode emits its position? No, too complex.
  // Strategy: Query selector all '.org-node'
  const nodes = Array.from(document.querySelectorAll('.org-node'));
  const nodeMap = new Map();
  nodes.forEach((el) => {
    // Retrieve ID from attribute (need to ensure RecursiveNode adds this)
    const id = el.getAttribute('data-node-id');
    if (id) nodeMap.set(id, el);
  });

  // Now iterate our data to find edges
  // We need flattened list for this
  // Re-flatten rawData or traverse the 'nodes' array if they have parent-id data attr
  nodes.forEach((el) => {
    const id = el.getAttribute('data-node-id');
    const pid = el.getAttribute('data-parent-id');

    if (id && pid && nodeMap.has(pid)) {
      const childEl = el;
      const parentEl = nodeMap.get(pid);

      // Get coordinates relative to the nodesContainer
      const childRect = childEl.getBoundingClientRect();
      const parentRect = parentEl.getBoundingClientRect();

      // Calculate anchor points (Parent Bottom Center -> Child Top Center)
      // Adjust for transform? If we calculate relative to screen (viewport) and subtract container offset,
      // we get coordinates inside the container *before* transform?
      // Actually, if the SVG is inside the transformed div, we need coordinates in that local space.
      // Since `nodesContainerRef` is inside the transformed div, `getBoundingClientRect` includes the transform.
      // We need to reverse the transform to get "local" coordinates?
      // Easier way: Put SVG *inside* the transformed wrapper (done).
      // Then the coordinates should be relative to properties *ignoring* the wrapper's transform?
      // No, getBoundingClientRect returns *viewport* coords.
      // The difference between (Item Rect) and (Wrapper Rect) gives the offset within the wrapper.
      // Since both are scaled, the difference is also scaled. We need to divide by scale.

      const scale = transform.value.scale;

      const pRect = nodesContainerRef.value.getBoundingClientRect(); // Wrapper rect

      const startX = (parentRect.left + parentRect.width / 2 - pRect.left) / scale;
      const startY = (parentRect.bottom - pRect.top) / scale; // Bottom of parent

      const endX = (childRect.left + childRect.width / 2 - pRect.left) / scale;
      const endY = (childRect.top - pRect.top) / scale; // Top of child

      // Draw generic elbow connector or Bezier
      // Simple cubic bezier from top-down
      const path = `M ${startX} ${startY - 10} 
                          C ${startX} ${startY + 20}, ${endX} ${endY - 20}, ${endX} ${endY}`;
      // Subtracting/Adding small offsets to connect to the "dots" we made in OrgNode

      lines.push({ id: `${pid}-${id}`, path });
    }
  });

  connections.value = lines;
}
</script>
