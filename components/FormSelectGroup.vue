<script setup lang="ts">
import { ref, type Ref, computed, watch, onMounted } from 'vue';
import { useApi } from '~/composables/useApi';

interface Props {
  component: {
    key: string;
    label: string;
    text?: string;
    source?: string;
    sourceAll?: string;
    place?: string;
  };
  formData: Ref<Record<string, any>>;
  validationErrors: Record<string, string>;
  validateField: (component: any, val: any) => void;
}

const props = defineProps<Props>();
const Api = useApi();

const { component, formData, validationErrors, validateField } = props;

// Ensure key exists in formData and is an array
if (!Array.isArray(formData.value[component.key])) {
  formData.value[component.key] = [];
}

const options = ref<{ label: string; id: string | number }[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;

  const labelField = component.label || 'label';
  // Use valueField if provided, otherwise fallback to key, then 'value', then 'id'
  const valueField = component.key || 'value';

  // 1. Fetch Options
  const dataSource = component.sourceAll || component.source;

  if (dataSource) {
    try {
      let arr = dataSource.split(',');
      if (arr.length == 1) {
        // Flow name
        const dataForm = new FormData();
        dataForm.append('flowname', dataSource);
        dataForm.append('menu', 'admin');
        dataForm.append('search', 'true');

        const res = (await Api.post('api/admin/execute-flow', dataForm)) as any;

        if (res.code === 200 && Array.isArray(res?.data?.data)) {
          options.value = res.data.data.map((item: Record<string, any>) => ({
            label: item[labelField],
            id: item[valueField] ?? item['id'], // Fallback to 'id' if specific field not found
          }));
        } else {
          console.error('Failed to fetch options:', res?.message);
        }
      } else {
        // Static list
        options.value = arr.map((element) => ({
          label: element,
          id: element,
        }));
      }
    } catch (err) {
      console.error('Error rendering options:', err);
    }
  }

  // 2. Fetch Selected Values
  if (component.source && component.sourceAll && component.source !== component.sourceAll) {
    try {
      let arr = component.source.split(',');
      if (arr.length == 1) {
        // Flow name for SELECTION
        const dataForm = new FormData();
        dataForm.append('flowname', component.source);
        dataForm.append('menu', 'admin');
        dataForm.append('search', 'true');

        const res = (await Api.post('api/admin/execute-flow', dataForm)) as any;

        if (res.code === 200 && Array.isArray(res?.data?.data)) {
          const selectedValues = res.data.data.map((item: Record<string, any>) => item[valueField] ?? item['id']);
          formData.value[component.key] = selectedValues;
          console.log(formData);
        }
      } else {
        formData.value[component.key] = arr;
      }
    } catch (err) {
      console.error('Error fetching selection:', err);
    }
  }

  loading.value = false;
});

const modelSelect = computed({
  get: () => formData.value[component.key],
  set: (val) => {
    formData.value[component.key] = val;
    validateField(component, val);
  },
});
</script>

<template>
  <div class="flex flex-col mb-3">
    <label v-if="component.text" class="mb-1 text-gray-400 text-sm font-medium">
      {{ $t(component.text.toUpperCase()) }}
    </label>

    <UCheckboxGroup
      v-model="modelSelect"
      :items="options"
      :legend="component.place"
      orientation="horizontal"
      indicator="end"
      value-attribute="id"
    />

    <span v-if="validationErrors[component.key]" class="text-xs text-red-500 mt-1">
      {{ validationErrors[component.key] }}
    </span>
  </div>
</template>
