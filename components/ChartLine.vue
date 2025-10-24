<template>
  <ClientOnly>
  <Highchart :options="options" />
  </ClientOnly>
</template>

<script setup>
const props = defineProps({ theme: Object })

const options = computed(() => ({
  ...props.theme,
  chart: { type: 'line', backgroundColor: 'transparent' },
  title: { text: 'Monthly Sales' },
  xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] },
  yAxis: { title: { text: 'Sales ($)' } },
  series: [{ name: 'Sales', data: [500, 700, 800, 1200, 1500], color: '#6366F1' }],
  credits: { enabled: false }
}))
</script>