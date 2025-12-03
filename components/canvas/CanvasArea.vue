<template>
  <div
    class="absolute rounded-xl border border-purple-400 bg-purple-200/30"
    :style="{
      left: area.x + 'px',
      top: area.y + 'px',
      width: area.width + 'px',
      height: area.height + 'px',
    }"
    @mousedown="$emit('start-drag', area, $event)"
  >
    <!-- header -->
    <div
      class="bg-purple-600 text-white text-xs px-2 py-1 rounded-t-xl cursor-move flex items-center justify-between"
    >
      <input v-model="area.name" class="bg-purple-600 outline-none flex-1 rounded px-2" />

      <div class="flex items-center">
        <UButton
          @click.stop="$emit('export', area)"
          class="text-white hover:text-blue-300 font-bold mr-2"
          title="Export Area"
          icon="heroicons:arrow-down-tray"
        >
        </UButton>
        <UButton
          @click.stop="$emit('delete', area.id)"
          class="text-white hover:text-red-300 font-bold"
          title="Delete Area"
          icon="heroicons:trash"
        >
        </UButton>
      </div>
    </div>
    <!-- resize handle -->
    <div
      class="absolute bottom-0 right-0 w-4 h-4 bg-purple-600 cursor-se-resize rounded"
      @mousedown.stop="$emit('start-resize', area, $event)"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  area: { type: Object, required: true },
});

defineEmits(['start-drag', 'start-resize', 'export', 'delete']);
</script>
