<template>
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
</template>

<script setup lang="ts">
import { useReportStore } from '~/store/report';

const reportStore = useReportStore();

const hasTextProperties = computed(() => {
  const type = reportStore.selectedElement?.type;
  return type === 'staticText' || type === 'textField';
});

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
