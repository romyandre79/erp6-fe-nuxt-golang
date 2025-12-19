<script setup lang="ts">
import FormRender from '~/components/FormRender.vue';

definePageMeta({
  layout: false,
});

const route = useRoute();
const Api = useApi();
const slug = computed(() => {
    // [...slug] returns an array of strings
    const s = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug;
    // Capitalize first letter of the last segment for display title
    if (!s) return 'Page';
    const lastSegment = s.split('/').pop() || s;
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
});

const pageData = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Map slug to i18n key if available, otherwise fallback to slug
const title = computed(() => {
    return pageData.value?.menuname || slug.value; 
});

useHead({
  title: `${title.value} - Capella Engine v6`,
    bodyAttrs: {
    class: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'
  }
});

const fetchPage = async () => {
  isLoading.value = true;
  error.value = null;
  // Join slug array if it's an array for the API call
  const slugParam = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug;
  try {
    const res = await Api.get(`api/public/page/${slugParam}`);
    if (res.code === 200) {
      pageData.value = res.data;
      if (typeof pageData.value.menuform === 'string') {
        try {
            pageData.value.menuform = JSON.parse(pageData.value.menuform);
        } catch (e) {
            console.error("Failed to parse menuform JSON", e);
        }
      }
    } else {
      error.value = res.message || 'Page not found';
    }
  } catch (err) {
    error.value = 'Failed to load page content';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchPage();
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation -->
    <LandingNavbar />

    <!-- Content -->
    <main class="flex-grow pt-24 pb-20 px-4 relative">
        <div v-if="isLoading" class="flex items-center justify-center min-h-[50vh]">
            <UIcon name="svg-spinners:ring-resize" class="w-12 h-12 text-gray-400" />
        </div>

        <div v-else-if="error" class="max-w-4xl mx-auto text-center py-20">
            <h1 class="text-6xl font-bold text-gray-300 mb-4">404</h1>
            <p class="text-xl text-gray-500">{{ error }}</p>
            <UButton to="/" color="gray" variant="ghost" class="mt-8">Return Home</UButton>
        </div>

        <div v-else-if="pageData" class="mx-auto w-full">
            <!-- Dynamic Form Render in Public Mode -->
           <FormRender 
             v-if="pageData.menuform"
             :schema="pageData.menuform" 
             formType="public" 
           />
           <div v-else class="text-center text-gray-400 py-20">
             This page has no content defined.
           </div>
        </div>
    </main>

    <!-- Footer -->
    <LandingFooter />
  </div>
</template>

<style>
@import '@/assets/css/landing.css';
</style>
