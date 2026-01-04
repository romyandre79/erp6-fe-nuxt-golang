<script setup lang="ts">
import { ref, type Ref, computed, watch, onMounted } from 'vue';
import { useApi } from '~/composables/useApi';
import type { SelectMenuItem } from '@nuxt/ui';

interface Props {
  component: {
    key: string;
    label: string;
    text?: string;
    source?: string;
    place?: string;
    valueField?: string;
    dependency?: { key: string; param: string }[];
  };
  formData: Ref<Record<string, any>>;
  validationErrors: Record<string, string>;
  validateField: (component: any, val: any) => void;
}

const props = defineProps<Props>();
const Api = useApi();

// Destructure supaya ESLint mengenali di template
const { component, formData, validationErrors, validateField } = props;

// Pastikan key ada di formData
if (!(component.key in formData.value)) formData.value[component.key] = '';

const options = ref<SelectMenuItem[]>([]);
const loading = ref(false);

// 🔹 Function to fetch data
async function fetchData() {
  if (!component.source) return;
  loading.value = true;

  try {
    let arr = props.component.source?.split(',');
    if (arr.length == 1) {
      const dataForm = new FormData();
      dataForm.append('flowname', component.source);
      dataForm.append('menu', 'admin');
      dataForm.append('search', 'true');

      // 🔹 Append dependencies params
      if (component.dependency && Array.isArray(component.dependency)) {
        component.dependency.forEach((dep: any) => {
          if (formData.value[dep.key]) {
            dataForm.append(dep.param, formData.value[dep.key]);
          }
        });
      }

      const res = await Api.post('api/admin/execute-flow', dataForm);

      if (res.code === 200 && Array.isArray(res.data?.data)) {
        const labelField = component.label || 'label';
        const valueField = component.valueField || component.key || 'value';

        options.value = res.data.data.map((item: Record<string, any>) => ({
          label: item[labelField],
          id: item[valueField],
        }));
      } else {
        console.error('Gagal ambil data untuk select:', res?.message);
        options.value = []; // Clear options on error or empty
      }
    } else {
      options.value = []; // Reset first
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        options.value.push({
          label: element,
          id: element,
        });
      }
    }
  } catch (err) {
    console.error('Error fetch data select:', err);
  }

  loading.value = false;
}

// 🔹 Ambil data dari API saat mount
onMounted(() => {
  fetchData();
});

// 🔹 Watch dependencies
if (component.dependency && Array.isArray(component.dependency)) {
  watch(
    () => component.dependency!.map((dep: any) => formData.value[dep.key]),
    async (newVal, oldVal) => {
      // Check if values actually changed
      const isChanged = newVal.some((val, i) => val !== oldVal[i]);
      if (isChanged) {
        // Reset current value
        formData.value[component.key] = null; 
        await fetchData();
      }
    }
  );
}

// 🔹 Computed dua arah
const modelSelect = computed({
  get: () => formData.value[component.key],
  set: (val) => {
    formData.value[component.key] = typeof val === 'string' && !isNaN(Number(val)) ? Number(val) : val;
    validateField(component, val);
  },
});

// 🔹 Sinkronisasi value setelah options siap
watch(
  options,
  (newOptions) => {
    if (!newOptions.length) return;

    const val = formData.value[component.key];
    if (val != null && val !== '') {
      const exists = newOptions.some((o) => o.id == val);
      if (!exists) {
        // console.warn(`⚠️ Value '${val}' tidak ditemukan di options untuk ${component.key}`);
         // Reset if selected value is no longer valid in new options (important for dependencies)
         if (component.dependency && Array.isArray(component.dependency)) {
             formData.value[component.key] = null;
         }
      } else {
        // force reactivity update agar USelect sinkron
        formData.value[component.key] = val;
      }
    }
  },
  { immediate: true },
);

// 🔹 Jika formData diubah dari luar
watch(
  () => formData.value[component.key],
  (val) => {
    if (options.value.length > 0 && val != null && val !== '') {
      const exists = options.value.some((o) => o.id == val);
      if (!exists) {
        // console.warn(`⚠️ Value '${val}' belum ada di options saat ini untuk ${component.key}`);
      }
    }
  },
);
</script>

<template>
  <div class="flex flex-col mb-3">
    <label v-if="component.text" class="mb-1 text-gray-400 text-sm font-medium">
      {{ $t(component.text.toUpperCase()) }}
    </label>

    <USelectMenu
      v-model="modelSelect"
      :items="options"
      value-key="id"
      :loading="loading"
      :placeholder="component.place || $t('CHOOSE')"
      class="w-full px-3 py-2 focus:ring focus:ring-blue-200 outline-none border-gray-300"
      :disabled="loading"
    />

    <span v-if="validationErrors[component.key]" class="text-xs text-red-500 mt-1">
      {{ validationErrors[component.key] }}
    </span>
  </div>
</template>
