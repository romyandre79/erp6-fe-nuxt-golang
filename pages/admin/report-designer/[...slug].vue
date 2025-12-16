<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Top Toolbar -->
    <div class="flex items-center justify-between px-4 py-2 bg-white border-b">
      <div class="flex items-center gap-2">
        <UButton icon="i-heroicons-arrow-left" size="sm" variant="ghost" @click="goBack">Back</UButton>
        <span class="text-lg font-semibold">{{ reportStore.currentTemplate?.reportName || 'Report Designer' }}</span>
      </div>

      <div class="flex items-center gap-2">
        <UButton icon="i-heroicons-arrow-uturn-left" size="sm" variant="ghost" @click="reportStore.undo" :disabled="reportStore.undoStack.length === 0">Undo</UButton>
        <UButton icon="i-heroicons-arrow-uturn-right" size="sm" variant="ghost" @click="reportStore.redo" :disabled="reportStore.redoStack.length === 0">Redo</UButton>
        
        <UDivider orientation="vertical" class="h-6" />
        
        <USelect v-model="zoomLevel" :options="zoomOptions" size="sm" class="w-24" @change="handleZoomChange" />
        
        <UDivider orientation="vertical" class="h-6" />
        
        <UButton icon="i-heroicons-squares-2x2" size="sm" variant="ghost" :color="reportStore.showGrid ? 'primary' : 'gray'" @click="reportStore.toggleGrid">Grid</UButton>
        <UButton icon="i-heroicons-arrows-pointing-out" size="sm" variant="ghost" :color="reportStore.snapToGrid ? 'primary' : 'gray'" @click="reportStore.toggleSnapToGrid">Snap</UButton>
        
        <UDivider orientation="vertical" class="h-6" />
        
        <UButton icon="i-heroicons-arrow-down-tray" size="sm" variant="soft" @click="exportJRXML">Export JRXML</UButton>
        <UButton icon="i-heroicons-eye" size="sm" variant="soft" @click="previewReport">Preview</UButton>
        <UButton icon="i-heroicons-check" size="sm" color="primary" @click="saveReport" :loading="saving">Save</UButton>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Sidebar - Component Palette -->
      <div class="w-64 bg-white border-r overflow-y-auto">
        <ReportSidebar />
      </div>

      <!-- Center Canvas -->
      <div class="flex-1 bg-gray-100 overflow-auto relative">
        <ReportCanvas />
      </div>

      <!-- Right Panel - Properties -->
      <div class="w-80 bg-white border-l overflow-y-auto">
        <div class="p-4">
          <h3 class="font-semibold mb-4">Properties</h3>
          <ReportProperties v-if="reportStore.selectedElement" />
          <div v-else class="text-sm text-gray-500 text-center py-8">
            Select an element to edit properties
          </div>
        </div>
      </div>
    </div>
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
import { useReportStore } from '~/store/report';

definePageMeta({
  middleware: ['auth'],
  layout: 'auth',
});

const route = useRoute();
const router = useRouter();
const reportStore = useReportStore();
const toast = useToast();
const Api = useApi();

const saving = ref(false);
const isLoading = ref(false);
const zoomLevel = ref('100%');

const zoomOptions = ['25%', '50%', '75%', '100%', '150%', '200%', '400%'];

async function loadReport() {
  const id = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug;
  if (!id) return;

  try {
    isLoading.value = true;
    await reportStore.loadTemplate(parseInt(id));
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to load report template', color: 'red' });
    router.push('/admin/report-designer');
  } finally {
    isLoading.value = false;
  }
}

function handleZoomChange() {
  const zoom = parseInt(zoomLevel.value.replace('%', ''));
  reportStore.setZoom(zoom);
}

async function saveReport() {
  try {
    saving.value = true;
    await reportStore.saveTemplate();
    toast.add({ title: 'Success', description: 'Report saved successfully', color: 'green' });
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to save report', color: 'red' });
  } finally {
    saving.value = false;
  }
}

async function exportJRXML() {
  if (!reportStore.currentTemplate?.reportTemplateID) return;

  try {
    isLoading.value = true;
    const response = await Api.get(`/api/admin/report-templates/${reportStore.currentTemplate.reportTemplateID}/export-jrxml`);
    const blob = new Blob([response], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportStore.currentTemplate.reportName}.jrxml`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.add({ title: 'Success', description: 'JRXML exported successfully', color: 'green' });
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to export JRXML', color: 'red' });
  } finally {
    isLoading.value = false;
  }
}

function previewReport() {
  toast.add({ title: 'Info', description: 'Preview functionality coming soon', color: 'blue' });
}

function goBack() {
  router.push('/admin/report-designer');
}

onMounted(() => {
  loadReport();
});

// Update zoom level when store changes
watch(() => reportStore.zoom, (newZoom) => {
  zoomLevel.value = `${newZoom}%`;
});
</script>
