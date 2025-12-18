<template>
  <div class="relative" :style="{ padding: '40px' }">
    <!-- Rulers -->
    <div v-if="reportStore.showRulers && !previewMode" class="absolute top-0 left-0 right-0 h-10 bg-gray-200 border-b flex items-end">
      <div v-for="i in Math.ceil(canvasWidth / 50)" :key="`h-${i}`" class="relative" :style="{ width: '50px' }">
        <span class="absolute bottom-0 left-0 text-xs text-gray-600">{{ i * 50 }}</span>
        <div class="absolute bottom-0 left-0 w-px h-2 bg-gray-400"></div>
      </div>
    </div>
    <div v-if="reportStore.showRulers && !previewMode" class="absolute top-0 left-0 bottom-0 w-10 bg-gray-200 border-r flex flex-col justify-end">
      <div v-for="i in Math.ceil(canvasHeight / 50)" :key="`v-${i}`" class="relative" :style="{ height: '50px' }">
        <span class="absolute top-0 left-0 text-xs text-gray-600 transform -rotate-90 origin-top-left">{{ i * 50 }}</span>
        <div class="absolute top-0 left-0 h-px w-2 bg-gray-400"></div>
      </div>
    </div>

    <!-- Canvas Container -->
    <div
      class="relative bg-white shadow-lg mx-auto transition-all duration-300"
      :style="{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        transform: `scale(${reportStore.zoom / 100})`,
        transformOrigin: 'top left',
      }"
    >
      <!-- Grid -->
      <svg
        v-if="reportStore.showGrid && !previewMode"
        class="absolute inset-0 pointer-events-none"
        :width="canvasWidth"
        :height="canvasHeight"
      >
        <defs>
          <pattern
            id="grid"
            :width="reportStore.gridSize"
            :height="reportStore.gridSize"
            patternUnits="userSpaceOnUse"
          >
            <path
              :d="`M ${reportStore.gridSize} 0 L 0 0 0 ${reportStore.gridSize}`"
              fill="none"
              stroke="rgba(0,0,0,0.1)"
              stroke-width="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <!-- Bands -->
      <div
        v-for="band in reportStore.currentTemplate?.bands"
        :key="band.type"
        class="relative"
        :class="{'border-b border-dashed border-gray-300': !previewMode}"
        :style="{ height: `${band.height}px` }"
        @dragover.prevent
        @drop="onDrop($event, band.type)"
      >
        <!-- Band Label -->
        <div v-if="!previewMode" class="absolute -left-2 top-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-l transform -translate-x-full z-10">
          {{ band.type }}
        </div>

        <!-- Elements in Band -->
        <div
          v-for="element in band.elements"
          :key="element.id"
          class="absolute overflow-hidden"
          :class="{
            'border cursor-move': !previewMode,
            'border-blue-500 border-2 z-20': !previewMode && reportStore.selectedElement?.id === element.id,
            'border-gray-400 hover:border-gray-500': !previewMode && reportStore.selectedElement?.id !== element.id,
          }"
          :style="{
            left: `${element.x}px`,
            top: `${element.y}px`,
            width: `${element.width}px`,
            height: `${element.height}px`,
          }"
          @click="selectElement(element)"
          @mousedown="startDrag($event, element)"
        >
          <!-- Element Content -->
          <div class="w-full h-full p-1" :class="{'pointer-events-none': previewMode}">
             <!-- Dynamic Component Rendering could be better here, but switch case for now -->
            <template v-if="element.type === 'staticText'">
              <div 
                class="w-full h-full whitespace-pre-wrap"
                :style="{
                  fontFamily: element.properties.fontFamily,
                  fontSize: `${element.properties.fontSize}px`,
                  fontWeight: element.properties.bold ? 'bold' : 'normal',
                  fontStyle: element.properties.italic ? 'italic' : 'normal',
                  textDecoration: element.properties.underline ? 'underline' : 'none',
                  color: element.properties.color,
                  textAlign: element.properties.alignment,
                }"
              >
                {{ element.properties.text || 'Label' }}
              </div>
            </template>
            <template v-else-if="element.type === 'textField'">
              <div class="w-full h-full flex items-center bg-blue-50/50 text-blue-600 text-xs px-1" v-if="!previewMode">
                 {{ element.properties.expression || '$F{field}' }}
              </div>
              <div v-else class="w-full h-full text-gray-500 italic">
                 {{ element.properties.expression }} (Data)
              </div>
            </template>
            <template v-else-if="element.type === 'image'">
               <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                 <img v-if="element.properties.source && !element.properties.source.startsWith('$')" :src="element.properties.source" class="max-w-full max-h-full" />
                 <UIcon v-else name="i-heroicons-photo" class="text-gray-400 w-8 h-8" />
               </div>
            </template>
            <template v-else-if="element.type === 'line'">
              <div 
                class="w-full h-full flex items-center justify-center"
              >
                 <div 
                    :style="{
                        width: element.properties.direction === 'vertical' ? `${element.properties.lineWidth}px` : '100%',
                        height: element.properties.direction === 'horizontal' ? `${element.properties.lineWidth}px` : '100%',
                        backgroundColor: element.properties.color
                    }"
                 ></div>
              </div>
            </template>
            <template v-else-if="element.type === 'rectangle'">
               <div class="w-full h-full border border-black"></div>
            </template>
            <template v-else>
               <span class="text-xs text-gray-400">{{ element.type }}</span>
            </template>
          </div>

          <!-- Resize Handles (when selected and not preview) -->
          <template v-if="!previewMode && reportStore.selectedElement?.id === element.id">
            <div
              v-for="handle in resizeHandles"
              :key="handle.position"
              class="absolute w-2 h-2 bg-blue-500 border border-white z-30"
              :class="handle.cursor"
              :style="handle.style"
              @mousedown.stop="startResize($event, element, handle.position)"
            ></div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReportStore } from '~/store/report';
import type { ReportElement } from '~/store/report';

const props = defineProps({
  previewMode: {
    type: Boolean,
    default: false
  }
});

const reportStore = useReportStore();

const canvasWidth = computed(() => reportStore.currentTemplate?.pageWidth || 595);
const canvasHeight = computed(() => reportStore.currentTemplate?.pageHeight || 842);

const resizeHandles = [
  { position: 'nw', cursor: 'cursor-nw-resize', style: { top: '-4px', left: '-4px' } },
  { position: 'n', cursor: 'cursor-n-resize', style: { top: '-4px', left: '50%', transform: 'translateX(-50%)' } },
  { position: 'ne', cursor: 'cursor-ne-resize', style: { top: '-4px', right: '-4px' } },
  { position: 'e', cursor: 'cursor-e-resize', style: { top: '50%', right: '-4px', transform: 'translateY(-50%)' } },
  { position: 'se', cursor: 'cursor-se-resize', style: { bottom: '-4px', right: '-4px' } },
  { position: 's', cursor: 'cursor-s-resize', style: { bottom: '-4px', left: '50%', transform: 'translateX(-50%)' } },
  { position: 'sw', cursor: 'cursor-sw-resize', style: { bottom: '-4px', left: '-4px' } },
  { position: 'w', cursor: 'cursor-w-resize', style: { top: '50%', left: '-4px', transform: 'translateY(-50%)' } },
];

let dragState: any = null;

function onDrop(event: DragEvent, bandType: string) {
  if (props.previewMode) return;
  event.preventDefault();
  const data = event.dataTransfer?.getData('application/json');
  if (!data) return;

  const component = JSON.parse(data);
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const x = Math.round((event.clientX - rect.left) / (reportStore.zoom / 100));
  const y = Math.round((event.clientY - rect.top) / (reportStore.zoom / 100));

  // Snap to grid
  const snappedX = reportStore.snapToGrid ? Math.round(x / reportStore.gridSize) * reportStore.gridSize : x;
  const snappedY = reportStore.snapToGrid ? Math.round(y / reportStore.gridSize) * reportStore.gridSize : y;

  const newElement: ReportElement = {
    id: `${component.type}_${Date.now()}`,
    type: component.type,
    x: snappedX,
    y: snappedY,
    width: component.props.width || 100,
    height: component.props.height || 20,
    properties: { ...component.props },
  };

  reportStore.addElement(bandType, newElement);
  reportStore.selectElement(newElement);
}

function selectElement(element: ReportElement) {
  if (props.previewMode) return;
  reportStore.selectElement(element);
}

function startDrag(event: MouseEvent, element: ReportElement) {
  if (props.previewMode) return;
  if (event.button !== 0) return; // Only left click

  dragState = {
    type: 'move',
    element,
    startX: event.clientX,
    startY: event.clientY,
    elementStartX: element.x,
    elementStartY: element.y,
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

function startResize(event: MouseEvent, element: ReportElement, position: string) {
  if (props.previewMode) return;
  dragState = {
    type: 'resize',
    element,
    position,
    startX: event.clientX,
    startY: event.clientY,
    elementStartX: element.x,
    elementStartY: element.y,
    elementStartWidth: element.width,
    elementStartHeight: element.height,
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

function onMouseMove(event: MouseEvent) {
  if (!dragState) return;

  const deltaX = (event.clientX - dragState.startX) / (reportStore.zoom / 100);
  const deltaY = (event.clientY - dragState.startY) / (reportStore.zoom / 100);

  if (dragState.type === 'move') {
    let newX = dragState.elementStartX + deltaX;
    let newY = dragState.elementStartY + deltaY;

    // Snap to grid
    if (reportStore.snapToGrid) {
      newX = Math.round(newX / reportStore.gridSize) * reportStore.gridSize;
      newY = Math.round(newY / reportStore.gridSize) * reportStore.gridSize;
    }

    reportStore.updateElement(dragState.element.id, { x: newX, y: newY });
  } else if (dragState.type === 'resize') {
    const updates: any = {};
    const pos = dragState.position;

    if (pos.includes('e')) {
      updates.width = Math.max(10, dragState.elementStartWidth + deltaX);
    }
    if (pos.includes('w')) {
      const newWidth = Math.max(10, dragState.elementStartWidth - deltaX);
      updates.width = newWidth;
      updates.x = dragState.elementStartX + (dragState.elementStartWidth - newWidth);
    }
    if (pos.includes('s')) {
      updates.height = Math.max(10, dragState.elementStartHeight + deltaY);
    }
    if (pos.includes('n')) {
      const newHeight = Math.max(10, dragState.elementStartHeight - deltaY);
      updates.height = newHeight;
      updates.y = dragState.elementStartY + (dragState.elementStartHeight - newHeight);
    }

    reportStore.updateElement(dragState.element.id, updates);
  }
}

function onMouseUp() {
  dragState = null;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}

// Keyboard shortcuts
onMounted(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (props.previewMode) return;
    
    // Delete
    if (event.key === 'Delete' && reportStore.selectedElement) {
      reportStore.deleteElement(reportStore.selectedElement.id);
    }
    // Undo
    if (event.ctrlKey && event.key === 'z') {
      event.preventDefault();
      reportStore.undo();
    }
    // Redo
    if (event.ctrlKey && event.key === 'y') {
      event.preventDefault();
      reportStore.redo();
    }
    // Arrow keys for nudging
    if (reportStore.selectedElement && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      const step = event.shiftKey ? 10 : 1;
      const updates: any = {};
      
      if (event.key === 'ArrowUp') updates.y = reportStore.selectedElement.y - step;
      if (event.key === 'ArrowDown') updates.y = reportStore.selectedElement.y + step;
      if (event.key === 'ArrowLeft') updates.x = reportStore.selectedElement.x - step;
      if (event.key === 'ArrowRight') updates.x = reportStore.selectedElement.x + step;
      
      reportStore.updateElement(reportStore.selectedElement.id, updates);
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });
});
</script>
