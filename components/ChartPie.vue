<template>
  <Highchart :options="options" />
</template>

<script setup>
const props = defineProps({ theme: Object })

const options = computed(() => ({
  ...props.theme,
  chart: { type: 'pie', backgroundColor: 'transparent' },
  title: { text: 'Sales by Category' },
  series: [{
    name: 'Sales',
    colorByPoint: true,
    data: [
      { name: 'Electronics', y: 40 },
      { name: 'Fashion', y: 30 },
      { name: 'Home', y: 20 },
      { name: 'Other', y: 10 }
    ]
  }],
  credits: { enabled: false }
}))
</script>
