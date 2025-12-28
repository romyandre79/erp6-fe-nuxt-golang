<template>
  <div class="module-manager p-6">
    <div class="header mb-6">
      <h1 class="text-3xl font-bold mb-2">Module Manager</h1>
      <p class="text-gray-600">Install, manage, and remove system modules</p>
    </div>

    <!-- Upload Module Section -->
    <div class="upload-section bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Install New Module</h2>

      <div
        class="upload-area border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
      >
        <input ref="fileInput" type="file" accept=".zip" class="hidden" @change="handleFileSelect" />

        <div v-if="!selectedFile" @click="$refs.fileInput.click()" class="cursor-pointer">
          <i class="fas fa-cloud-upload-alt text-5xl text-gray-400 mb-4"></i>
          <p class="text-lg font-medium text-gray-700">Click to upload module package</p>
          <p class="text-sm text-gray-500 mt-2">ZIP file containing module.json</p>
        </div>

        <div v-else class="space-y-4">
          <div class="flex items-center justify-center space-x-3">
            <i class="fas fa-file-archive text-4xl text-blue-500"></i>
            <div class="text-left">
              <p class="font-medium text-gray-800">{{ selectedFile.name }}</p>
              <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
            </div>
          </div>

          <div class="flex space-x-3 justify-center">
            <button
              @click="uploadModule"
              :disabled="uploading"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i v-if="uploading" class="fas fa-spinner fa-spin mr-2"></i>
              {{ uploading ? 'Installing...' : 'Install Module' }}
            </button>
            <button
              @click="clearFile"
              :disabled="uploading"
              class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          <!-- Upload Progress -->
          <div v-if="uploading" class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Installed Modules List -->
    <div class="modules-list bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Installed Modules</h2>
        <button @click="loadModules" class="text-blue-600 hover:text-blue-700">
          <i class="fas fa-sync-alt mr-2"></i>Refresh
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-600">Loading modules...</p>
      </div>

      <!-- Modules Grid -->
      <div v-else-if="modules.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="module in modules"
          :key="module.moduleid"
          class="module-card border rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="font-semibold text-lg">{{ module.modulename }}</h3>
              <p class="text-sm text-gray-500">v{{ module.moduleversion }}</p>
            </div>
            <span
              :class="module.recordstatus === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
              class="px-2 py-1 rounded text-xs font-medium"
            >
              {{ module.recordstatus === 1 ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <p class="text-sm text-gray-600 mb-4 line-clamp-2">{{ module.description }}</p>

          <div class="text-xs text-gray-500 mb-4">
            <p>Installed: {{ formatDate(module.installdate) }}</p>
            <p>Created by: {{ module.createdby }}</p>
          </div>

          <div class="flex space-x-2">
            <button
              @click="viewModuleDetails(module.moduleid)"
              class="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm font-medium transition-colors"
            >
              <i class="fas fa-info-circle mr-1"></i>Details
            </button>
            <button
              @click="exportModule(module.moduleid, module.modulename)"
              class="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded hover:bg-green-100 text-sm font-medium transition-colors"
            >
              <i class="fas fa-download mr-1"></i>Export
            </button>
            <button
              @click="confirmUninstall(module)"
              class="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm font-medium transition-colors"
            >
              <i class="fas fa-trash-alt mr-1"></i>Uninstall
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <i class="fas fa-box-open text-5xl text-gray-300 mb-4"></i>
        <p class="text-gray-600">No modules installed</p>
        <p class="text-sm text-gray-500 mt-2">Upload a module package to get started</p>
      </div>
    </div>

    <!-- Module Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeDetailsModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div class="p-6 border-b flex justify-between items-center">
          <h2 class="text-2xl font-bold">Module Details</h2>
          <button @click="closeDetailsModal" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div v-if="moduleDetails" class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <!-- Module Info -->
          <div class="mb-6">
            <h3 class="text-xl font-semibold mb-2">{{ moduleDetails.module.modulename }}</h3>
            <p class="text-gray-600 mb-4">{{ moduleDetails.module.description }}</p>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div><span class="font-medium">Version:</span> {{ moduleDetails.module.moduleversion }}</div>
              <div><span class="font-medium">Created by:</span> {{ moduleDetails.module.createdby }}</div>
              <div><span class="font-medium">Installed:</span> {{ formatDate(moduleDetails.module.installdate) }}</div>
              <div>
                <span class="font-medium">Status:</span>
                {{ moduleDetails.module.recordstatus === 1 ? 'Active' : 'Inactive' }}
              </div>
            </div>
          </div>

          <!-- Dependencies -->
          <div v-if="moduleDependencies" class="mb-6">
            <h4 class="font-semibold mb-3 flex items-center">
              <i class="fas fa-project-diagram mr-2 text-blue-600"></i>
              Dependencies
            </h4>

            <div v-if="moduleDependencies.depends_on.length > 0" class="mb-3">
              <p class="text-sm font-medium text-gray-700 mb-2">Depends on:</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="dep in moduleDependencies.depends_on"
                  :key="dep.moduleid"
                  class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {{ dep.modulename }}
                </span>
              </div>
            </div>

            <div v-if="moduleDependencies.dependents.length > 0" class="mb-3">
              <p class="text-sm font-medium text-gray-700 mb-2">Required by:</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="dep in moduleDependencies.dependents"
                  :key="dep.moduleid"
                  class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                >
                  {{ dep.modulename }}
                </span>
              </div>
            </div>

            <div v-if="moduleDependencies.depends_on.length === 0 && moduleDependencies.dependents.length === 0">
              <p class="text-sm text-gray-500">No dependencies</p>
            </div>
          </div>

          <!-- Menu Access -->
          <div v-if="moduleDetails.menuaccess.length > 0" class="mb-6">
            <h4 class="font-semibold mb-3 flex items-center">
              <i class="fas fa-bars mr-2 text-green-600"></i>
              Menu Items ({{ moduleDetails.menuaccess.length }})
            </h4>
            <div class="space-y-2">
              <div
                v-for="menu in moduleDetails.menuaccess"
                :key="menu.menuaccessid"
                class="p-3 bg-gray-50 rounded flex items-center"
              >
                <i :class="menu.menuicon" class="mr-3 text-gray-600"></i>
                <div>
                  <p class="font-medium">{{ menu.menuname }}</p>
                  <p class="text-xs text-gray-500">{{ menu.menuurl }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Widgets -->
          <div v-if="moduleDetails.widgets.length > 0" class="mb-6">
            <h4 class="font-semibold mb-3 flex items-center">
              <i class="fas fa-th mr-2 text-purple-600"></i>
              Widgets ({{ moduleDetails.widgets.length }})
            </h4>
            <div class="space-y-2">
              <div v-for="widget in moduleDetails.widgets" :key="widget.widgetid" class="p-3 bg-gray-50 rounded">
                <p class="font-medium">{{ widget.widgettitle }}</p>
                <p class="text-sm text-gray-600">{{ widget.description }}</p>
              </div>
            </div>
          </div>

          <!-- Workflows -->
          <div v-if="moduleDetails.workflows.length > 0" class="mb-6">
            <h4 class="font-semibold mb-3 flex items-center">
              <i class="fas fa-sitemap mr-2 text-indigo-600"></i>
              Workflows ({{ moduleDetails.workflows.length }})
            </h4>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="workflow in moduleDetails.workflows"
                :key="workflow.workflowid"
                class="p-2 bg-gray-50 rounded text-sm"
              >
                {{ workflow.wfname }}
              </div>
            </div>
          </div>

          <!-- Database Tables -->
          <div v-if="moduleDetails.tables.length > 0" class="mb-6">
            <h4 class="font-semibold mb-3 flex items-center">
              <i class="fas fa-database mr-2 text-red-600"></i>
              Database Tables ({{ moduleDetails.tables.length }})
            </h4>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="table in moduleDetails.tables"
                :key="table.moduletablesid"
                class="p-2 bg-gray-50 rounded text-sm font-mono"
              >
                {{ table.nametable }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Uninstall Confirmation Modal -->
    <div
      v-if="showUninstallModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeUninstallModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
            </div>
            <h3 class="text-xl font-bold">Uninstall Module</h3>
          </div>

          <p class="text-gray-700 mb-4">
            Are you sure you want to uninstall <strong>{{ moduleToUninstall?.modulename }}</strong
            >?
          </p>

          <!-- Dependency Warning -->
          <div
            v-if="uninstallDependencies && uninstallDependencies.dependents.length > 0"
            class="bg-orange-50 border border-orange-200 rounded p-4 mb-4"
          >
            <p class="text-orange-800 font-medium mb-2">
              <i class="fas fa-exclamation-circle mr-2"></i>
              Cannot uninstall - Dependencies exist
            </p>
            <p class="text-sm text-orange-700 mb-2">The following modules depend on this module:</p>
            <ul class="list-disc list-inside text-sm text-orange-700">
              <li v-for="dep in uninstallDependencies.dependents" :key="dep.moduleid">
                {{ dep.modulename }}
              </li>
            </ul>
            <p class="text-sm text-orange-700 mt-2">Please uninstall dependent modules first.</p>
          </div>

          <!-- Table Cleanup Option -->
          <div v-else class="mb-4">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                v-model="dropTables"
                type="checkbox"
                class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span class="text-sm text-gray-700"> Drop database tables (⚠️ This will delete all data) </span>
            </label>
          </div>

          <div class="flex space-x-3">
            <button
              v-if="!uninstallDependencies || uninstallDependencies.dependents.length === 0"
              @click="uninstallModule"
              :disabled="uninstalling"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <i v-if="uninstalling" class="fas fa-spinner fa-spin mr-2"></i>
              {{ uninstalling ? 'Uninstalling...' : 'Uninstall' }}
            </button>
            <button
              @click="closeUninstallModal"
              :disabled="uninstalling"
              class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toast.show" class="fixed bottom-4 right-4 z-50">
      <div
        :class="{
          'bg-green-500': toast.type === 'success',
          'bg-red-500': toast.type === 'error',
          'bg-blue-500': toast.type === 'info',
        }"
        class="text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3"
      >
        <i
          :class="{
            'fa-check-circle': toast.type === 'success',
            'fa-exclamation-circle': toast.type === 'error',
            'fa-info-circle': toast.type === 'info',
          }"
          class="fas text-xl"
        ></i>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const fileInput = ref(null);
const selectedFile = ref(null);
const uploading = ref(false);
const uploadProgress = ref(0);
const loading = ref(false);
const modules = ref([]);
const showDetailsModal = ref(false);
const moduleDetails = ref(null);
const moduleDependencies = ref(null);
const showUninstallModal = ref(false);
const moduleToUninstall = ref(null);
const uninstallDependencies = ref(null);
const dropTables = ref(false);
const uninstalling = ref(false);
const toast = ref({ show: false, message: '', type: 'info' });

const config = useRuntimeConfig();
const api = useApi();

definePageMeta({
  layout: 'auth',
});

onMounted(() => {
  loadModules();
});

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file && file.name.endsWith('.zip')) {
    selectedFile.value = file;
  } else {
    showToast('Please select a valid ZIP file', 'error');
  }
}

function clearFile() {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

async function uploadModule() {
  if (!selectedFile.value) return;

  uploading.value = true;
  uploadProgress.value = 0;

  const formData = new FormData();
  formData.append('module', selectedFile.value);
  formData.append('menu', 'modules');

  try {
    const response = await api.post(`/api/admin/module/upload`, {
      body: formData,
    });

    uploadProgress.value = 100;

    const data = await response.json();

    if (response.ok) {
      showToast('Module installed successfully!', 'success');
      clearFile();
      await loadModules();
    } else {
      showToast(data.message || 'Failed to install module', 'error');
    }
  } catch (error) {
    console.error('Upload error:', error);
    showToast('Failed to upload module', 'error');
  } finally {
    uploading.value = false;
    uploadProgress.value = 0;
  }
}

async function loadModules() {
  loading.value = true;
  try {
    const dataForm = new FormData();
    dataForm.append('flowname', 'searchmodules');
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');
    const res = await api.post('api/admin/execute-flow', dataForm);
    if (res.code == 200 && res.data?.data) {
      modules.value = res.data.data;
    }
  } catch (error) {
    console.error('Load modules error:', error);
    showToast('Failed to load modules', 'error');
  } finally {
    loading.value = false;
  }
}

async function viewModuleDetails(moduleid) {
  try {
    let dataForm = new FormData();
    dataForm.append('flowname', 'getmodule');
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');
    dataForm.append('moduleid', moduleid);
    let res = await api.post('api/admin/execute-flow', dataForm);
    if (res.code == 200 && res.data?.data) {
      moduleDetails.value = res.data.data;

      dataForm = new FormData();
      dataForm.append('flowname', 'getmodule');
      dataForm.append('menu', 'admin');
      dataForm.append('search', 'true');
      dataForm.append('moduleid', moduleid);
      res = await api.post('api/admin/execute-flow', dataForm);
      if (res.code == 200 && res.data?.data) {
        moduleDependencies.value = res.data.data;
        showDetailsModal.value = true;
      }
    }
  } catch (error) {
    console.error('Load details error:', error);
    showToast('Failed to load module details', 'error');
  }
}

function closeDetailsModal() {
  showDetailsModal.value = false;
  moduleDetails.value = null;
  moduleDependencies.value = null;
}

async function confirmUninstall(module) {
  moduleToUninstall.value = module;
  dropTables.value = false;

  // Check dependencies
  try {
    const res = await api.get(`/api/admin/module/dependencies/${module.moduleid}?menu=modules`);

    if (res && res.code === 200) {
      uninstallDependencies.value = res.data;
      showUninstallModal.value = true;
    }
  } catch (error) {
    console.error('Check dependencies error:', error);
    showToast('Failed to check dependencies', 'error');
  }
}

async function uninstallModule() {
  if (!moduleToUninstall.value) return;

  uninstalling.value = true;

  try {
    const res = await api.post(
      `/api/admin/module/uninstall/${moduleToUninstall.value.moduleid}?drop_tables=${dropTables.value}`,
      { menu: 'modules' },
    );

    if (res && (res.code === 200 || res.success)) {
      showToast('Module uninstalled successfully!', 'success');
      closeUninstallModal();
      await loadModules();
    } else {
      showToast(res.message || 'Failed to uninstall module', 'error');
    }
  } catch (error) {
    console.error('Uninstall error:', error);
    showToast('Failed to uninstall module', 'error');
  } finally {
    uninstalling.value = false;
  }
}

function closeUninstallModal() {
  showUninstallModal.value = false;
  moduleToUninstall.value = null;
  uninstallDependencies.value = null;
  dropTables.value = false;
}

async function exportModule(moduleid, modulename) {
  try {
    const filename = `${modulename.toLowerCase().replace(/ /g, '-')}.zip`;
    await api.donlotFile(`/api/admin/module/export/${moduleid}?menu=modules`, null, filename, 'GET');
    showToast('Module exported successfully!', 'success');
  } catch (error) {
    console.error('Export error:', error);
    showToast('Failed to export module', 'error');
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function showToast(message, type = 'info') {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
