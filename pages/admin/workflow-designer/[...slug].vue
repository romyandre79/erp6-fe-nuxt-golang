<template>
  <div class="h-screen flex overflow-hidden">
    <!-- Sidebar on the left -->
    <div class="flex-none bg-white border-r z-10">
      <Sidebar />
    </div>

    <!-- Designer takes remaining space -->
    <div class="flex-1 relative bg-gray-100">
      <Designer @saved="markClean" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWorkflowStore } from '~/store/workflow';

// Lazy load heavy components for code splitting
const Designer = defineAsyncComponent(() => import('~/components/workflow/Designer.vue'));
const Sidebar = defineAsyncComponent(() => import('~/components/workflow/WorkflowSidebar.vue'));

definePageMeta({
  middleware: ['auth'],
  layout: 'auth'
});

const route = useRoute();
const router = useRouter();
const store = useWorkflowStore();

// Helper to get workflow ID from route
function getWorkflowId(): string | null {
  const slug = route.params.slug;
  const id = Array.isArray(slug) ? slug[0] : slug;
  const finalId = id ?? route.params.id ?? route.query.id ?? null;
  console.log('getWorkflowId resolving to:', finalId, 'from slug:', slug);
  return finalId as string | null;
}

onMounted(async () => {
  await router.isReady(); // Critical: Wait for router to be ready
  console.log('Page Mounted - Router Ready');
  
  const id = getWorkflowId();
  if (!id) {
    console.warn('No ID found in route');
    return;
  }
  console.log('Calling store.loadWorkflow with ID:', id);
  await store.loadWorkflow(id);
});

/*watch(
  () => route.params.slug,
  async () => {
    console.log('Route slug changed:', route.params.slug);
    const id = getWorkflowId();
    if (!id) return;
    console.log('Calling store.loadWorkflow (watch) with ID:', id);
    await store.loadWorkflow(id);
  },
  { deep: true }
);*/
import { useUnsavedChanges } from '~/composables/useUnsavedChanges';

const { isDirty, markDirty, markClean } = useUnsavedChanges();

// Watch for changes in store.workflow
watch(() => store.workflow, () => {
  if (store.workflow) markDirty();
}, { deep: true });

// Mark clean when workflow is loaded initially
watch(() => store.workflow?.id, () => {
   markClean();
});

// Also need to handle save event to markClean.
// The save logic is likely in Sidebar or Designer.
// `Sidebar` emits `save`.
// I should listen to save event if possible, or watch store loading state.

</script>
