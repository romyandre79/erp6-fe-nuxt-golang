<template>
  <div class="space-y-4">
    <!-- ELEMENT PROPERTIES (When an element is selected) -->
    <div v-if="reportStore.selectedElement" class="space-y-4">
      <!-- Position & Size -->
      <div class="border-b pb-4">
        <h4 class="text-sm font-medium mb-3">Position & Size</h4>
        <div class="grid grid-cols-2 gap-2">
          <UFormGroup label="X" size="sm">
            <UInput
              :model-value="reportStore.selectedElement.x"
              type="number"
              size="sm"
              @update:model-value="updateProperty('x', parseInt($event))"
            />
          </UFormGroup>
          <UFormGroup label="Y" size="sm">
            <UInput
              :model-value="reportStore.selectedElement.y"
              type="number"
              size="sm"
              @update:model-value="updateProperty('y', parseInt($event))"
            />
          </UFormGroup>
          <UFormGroup label="Width" size="sm">
            <UInput
              :model-value="reportStore.selectedElement.width"
              type="number"
              size="sm"
              @update:model-value="updateProperty('width', parseInt($event))"
            />
          </UFormGroup>
          <UFormGroup label="Height" size="sm">
            <UInput
              :model-value="reportStore.selectedElement.height"
              type="number"
              size="sm"
              @update:model-value="updateProperty('height', parseInt($event))"
            />
          </UFormGroup>
        </div>
      </div>

      <!-- Element-Specific Properties -->
      <div class="border-b pb-4">
        <h4 class="text-sm font-medium mb-3">Element Properties</h4>

        <!-- Static Text -->
        <template v-if="reportStore.selectedElement.type === 'staticText'">
          <UFormGroup label="Text" size="sm">
            <UTextarea
              :model-value="reportStore.selectedElement.properties.text"
              size="sm"
              @update:model-value="updateElementProperty('text', $event)"
            />
          </UFormGroup>
        </template>

        <!-- Text Field -->
        <template v-if="reportStore.selectedElement.type === 'textField'">
          <UFormGroup label="Expression" size="sm">
            <UInput
              :model-value="reportStore.selectedElement.properties.expression"
              size="sm"
              placeholder="$F{fieldName}"
              @update:model-value="updateElementProperty('expression', $event)"
            />
          </UFormGroup>
          <UFormGroup label="Pattern" size="sm" class="mt-2">
            <UInput
              :model-value="reportStore.selectedElement.properties.pattern"
              size="sm"
              placeholder="e.g., #,##0.00"
              @update:model-value="updateElementProperty('pattern', $event)"
            />
          </UFormGroup>
        </template>

        <!-- Image -->
        <template v-if="reportStore.selectedElement.type === 'image'">
          <UFormGroup label="Source" size="sm">
            <UInput
              :model-value="reportStore.selectedElement.properties.source"
              size="sm"
              placeholder="URL or expression"
              @update:model-value="updateElementProperty('source', $event)"
            />
          </UFormGroup>
          <UFormGroup label="Scale Mode" size="sm" class="mt-2">
            <USelect
              :model-value="reportStore.selectedElement.properties.scaleMode"
              :options="['retainShape', 'fillFrame', 'clip']"
              size="sm"
              @update:model-value="updateElementProperty('scaleMode', $event)"
            />
          </UFormGroup>
        </template>

        <!-- Line -->
        <template v-if="reportStore.selectedElement.type === 'line'">
          <UFormGroup label="Direction" size="sm">
            <USelect
              :model-value="reportStore.selectedElement.properties.direction"
              :options="['horizontal', 'vertical', 'diagonal']"
              size="sm"
              @update:model-value="updateElementProperty('direction', $event)"
            />
          </UFormGroup>
          <UFormGroup label="Line Width" size="sm" class="mt-2">
            <UInput
              :model-value="reportStore.selectedElement.properties.lineWidth"
              type="number"
              size="sm"
              @update:model-value="updateElementProperty('lineWidth', parseInt($event))"
            />
          </UFormGroup>
        </template>

        <!-- Barcode -->
        <template v-if="reportStore.selectedElement.type === 'barcode'">
          <UFormGroup label="Type" size="sm">
            <USelect
              :model-value="reportStore.selectedElement.properties.type"
              :options="['Code128', 'Code39', 'EAN13', 'QRCode']"
              size="sm"
              @update:model-value="updateElementProperty('type', $event)"
            />
          </UFormGroup>
          <UFormGroup label="Expression" size="sm" class="mt-2">
            <UInput
              :model-value="reportStore.selectedElement.properties.expression"
              size="sm"
              placeholder="$F{barcodeValue}"
              @update:model-value="updateElementProperty('expression', $event)"
            />
          </UFormGroup>
        </template>
      </div>

      <!-- Text Styling (for text elements) -->
      <div v-if="hasTextProperties" class="border-b pb-4">
        <h4 class="text-sm font-medium mb-3">Text Style</h4>
        <div class="space-y-2">
          <div class="grid grid-cols-2 gap-2">
            <UFormGroup label="Font Size" size="sm">
              <UInput
                :model-value="reportStore.selectedElement.properties.fontSize"
                type="number"
                size="sm"
                @update:model-value="updateElementProperty('fontSize', parseInt($event))"
              />
            </UFormGroup>
            <UFormGroup label="Font Family" size="sm">
              <USelect
                :model-value="reportStore.selectedElement.properties.fontFamily"
                :options="['Arial', 'Times New Roman', 'Courier New', 'Helvetica']"
                size="sm"
                @update:model-value="updateElementProperty('fontFamily', $event)"
              />
            </UFormGroup>
          </div>
          <div class="flex gap-2">
            <UCheckbox
              :model-value="reportStore.selectedElement.properties.bold"
              label="Bold"
              @update:model-value="updateElementProperty('bold', $event)"
            />
            <UCheckbox
              :model-value="reportStore.selectedElement.properties.italic"
              label="Italic"
              @update:model-value="updateElementProperty('italic', $event)"
            />
            <UCheckbox
              :model-value="reportStore.selectedElement.properties.underline"
              label="Underline"
              @update:model-value="updateElementProperty('underline', $event)"
            />
          </div>
          <UFormGroup label="Alignment" size="sm">
            <USelect
              :model-value="reportStore.selectedElement.properties.alignment"
              :options="['left', 'center', 'right', 'justify']"
              size="sm"
              @update:model-value="updateElementProperty('alignment', $event)"
            />
          </UFormGroup>
          <UFormGroup label="Color" size="sm">
            <UInput
              :model-value="reportStore.selectedElement.properties.color"
              type="color"
              size="sm"
              @update:model-value="updateElementProperty('color', $event)"
            />
          </UFormGroup>
        </div>
      </div>

      <!-- Delete Button -->
      <div class="pt-4">
        <UButton
          color="red"
          variant="soft"
          block
          icon="i-heroicons-trash"
          @click="deleteElement"
        >
          Delete Element
        </UButton>
      </div>
    </div>

    <!-- PAGE PROPERTIES (When no element is selected) -->
    <!-- PAGE PROPERTIES (When no element is selected) -->
    <div v-else-if="reportStore.currentTemplate" class="space-y-4">
      <div class="border-b pb-2 mb-2">
        <h3 class="font-semibold text-gray-700">Report Properties</h3>
      </div>

      <!-- Basic Info -->
      <UFormGroup label="Report Name">
        <UInput v-model="reportStore.currentTemplate.reportName" @change="reportStore.saveState" />
      </UFormGroup>
      
      <UFormGroup label="Description">
        <UTextarea v-model="reportStore.currentTemplate.reportDesc" :rows="2" @change="reportStore.saveState" />
      </UFormGroup>

      <!-- Language & Configuration -->
      <div class="grid grid-cols-2 gap-2">
        <UFormGroup label="Language">
          <USelect 
            v-model="reportStore.currentTemplate.language" 
            :options="['java', 'groovy']" 
            @change="reportStore.saveState" 
          />
        </UFormGroup>
        
        <UFormGroup label="When No Data Type">
          <USelect 
            v-model="reportStore.currentTemplate.whenNoDataType" 
            :options="['NoPages', 'BlankPage', 'AllSectionsNoDetail', 'NoDataSection', 'Null']" 
            @change="reportStore.saveState" 
          />
        </UFormGroup>
      </div>

      <UFormGroup label="Imports">
        <div class="flex gap-1">
          <UInput v-model="reportStore.currentTemplate.imports" class="flex-1" @change="reportStore.saveState" />
          <UButton icon="i-heroicons-ellipsis-horizontal" color="gray" variant="soft" size="xs" />
        </div>
      </UFormGroup>

      <UFormGroup label="Format Factory Class">
         <div class="flex gap-1">
          <UInput v-model="reportStore.currentTemplate.formatFactoryClass" class="flex-1" @change="reportStore.saveState" />
          <UButton icon="i-heroicons-ellipsis-horizontal" color="gray" variant="soft" size="xs" />
        </div>
      </UFormGroup>

      <!-- Pagination / Appearance Flags -->
      <div class="space-y-2 border rounded p-2 bg-gray-50">
        <UCheckbox v-model="reportStore.currentTemplate.titleOnNewPage" label="Title On A New Page" @change="reportStore.saveState" />
        <UCheckbox v-model="reportStore.currentTemplate.summaryOnNewPage" label="Summary On A New Page" @change="reportStore.saveState" />
        <UCheckbox v-model="reportStore.currentTemplate.summaryWithPageHeaderAndFooter" label="Summary With Page Header And Footer" @change="reportStore.saveState" />
        <UCheckbox v-model="reportStore.currentTemplate.floatColumnFooter" label="Float Column Footer" @change="reportStore.saveState" />
        <UCheckbox v-model="reportStore.currentTemplate.ignorePagination" label="Ignore Pagination" @change="reportStore.saveState" />
        <UCheckbox v-model="reportStore.currentTemplate.createBookmarks" label="Create bookmarks" @change="reportStore.saveState" />
      </div>

      <!-- Dataset Configuration -->
      <div class="border-t pt-2 mt-2">
        <h4 class="text-sm font-semibold mb-2 text-gray-600">Dataset</h4>
        <div class="space-y-2">
            <UFormGroup label="Scriptlet Class">
              <div class="flex gap-1">
                <UInput v-model="reportStore.currentTemplate.scriptletClass" class="flex-1" @change="reportStore.saveState" />
                <UButton icon="i-heroicons-ellipsis-horizontal" color="gray" variant="soft" size="xs" />
              </div>
            </UFormGroup>
            <UFormGroup label="Resource Bundle">
               <div class="flex gap-1">
                <UInput v-model="reportStore.currentTemplate.resourceBundle" class="flex-1" @change="reportStore.saveState" />
                <UButton icon="i-heroicons-ellipsis-horizontal" color="gray" variant="soft" size="xs" />
              </div>
            </UFormGroup>
            <UFormGroup label="Default Data Adapter">
              <div class="flex gap-1">
                <!-- Data Adapter Selection -->
                <UInput v-model="reportStore.currentTemplate.defaultDataAdapter" class="flex-1" placeholder="Select Adapter..." @change="reportStore.saveState" />
                <UButton icon="i-heroicons-ellipsis-horizontal" color="gray" variant="soft" size="xs" />
              </div>
            </UFormGroup>
            
            <UButton block variant="outline" icon="i-heroicons-adjustments-horizontal" class="mt-2" @click="openQueryEditor">
              Edit query, filter and sort options
            </UButton>
        </div>
      </div>

      <!-- Page Format -->
      <div class="border-t pt-2 mt-2">
        <div class="flex justify-between items-center mb-2">
           <h4 class="text-sm font-semibold text-gray-600">Page Format</h4>
           <UBadge size="xs" variant="subtle">{{ reportStore.currentTemplate.pageWidth }}x{{ reportStore.currentTemplate.pageHeight }}</UBadge>
        </div>
        
        <div class="grid grid-cols-2 gap-2 mb-2">
          <UFormGroup label="Page Size">
            <USelect 
              v-model="selectedPageSizeName" 
              :options="pageSizes.map(s => s.name)" 
              @change="updatePageSize"
            />
          </UFormGroup>
           <UFormGroup label="Orientation">
            <USelect 
              v-model="reportStore.currentTemplate.orientation" 
              :options="['portrait', 'landscape']" 
              @change="updatePageOrientation" 
            />
          </UFormGroup>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <UFormGroup label="Left Margin">
            <UInput type="number" v-model.number="reportStore.currentTemplate.margins.left" @change="reportStore.saveState" size="sm">
               <template #trailing><span class="text-gray-500 text-xs">px</span></template>
            </UInput>
          </UFormGroup>
          <UFormGroup label="Right Margin">
            <UInput type="number" v-model.number="reportStore.currentTemplate.margins.right" @change="reportStore.saveState" size="sm">
               <template #trailing><span class="text-gray-500 text-xs">px</span></template>
            </UInput>
          </UFormGroup>
          <UFormGroup label="Top Margin">
             <UInput type="number" v-model.number="reportStore.currentTemplate.margins.top" @change="reportStore.saveState" size="sm">
               <template #trailing><span class="text-gray-500 text-xs">px</span></template>
             </UInput>
          </UFormGroup>
          <UFormGroup label="Bottom Margin">
            <UInput type="number" v-model.number="reportStore.currentTemplate.margins.bottom" @change="reportStore.saveState" size="sm">
               <template #trailing><span class="text-gray-500 text-xs">px</span></template>
            </UInput>
          </UFormGroup>
        </div>
        
        <UButton block variant="outline" size="sm" class="mt-2" @click="openPageFormatModal">Edit Page Format</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReportStore } from '~/store/report';
import { pageSizes } from '~/types/report-components';

const reportStore = useReportStore();

const hasTextProperties = computed(() => {
  const type = reportStore.selectedElement?.type;
  return type === 'staticText' || type === 'textField';
});

// For Page Size Selector
const selectedPageSizeName = ref('A4 Portrait');

// Initialize selector based on current template
watchEffect(() => {
    if(reportStore.currentTemplate) {
        // Try to match current dims to a preset
        const match = pageSizes.find(p => 
            p.width === reportStore.currentTemplate?.pageWidth && 
            p.height === reportStore.currentTemplate?.pageHeight
        );
        if(match) selectedPageSizeName.value = match.name;
        // else keep 'Custom' or last selected if reasonable
    }
});

function updatePageSize(name: string) {
    const size = pageSizes.find(p => p.name === name);
    if(size && reportStore.currentTemplate) {
        reportStore.currentTemplate.pageWidth = size.width;
        reportStore.currentTemplate.pageHeight = size.height;
        reportStore.currentTemplate.orientation = size.orientation;
        reportStore.saveState(); // push to undo stack
    }
}

function updatePageOrientation(value: string) {
    if(!reportStore.currentTemplate) return;
    reportStore.currentTemplate.orientation = value;
    // Update dimensions if switching (basic logic)
    // Actually, maybe we should swap width/height if orientation changes? 
    // For now just set property.
    reportStore.saveState();
}

function openPageFormatModal() {
    alert('Page Format Modal to be implemented');
}

function openQueryEditor() {
    alert('Query Editor to be implemented');
}

// Data Adapters
const dataAdapters = ref<string[]>([]);
async function fetchDataAdapters() {
    // Determine where to get data logic.
    // Example: const response = await api.post('/api/admin/execute-flow', ... 'getdataadapters')
}

onMounted(() => {
    fetchDataAdapters();
});

function updatePageProperty(key: string, value: any) {
    if(!reportStore.currentTemplate) return;
    // @ts-ignore
    reportStore.currentTemplate[key] = value;
    reportStore.saveState();
}

function updateMargin(key: string, value: number) {
    if(!reportStore.currentTemplate) return;
    // @ts-ignore
    reportStore.currentTemplate.margins[key] = value;
    reportStore.saveState();
}


function updateProperty(key: string, value: any) {
  if (!reportStore.selectedElement) return;
  reportStore.updateElement(reportStore.selectedElement.id, { [key]: value });
}

function updateElementProperty(key: string, value: any) {
  if (!reportStore.selectedElement) return;
  const properties = { ...reportStore.selectedElement.properties, [key]: value };
  reportStore.updateElement(reportStore.selectedElement.id, { properties });
}

function deleteElement() {
  if (!reportStore.selectedElement) return;
  if (confirm('Are you sure you want to delete this element?')) {
    reportStore.deleteElement(reportStore.selectedElement.id);
  }
}
</script>
