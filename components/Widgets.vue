<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <div
      v-for="(widget, i) in widgets"
      :key="i"
      class="p-5 w-full rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 
             bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300"
    >
      <h1>{{ $t(widget.widgettitle) }}</h1>
      <br />

      <div v-for="(comp, j) in getWidgetComponents(widget.widgetname)" :key="j">
        <div v-html="renderWidget(comp, $t)"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useWidgets } from '~/composables/useWidgets'

const { widgets, fetchWidgets, getWidgetComponents, renderWidget } = useWidgets()

const props = defineProps({
  moduleName: {
    type: String,
    required: true
  },
})

onMounted(() => {
  fetchWidgets(props.moduleName)
})
</script>
