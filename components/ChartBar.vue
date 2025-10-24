<template>
    <Highcharts :options="options" />
</template>

<script setup>
const props = defineProps({ theme: Object })

const options = computed(() => ({
  ...props.theme,
  chart: { type: 'column', backgroundColor: 'transparent' },
  title: { text: 'User Growth' },
  xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] },
  yAxis: { title: { text: 'Users' } },
  series: [{ name: 'Users', data: [200, 300, 400, 600, 900], color: '#10B981' }],
  credits: { enabled: false }
}))
</script>