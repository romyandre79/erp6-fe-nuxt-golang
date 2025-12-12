<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Report Designer</h1>
      <UButton icon="i-heroicons-plus" @click="createNewReport">Create New Report</UButton>
    </div>

    <div class="mb-4 flex gap-4">
      <UInput v-model="searchQuery" placeholder="Search reports..." icon="i-heroicons-magnifying-glass" class="flex-1" />
      <USelect v-model="selectedCategory" :options="categories" placeholder="All Categories" />
    </div>

    <div v-if="loading" class="text-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-4xl" />
    </div>

    <div v-else-if="filteredTemplates.length === 0" class="text-center py-12 text-gray-500">
      No report templates found. Create your first report!
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard
        v-for="template in filteredTemplates"
        :key="template.reporttemplateid"
        class="cursor-pointer hover:shadow-lg transition-shadow"
      >
        <template #header>
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold">{{ template.reportname }}</h3>
              <p class="text-sm text-gray-500">{{ template.reportcategory }}</p>
            </div>
            <UBadge :color="template.reporttype === 'PDF' ? 'red' : 'green'">
              {{ template.reporttype }}
            </UBadge>
          </div>
        </template>

        <p class="text-sm text-gray-600 mb-4">{{ template.reportdesc || 'No description' }}</p>

        <template #footer>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500">
              {{ new Date(template.updatedate).toLocaleDateString() }}
            </span>
            <div class="flex gap-2">
              <UButton size="xs" icon="i-heroicons-pencil" @click="editReport(template.reporttemplateid)">
                Edit
              </UButton>
              <UButton
                size="xs"
                color="red"
                variant="soft"
                icon="i-heroicons-trash"
                @click="deleteReport(template.reporttemplateid)"
              >
                Delete
              </UButton>
              <UButton
                size="xs"
                color="gray"
                variant="soft"
                icon="i-heroicons-arrow-down-tray"
                @click="exportJRXML(template.reporttemplateid)"
              >
                Export
              </UButton>
            </div>
          </div>
        </template>
      </UCard>
    </div>

    <!-- Create/Import Modal -->
    <UModal v-model="showCreateModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Create New Report</h3>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Report Name" required>
            <UInput v-model="newReport.reportname" placeholder="Enter report name" />
          </UFormGroup>

          <UFormGroup label="Description">
            <UTextarea v-model="newReport.reportdesc" placeholder="Enter description" />
          </UFormGroup>

          <UFormGroup label="Category">
            <UInput v-model="newReport.reportcategory" placeholder="e.g., Sales, Finance, HR" />
          </UFormGroup>

          <UFormGroup label="Report Type">
            <USelect v-model="newReport.reporttype" :options="['PDF', 'XLS', 'CSV']" />
          </UFormGroup>

          <UDivider label="OR" />

          <UFormGroup label="Import JRXML File">
            <UInput type="file" accept=".jrxml" @change="handleFileUpload" />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="soft" @click="showCreateModal = false">Cancel</UButton>
            <UButton @click="saveNewReport">Create</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'auth',
});

const Api = useApi();
const toast = useToast();
const router = useRouter();

const loading = ref(true);
const templates = ref<any[]>([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const showCreateModal = ref(false);
const uploadedFile = ref<File | null>(null);

const newReport = ref({
  reportname: '',
  reportdesc: '',
  reportcategory: '',
  reporttype: 'PDF',
});

const categories = computed(() => {
  const cats = templates.value.map((t) => t.reportcategory).filter(Boolean);
  return ['All Categories', ...new Set(cats)];
});

const filteredTemplates = computed(() => {
  let filtered = templates.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.reportname.toLowerCase().includes(query) ||
        t.reportdesc?.toLowerCase().includes(query)
    );
  }

  if (selectedCategory.value && selectedCategory.value !== 'All Categories') {
    filtered = filtered.filter((t) => t.reportcategory === selectedCategory.value);
  }

  return filtered;
});

async function loadTemplates() {
  try {
    loading.value = true;
    const response = await Api.get('/api/admin/report-templates');
    if (response.code === 200) {
      templates.value = response.data;
    }
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to load templates', color: 'red' });
  } finally {
    loading.value = false;
  }
}

function createNewReport() {
  newReport.value = {
    reportname: '',
    reportdesc: '',
    reportcategory: '',
    reporttype: 'PDF',
  };
  uploadedFile.value = null;
  showCreateModal.value = true;
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    uploadedFile.value = target.files[0];
  }
}

async function saveNewReport() {
  if (uploadedFile.value) {
    // Import JRXML
    const formData = new FormData();
    formData.append('file', uploadedFile.value);
    formData.append('reportname', newReport.value.reportname);
    formData.append('reportdesc', newReport.value.reportdesc);
    formData.append('reportcategory', newReport.value.reportcategory);

    try {
      const response = await Api.post('/api/admin/report-templates/import-jrxml', formData);
      if (response.code === 200) {
        toast.add({ title: 'Success', description: 'JRXML imported successfully', color: 'green' });
        showCreateModal.value = false;
        await loadTemplates();
        router.push(`/admin/report-designer/${response.data.reporttemplateid}`);
      }
    } catch (error) {
      toast.add({ title: 'Error', description: 'Failed to import JRXML', color: 'red' });
    }
  } else {
    // Create new template
    try {
      const response = await Api.post('/api/admin/report-templates', newReport.value);
      if (response.code === 200) {
        toast.add({ title: 'Success', description: 'Report created successfully', color: 'green' });
        showCreateModal.value = false;
        router.push(`/admin/report-designer/${response.data.reporttemplateid}`);
      }
    } catch (error) {
      toast.add({ title: 'Error', description: 'Failed to create report', color: 'red' });
    }
  }
}

function editReport(id: number) {
  router.push(`/admin/report-designer/${id}`);
}

async function deleteReport(id: number) {
  if (!confirm('Are you sure you want to delete this report?')) return;

  try {
    const response = await Api.delete(`/api/admin/report-templates/${id}`);
    if (response.code === 200) {
      toast.add({ title: 'Success', description: 'Report deleted successfully', color: 'green' });
      await loadTemplates();
    }
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to delete report', color: 'red' });
  }
}

async function exportJRXML(id: number) {
  try {
    const response = await Api.get(`/api/admin/report-templates/${id}/export-jrxml`);
    // Response should be the JRXML file content
    const blob = new Blob([response], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${id}.jrxml`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to export JRXML', color: 'red' });
  }
}

onMounted(() => {
  loadTemplates();
});
</script>
