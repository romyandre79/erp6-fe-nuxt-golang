<template>
  <div class="p-6">
    <div
      v-if="maintenanceMode"
      class="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg border dark:border-gray-800 animate-fade-in"
    >
      <div class="text-8xl mb-6">🚧</div>
      <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-3">Under Maintenance</h1>
      <p class="text-gray-600 dark:text-gray-300 max-w-md text-lg">{{ maintenanceMessage }}</p>
      <button
        @click="$router.back()"
        class="mt-8 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
      >
        Go Back
      </button>
    </div>
    <FormRender
      v-else-if="formSchema"
      :schema="formSchema"
      :menuName="menuName"
      :formType="formType"
      :title="formTitle"
      :permissions="permissions"
    />
  </div>
</template>

<script setup lang="ts">
//import FormRenderer from '~/components/FormRenderer.vue'
import FormRender from '~/components/FormRender.vue';

const route = useRoute();
const { getMenuForm } = useAuth();
const formSchema = ref<Record<string, any> | null>(null);
const formType = ref(String);
const formTitle = ref(String);
const menuName = ref(String);
const permissions = ref<Record<string, number>>({});

definePageMeta({
  layout: 'auth',
  middleware: ['auth'],
});

// State for maintenance mode
const maintenanceMode = ref(false);
const maintenanceMessage = ref('');

onMounted(async () => {
  try {
    menuName.value = route.params.slug[0];
    const res = await getMenuForm(route.params.slug);
    if (res?.code == 200) {
      formTitle.value = res.data.data.description;
      formType.value = res.data.data.menutype;
      formSchema.value = JSON.parse(res.data.data.menuform);
      permissions.value = {
        iswrite: res.data.data.iswrite ?? 1, // Default to 1 if not present (legacy compat)
        isread: res.data.data.isread ?? 1,
        ispurge: res.data.data.ispurge ?? 1,
        isupload: res.data.data.isupload ?? 1,
        isdownload: res.data.data.isdownload ?? 1,
      };
    } else if (res?.code == 423 || res?.message === 'SCHEMA_LOCKED') {
      // Schema is locked
      maintenanceMode.value = true;
      maintenanceMessage.value = res.message || 'This menu is currently under maintenance.';
    } else {
      console.error('Invalid response from /auth/me', res);
    }
  } catch (err) {
    console.error('Error loading user info:', err);
  }
});
</script>
