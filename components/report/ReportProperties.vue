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
              class="w-full"
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
              <USelectMenu
                :model-value="reportStore.selectedElement.properties.fontFamily"
                :items="['Arial', 'Times New Roman', 'Courier New', 'Helvetica']"
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
        <UButton color="red" variant="soft" block icon="i-heroicons-trash" @click="deleteElement">
          Delete Element
        </UButton>
      </div>
    </div>

    <!-- PAGE PROPERTIES (When no element is selected) -->
    <!-- PAGE PROPERTIES (When no element is selected) -->
    <div v-else-if="reportStore.currentTemplate" class="space-y-4">
      <!-- Tabs -->
      <div class="flex border-b mb-4">
        <button
          v-for="tab in ['Report', 'Advanced']"
          :key="tab"
          @click="activeTab = tab"
          class="px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px"
          :class="
            activeTab === tab
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          "
        >
          {{ tab }}
        </button>
      </div>

      <!-- Report Tab (General) -->
      <div v-show="activeTab === 'Report'" class="space-y-4">
        <!-- Basic Info -->
        <!-- Basic Info -->
        <div class="space-y-1">
          <label class="text-sm font-semibold text-gray-700">Report Name</label>
          <UInput v-model="reportStore.currentTemplate.reportName" @change="reportStore.saveState" class="w-full" />
        </div>

        <div class="space-y-1">
          <label class="text-sm font-semibold text-gray-700">Description</label>
          <UTextarea
            v-model="reportStore.currentTemplate.reportDesc"
            :rows="2"
            @change="reportStore.saveState"
            class="w-full"
          />
        </div>

        <!-- Language & Configuration -->
        <div class="space-y-1">
          <label class="text-sm font-semibold text-gray-700">When No Data Type</label>
          <USelectMenu
            v-model="reportStore.currentTemplate.whenNoDataType"
            :items="
              ['NoPages', 'BlankPage', 'AllSectionsNoDetail', 'NoDataSection', 'Null'].map((x) => ({
                label: x,
                value: x,
              }))
            "
            value-attribute="value"
            option-attribute="label"
            class="w-full"
            @change="reportStore.saveState"
          />
        </div>

        <!-- Pagination / Appearance Flags -->
        <div class="space-y-2 border rounded p-2 bg-gray-50">
          <UCheckbox
            v-model="reportStore.currentTemplate.titleOnNewPage"
            label="Title On A New Page"
            :ui="{ label: 'text-gray-900 font-medium' }"
            @change="reportStore.saveState"
          />
          <UCheckbox
            v-model="reportStore.currentTemplate.summaryOnNewPage"
            label="Summary On A New Page"
            :ui="{ label: 'text-gray-900 font-medium' }"
            @change="reportStore.saveState"
          />
          <UCheckbox
            v-model="reportStore.currentTemplate.summaryWithPageHeaderAndFooter"
            label="Summary With Page Header And Footer"
            :ui="{ label: 'text-gray-900 font-medium' }"
            @change="reportStore.saveState"
          />
        </div>

        <!-- Dataset Configuration -->
        <div class="border-t pt-2 mt-2">
          <h4 class="text-sm font-semibold mb-2 text-gray-600">Data Source</h4>
          <div class="space-y-2">
            <UFormGroup label="Flow">
              <div class="flex gap-1">
                <UInput
                  v-model="reportStore.currentTemplate.datasource"
                  class="flex-1"
                  @change="reportStore.saveState"
                />
              </div>
            </UFormGroup>
          </div>
        </div>

        <!-- Page Format -->
        <div class="border-t pt-2 mt-2">
          <UButton block variant="outline" size="sm" class="mt-2" @click="openPageFormatModal"
            >Edit Page Format</UButton
          >
        </div>
      </div>
      <!-- End Report Tab -->

      <!-- Advanced Tab (Data & Parameters) -->
      <div v-show="activeTab === 'Advanced'" class="space-y-6">
        <!-- Parameters Section -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <h4 class="text-sm font-semibold text-gray-700">Parameters</h4>
            <UButton icon="i-heroicons-plus" size="xs" variant="soft" @click="addParameter" />
          </div>
          <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
            <div
              v-for="(param, index) in reportStore.currentTemplate.parameters"
              :key="index"
              class="p-2 border rounded bg-gray-50 relative group"
            >
              <UButton
                icon="i-heroicons-trash"
                color="red"
                variant="ghost"
                size="xs"
                class="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                @click="reportStore.deleteParameter(index)"
              />
              <div class="grid gap-2">
                <UInput v-model="param.name" placeholder="Name" size="xs" @change="reportStore.saveState" />
                <div class="flex gap-2">
                  <UInput
                    v-model="param.class"
                    placeholder="Class (e.g. java.lang.String)"
                    size="xs"
                    class="flex-1"
                    @change="reportStore.saveState"
                  />
                  <UInput
                    v-model="param.defaultValue"
                    placeholder="Default Value"
                    size="xs"
                    class="flex-1"
                    @change="reportStore.saveState"
                  />
                </div>
              </div>
            </div>
            <div
              v-if="reportStore.currentTemplate.parameters.length === 0"
              class="text-xs text-gray-400 italic text-center py-2"
            >
              No parameters defined
            </div>
          </div>
        </div>

        <!-- Variables Section -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <h4 class="text-sm font-semibold text-gray-700">Variables</h4>
            <UButton icon="i-heroicons-plus" size="xs" variant="soft" @click="addVariable" />
          </div>
          <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
            <div
              v-for="(variable, index) in reportStore.currentTemplate.variables"
              :key="index"
              class="p-2 border rounded bg-gray-50 relative group"
            >
              <UButton
                icon="i-heroicons-trash"
                color="red"
                variant="ghost"
                size="xs"
                class="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                @click="reportStore.deleteVariable(index)"
              />
              <div class="grid gap-2">
                <UInput v-model="variable.name" placeholder="Name" size="xs" @change="reportStore.saveState" />
                <div class="flex gap-2">
                  <UInput
                    v-model="variable.class"
                    placeholder="Class"
                    size="xs"
                    class="flex-1"
                    @change="reportStore.saveState"
                  />
                  <USelect
                    v-model="variable.calculation"
                    :options="['Nothing', 'Count', 'Sum', 'Average', 'Lowest', 'Highest']"
                    size="xs"
                    class="flex-1"
                    @change="reportStore.saveState"
                  />
                </div>
                <UInput
                  v-model="variable.expression"
                  placeholder="Expression"
                  size="xs"
                  @change="reportStore.saveState"
                />
              </div>
            </div>
            <div
              v-if="reportStore.currentTemplate.variables.length === 0"
              class="text-xs text-gray-400 italic text-center py-2"
            >
              No variables defined
            </div>
          </div>
        </div>
      </div>
      <!-- End Advanced Tab -->
    </div>
  </div>
  <Teleport to="body">
    <div
      v-if="isPageFormatModalOpen"
      class="fixed inset-0 z-[40] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div
        v-if="reportStore.currentTemplate && localPageFormat"
        class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto p-6 relative"
      >
        <div class="flex items-center gap-2 mb-4 border-b pb-2">
          <UIcon name="i-heroicons-document" class="w-5 h-5 text-gray-500" />
          <h3 class="text-lg font-bold text-gray-900">Page Format</h3>
          <UButton
            icon="i-heroicons-x-mark"
            variant="ghost"
            color="gray"
            size="sm"
            class="ml-auto"
            @click="isPageFormatModalOpen = false"
          />
        </div>

        <div class="flex flex-col md:flex-row gap-6">
          <!-- Left Column: Settings -->
          <div class="w-full md:w-1/2 space-y-4">
            <div class="flex items-center gap-2">
              <label class="w-16 text-sm font-semibold text-gray-700">Format</label>
              <USelectMenu
                v-model="localSelectedFormat"
                :items="['A3', 'A4', 'Letter', 'Legal', 'Custom']"
                :ui="{ content: 'z-[60]' }"
                class="flex-1"
                @change="updateLocalFormat"
              />
            </div>

            <div class="flex items-center gap-2">
              <label class="w-16 text-sm font-semibold text-gray-700">Width</label>
              <div class="flex flex-1 gap-2">
                <UInput type="number" v-model.number="localPageFormat.pageWidth" class="flex-1" size="sm" />
                <USelectMenu
                  :items="['pixel']"
                  model-value="pixel"
                  disabled
                  size="sm"
                  class="w-20"
                  :ui="{ content: 'z-[60]' }"
                />
              </div>
            </div>

            <div class="flex items-center gap-2">
              <label class="w-16 text-sm font-semibold text-gray-700">Height</label>
              <div class="flex flex-1 gap-2">
                <UInput type="number" v-model.number="localPageFormat.pageHeight" class="flex-1" size="sm" />
                <USelectMenu
                  :items="['pixel']"
                  model-value="pixel"
                  disabled
                  size="sm"
                  class="w-20"
                  :ui="{ content: 'z-[60]' }"
                />
              </div>
            </div>

            <!-- Orientation -->
            <div class="border rounded p-3">
              <label class="text-xs font-semibold text-gray-900 block mb-2">Page Orientation</label>
              <div class="flex gap-4">
                <URadio
                  v-model="localPageFormat.orientation"
                  value="portrait"
                  label="Portrait"
                  @change="updateLocalOrientation"
                  :ui="{ label: 'text-gray-900' }"
                />
                <URadio
                  v-model="localPageFormat.orientation"
                  value="landscape"
                  label="Landscape"
                  @change="updateLocalOrientation"
                  :ui="{ label: 'text-gray-900' }"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <!-- Margins -->
              <div class="border rounded p-3">
                <label class="text-xs font-semibold text-gray-900 block mb-2">Margins</label>
                <div class="grid grid-cols-1 gap-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-700">Top</span>
                    <UInput type="number" v-model.number="localPageFormat.margins.top" size="2xs" class="w-16" />
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-700">Bottom</span>
                    <UInput type="number" v-model.number="localPageFormat.margins.bottom" size="2xs" class="w-16" />
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-700">Left</span>
                    <UInput type="number" v-model.number="localPageFormat.margins.left" size="2xs" class="w-16" />
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-700">Right</span>
                    <UInput type="number" v-model.number="localPageFormat.margins.right" size="2xs" class="w-16" />
                  </div>
                </div>
              </div>

              <!-- Columns -->
              <div class="border rounded p-3">
                <label class="text-xs font-semibold text-gray-900 block mb-2">Columns</label>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-700">Count</span>
                    <UInput type="number" v-model.number="localPageFormat.columnCount" size="2xs" class="w-16" />
                  </div>
                  <div class="flex items-center justify-between text-xs text-gray-700">
                    Width <UInput type="number" v-model.number="localPageFormat.columnWidth" size="2xs" class="w-16" />
                  </div>
                  <div class="flex items-center justify-between text-xs text-gray-700">
                    Space
                    <UInput type="number" v-model.number="localPageFormat.columnSpacing" size="2xs" class="w-16" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Preview (Mock) -->
          <div
            class="w-full md:w-1/2 flex items-center justify-center bg-gray-100 rounded border min-h-[200px] md:min-h-auto"
          >
            <div
              class="bg-white shadow border transition-all duration-300 relative"
              :style="{
                width: '150px',
                height: 150 * (localPageFormat.pageHeight / localPageFormat.pageWidth) + 'px',
              }"
            >
              <!-- Margins Preview -->
              <div
                class="absolute inset-0 border border-blue-200"
                :style="{
                  top: localPageFormat.margins.top / 10 + 'px',
                  bottom: localPageFormat.margins.bottom / 10 + 'px',
                  left: localPageFormat.margins.left / 10 + 'px',
                  right: localPageFormat.margins.right / 10 + 'px',
                }"
              >
                <!-- Column Preview Lines -->
                <template v-if="localPageFormat.columnCount > 1">
                  <div
                    v-for="i in localPageFormat.columnCount - 1"
                    :key="i"
                    class="absolute top-0 bottom-0 border-r border-dashed border-gray-300"
                    :style="{
                      left: `calc(${(100 / localPageFormat.columnCount) * i}% - ${localPageFormat.columnSpacing / 20}px)`,
                    }"
                  ></div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-2 border-t pt-4">
          <UButton variant="ghost" @click="isPageFormatModalOpen = false">Cancel</UButton>
          <UButton color="primary" @click="savePageFormat">OK</UButton>
        </div>
      </div>
    </div>
  </Teleport>
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
const activeTab = ref('Report');

function addParameter() {
  reportStore.addParameter({ name: 'NewParameter', class: 'java.lang.String' });
}

function addVariable() {
  reportStore.addVariable({ name: 'NewVariable', class: 'java.lang.Integer', calculation: 'Nothing', expression: '' });
}

// Initialize selector based on current template
watchEffect(() => {
  if (reportStore.currentTemplate) {
    // Try to match current dims to a preset
    const match = pageSizes.find(
      (p) =>
        p.width === Number(reportStore.currentTemplate?.pageWidth) &&
        p.height === Number(reportStore.currentTemplate?.pageHeight),
    );
    if (match) selectedPageSizeName.value = match.name;
    // else keep 'Custom' or last selected if reasonable
  }
});

function updatePageSize(name: string) {
  const size = pageSizes.find((p) => p.name === name);
  if (size && reportStore.currentTemplate) {
    reportStore.currentTemplate.pageWidth = size.width;
    reportStore.currentTemplate.pageHeight = size.height;
    reportStore.currentTemplate.orientation = size.orientation;
    reportStore.saveState(); // push to undo stack
  }
}

function updatePageOrientation(value: string) {
  if (!reportStore.currentTemplate) return;
  reportStore.currentTemplate.orientation = value;
  // Update dimensions if switching (basic logic)
  // Actually, maybe we should swap width/height if orientation changes?
  // For now just set property.
  reportStore.saveState();
}

const isPageFormatModalOpen = ref(false);
const localPageFormat = ref<any>(null);
const localSelectedFormat = ref('A4');

function openPageFormatModal() {
  if (!reportStore.currentTemplate) return;
  // Deep copy current template properties needed for page format
  localPageFormat.value = JSON.parse(
    JSON.stringify({
      pageWidth: reportStore.currentTemplate.pageWidth,
      pageHeight: reportStore.currentTemplate.pageHeight,
      orientation: reportStore.currentTemplate.orientation,
      margins: reportStore.currentTemplate.margins,
      columnCount: reportStore.currentTemplate.columnCount || 1,
      columnWidth: reportStore.currentTemplate.columnWidth || 555,
      columnSpacing: reportStore.currentTemplate.columnSpacing || 0,
    }),
  );

  // Guess format
  const match = pageSizes.find(
    (p) =>
      p.width === Number(reportStore.currentTemplate?.pageWidth) &&
      p.height === Number(reportStore.currentTemplate?.pageHeight),
  );
  if (match) {
    localSelectedFormat.value = match.name.split(' ')[0];
  } else {
    localSelectedFormat.value = 'Custom';
  }

  isPageFormatModalOpen.value = true;
}

function savePageFormat() {
  if (!reportStore.currentTemplate || !localPageFormat.value) return;

  // Apply changes
  Object.assign(reportStore.currentTemplate, {
    pageWidth: localPageFormat.value.pageWidth,
    pageHeight: localPageFormat.value.pageHeight,
    orientation: localPageFormat.value.orientation,
    margins: localPageFormat.value.margins,
    columnCount: localPageFormat.value.columnCount,
    columnWidth: localPageFormat.value.columnWidth,
    columnSpacing: localPageFormat.value.columnSpacing,
  });

  reportStore.saveState();
  isPageFormatModalOpen.value = false;
}

function updateLocalFormat() {
  if (localSelectedFormat.value === 'Custom') return;

  const sizeName =
    localSelectedFormat.value +
    ' ' +
    (localPageFormat.value.orientation.charAt(0).toUpperCase() + localPageFormat.value.orientation.slice(1));
  const size =
    pageSizes.find((p) => p.name === sizeName) || pageSizes.find((p) => p.name.startsWith(localSelectedFormat.value));

  if (size) {
    localPageFormat.value.pageWidth = size.width;
    localPageFormat.value.pageHeight = size.height;
  }
}

function updateLocalOrientation() {
  updateLocalFormat(); // Re-apply format size based on new orientation
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
  if (!reportStore.currentTemplate) return;
  // @ts-ignore
  reportStore.currentTemplate[key] = value;
  reportStore.saveState();
}

function updateMargin(key: string, value: number) {
  if (!reportStore.currentTemplate) return;
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
