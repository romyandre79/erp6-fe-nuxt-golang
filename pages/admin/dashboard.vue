<template>
  <div v-for="group in groupedWidgets" :key="group.key" class="flex flex-row flex-nowrap gap-3 p-2">
    <div v-for="(value, i) in group.items" :key="i" class="flex-1 min-w-0 p-">
      <FormRender :schema="value.widgetform" formType="widget" />
    </div>
  </div>
</template>

<script setup lang="ts">
import FormRender from '~/components/FormRender.vue';

definePageMeta({
  layout: 'auth',
  middleware: ['auth'],
});

const { fetchWidgets } = useWidgets();
const recordWidget = ref<Record<string, any> | null>(null);
let res: any;
let schema: any;

const groupedWidgets = computed(() => {
  if (!recordWidget.value) return [];

  // Group by dasgroup
  const groups: Record<string, any[]> = {};

  for (const item of recordWidget.value) {
    const key = item.dashgroup || '';

    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }

  // Sort items per group by position
  for (const key in groups) {
    groups[key].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }

  // Convert to sorted array by group key
  const sortedGroupKeys = Object.keys(groups).sort((a, b) => {
    // jika dashgroup angka → urutkan numerik
    const na = Number(a);
    const nb = Number(b);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;

    // jika bukan angka → urutkan alphabet
    return a.localeCompare(b);
  });

  // Return array berurutan:
  // [ { groupKey: "...", items: [...] }, ... ]
  return sortedGroupKeys.map((key) => ({
    key,
    items: groups[key],
  }));
});

const fetchData = async () => {
  try {
    res = await fetchWidgets('admin');
    if (res?.code === 200) {
      recordWidget.value = res?.data.data;
      for (let index = 0; index < recordWidget.value.length; index++) {
        const element = recordWidget.value[index];
        recordWidget.value[index].widgetform = JSON.parse(element.widgetform);
        console.log('widg', recordWidget);
      }
    } else {
      console.error('Invalid response from /auth/me', res);
    }
  } catch (err) {
    console.error('Error loading user info:', err);
  }
};

const fetchForm = (rec: any) => {
  if (res.data.data[rec].widgetform != '') {
    return JSON.parse(res.data.data[rec].widgetform);
  }
};

onMounted(async () => {
  fetchData();
});
</script>
