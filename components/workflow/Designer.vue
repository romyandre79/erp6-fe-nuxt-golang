<template>
  <div class="relative h-full">
    <div
      v-if="testResult"
      id="test-result-overlay"
      class="absolute top-6 left-6 p-4 bg-white shadow-xl rounded border z-50 max-w-md"
    >
      <h3 class="font-bold text-lg">Payload (Form Data)</h3>
      <pre class="text-sm whitespace-pre-wrap">{{ payload }}</pre>
      <h3 class="font-bold text-lg">Test Result</h3>
      <pre class="text-sm whitespace-pre-wrap">{{ testResult }}</pre>
      <button @click="testResult = ''" class="mt-2 px-3 py-1 bg-gray-200 rounded text-sm">Close</button>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useWorkflowStore } from '~/store/workflow';
import { toPng } from 'html-to-image';
import { useToast, useNuxtApp, useApi, useRoute } from '#imports';

const store = useWorkflowStore();
const toast = useToast();
const testResult = ref('');
const payload = ref('');

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
  ed.on('nodeRemoved', () => scheduleSave());
  ed.on('connectionCreated', () => scheduleSave());
  ed.on('connectionRemoved', () => scheduleSave());

  ed.on('nodeSelected', async (id: string) => {
    const cleanId = id.replace('node-', '');
    const node = ed.drawflow.drawflow?.Home?.data?.[cleanId];

    if (node) {
      await store.loadComponentProperties(node.name, cleanId.toString());
      store.setSelectedNode(node);
    }
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

    xhr.open('POST', `${apiBase}/plugins/upload`);

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
    } catch (e) {
      console.error('❌ Failed to import workflow', e);
    }
  },
  { immediate: true },
);

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

  editor.addNode(
    cmp.componentname ?? cmp.name ?? cmp.code,
    cmp.input ?? cmp.inputs ?? 1,
    cmp.output ?? cmp.outputs ?? 1,
    x,
    y,
    cmp.componentname ?? cmp.name,
    {},
    `<div class='title-box'>${cmp.componenttitle ?? cmp.label ?? cmp.name}</div>`,
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

async function testFlow() {
  try {
    const dataForm = new FormData();
    dataForm.append('flowname', route.params.slug);
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');
    for (let index = 0; index < store.parameters.length; index++) {
      const element = store.parameters[index];
      dataForm.append(element.parametername, element.parametervalue);
    }
    const res = await Api.post('admin/execute-flow', dataForm);
    payload.value = JSON.stringify(formDataToObject(dataForm), null, 2);

    if (res?.code == 200) {
      testResult.value = JSON.stringify(res.data ?? res.message, null, 2);
    } else {
      testResult.value = `Error: ${res.message}`;
    }
  } catch (err) {
    testResult.value = `Exception: ${err}`;
  }
}
</script>
