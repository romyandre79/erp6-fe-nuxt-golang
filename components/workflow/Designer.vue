<template>
  <div class="relative h-full">
    <!-- Payload Display (top-left, minimal) -->
    <div
      v-if="showPayload"
      id="payload-overlay"
      class="absolute top-6 left-6 p-3 bg-white shadow-lg rounded border z-50 max-w-sm"
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

    <div id="drawflow" class="absolute inset-0" @drop="drop" @dragover.prevent></div>

    <!-- Zoom Control -->
    <div class="absolute right-6 top-6 flex flex-row gap-2 z-50">
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
      <button @click="testFlow" class="p-2 rounded shadow bg-white text-black">Test Flow</button>
      <button v-if="hasTestResults" @click="clearTestResults" class="p-2 rounded shadow bg-red-100 text-red-600 hover:bg-red-200">Clear Results</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useWorkflowStore } from '~/store/workflow';
import { toPng } from 'html-to-image';
import { useToast, useNuxtApp, useApi, useRoute } from '#imports';

const store = useWorkflowStore();
const toast = useToast();
const testResult = ref('');
const payload = ref('');
const showPayload = ref(false);

// Step Results State
const stepResults = ref<any[]>([]);
const hasTestResults = computed(() => stepResults.value.length > 0);

// Upload State
const showUploadModal = ref(false);
const selectedFile = ref<File | null>(null);
const uploadProgress = ref(-1);
const uploadStatus = ref('');
const uploadError = ref('');
const isUploading = ref(false);

let editor: any = null;
let saveTimeout: any = null;

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
  ed.on('nodeCreated', () => scheduleSave());
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
    scheduleSave();
  });
  ed.on('connectionCreated', () => scheduleSave());
  ed.on('connectionRemoved', () => scheduleSave());

  ed.on('nodeSelected', async (id: string) => {
    console.log('Designer: nodeSelected event', id);
    const cleanId = id.replace('node-', '');
    const node = ed.drawflow.drawflow?.Home?.data?.[cleanId];

    if (node) {
      console.log('Designer: Loading properties for node', cleanId, node.name);
      await store.loadComponentProperties(node.name, cleanId.toString());
      console.log('Designer: Setting selected node in store');
      store.setSelectedNode(node);
    }
    
    // Collapse the result panel for this node when clicked
    collapseNodeResultPanel(cleanId);
  });

  return ed;
}

/* ======================================================
   Auto Save
   ======================================================*/
function scheduleSave() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      store.saveFlow(editor.export());
    } catch (e) {
      console.error('❌ saveFlow error', e);
    }
  }, 500);
}

async function Save() {
  try {
    const res = await store.saveFlow(editor.export());
    if (res.code == 200) {
      toast.add({
        title: $t('TITLE UPDATE'),
        description: $t(res.message.replaceAll('_', ' ')),
      });
    }
  } catch (e) {
    console.error('❌ saveFlow error', e);
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

    xhr.open('POST', `${apiBase}/admin/plugins/upload`);

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
      }, 100);
    } catch (e) {
      console.error('❌ ERROR IMPORT DRAWFLOW', e);
    }
  }
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
  
  // Find all nodes with title-box (old style)
  const oldNodes = document.querySelectorAll('.drawflow-node .title-box');
  
  oldNodes.forEach((titleBox) => {
    const nodeEl = titleBox.closest('.drawflow-node') as HTMLElement;
    if (!nodeEl) return;
    
    // Get node ID
    const nodeId = nodeEl.id?.replace('node-', '');
    if (!nodeId) return;
    
    // Get node data from editor
    const nodeData = editor.drawflow.drawflow?.Home?.data?.[nodeId];
    if (!nodeData) return;
    
    // Get the title text
    const title = titleBox.textContent || nodeData.name || 'Unknown';
    
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
  
  console.log(`✅ Converted ${oldNodes.length} old nodes to icon style`);
  
  // Update all connection paths after DOM changes
  updateAllConnections();
}

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
  
  console.log('✅ Updated all connection paths');
}

/* ======================================================
   Destroy
   ======================================================*/
onBeforeUnmount(() => {
  try {
    editor?.destroy();
  } catch (e) {
    console.error(e);
  }
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

  // auto save
  scheduleSave();
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

  fixColors(container);

  const canvas = await toPng(container, {
    cacheBust: true, // optional: mencegah cache gambar lama
    pixelRatio: 2, // optional: resolusi lebih tinggi
  });

  const link = document.createElement('a');
  link.download = 'workflow.png';
  link.href = canvas;
  link.click();
}

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
  
  results.forEach((step) => {
    const nodeEl = document.getElementById(`node-${step.nodeId}`) as HTMLElement;
    if (!nodeEl) return;
    
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
    details.style.cssText = 'display: none; margin-top: 8px; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 8px;';
    
    let detailsHtml = '';
    if (step.input && Object.keys(step.input).length > 0) {
      detailsHtml += `<div style="margin-bottom: 8px;"><strong style="font-size: 12px;">Input:</strong><pre style="background: white; padding: 8px; border-radius: 4px; margin: 4px 0; overflow: auto; max-height: 150px; font-size: 11px; white-space: pre-wrap; word-break: break-all;">${JSON.stringify(step.input, null, 2)}</pre></div>`;
    }
    detailsHtml += `<div><strong style="font-size: 12px;">Result:</strong><pre style="background: white; padding: 8px; border-radius: 4px; margin: 4px 0; overflow: auto; max-height: 200px; font-size: 11px; white-space: pre-wrap; word-break: break-all;">${JSON.stringify(step.result, null, 2)}</pre></div>`;
    if (step.error) {
      detailsHtml += `<div style="color: #dc2626; margin-top: 6px; font-size: 12px;"><strong>Error:</strong> ${step.error}</div>`;
    }
    details.innerHTML = detailsHtml;
    
    // Toggle expand/collapse
    panel.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = details.style.display !== 'none';
      details.style.display = isExpanded ? 'none' : 'block';
      summary.querySelector('span:last-child')!.textContent = isExpanded ? '▼' : '▲';
      
      // When expanding, make panel wider for better readability
      if (!isExpanded) {
        panel.style.minWidth = '400px';
      } else {
        // When collapsing, reset to original width
        panel.style.minWidth = `${panelWidth}px`;
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
    // Clear previous results
    clearTestResults();
    
    const dataForm = new FormData();
    dataForm.append('flowname', route.params.slug);
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');
    dataForm.append('debug', 'true'); // Enable step-by-step results
    for (let index = 0; index < store.parameters.length; index++) {
      const element = store.parameters[index];
      dataForm.append(element.parametername, element.parametervalue);
    }
    const res = await Api.post('admin/execute-flow', dataForm);
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
  }
}
</script>
