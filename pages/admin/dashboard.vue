<template>
  <div class="flex flex-wrap p-2">
    <div
      v-for="(value, i) in recordWidget"
      :key="i"
      :class="value.webformat"
    >
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

const fetchData = async () => {
  try {
    res = await fetchWidgets('admin');
    if (res?.code === 200) {
      recordWidget.value = res?.data.data;
      for (let index = 0; index < recordWidget.value.length; index++) {
        const element = recordWidget.value[index];
        recordWidget.value[index].widgetform = JSON.parse(element.widgetform);
        console.log ('widg', recordWidget)
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
