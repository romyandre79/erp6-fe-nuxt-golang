<script setup>
import { VChart } from 'vue-echarts'
import * as echarts from 'echarts/core'

import {
  BarChart,
  LineChart,
  PieChart
} from 'echarts/charts'

import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
} from 'echarts/components'

import { CanvasRenderer } from 'echarts/renderers'

import { useColorMode } from '@vueuse/core'
import { useApiChart } from '@/composables/useApiChart.js'

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  CanvasRenderer,
])

// props
const props = defineProps({
  option: Object,
  api: String,
  apiParams: Object,
  refreshMs: { type: Number, default: 0 },

  // theme: "light", "dark", or "auto"
  theme: { type: String, default: 'auto' },

  tooltipFormatter: Function,

  height: { type: String, default: '300px' },
  width: { type: String, default: '100%' }
})

// detect theme via system
const systemTheme = useColorMode()

const resolvedTheme = computed(() => {
  if (props.theme === 'auto') return systemTheme.value
  return props.theme
})

// API dataset
let api = null
if (props.api) {
  api = useApiChart(props.api, props.apiParams || {}, props.refreshMs)
}

// merge option
const finalOption = computed(() => {
  const base = props.option || {}

  // smooth animation
  const animationConfig = {
    animationDuration: 600,
    animationEasing: 'cubicOut'
  }

  // tooltip override
  const tooltip = props.tooltipFormatter
    ? { trigger: 'axis', formatter: props.tooltipFormatter }
    : base.tooltip

  // API dataset mode
  if (props.api && api?.data?.value) {
    return {
      ...base,
      tooltip,
      ...animationConfig,
      dataset: { source: api.data.value }
    }
  }

  // normal mode
  return {
    ...base,
    tooltip,
    ...animationConfig
  }
})
</script>

<template>
  <div :style="{ width, height }" class="relative">

    <!-- loading -->
    <div v-if="api && api.loading"
         class="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-black/50 z-10">
      <span class="text-gray-600 dark:text-gray-200">Loading chart...</span>
    </div>

    <!-- error -->
    <div v-else-if="api && api.error"
         class="absolute inset-0 flex items-center justify-center text-red-600 z-10">
      Failed to load dataset.
    </div>

    <!-- chart -->
    <VChart
      v-else
      :option="finalOption"
      :theme="resolvedTheme"
      autoresize
      :style="{ width, height }"
    />
  </div>
</template>
