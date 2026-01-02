<template>
  <div class="w-full h-[600px] border border-gray-200 rounded-lg bg-gray-50 overflow-hidden relative flex flex-col" ref="containerRef">
    
    <!-- Toolbar -->
    <div class="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-white p-2 rounded shadow-sm border border-gray-200">
        <UButton icon="i-heroicons-plus" color="white" variant="ghost" size="sm" @click="zoomIn" title="Zoom In" />
        <UButton icon="i-heroicons-minus" color="white" variant="ghost" size="sm" @click="zoomOut" title="Zoom Out" />
        <UButton icon="i-heroicons-arrow-path" color="white" variant="ghost" size="sm" @click="resetZoom" title="Reset" />
        <div class="h-px bg-gray-200 my-1"></div>
        <UButton :icon="isFullscreen ? 'i-heroicons-arrows-pointing-in' : 'i-heroicons-arrows-pointing-out'" color="white" variant="ghost" size="sm" @click="toggleFullscreen" :title="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'" />
        <div class="h-px bg-gray-200 my-1"></div>
        <UButton icon="i-heroicons-photo" color="white" variant="ghost" size="sm" @click="exportOrgChart('png')" title="Export PNG" />
        <UButton icon="i-heroicons-document-text" color="white" variant="ghost" size="sm" @click="exportOrgChart('pdf')" title="Export PDF" />
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
             <svg class="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible" style="min-width: 1px; min-height: 1px;">
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
                        @node-reorder="handleNodeReorder"
                      />
                 </div>
             </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useApi, useToast, useRoute } from '#imports';
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
       orderKey: 'order' 
    })
  },
  onCreate: { type: String, default: '' },
  onUpdate: { type: String, default: '' },
  onDelete: { type: String, default: '' },
  onEdit: { type: String, default: '' },
  modalKey: { type: String, default: '' }
});

const emit = defineEmits(['openModal', 'editNode']);

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
        const route = useRoute();
        let res;
        
        // Check if source is a URL or a Flow Name
        if (props.source.startsWith('/') || props.source.startsWith('http')) {
            // It's likely a direct URL
            res = await api.get(props.source); 
        } else {
            // It's a Flow Name - use execute-flow
            const form = new FormData();
            form.append('flowname', props.source);
            form.append('menu', 'admin');
            form.append('search', 'false');
            
            // Append route params
            if (route.params.id) {
                form.append('companyid', Array.isArray(route.params.id) ? route.params.id[0] : route.params.id);
                form.append('id', Array.isArray(route.params.id) ? route.params.id[0] : route.params.id);
            }
            
            for (const key in route.params) {
                if (key !== 'id') {
                     const val = route.params[key];
                     form.append(key, Array.isArray(val) ? val[0] : val);
                }
            }

            res = await api.post('api/admin/execute-flow', form);
        }

        if(res.data) {
             rawData.value = Array.isArray(res.data) ? res.data : (res.data.data || []);
             if (!Array.isArray(rawData.value) && rawData.value.data && Array.isArray(rawData.value.data)) {
                 rawData.value = rawData.value.data;
             }
        } else {
             rawData.value = [];
        }

        // Auto-create root if empty and we have a company ID
        if (rawData.value.length === 0 && route.params.id && props.onCreate) {
             await initializeDefaultRoot(route.params.id);
        }

    } catch (e) {
        console.error("Failed to fetch OrgChart data", e);
        rawData.value = [];
    } finally {
        loading.value = false;
        await nextTick();
        updateConnections();
    }
}

async function initializeDefaultRoot(companyId) {
    try {
        const route = useRoute();
        // 1. Fetch Company Info
        const companyForm = new FormData();
        companyForm.append('flowname', 'searchcompanyauth');
        companyForm.append('menu', 'admin');
        companyForm.append('search', 'true');
        // Retrieve specific company if possible, or filter client side
        companyForm.append('companyid', Array.isArray(companyId) ? companyId[0] : companyId); 

        const res = await api.post('api/admin/execute-flow', companyForm);
        let companyName = `Company ${companyId}`; // Fallback

        if (res.data) {
            const companies = Array.isArray(res.data) ? res.data : (res.data.data || []);
            // Assuming the API might return a list or single object. 
            // If it returns a list, find the matching ID.
            let found = null;
            if (Array.isArray(companies)) {
                found = companies.find(c => String(c.companyid) === String(companyId));
            } else if (companies.companyid) {
                found = companies;
            }
            
            if (found && found.companyname) {
                companyName = found.companyname;
            }
        }

        // 2. Create Root Node
        const createForm = new FormData();
        createForm.append('flowname', props.onCreate);
        createForm.append('companyid', Array.isArray(companyId) ? companyId[0] : companyId);
        createForm.append(props.config.labelKey, companyName); // e.g. 'structurename'
        createForm.append(props.config.titleKey, 'Head Office'); // Generic title
        // parent_id is omitted or null for root
        
        await api.post('api/admin/execute-flow', createForm);
        
        // 3. Refresh (recursion avoided by check above? No, need to be careful)
        
        const form = new FormData();
        form.append('flowname', props.source);
        form.append('menu', 'admin');
        form.append('search', 'false');
        if (route.params.id) {
            form.append('companyid', Array.isArray(route.params.id) ? route.params.id[0] : route.params.id);
            form.append('id', Array.isArray(route.params.id) ? route.params.id[0] : route.params.id);
        }
        const refreshRes = await api.post('api/admin/execute-flow', form);
        if(refreshRes.data) {
             rawData.value = Array.isArray(refreshRes.data) ? refreshRes.data : (refreshRes.data.data || []);
             if (!Array.isArray(rawData.value) && rawData.value.data && Array.isArray(rawData.value.data)) {
                 rawData.value = rawData.value.data;
             }
        }

    } catch (e) {
        console.error("Failed to auto-create root node", e);
    }
}

function buildTree(items) {
    const nodeKey = props.config.nodeKey || 'id';
    const parentKey = props.config.parentKey || 'parent_id';
    
    const itemMap = {};
    items.forEach(item => {
        itemMap[item[nodeKey]] = { ...item, children: [] };
    });

    const orderKey = props.config.orderKey || 'order';

    let root = null;
    items.forEach(item => {
        const node = itemMap[item[nodeKey]];
        if (item[parentKey] && itemMap[item[parentKey]]) {
            itemMap[item[parentKey]].children.push(node);
        } else {
            root = node; // Accessing the first root found
        }
    });
    
    // Sort children by order
    Object.values(itemMap).forEach(node => {
        if (node.children && node.children.length > 0) {
            node.children.sort((a, b) => (a[orderKey] || 0) - (b[orderKey] || 0));
        }
    });
    
    return root; 
}

// --- Interaction Handlers ---

function handleNodeClick(node) {
    // Select node?
}

async function handleNodeEdit(node) {
    if(props.modalKey) {
        // Fetch Details (could be Node Details or Employee List depending on flow)
        try {
            const formData = new FormData();
            formData.append('flowname', props.onEdit || 'getemployeeorgbyorgstruc'); // Fallback to previous default
            formData.append('menu', 'admin');
            formData.append('search', 'true');
            // ID might be passed as orgstructureid or simple id
            formData.append('orgstructureid', node[props.config.nodeKey]); 
            formData.append('id', node[props.config.nodeKey]); 
            
            const res = await api.post('api/admin/execute-flow', formData);
            
            let nodeData = { ...node };

            if(res.data) {
                 const result = Array.isArray(res.data) ? res.data : (res.data.data || null);
                 
                 if (Array.isArray(result)) {
                     // It's a list (e.g. employees)
                     nodeData.members = result;
                 } else if (result && typeof result === 'object') {
                     // It's a single record (Node details)
                     nodeData = { ...nodeData, ...result };
                     
                     // If the object contains a specific list key (like 'members' or 'employees'), keep it?
                     // Usually standard response is just flat fields.
                 }
            }
            
            emit('editNode', nodeData);
            emit('openModal', props.modalKey, nodeData); 
            
        } catch(e) {
            console.error("Failed to fetch edit details", e);
            // Open modal anyway just with local node data
            emit('editNode', node);
            emit('openModal', props.modalKey, node);
        }
    } else {
        emit('editNode', node);
    }
}

async function handleNodeAdd(parentNode) {
    const flow = props.onCreate;
    if(!flow) {
        toast.add({ title: 'Configuration Error', description: 'onCreate flow not defined', color: 'orange' });
        return;
    }
    
    if(props.modalKey) {
        emit('openModal', props.modalKey, { [props.config.parentKey]: parentNode[props.config.nodeKey] }, true); // true for 'isNew'
    } else {
        console.warn("No modalKey provided");
    }
}

async function handleNodeDelete(node) {
     if(!confirm(`Delete ${node[props.config.labelKey]}?`)) return;

    const flow = props.onDelete;
     if(!flow) {
        toast.add({ title: 'Configuration Error', description: 'onDelete flow not defined', color: 'orange' });
        return;
    }
    
    // Execute generic flow
    const form = new FormData();
    form.append('flowname', flow);
    form.append('menu', 'admin');
    form.append('search', 'false');
    form.append(props.config.nodeKey, node[props.config.nodeKey]);
    
    try {
        await api.post('api/admin/execute-flow', form);
        await fetchData(); // Refresh
        toast.add({ title: 'Success', description: 'Node deleted' });
    } catch(e) {
        toast.add({ title: 'Error', description: 'Failed to delete node', color: 'red' });
    }
}

async function handleNodeDrop({ target, source }) {
    // Move source to be child of target
    if(source[props.config.parentKey] === target[props.config.nodeKey]) return; // No change

    const flow = props.onUpdate;
     if(!flow) {
        toast.add({ title: 'Configuration Error', description: 'onUpdate flow not defined', color: 'orange' });
        return;
    }

    // Execute update flow
    const form = new FormData();
    form.append('flowname', flow);
    form.append('menu', 'admin');
    form.append('search', 'false');
    form.append(props.config.nodeKey, source[props.config.nodeKey]);
    form.append(props.config.parentKey, target[props.config.nodeKey]);

    try {
        await api.post('api/admin/execute-flow', form);
        await fetchData(); // Refresh
        toast.add({ title: 'Success', description: 'Node moved successfully' });
    } catch(e) {
        toast.add({ title: 'Error', description: 'Failed to move node', color: 'red' });
    }
}

async function handleNodeReorder({ node, direction }) {
    // direction: 'left' (order - 1) or 'right' (order + 1)
    // We need to find the sibling to swap with.
    // Easier: Just re-assign orders for all siblings?
    // Or just swap with adjacent?
    
    if (!node) return;
    const parentId = node[props.config.parentKey];
    if (!parentId) return; // Can't reorder root easily without queue
    
    // Find parent in rawData (tree is built every time, but rawData is flat list)
    // We need the *children* list of the parent. 
    // Let's use the `flattened` data or traverse? 
    // Actually `buildTree` mutates objects by adding `children`.
    // But `rawData` is ref.
    
    // Let's find siblings from rawData
    const nodeKey = props.config.nodeKey;
    const parentKey = props.config.parentKey;
    const orderKey = props.config.orderKey || 'order';
    
    const siblings = rawData.value.filter(n => String(n[parentKey]) === String(parentId));
    siblings.sort((a, b) => (a[orderKey] || 0) - (b[orderKey] || 0));
    
    const index = siblings.findIndex(n => String(n[nodeKey]) === String(node[nodeKey]));
    if (index === -1) return;
    
    let swapIndex = -1;
    if (direction === 'left' && index > 0) swapIndex = index - 1;
    if (direction === 'right' && index < siblings.length - 1) swapIndex = index + 1;
    
    if (swapIndex !== -1) {
        const sibling = siblings[swapIndex];
        
        // Swap orders. If orders are missing/same, we might need to re-index all.
        // Robust way: Re-index all siblings
        let currentOrder = siblings[index][orderKey] || index;
        let siblingOrder = sibling[orderKey] || swapIndex;
        
        // If they are equal (e.g. both 0), simple swap won't work.
        // Let's just assign new indices based on current position (force rewrite)
        // But that triggers N calls.
        
        // Let's try simple swap first. If equal, shift one.
         const tempOrder = currentOrder;
         currentOrder = siblingOrder;
         siblingOrder = tempOrder;
         
         // If equal, force differentiation
         if(currentOrder === siblingOrder) {
             currentOrder = swapIndex; // the new position
             siblingOrder = index;
         }

        // Update Node
        const form1 = new FormData();
        form1.append('flowname', props.onUpdate);
        form1.append('menu', 'admin');
        form1.append('search', 'false');
        form1.append(nodeKey, node[nodeKey]);
        form1.append(orderKey, siblingOrder); // New order for node (swapped)
        
        // Update Sibling
        const form2 = new FormData();
        form2.append('flowname', props.onUpdate);
        form2.append('menu', 'admin');
        form2.append('search', 'false');
        form2.append(nodeKey, sibling[nodeKey]);
        form2.append(orderKey, currentOrder); // New order for sibling
        
        try {
            await Promise.all([
                 api.post('api/admin/execute-flow', form1),
                 api.post('api/admin/execute-flow', form2)
            ]);
            await fetchData();
        } catch(e) {
            console.error(e);
            toast.add({ title: 'Error', description: 'Reorder failed', color: 'red' });
        }
    }
}


// --- Canvas Navigation ---

function startPan(e) {
    if(e.button !== 0) return; // Only left click
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
    if(containerRef.value) containerRef.value.style.cursor = 'grab';
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

function zoomIn() { transform.value.scale = Math.min(3, transform.value.scale * 1.2); }
function zoomOut() { transform.value.scale = Math.max(0.2, transform.value.scale * 0.8); }
function resetZoom() {
    transform.value = { x: 0, y: 0, scale: 1 };
    centerRoot();
}
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        containerRef.value.requestFullscreen().catch(err => console.log(err));
        isFullscreen.value = true;
    } else {
        document.exitFullscreen();
        isFullscreen.value = false;
    }
}

function centerRoot() {
    // Logic to center the root node in the view
    // Requires getting bbox of root element and container
    if(nodesContainerRef.value && containerRef.value) {
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
    if(!containerRect) return;

    // We can't easily query selectors across components scoped styles unless we use global classes or data attributes
    // Strategy: Each RecursiveNode emits its position? No, too complex.
    // Strategy: Query selector all '.org-node'
    const nodes = Array.from(document.querySelectorAll('.org-node'));
    const nodeMap = new Map();
    nodes.forEach(el => {
        // Retrieve ID from attribute (need to ensure RecursiveNode adds this)
        const id = el.getAttribute('data-node-id');
        if(id) nodeMap.set(id, el);
    });

    // Now iterate our data to find edges
    // We need flattened list for this
    // Re-flatten rawData or traverse the 'nodes' array if they have parent-id data attr
    nodes.forEach(el => {
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

            // Draw Orthogonal (Elbow) connector
            // Start (Parent Bottom) -> Down -> Across -> Down -> End (Child Top)
            const midY = startY + (endY - startY) / 2;
            
            const path = `M ${startX} ${startY} 
                          L ${startX} ${midY} 
                          L ${endX} ${midY} 
                          L ${endX} ${endY}`;

             lines.push({ id: `${pid}-${id}`, path });
        }
    }); // End nodes.forEach
    
    connections.value = lines;
}

// --- Export ---
async function exportOrgChart(format = 'png') {
    const element = nodesContainerRef.value; // Prefer exporting the nodes container specifically or the whole canvas?
    // If we export containerRef, we get the current viewport (clipped).
    // If we export nodesContainerRef, we get the full chart but maybe without background/connections if they are outside?
    // The connections are in a separate SVG layer at the same level as nodesContainerRef parent.
    // Better to export the 'transform' wrapper div found in template (we don't have a ref for it yet, let's add one or query it)
    
    // Let's rely on containerRef but temporary disable overflow:hidden and reset scale to get full image?
    // Or just export nodesContainerRef and accept no lines (lines are SVG sibling).
    
    // Best approach: Export the scrolling content layer.
    // In template: 
    // <div ref="transformLayer" ... :style="transform...">
    //    <svg>...</svg>
    //    <div ref="nodesContainerRef">...</div>
    // </div>
    
    // I need to add ref="transformLayer" to the div wrapping SVG and nodes.
    // But for now, let's try exporting the 'containerRef' but we might need to expand it.
    
    // Actually, `html-to-image` handles hidden elements if configured, but `overflow:hidden` on parent will clip it.
    // Let's simply target the nodesContainerRef for now, as lines are difficult to capture if they are siblings.
    // WAIT, lines ARE siblings. If I export `nodesContainerRef`, I miss lines.
    
    // I'll grab the parent of `nodesContainerRef`.
    const contentInfo = nodesContainerRef.value?.parentElement; // The div with transform
    if (!contentInfo) return;

    toast.add({ title: 'Exporting...', description: 'Generating ' + format.toUpperCase(), color: 'blue', timeout: 0 });

    try {
        const { toPng } = await import('html-to-image');
        const jsPDFModule = await import('jspdf');
        const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;

        // Save current transform
        const originalTransform = transform.value;
        
        // Reset scale and position to ensure high quality and full visibility
        // We might want to scale UP for better resolution
        transform.value = { x: 50, y: 50, scale: 1 }; 
        await nextTick();
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for render/transition

        const dataUrl = await toPng(contentInfo, { 
            cacheBust: true, 
             backgroundColor: '#f9fafb', // gray-50
             quality: 1.0,
             pixelRatio: 2 // Higher res
        });

        const filename = `org-chart-${props.source || 'export'}`;

        if (format === 'png') {
            const link = document.createElement('a');
            link.download = `${filename}.png`;
            link.href = dataUrl;
            link.click();
        } else {
            // PDF
             const imgProps = new Image();
             imgProps.src = dataUrl;
             await new Promise(resolve => imgProps.onload = resolve);
             
             const pdfWidth = imgProps.width;
             const pdfHeight = imgProps.height;
             
             const pdf = new jsPDF({
                orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
                unit: 'px',
                format: [pdfWidth, pdfHeight]
             });
             
             pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
             pdf.save(`${filename}.pdf`);
        }

        toast.add({ title: 'Success', description: 'Export completed!', color: 'green', timeout: 3000 });

    } catch (e) {
        console.error('Export failed', e);
        toast.add({ title: 'Error', description: 'Export failed', color: 'red' });
    } finally {
        // Restore transform
        // transform.value = originalTransform; // Actually let's just leave it reset or restore. Restoring might jump.
    }
}

// Expose refresh method to parent
defineExpose({
    refresh: fetchData
});

</script>
