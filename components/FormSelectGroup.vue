<script setup lang="ts">
import { ref, type Ref, computed, watch, onMounted } from 'vue';
import { useApi } from '~/composables/useApi';

interface Props {
  component: {
    key: string;
    label: string;
    text?: string;
    source?: string;
    place?: string;
    valueField?: string;
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

const options = ref<{ label: string; value: string | number }[]>([]);
const loading = ref(false);

onMounted(async () => {
  if (!component.source) return;
  loading.value = true;

  try {
    let arr = props.component.source?.split(',');
    if (arr.length == 1) {
      // It's likely a flow name, fetch from API
      const dataForm = new FormData();
      dataForm.append('flowname', component.source);
      dataForm.append('menu', 'admin');
      dataForm.append('search', 'true');

      const res = await Api.post('api/admin/execute-flow', dataForm);

      if (res.code === 200 && Array.isArray(res.data?.data)) {
        const labelField = component.label || 'label';
        const valueField = component.valueField || component.key || 'value';

        options.value = res.data.data.map((item: Record<string, any>) => ({
          label: item[labelField],
          value: item[valueField],
        }));
      } else {
        console.error('Failed to fetch data for selectgroup:', res?.message);
      }
    } else {
      // It's a static comma-separated list
      options.value = arr.map((element) => ({
        label: element,
        value: element,
      }));
    }
  } catch (err) {
    console.error('Error fetch data selectgroup:', err);
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
      :options="options"
      :legend="component.place"
    />

    <span v-if="validationErrors[component.key]" class="text-xs text-red-500 mt-1">
      {{ validationErrors[component.key] }}
    </span>
  </div>
</template>
