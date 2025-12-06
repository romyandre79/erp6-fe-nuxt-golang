<template>
  <div class="h-screen flex overflow-hidden">
    <!-- Sidebar on the left -->
    <div class="flex-none bg-white border-r z-10">
      <Sidebar />
    </div>

    <!-- Designer takes remaining space -->
    <div class="flex-1 relative bg-gray-100">
      <Designer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useWorkflowStore } from '~/store/workflow';

// Lazy load heavy components for code splitting
const Designer = defineAsyncComponent(() => import('~/components/workflow/Designer.vue'));
const Sidebar = defineAsyncComponent(() => import('~/components/workflow/WorkflowSidebar.vue'));

definePageMeta({
  middleware: ['auth'],
  layout: 'auth'
});

const route = useRoute();
const store = useWorkflowStore();

onMounted(async () => {
  const id = (route.params.slug ?? route.params.id ?? route.query.id) as string;
  if (!id) return;
  await store.loadWorkflow(id);
});

watch(
  () => route.params.slug,
  async (newSlug) => {
    const id = (newSlug ?? route.params.id ?? route.query.id) as string;
    if (!id) return;
    await store.loadWorkflow(id);
  }
);
</script>
