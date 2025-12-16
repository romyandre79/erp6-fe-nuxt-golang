<template>
  <div
    class="absolute shadow-lg rounded border bg-white cursor-move"
    :style="{ left: table.x + 'px', top: table.y + 'px', width: table.width + 'px' }"
    draggable="true"
    @dragstart="$emit('dragstart', table, $event)"
    @dblclick="$emit('select', table.id)"
    :data-table-id="table.id"
  >
    <div class="flex items-center justify-between p-2 bg-gray-800 text-white rounded-t">
      <div class="font-medium">{{ table.name || 'table_' + table.id }}</div>
      <div class="flex gap-1">
        <UButton
          icon="heroicons:document-duplicate"
          @click.stop="$emit('duplicate', table)"
          title="Duplicate"
          class="text-xs px-2"
        ></UButton>
        <UButton
          icon="heroicons:trash"
          @click.stop="$emit('delete', table.id)"
          title="Delete"
          class="text-xs px-2"
        ></UButton>
      </div>
    </div>

    <div class="p-2 text-xs">
      <div 
        v-for="(col, i) in table.columns" 
        :key="i" 
        class="flex items-center gap-2 p-1 hover:bg-gray-100 rounded" 
        :data-col-index="i"
        @dragover.prevent
        @drop="onColDrop(i, $event)"
      >
        <span 
          class="cursor-move text-gray-400 px-1"
          draggable="true"
          @dragstart.stop="onColDragStart(i, $event)"
        >⋮⋮</span>
        <span class="w-6 text-gray-600">{{ i + 1 }}</span>
        <span class="flex-1 truncate">{{ col.name }}</span>
        <span class="text-gray-500 text-[11px]">{{ col.type || '' }}</span>

        <!-- small handle to start linking -->
        <button
          @pointerdown.stop.prevent="$emit('start-link', table.id, i, $event)"
          class="w-4 h-4 rounded-full bg-blue-500"
          title="Start relation"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  table: { type: Object, required: true },
});

const emit = defineEmits(['dragstart', 'select', 'duplicate', 'delete', 'start-link', 'reorder']);

const dragColIndex = ref<number | null>(null);

function onColDragStart(idx: number, event: DragEvent) {
  dragColIndex.value = idx;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
    event.dataTransfer.setData('text/plain', String(idx)); // Required for Firefox
  }
}

function onColDrop(targetIdx: number, event?: DragEvent) {
  if (dragColIndex.value === null) return;
  
  if (dragColIndex.value !== null) {
      // Only stop propagation if we are indeed reordering columns
      event?.stopPropagation();
  }

  if (dragColIndex.value === targetIdx) return;
  emit('reorder', { tableId: props.table.id, from: dragColIndex.value, to: targetIdx });
  dragColIndex.value = null;
}
</script>
