<template>
  <div :class="container.props.class">
    <!-- Render Filters (Children) -->
    <div v-if="container.children && container.children.length > 0" class="mb-4 flex flex-wrap gap-2">
      <component :is="renderChild(child)" v-for="(child, i) in container.children" :key="i" />
    </div>

    <!-- Render Chart -->
    <div class="w-full h-96">
      <v-chart class="chart" :option="chartOption" autoresize />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, provide } from 'vue';
import { useApi } from '#imports';
import VChart, { THEME_KEY } from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, BarChart, LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components';

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
]);

provide(THEME_KEY, 'light');

const props = defineProps({
  container: { type: Object, required: true },
  renderChild: { type: Function, required: true },
  formData: { type: Object, required: true },
});

const Api = useApi();
const chartOption = ref({});

// Helper to find input keys in children
function getFilterKeys(nodes: any[]): string[] {
  let keys: string[] = [];
  if (!nodes) return keys;
  for (const node of nodes) {
    if (node.props && node.props.key) {
      keys.push(node.props.key);
    }
    if (node.children) {
      keys = keys.concat(getFilterKeys(node.children));
    }
  }
  return keys;
}

const filterKeys = computed(() => getFilterKeys(props.container.children));

async function fetchData() {
  if (!props.container.props.searchflow) return;

  const dataForm = new FormData();
  dataForm.append('flowname', props.container.props.searchflow);
  dataForm.append('menu', 'admin');
  dataForm.append('search', 'true');

  // Append filters
  filterKeys.value.forEach((key) => {
    if (props.formData[key] !== undefined) {
      dataForm.append(key, props.formData[key]);
    }
  });

  try {
    const res = (await Api.post('api/admin/execute-flow', dataForm)) as any;
    if (res.code === 200) {
      chartOption.value = res.data.data;
    }
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  fetchData();
});

// Watch specific filter keys in formData
watch(
  () => filterKeys.value.map((key) => props.formData[key]),
  () => {
    fetchData();
  },
  { deep: true },
);
</script>

<style scoped>
.chart {
  height: 100%;
  width: 100%;
}
</style>
