<template>
  <div class="relative h-full">
    <div id="drawflow" class="absolute inset-0" @drop="drop" @dragover.prevent></div>

    <!-- Zoom Control -->
    <div class="absolute right-6 top-6 flex flex-row gap-2 z-50">
      <button @click="zoomOut" class="p-2 rounded shadow bg-white text-black">-</button>
      <button @click="zoomReset" class="p-2 rounded shadow bg-white text-black">Reset</button>
      <button @click="zoomIn" class="p-2 rounded shadow bg-white text-black">+</button>
      <button @click="Save" class="p-2 rounded shadow bg-white text-black">Save</button>
      <button @click="exportImage" class="p-2 rounded shadow bg-white text-black">Export PNG</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { useWorkflowStore } from '~/store/workflow';
import html2canvas from 'html2canvas';

const store = useWorkflowStore();
const toast = useToast();

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
      const res = await store.loadComponentProperties(node.name, cleanId.toString());
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
  } catch {}
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

  const canvas = await html2canvas(container, {
    backgroundColor: '#ffffff',
    scale: 2, // resolusi tinggi
  });

  const link = document.createElement('a');
  link.download = 'workflow.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
</script>
