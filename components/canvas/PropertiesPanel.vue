<template>
  <div class="h-full flex flex-col bg-white p-4 overflow-auto">
    <div v-if="selectedTable" class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Properties — {{ selectedTable.name || 'Untitled' }}</h2>
      </div>
      <div>
        <button
          @click="$emit('view-data')"
          class="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
        >
          <UIcon name="heroicons:table-cells" class="w-4 h-4" />
          View Data
        </button>
      </div>

      <div>
        <label class="text-sm text-gray-600">Table Name</label>
        <input v-model="selectedTable.name" class="w-full mt-1 p-2 border rounded" />
      </div>

      <div>
        <label class="text-sm text-gray-600"
          >View Flow <NuxtLink to="/admin/workflow" target="_blank"> (to Workflow) </NuxtLink></label
        >
        <input v-model="selectedTable.flow" class="w-full mt-1 p-2 border rounded" />
      </div>

      <div>
        <label class="text-sm text-gray-600"
          >Modification Flow <NuxtLink to="/admin/workflow" target="_blank"> (to Workflow) </NuxtLink></label
        >
        <input v-model="selectedTable.modifflow" class="w-full mt-1 p-2 border rounded" />
      </div>

      <div>
        <label class="text-sm text-gray-600">Comment</label>
        <input v-model="selectedTable.comment" class="w-full mt-1 p-2 border rounded" />
      </div>

      <div>
        <label class="text-sm text-gray-600">Is Published</label>
        <input type="checkbox" v-model="selectedTable.ispublished" class="w-full mt-1 p-2 border rounded" />
      </div>

      <div>
        <label class="text-sm text-gray-600">Position</label>
        <div class="flex gap-2 mt-1">
          <input type="number" v-model.number="selectedTable.x" class="w-1/3 p-2 border rounded" />
          <input type="number" v-model.number="selectedTable.y" class="w-1/3 p-2 border rounded" />
          <input type="number" v-model.number="selectedTable.width" class="w-1/3 p-2 border rounded" />
        </div>
      </div>

      <div>
        <label class="text-sm text-gray-600">Columns</label>
        <div class="mt-2 space-y-2">
          <div v-for="(col, idx) in selectedTable.columns" :key="idx" class="flex items-center gap-2">
            <input v-model="col.name" placeholder="name" class="flex-1 p-2 border rounded" />
            <select v-model="col.type" placeholder="type" class="w-36 p-2 border rounded">
              <option value="auto">Auto Increment</option>
              <option value="text">Text</option>
              <option value="longtext">Long Text</option>
              <option value="number">Number</option>
              <option value="integer">Integer</option>
              <option value="timestamp">Time stamp</option>
              <option value="boolean">Boolean</option>
            </select>
            <input type="checkbox" v-model="col.allownull" placeholder="type" class="w-36 p-2 border rounded" />
            <input v-model="col.default" placeholder="default" class="flex-1 p-2 border rounded" />
            <button @click="$emit('remove-column', idx)" class="px-2 py-1 bg-red-500 text-white rounded">-</button>
          </div>
          <div class="flex gap-2">
            <button @click="$emit('add-column')" class="px-3 py-1 bg-blue-600 text-white rounded">Add Column</button>
            <button
              @click="$emit('ai-suggest-types', selectedTable)"
              class="px-3 py-1 bg-yellow-500 text-white rounded"
            >
              AI Suggest Types
            </button>
          </div>
        </div>
      </div>

      <div>
        <label class="text-sm text-gray-600">Raw JSON</label>
        <textarea
          v-model="jsonPreviewModel"
          rows="6"
          class="w-full p-2 border rounded mt-1 text-xs font-mono"
        ></textarea>
        <div class="flex gap-2 mt-1">
          <button
            @click="$emit('apply-json', jsonPreviewModel)"
            class="px-3 py-1 bg-green-600 text-white rounded text-xs"
          >
            Apply
          </button>
          <button
            @click="$emit('copy-json', jsonPreviewModel)"
            class="px-3 py-1 bg-gray-500 text-white rounded text-xs"
          >
            Copy
          </button>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <h3 class="font-semibold">Relations</h3>
      <div v-if="relations.length">
        <div v-for="r in relations" :key="r.id" class="flex items-center justify-between mt-2">
          <div class="text-sm">{{ r.from.table }}.{{ r.from.col }} ➜ {{ r.to.table }}.{{ r.to.col ?? '-' }}</div>
          <div class="flex gap-2">
            <button @click="$emit('remove-relation', r.id)" class="px-2 py-1 bg-red-500 text-white rounded">
              Delete
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-400 text-sm">No relations</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{
  selectedTable: any;
  relations: any[];
  jsonPreview: string;
}>();

const emit = defineEmits([
  'ai-parse',
  'remove-column',
  'add-column',
  'ai-suggest-types',
  'apply-json',
  'copy-json',
  'remove-relation',
  'update:jsonPreview',
  'view-data',
]);

const jsonPreviewModel = computed({
  get: () => props.jsonPreview,
  set: (val) => emit('update:jsonPreview', val),
});
</script>
