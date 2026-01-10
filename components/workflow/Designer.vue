<template>
  <div class="relative h-full">
    <!-- Payload Display (top-left, minimal) -->
    <div
      v-if="showPayload"
      id="payload-overlay"
      class="absolute top-20 left-6 p-3 bg-white shadow-lg rounded border z-50 max-w-sm"
    >
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-bold text-sm">Test Payload</h3>
        <button @click="showPayload = false" class="text-gray-400 hover:text-gray-600">&times;</button>
      </div>
      <pre class="text-xs whitespace-pre-wrap bg-gray-50 p-2 rounded max-h-40 overflow-auto">{{ payload }}</pre>
    </div>

    <!-- Upload Plugin Modal -->
    <div v-if="showUploadModal" class="absolute inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div class="bg-white p-6 rounded shadow-xl w-96">
        <h3 class="text-lg font-bold mb-4">Upload Component Plugin</h3>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Select Plugin ZIP</label>
          <input type="file" accept=".zip" @change="onFileSelected" class="w-full border rounded p-2 text-sm" />
        </div>

        <div v-if="uploadProgress >= 0" class="mb-4">
          <div class="flex justify-between text-xs mb-1">
            <span>{{ uploadStatus }}</span>
            <span>{{ uploadProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
        </div>

        <div v-if="uploadError" class="mb-4 text-red-500 text-sm">
          {{ uploadError }}
        </div>

        <div class="flex justify-end gap-2">
          <button @click="closeUploadModal" class="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
          <button
            @click="uploadPlugin"
            :disabled="!selectedFile || isUploading"
            class="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isUploading ? 'Uploading...' : 'Upload' }}
          </button>
        </div>
      </div>
    </div>


<div class="absolute left-6 top-6 flex flex-row gap-2 z-50">
      <button 
        @click="handleUndo" 
        :disabled="!canUndo"
        :class="{ 'opacity-50 cursor-not-allowed': !canUndo }"
        class="p-2 rounded shadow bg-white text-black" 
        title="Undo (Ctrl+Z)"
      >
        ↶ Undo
      </button>
      <button 
        @click="handleRedo" 
        :disabled="!canRedo"
        :class="{ 'opacity-50 cursor-not-allowed': !canRedo }"
        class="p-2 rounded shadow bg-white text-black" 
        title="Redo (Ctrl+Y)"
      >
        ↷ Redo
      </button>
      <div class="w-px bg-gray-300 mx-1"></div>
      <button @click="zoomOut" class="p-2 rounded shadow bg-white text-black" title="Zoom Out">-</button>
      <button @click="zoomReset" class="p-2 rounded shadow bg-white text-black" title="Reset Zoom">Reset</button>
      <button @click="zoomIn" class="p-2 rounded shadow bg-white text-black" title="Zoom In">+</button>
      <div class="w-px bg-gray-300 mx-1"></div>
      <button @click="showUploadModal = true" class="p-2 rounded shadow bg-white text-black flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload Plugin
      </button>
      <button @click="Save" class="p-2 rounded shadow bg-white text-black">Save</button>
                      <button @click="exportImage" class="p-2 rounded shadow bg-white text-black">Export PNG</button>
      <button @click="copySchema" class="p-2 rounded shadow bg-white text-black">Copy From</button>
      <button @click="testFlow" :disabled="isTestingFlow" class="p-2 rounded shadow bg-white text-black disabled:opacity-50 disabled:cursor-not-allowed">
        <span v-if="isTestingFlow" class="inline-flex items-center gap-2">
          <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Testing...
        </span>
        <span v-else>Test Flow</span>
      </button>
      <button v-if="hasTestResults" @click="clearTestResults" class="p-2 rounded shadow bg-red-100 text-red-600 hover:bg-red-200">Clear Results</button>
      <div class="w-px bg-gray-300 mx-1"></div>
      <button @click="createNewArea" class="p-2 rounded shadow bg-white text-black flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <path d="M12 8v8M8 12h8"/>
        </svg>
        Add Area
      </button>

    </div>
    <div id="drawflow" class="absolute inset-0" @drop="drop" @dragover.prevent>
      <!-- Canvas Areas -->
      <div :style="{ transform: transformString, transformOrigin: '0 0', position: 'absolute', top: 0, left: 0, width: '0px', height: '0px', pointerEvents: 'none', overflow: 'visible' }">
        <WorkflowArea
          v-for="area in store.areas"
          :key="area.id"
          :area="area"
          @start-drag="startAreaDrag"
          @start-resize="startAreaResize"
          @delete="deleteAreaFromStore"
        />
      </div>
     </div>



    <!-- Zoom Control -->
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useWorkflowStore } from '~/store/workflow';
import { toPng } from 'html-to-image';
import { useToast, useNuxtApp, useApi, useRoute } from '#imports';
import WorkflowArea from './WorkflowArea.vue';


const store = useWorkflowStore();
const toast = useToast();
const emit = defineEmits(['saved']); // Added emit definition
const testResult = ref('');
const payload = ref('');
const showPayload = ref(false);

// Transform Sync for Areas
const transformString = ref('translate(0px, 0px) scale(1)');

// Step Results State
const stepResults = ref<any[]>([]);
const hasTestResults = computed(() => stepResults.value.length > 0);

// Test Flow Loading State
const isTestingFlow = ref(false);
const nodeStates = ref<Map<number, 'running' | 'success' | 'error'>>(new Map());
const nodeErrors = ref<Map<number, string>>(new Map());

// Upload State
const showUploadModal = ref(false);
const selectedFile = ref<File | null>(null);
const uploadProgress = ref(-1);
const uploadStatus = ref('');
const uploadError = ref('');
const isUploading = ref(false);

// Area Management State (DBObject Style)

let editor: any = null;
let saveTimeout: any = null;
let workflowSocket: WebSocket | null = null;

// Undo/Redo functionality for workflow
const { canUndo, canRedo, record, undo, redo, reset } = useUndoRedo<any>(null, {
  historyLimit: 50,
  enableKeyboardShortcuts: false // We'll handle this manually
});

/* ======================================================
   FUNCTION: initEditor (DEFINISI WAJIB ADA!!)
   ======================================================*/
function initEditor(container: HTMLElement) {
  const { $drawflow } = useNuxtApp();

  if (!$drawflow) {
    console.error('❌ Drawflow plugin not available');
    return null;
  }

  // Create instance
  const ed = new ($drawflow as any)(container);
  ed.reroute = true;
  ed.reroute_fix_curvature = true;
  ed.force_first_input = false;
  ed.start();
  
  /* -------- Register events --------*/
  ed.on('nodeRemoved', (id: string) => {
    // When node removed, cleanup its properties from DB
    const cleanId = id.replace('node-', '');
    if (typeof store.deleteNodeProperties === 'function') {
      try {
        store.deleteNodeProperties(cleanId);
      } catch (err) {
        console.error('Error deleteNodeProperties:', err);
      }
    }
    // Record state for undo/redo
    recordEditorState();
  });

  // Sync Areas with Canvas Transform (DOM Mirroring)
  function updateTransform() {
    // We read directly from the Drawflow DOM element to ensure 100% sync
    const drawflowInternal = container.querySelector('.drawflow') as HTMLElement;
    if (drawflowInternal) {
      transformString.value = drawflowInternal.style.transform;
    } else {
      transformString.value = `translate(${ed.canvas_x}px, ${ed.canvas_y}px) scale(${ed.zoom})`;
    }
  }

  ed.on('translate', updateTransform);
  ed.on('zoom', updateTransform);
  ed.on('import', updateTransform); 
  
  // Initial sync attempt
  setTimeout(updateTransform, 50); 

  ed.on('nodeSelected', async (id: string) => {
    const cleanId = id.replace('node-', '');
    const node = ed.drawflow.drawflow?.Home?.data?.[cleanId];

    if (node) {
      await store.loadComponentProperties(node.name, cleanId.toString());
      store.setSelectedNode(node);
    }
    
    // Hide all result panels first
    const allPanels = document.querySelectorAll('.node-result-panel') as NodeListOf<HTMLElement>;
    allPanels.forEach(p => p.style.display = 'none');
    
    // Show only the result panel for this node (if it exists)
    const panel = document.querySelector(`.node-result-panel[data-node-result="${cleanId}"]`) as HTMLElement;
    if (panel) {
      panel.style.display = 'block';
    }
  });

  // Record state on node creation
  ed.on('nodeCreated', () => {
    recordEditorState();
  });

  // Record state on connection changes
  ed.on('connectionCreated', () => {
    recordEditorState();
  });

  ed.on('connectionRemoved', () => {
    recordEditorState();
  });



  return ed;
}

async function Save() {
  try {
    const res = await store.saveFlow(editor.export());
    if (res.code == 200) {
      toast.add({
        title: $t('TITLE UPDATE'),
        description: $t(res.message.replaceAll('_', ' ')),
      });
      emit('saved');
      // Record state after save
      recordEditorState();
    }
  } catch (e) {
    console.error('❌ saveFlow error', e);
  }
}

// Helper function to record editor state
function recordEditorState() {
  if (!editor) return;
  try {
    const state = editor.export();
    record(JSON.parse(JSON.stringify(state)));
  } catch (e) {
    console.error('Error recording editor state:', e);
  }
}

// Undo/Redo handlers
const handleUndo = () => {
  const previousState = undo();
  if (previousState && editor) {
    try {
      editor.import(previousState);
      setTimeout(() => {
        convertOldNodesToIcons();
        updateAllConnections();
      }, 100);
    } catch (e) {
      console.error('Error restoring previous state:', e);
    }
  }
};

const handleRedo = () => {
  const nextState = redo();
  if (nextState && editor) {
    try {
      editor.import(nextState);
      setTimeout(() => {
        convertOldNodesToIcons();
        updateAllConnections();
      }, 100);
    } catch (e) {
      console.error('Error restoring next state:', e);
    }
  }
};

// Keyboard shortcuts for undo/redo AND Copy/Paste
const handleKeyDown = (event: KeyboardEvent) => {
  // Ignore shortcuts if user is focusing on an input field
  const target = event.target as HTMLElement;
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)) {
    return;
  }

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

  // Copy: Ctrl+C
  if (ctrlKey && event.key === 'c') {
    handleCopy();
  }

  // Paste: Ctrl+V
  if (ctrlKey && event.key === 'v') {
    handlePaste();
  }
};

/* ======================================================
   Clipboard Logic (Copy/Paste)
   ======================================================*/
const clipboard = ref<any>(null);
const lastPastedText = ref('');
const pasteCount = ref(0);

async function handleCopy() {
    const node = store.selectedNode;
    if (!node) return;
    
    // Deep clone to avoid reference issues
    try {
        const nodeStr = JSON.stringify(node);
        clipboard.value = JSON.parse(nodeStr); // Keep internal clipboard as backup
        
        // Try writing to system clipboard
        try {
          await navigator.clipboard.writeText(nodeStr);
          toast.add({ title: 'Copied', description: 'Node copied to clipboard' });
        } catch (sysErr) {
          console.warn('System clipboard write failed', sysErr);
          toast.add({ title: 'Copied', description: 'Node copied to internal clipboard only' });
        }
    } catch (e) {
        console.error('Failed to copy node', e);
        toast.add({ title: 'Error', description: 'Failed to copy node', color: 'red' });
    }
}

async function handlePaste() {
    if (!editor) return;

    try {
        let text = '';
        let fromSystem = false;
        
        // Try reading from system clipboard first
        try {
            text = await navigator.clipboard.readText();
            fromSystem = true;
        } catch (e) {
            console.warn('System clipboard read failed', e);
        }

        // Fallback to internal clipboard if system empty or failed
        if (!text && clipboard.value) {
            text = JSON.stringify(clipboard.value);
            fromSystem = false;
        }

        if (!text) return;

        let cmp: any = null;
        let isOrdinaryText = false;

        try {
            cmp = JSON.parse(text);
        } catch (e) {
            isOrdinaryText = true;
        }

        // "Check again, is object or ordinary text" logic
        if (isOrdinaryText || !cmp || typeof cmp !== 'object') {
             toast.add({ title: 'Paste Info', description: 'Clipboard contains ordinary text, not a workflow node.', color: 'orange' });
             return; 
        }

        // Validate it looks like a node
        // A exported node usually has: id, name, data, class, html, typenode, inputs, outputs, pos_x, pos_y
        if (!cmp.name && !cmp.componentname) {
             toast.add({ title: 'Paste Error', description: 'Invalid node structure in clipboard.', color: 'red' });
             return;
        }

        // Handle Offset Logic for smart pasting
        if (text === lastPastedText.value) {
            pasteCount.value++;
        } else {
            lastPastedText.value = text;
            pasteCount.value = 1;
        }

        // Add offset so nodes don't stack exactly on top of each other
        const offset = 30 * pasteCount.value;
        
        const x = (cmp.pos_x || 100) + offset;
        const y = (cmp.pos_y || 100) + offset;

        // Node Properties
        const componentName = cmp.name || cmp.componentname;
        
        // Handle inputs/outputs count safely
        let inputs = 1;
        if (typeof cmp.inputs === 'number') inputs = cmp.inputs;
        else if (typeof cmp.inputs === 'object') inputs = Object.keys(cmp.inputs).length;
        
        let outputs = 1;
        if (typeof cmp.outputs === 'number') outputs = cmp.outputs;
        else if (typeof cmp.outputs === 'object') outputs = Object.keys(cmp.outputs).length;

        const data = cmp.data || {}; 

        // HTML Construction
        const storeCmp = store.components.find((c: any) => (c.componentname || c.name)?.toLowerCase() === componentName?.toLowerCase());
        const iconClass = storeCmp?.componentclass || storeCmp?.icon || 'fa-solid fa-cube';
        const title = data.description || data.label || data.name || componentName;

        const nodeHtml = `
            <div class="node-icon-wrapper">
                <div class="node-icon">
                <i class="${iconClass}"></i>
                </div>
                <div class="node-label">${title}</div>
            </div>
        `;

        const newId = editor.addNode(
            componentName,
            inputs,
            outputs,
            x,
            y,
            componentName, // Class name/Component type
            data,
            nodeHtml,
            false 
        );
        
        toast.add({ title: 'Pasted', description: 'Node pasted successfully' });
        
        // Record state check
        recordEditorState();

    } catch (e) {
        console.error('Failed to paste node', e);
        toast.add({ title: 'Error', description: 'Failed to paste node: ' + e, color: 'red' });
    }
}

/* ======================================================
   Upload Plugin Logic
   ======================================================*/
function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0];
    uploadError.value = '';
  }
}

function closeUploadModal() {
  showUploadModal.value = false;
  selectedFile.value = null;
  uploadProgress.value = -1;
  uploadStatus.value = '';
  uploadError.value = '';
  isUploading.value = false;
}

async function uploadPlugin() {
  if (!selectedFile.value) return;

  isUploading.value = true;
  uploadProgress.value = 0;
  uploadStatus.value = 'Starting upload...';
  uploadError.value = '';

  const formData = new FormData();
  formData.append('plugin', selectedFile.value);

  try {
    // Use XMLHttpRequest for progress tracking since fetch doesn't support it natively
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        uploadProgress.value = percent;
        uploadStatus.value = `Uploading... ${percent}%`;
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        uploadProgress.value = 100;
        uploadStatus.value = 'Upload complete! Processing...';

        try {
          const response = JSON.parse(xhr.responseText);
          toast.add({
            title: 'Success',
            description: 'Plugin uploaded successfully',
            color: 'green',
          });

          // Refresh components list
          store.loadComponents();

          setTimeout(() => {
            closeUploadModal();
          }, 1000);
        } catch (e) {
          uploadError.value = 'Invalid response from server';
        }
      } else {
        uploadError.value = `Upload failed: ${xhr.statusText || 'Unknown error'}`;
      }
      isUploading.value = false;
    });

    xhr.addEventListener('error', () => {
      uploadError.value = 'Network error during upload';
      isUploading.value = false;
    });

    // Get API base URL from runtime config or use relative path
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || '/api';

    xhr.open('POST', `${apiBase}/api/admin/plugins/upload`);

    // Add auth token if needed
    const token = useCookie('token');
    if (token.value) {
      xhr.setRequestHeader('Authorization', `Bearer ${token.value}`);
    }

    xhr.send(formData);
  } catch (err) {
    console.error('Upload error:', err);
    uploadError.value = `Exception: ${err}`;
    isUploading.value = false;
  }
}

/* ======================================================
   WebSocket for Real-Time Workflow Updates
   ======================================================*/
function initWorkflowWebSocket() {
  // Prevent multiple connections
  if (workflowSocket && (workflowSocket.readyState === WebSocket.OPEN || workflowSocket.readyState === WebSocket.CONNECTING)) return;

  const config = useRuntimeConfig();
  const token = useCookie('token');
  
  if (!token.value) {
    console.error('No token for workflow WS');
    return;
  }

  // Close existing connection
  if (workflowSocket) workflowSocket.close();

  let wsBase = config.public.apiBase.replace('http', 'ws');
  const wsUrl = `${wsBase}/api/ws/notifications?token=${token.value}`;
  
  workflowSocket = new WebSocket(wsUrl);
  
  workflowSocket.onopen = () => {
  };

  workflowSocket.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      handleWorkflowEvent(payload);
    } catch (err) {
    }
  };

  workflowSocket.onclose = (e) => {
    workflowSocket = null;
  };

  workflowSocket.onerror = (e) => {
  };
}

function handleWorkflowEvent(payload: any) {
  // Only handle workflow_test events
  if (payload.type !== 'workflow_test') return;
    
  const nodeId = payload.nodeId;
  if (!nodeId) return;
  
  const nodeEl = document.getElementById(`node-${nodeId}`) as HTMLElement;
  if (!nodeEl) return;
  
  // Remove all state classes
  nodeEl.classList.remove('node-running', 'node-success', 'node-error');
  
  switch (payload.event) {
    case 'node_start':
      nodeEl.classList.add('node-running');
      nodeStates.value.set(nodeId, 'running');
      console.log(`Node ${nodeId} (${payload.componentName}) started`);
      break;
      
    case 'node_complete':
      nodeEl.classList.add('node-success');
      nodeStates.value.set(nodeId, 'success');
      console.log(`Node ${nodeId} (${payload.componentName}) completed in ${payload.executionTime}ms`);
      break;
      
    case 'node_error':
      nodeEl.classList.add('node-error');
      nodeStates.value.set(nodeId, 'error');
      nodeErrors.value.set(nodeId, payload.error || 'Unknown error');
      console.log(`Node ${nodeId} (${payload.componentName}) failed:`, payload.error);
      break;
  }
}

/* ======================================================
   Mounted
   ======================================================*/
onMounted(async () => {
  const el = document.getElementById('drawflow') as HTMLElement;

  if (!el) {
    console.error('❌ drawflow element not found');
    return;
  }

  editor = initEditor(el); //<-- DI SINI TIDAK AKAN ERROR LAGI
  (window as any).editor = editor;

  // Import existing flow
  const flowObj = store.workflow?.flow;
  if (flowObj && editor) {
    try {
      editor.import(flowObj);
      // Convert old nodes to new icon style and update connections
      setTimeout(() => {
        convertOldNodesToIcons();
        updateAllConnections();
        // Initialize undo/redo with current state
        reset(editor.export());
      }, 100);
    } catch (e) {
      console.error('❌ ERROR IMPORT DRAWFLOW', e);
    }
  }
  
  // Initialize WebSocket for real-time updates
  initWorkflowWebSocket();
  
  // Register keyboard shortcuts
  window.addEventListener('keydown', handleKeyDown);
});

watch(
  () => store.workflow,
  (wf) => {
    if (!wf || !wf.flow || !editor) return;

    try {
      const parsed = typeof wf.flow === 'string' ? JSON.parse(wf.flow) : wf.flow;
      editor.import(parsed.drawflow ? parsed : parsed.flow);
      // Convert old nodes to new icon style and update connections
      setTimeout(() => {
        convertOldNodesToIcons();
        updateAllConnections();
      }, 100);
    } catch (e) {
      console.error('❌ Failed to import workflow', e);
    }
  },
  { immediate: true },
);

/* ======================================================
   Convert old title-box nodes to icon-based nodes
   ======================================================*/
function convertOldNodesToIcons() {
  if (!editor) return;
  
  // Find all nodes (not just old title-box ones, to ensure all labels are up to date)
  // But strictly, let's target .drawflow-node to iterate them all
  const allNodes = document.querySelectorAll('.drawflow-node');
  
  allNodes.forEach((nodeEl: any) => {
    // Get node ID
    const nodeId = nodeEl.id?.replace('node-', '');
    if (!nodeId) return;
    
    // Get node data from editor
    const nodeData = editor.drawflow.drawflow?.Home?.data?.[nodeId];
    if (!nodeData) return;
    
    // Get the title text - PRIORITIZE User Data (description -> label -> name)
    const data = nodeData.data || {};
    const title = data.description || data.label || data.name || nodeData.name || 'Unknown';
    
    // Apply Flip Classes
    if (data.flip_h) nodeEl.classList.add('flipped-horizontal');
    else nodeEl.classList.remove('flipped-horizontal');
    
    if (data.flip_v) nodeEl.classList.add('flipped-vertical');
    else nodeEl.classList.remove('flipped-vertical');
    
    // Find component to get icon
    const component = store.components.find(
      (c: any) => (c.componentname || c.name)?.toLowerCase() === nodeData.name?.toLowerCase()
    );
    const iconClass = component?.componentclass || component?.icon || 'fa-solid fa-cube';
    
    // Create new icon-based HTML
    const newHtml = `
      <div class="node-icon-wrapper">
        <div class="node-icon">
          <i class="${iconClass}"></i>
        </div>
        <div class="node-label">${title}</div>
      </div>
    `;
    
    // Find the drawflow_content_node and replace its innerHTML
    const contentNode = nodeEl.querySelector('.drawflow_content_node');
    if (contentNode) {
      contentNode.innerHTML = newHtml;
    }
  });
  
  // Update all connection paths after DOM changes
  updateAllConnections();
}

/**
 * Watch for changes in the selected node's data to update the visual label in real-time.
 */
watch(
  () => store.selectedNode?.data,
  (newData, oldData) => {
    const node = store.selectedNode;
    if (!node || !newData) return;
    
    const nodeEl = document.getElementById(`node-${node.id}`);
    if (!nodeEl) return;
    
    const labelEl = nodeEl.querySelector('.node-label');
    if (labelEl) {
      // Prioritize description -> label -> name -> component name
      const title = newData.description || newData.label || newData.name || node.name;
      if (title && labelEl.textContent !== title) {
        labelEl.textContent = title;
      }
    } else {
        // If label element doesn't exist yet (old style node?), force conversion
        convertOldNodesToIcons();
    }
  },
  { deep: true }
);

/* ======================================================
   Update all connection paths to match current DOM positions
   ======================================================*/
function updateAllConnections() {
  if (!editor) return;
  
  // Get all node IDs from the editor data
  const nodes = editor.drawflow.drawflow?.Home?.data;
  if (!nodes) return;
  
  // Update connections for each node
  Object.keys(nodes).forEach((nodeId) => {
    try {
      editor.updateConnectionNodes(`node-${nodeId}`);
    } catch (e) {
      // Ignore errors for nodes without connections
    }
  });
  
}

/* ======================================================
   Area Management Functions
   ======================================================*/
function createNewArea() {
  const newArea = store.addArea({
    name: `Area ${store.areas.length + 1}`,
    color: '#3b82f6',
    x: 100 + (store.areas.length * 30),
    y: 100 + (store.areas.length * 30),
    width: 400,
    height: 300,
  });
  toast.add({
    title: 'Area Created',
    description: `Created new area: ${newArea.name}`,
  });
}

function updateAreaInStore(area: any) {
  store.updateArea(area.id, area);
}

function deleteAreaFromStore(areaId: string) {
  const area = store.getAreaById(areaId);
  if (area && confirm(`Delete area "${area.name}"?`)) {
    store.deleteArea(areaId);
    toast.add({
      title: 'Area Deleted',
      description: `Deleted area: ${area.name}`,
    });
  }
}

/* ======================================================
   Area Management Functions (DBObject Style)
   ======================================================*/
const activeArea = ref<any>(null);
const areaMode = ref<'move' | 'resize' | null>(null);
// Store initial drag state
const dragStart = ref({ mouseX: 0, mouseY: 0, areaX: 0, areaY: 0, areaW: 0, areaH: 0 });

function startAreaDrag(area: any, ev: MouseEvent) {
  activeArea.value = area;
  areaMode.value = 'move';
  
  dragStart.value = {
    mouseX: ev.clientX,
    mouseY: ev.clientY,
    areaX: area.x,
    areaY: area.y,
    areaW: area.width,
    areaH: area.height
  };

  // Find all nodes within this area
  activeAreaNodes.value = getNodesInArea(area);

  window.addEventListener('mousemove', onAreaMouseMove);
  window.addEventListener('mouseup', stopAreaInteraction);
}

function startAreaResize(area: any, ev: MouseEvent) {
  activeArea.value = area;
  areaMode.value = 'resize';
  
  dragStart.value = {
    mouseX: ev.clientX,
    mouseY: ev.clientY,
    areaX: area.x,
    areaY: area.y,
    areaW: area.width,
    areaH: area.height
  };

  window.addEventListener('mousemove', onAreaMouseMove);
  window.addEventListener('mouseup', stopAreaInteraction);
}

function onAreaMouseMove(ev: MouseEvent) {
  if (!activeArea.value || !editor) return;
  const area = activeArea.value;
  const zoom = editor.zoom; // Drawflow zoom level

  const deltaX = (ev.clientX - dragStart.value.mouseX) / zoom;
  const deltaY = (ev.clientY - dragStart.value.mouseY) / zoom;

  if (areaMode.value === 'move') {
    const newX = dragStart.value.areaX + deltaX;
    const newY = dragStart.value.areaY + deltaY;
    
    // Calculate actual change for nodes (to avoid floating point drift accumulation)
    const dx = newX - area.x;
    const dy = newY - area.y;

    area.x = newX;
    area.y = newY;

    // Move nodes inside the area
    activeAreaNodes.value.forEach(({ nodeId, initialX, initialY }) => {
      const nodeEl = document.getElementById(`node-${nodeId}`);
      if (nodeEl && editor) {
        // We recalculate node position based on total delta to avoid drift
        // But here we rely on the previous logic which updated based on dx. 
        // Let's stick to the dx approach but correctly calculated.
        
        // Actually, easier: Update node position = initialNodePos + totalDelta
        // We need to store initial node positions in startAreaDrag too.
        // But activeAreaNodes already stores initialX/initialY from getNodesInArea?
        // Let's assume getNodesInArea captures CURRENT position as initial.
        
        const newNodeX = initialX + (newX - dragStart.value.areaX); // Total delta
        const newNodeY = initialY + (newY - dragStart.value.areaY);
        
        // Update node position in DOM
        nodeEl.style.left = `${newNodeX}px`;
        nodeEl.style.top = `${newNodeY}px`;
        
        // Update node position in editor data
        const nodeData = editor.drawflow.drawflow?.Home?.data?.[nodeId];
        if (nodeData) {
          nodeData.pos_x = newNodeX;
          nodeData.pos_y = newNodeY;
        }
      }
    });
    
    // Update connections
    if (editor) {
      activeAreaNodes.value.forEach(({ nodeId }) => {
        try {
          editor.updateConnectionNodes(`node-${nodeId}`);
        } catch (e) {
          // Ignore errors
        }
      });
    }
  } else if (areaMode.value === 'resize') {
    area.width = Math.max(100, dragStart.value.areaW + deltaX);
    area.height = Math.max(100, dragStart.value.areaH + deltaY);
  }
}

function stopAreaInteraction() {
  if (activeArea.value) {
    store.updateArea(activeArea.value.id, activeArea.value);
  }
  activeArea.value = null;
  activeAreaNodes.value = [];
  areaMode.value = null;
  window.removeEventListener('mousemove', onAreaMouseMove);
  window.removeEventListener('mouseup', stopAreaInteraction);
}

// Helper function to get all nodes within an area's boundaries
function getNodesInArea(area: any): { nodeId: string; initialX: number; initialY: number }[] {
  const nodesInArea: { nodeId: string; initialX: number; initialY: number }[] = [];
  
  if (!editor || !editor.drawflow?.drawflow?.Home?.data) return nodesInArea;
  
  const nodes = editor.drawflow.drawflow.Home.data;
  
  Object.keys(nodes).forEach((nodeId) => {
    const node = nodes[nodeId];
    const nodeX = node.pos_x;
    const nodeY = node.pos_y;
    
    // Check if node is within area boundaries
    if (
      nodeX >= area.x &&
      nodeX <= area.x + area.width &&
      nodeY >= area.y &&
      nodeY <= area.y + area.height
    ) {
      nodesInArea.push({
        nodeId: nodeId,
        initialX: nodeX,
        initialY: nodeY,
      });
    }
  });
  
  return nodesInArea;
}





/* ======================================================
   Destroy
   ======================================================*/
onBeforeUnmount(() => {
  try {
    editor?.destroy();
  } catch (e) {
  }
  
  // Remove keyboard listener
  window.removeEventListener('keydown', handleKeyDown);
});

/* ======================================================
   Zoom Buttons
   ======================================================*/
function zoomIn() {
  editor?.zoom_in();
}
function zoomOut() {
  editor?.zoom_out();
}
function zoomReset() {
  editor?.zoom_reset();
}

function drop(ev: DragEvent) {
  ev.preventDefault();
  if (!editor) return;

  const data = ev.dataTransfer?.getData('node');
  if (!data) {
    console.warn('⚠️ drop: no data received');
    return;
  }

  const cmp = JSON.parse(data);

  // posisi mouse → posisi canvas
  const rect = (document.getElementById('drawflow') as HTMLElement).getBoundingClientRect();
  const x = ev.clientX - rect.left;
  const y = ev.clientY - rect.top;

  // Get icon class - use componentclass as icon, or fallback to common icon
  const iconClass = cmp.componentclass || cmp.icon || 'fa-solid fa-cube';
  const title = cmp.componenttitle ?? cmp.label ?? cmp.name;
  
  // Create icon-based node template
  const nodeHtml = `
    <div class="node-icon-wrapper">
      <div class="node-icon">
        <i class="${iconClass}"></i>
      </div>
      <div class="node-label">${title}</div>
    </div>
  `;

  editor.addNode(
    cmp.componentname ?? cmp.name ?? cmp.code,
    cmp.input ?? cmp.inputs ?? 1,
    cmp.output ?? cmp.outputs ?? 1,
    x,
    y,
    cmp.componentname ?? cmp.name,
    {},
    nodeHtml,
  );

}

function fixColors(container: HTMLElement) {
  const elements = container.querySelectorAll('*');

  elements.forEach((el: any) => {
    const style = window.getComputedStyle(el);

    if (style.color.includes('oklch')) el.style.color = '#222';
    if (style.backgroundColor.includes('oklch')) el.style.backgroundColor = '#fff';
    if (style.borderColor.includes('oklch')) el.style.borderColor = '#ccc';
  });
}

async function exportImage() {
  const container = document.getElementById('drawflow');
  if (!container) return;

  // 1. Calculate Bounding Box of all nodes
  const nodes = container.querySelectorAll('.drawflow-node');
  if (nodes.length === 0) {
    toast.add({ title: 'Export Failed', description: 'No nodes to export', color: 'orange' });
    return;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach((node: any) => {
    // offsetLeft/Top are relative to the .drawflow container (which is what we will capture)
    // providing the transform is effectively reset or ignored by calculating in this space
    const x = node.offsetLeft;
    const y = node.offsetTop;
    const w = node.offsetWidth;
    const h = node.offsetHeight;

    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x + w > maxX) maxX = x + w;
    if (y + h > maxY) maxY = y + h;
  });
  
  // Also include Areas in the bounding box calculation
  // The areas are in a separate wrapper but share the same coordinate space (thanks to our fix)
  // However, for export, we want to capture the .drawflow container.
  // We can try to capture the PARENT #drawflow, but then we have to handle the viewport.
  // BETTER STRATEGY: Capture the .drawflow layer, but force it to be large enough.
  
  // Add padding
  const padding = 50;
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;

  const totalWidth = maxX - minX;
  const totalHeight = maxY - minY;

  // 2. Prepare Export
  const contentLayer = container.querySelector('.drawflow') as HTMLElement;
  if (!contentLayer) return;
  
  fixColors(contentLayer);

  // TEMPORARY: Thicken lines for export to prevent faintest
  const connections = contentLayer.querySelectorAll('.connection .main-path');
  const originalWidths = new Map();
  connections.forEach((path: any, index) => {
     originalWidths.set(index, path.style.strokeWidth);
     path.style.strokeWidth = '6px'; // Thick lines for high-res export
     path.style.stroke = '#4682b4'; // Ensure solid color (SteelBlue)
  });

  try {
      const canvas = await toPng(contentLayer, {
        cacheBust: true,
        pixelRatio: 2.5, // slightly lower than 3 to avoid excessive memory, but 2.5 is sharp
        backgroundColor: '#ffffff',
        width: totalWidth,
        height: totalHeight,
        style: {
          transform: `translate(${-minX}px, ${-minY}px) scale(1)`,
          transformOrigin: 'top left',
          width: `${totalWidth}px`,
          height: `${totalHeight}px`,
        }
      });
      
      // RESTORE line widths
      connections.forEach((path: any, index) => {
         path.style.strokeWidth = originalWidths.get(index);
         path.style.stroke = ''; // removing inline stroke to revert to css class
      });

      const link = document.createElement('a');
      link.download = `workflow-${new Date().toISOString().slice(0,10)}.png`;
      link.href = canvas;
      link.click();
      
      toast.add({ title: 'Export Success', description: 'Image downloaded', color: 'green' });
  } catch (err) {
      // Restore on error too
      connections.forEach((path: any, index) => {
         path.style.strokeWidth = originalWidths.get(index);
         path.style.stroke = '';
      });
      
      console.error('Export failed', err);
      toast.add({ title: 'Export Failed', description: String(err), color: 'red' });
  }
}

const copySchema = async () => {
  const name = window.prompt('Copy Schema From ? ');
  console.log(name)
  if (name) {
    try {
      await store.copyFlow(name);
      
    } catch (err) {
      console.error('Error loading :', err);
    }
  } else {
    console.warn('Empty');
  }
};

const route = useRoute();
const Api = useApi();

function formDataToObject(fd: FormData) {
  const obj: Record<string, any> = {};
  for (const [key, value] of fd.entries()) {
    obj[key] = value instanceof File ? value.name : value;
  }
  return obj;
}

/* ======================================================
   Inject result panel below each node
   ======================================================*/
function injectNodeResults(results: any[]) {
  // Clear any existing result panels first
  clearNodeResultPanels();
  
  // Get the drawflow parent container
  const drawflowContainer = document.getElementById('drawflow');
  if (!drawflowContainer) return;
  
  // Get the parent element that holds the nodes (drawflow_content)
  const drawflowContent = drawflowContainer.querySelector('.drawflow') as HTMLElement;
  if (!drawflowContent) return;
  
  // Filter duplicate results for same node (keep latest)
  const uniqueResults = new Map();
  results.forEach(step => {
      uniqueResults.set(step.nodeId, step);
  });

  uniqueResults.forEach((step) => {
    const nodeEl = document.getElementById(`node-${step.nodeId}`) as HTMLElement;
    if (!nodeEl) return;
    
    // Apply visual state to node
    nodeEl.classList.remove('node-success', 'node-error');
    if (step.success) {
      nodeEl.classList.add('node-success');
    } else {
      nodeEl.classList.add('node-error');
      nodeErrors.value.set(step.nodeId, step.error || 'Unknown error');
    }
    
    // Get node position and dimensions
    const nodeRect = nodeEl.getBoundingClientRect();
    const containerRect = drawflowContent.getBoundingClientRect();
    
    // Calculate position relative to drawflow content
    const nodeLeft = nodeEl.offsetLeft;
    const nodeTop = nodeEl.offsetTop;
    const nodeWidth = nodeEl.offsetWidth;
    const nodeHeight = nodeEl.offsetHeight;
    
    // Create result panel element
    const panel = document.createElement('div');
    panel.className = 'node-result-panel';
    panel.setAttribute('data-node-result', step.nodeId);
    
    // Determine status color
    const bgColor = step.success ? '#dcfce7' : '#fee2e2';
    const borderColor = step.success ? '#22c55e' : '#ef4444';
    const icon = step.success ? '✓' : '✗';
    const iconColor = step.success ? '#16a34a' : '#dc2626';
    
    // Use a minimum width of 200px for better readability
    const panelWidth = Math.max(nodeWidth, 80);
    
    // Position panel below the node using fixed coordinates
    // Hidden by default - will show when node is clicked
    panel.style.cssText = `
      position: absolute;
      left: ${nodeLeft}px;
      top: ${nodeTop + nodeHeight + 4}px;
      min-width: ${panelWidth}px;
      background: ${bgColor};
      border: 1px solid ${borderColor};
      border-radius: 6px;
      padding: 8px 10px;
      font-size: 12px;
      z-index: 10;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      pointer-events: auto;
      resize: both;
      overflow: auto;
      display: none;
    `;
    
    // Create collapsed view
    const summary = document.createElement('div');
    summary.className = 'result-summary';
    summary.style.cssText = 'display: flex; align-items: center; justify-content: space-between;';
    summary.innerHTML = `
      <span style="color: ${iconColor}; font-weight: bold; font-size: 14px;">${icon}</span>
      <span style="margin-left: 8px; flex: 1; color: #374151; font-size: 12px;">${step.executionTime}ms</span>
      <span style="color: #6b7280; font-size: 12px;">▼</span>
    `;
    
    // Create expanded details
    const details = document.createElement('div');
    details.className = 'result-details';
    details.style.cssText = 'display: none; margin-top: 8px; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 8px; height: calc(100% - 40px); overflow: hidden; display: flex; flex-direction: column;';
    
    let detailsHtml = '';
    if (step.input && Object.keys(step.input).length > 0) {
      detailsHtml += `<div style="margin-bottom: 8px; flex-shrink: 0;"><strong style="font-size: 12px;">Input:</strong><pre style="background: white; padding: 8px; border-radius: 4px; margin: 4px 0; overflow: auto; max-height: 150px; font-size: 11px; white-space: pre-wrap; word-break: break-all;">${JSON.stringify(step.input, null, 2)}</pre></div>`;
    }
    detailsHtml += `<div style="flex: 1; display: flex; flex-direction: column; min-height: 0;"><strong style="font-size: 12px;">Result:</strong><pre style="background: white; padding: 8px; border-radius: 4px; margin: 4px 0; overflow: auto; flex: 1; font-size: 11px; white-space: pre-wrap; word-break: break-all;">${JSON.stringify(step.result, null, 2)}</pre></div>`;
    if (step.error) {
      detailsHtml += `<div style="color: #dc2626; margin-top: 6px; font-size: 12px; flex-shrink: 0;"><strong>Error:</strong> ${step.error}</div>`;
    }
    details.innerHTML = detailsHtml;
    
    // Toggle expand/collapse
    panel.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = details.style.display === 'none' || details.style.display === '';
      
      if (isExpanded) {
        // Expanding - make panel larger to show more content
        details.style.display = 'flex';
        summary.querySelector('span:last-child')!.textContent = '▲';
        panel.style.minWidth = '600px';  // Increased from 400px
        panel.style.minHeight = '400px'; // Increased from 300px
        panel.style.maxWidth = '800px';  // Add max width
        panel.style.maxHeight = '600px'; // Add max height
      } else {
        // Collapsing
        details.style.display = 'none';
        summary.querySelector('span:last-child')!.textContent = '▼';
        panel.style.minWidth = `${panelWidth}px`;
        panel.style.minHeight = 'auto';
        panel.style.maxWidth = 'none';
        panel.style.maxHeight = 'none';
      }
    });
    
    panel.appendChild(summary);
    panel.appendChild(details);
    
    // Append to the drawflow content container (not inside node)
    drawflowContent.appendChild(panel);
  });
}

function clearNodeResultPanels() {
  const panels = document.querySelectorAll('.node-result-panel');
  panels.forEach(panel => panel.remove());
}

function collapseNodeResultPanel(nodeId: string) {
  const panel = document.querySelector(`.node-result-panel[data-node-result="${nodeId}"]`) as HTMLElement;
  if (!panel) return;
  
  const details = panel.querySelector('.result-details') as HTMLElement;
  const summary = panel.querySelector('.result-summary') as HTMLElement;
  
  if (details && details.style.display !== 'none') {
    // Collapse the panel
    details.style.display = 'none';
    // Reset the arrow
    const arrow = summary?.querySelector('span:last-child');
    if (arrow) arrow.textContent = '▼';
    // Reset min-width to smaller size
    panel.style.minWidth = '80px';
  }
}

function clearTestResults() {
  stepResults.value = [];
  testResult.value = '';
  payload.value = '';
  showPayload.value = false;
  clearNodeResultPanels();
}

async function testFlow() {
  try {
    // Set loading state
    isTestingFlow.value = true;
    
    // Clear previous results and node states
    clearTestResults();
    nodeStates.value.clear();
    nodeErrors.value.clear();
    
    const dataForm = new FormData();
    dataForm.append('flowname', route.params.slug);
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');
    dataForm.append('debug', 'true'); // Enable step-by-step results
    for (let index = 0; index < store.parameters.length; index++) {
      const element = store.parameters[index];
      dataForm.append(element.parametername, element.parametervalue);
    }
    const res = await Api.post('api/admin/execute-flow', dataForm);
    payload.value = JSON.stringify(formDataToObject(dataForm), null, 2);
    showPayload.value = true;

    if (res?.code == 200) {
      // Check if we have step results
      if (res.data?.stepResults && Array.isArray(res.data.stepResults)) {
        stepResults.value = res.data.stepResults;
        // Inject result panels below each node
        injectNodeResults(res.data.stepResults);
        
        toast.add({
          title: 'Test Complete',
          description: `${res.data.stepResults.length} steps executed`,
          color: 'green',
        });
      } else {
        testResult.value = JSON.stringify(res.data ?? res.message, null, 2);
      }
    } else {
      testResult.value = `Error: ${res.message}`;
      toast.add({
        title: 'Test Failed',
        description: res.message,
        color: 'red',
      });
    }
  } catch (err) {
    testResult.value = `Exception: ${err}`;
    toast.add({
      title: 'Test Error',
      description: String(err),
      color: 'red',
    });
  } finally {
    // Clear loading state
    isTestingFlow.value = false;
  }
}
</script>
