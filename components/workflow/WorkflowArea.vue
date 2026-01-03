<template>
  <div
    class="absolute rounded-lg border-2"
    :style="{
      left: area.x + 'px',
      top: area.y + 'px',
      width: area.width + 'px',
      height: area.height + 'px',
      backgroundColor: area.color + '20',
      borderColor: area.color,
      zIndex: 0,
      pointerEvents: 'none'
    }"
  >
    <!-- header -->
    <div 
      class="text-white text-xs px-2 py-1 rounded-t-md flex items-center justify-between"
      :style="{ backgroundColor: area.color, pointerEvents: 'auto' }"
      @mousedown="$emit('start-drag', area, $event)"
    >
      <div class="flex items-center gap-2 flex-1">
        <!-- Drag Handle Icon -->
        <div class="cursor-move flex-shrink-0" title="Drag to move">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="5" r="1"/>
            <circle cx="9" cy="12" r="1"/>
            <circle cx="9" cy="19" r="1"/>
            <circle cx="15" cy="5" r="1"/>
            <circle cx="15" cy="12" r="1"/>
            <circle cx="15" cy="19" r="1"/>
          </svg>
        </div>
        
        <input 
          v-model="area.name" 
          class="outline-none flex-1 rounded px-2 bg-transparent font-bold" 
          @click.stop
          @mousedown.stop
        />
      </div>

      <div class="flex items-center gap-1">
        <input 
          type="color" 
          v-model="area.color" 
          class="w-6 h-6 rounded cursor-pointer border-0"
          title="Change Color"
          @click.stop
          @mousedown.stop
        />
        <button
          @click.stop="$emit('delete', area.id)"
          @mousedown.stop
          class="text-white hover:text-red-300 font-bold p-1"
          title="Delete Area"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- resize handle -->
    <div
      class="absolute bottom-0 right-0 w-4 h-4 rounded cursor-se-resize"
      :style="{ backgroundColor: area.color, pointerEvents: 'auto' }"
      @mousedown.stop="$emit('start-resize', area, $event)"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  area: { type: Object, required: true },
});

defineEmits(['start-drag', 'start-resize', 'delete']);
</script>
