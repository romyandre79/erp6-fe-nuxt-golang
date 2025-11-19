<template>
  <div class="p-6 space-y-5" v-for="(value, i) in recordWidget">
    <div
      v-if="fetchForm(i)"
      class="p-5 w-full rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white text-black hover:shadow-xl transition-all duration-300"
    >
      <FormRender :schema="fetchForm(i)" formtype="widget" />
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

const fetchData = async () => {
  try {
    res = await fetchWidgets('admin');
    if (res?.code === 200) {
      recordWidget.value = res?.data.data;
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
