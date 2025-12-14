<script setup lang="ts">
definePageMeta({
  layout: false,
});

const route = useRoute();
const slug = computed(() => {
    const s = route.params.slug as string;
    return s.charAt(0).toUpperCase() + s.slice(1);
});

// Map slug to i18n key if available, otherwise fallback to slug
const title = computed(() => {
    // Basic mapping, in reality you might look up from i18n
    return slug.value; 
});

useHead({
  title: `${title.value} - Capella Engine v6`,
    bodyAttrs: {
    class: 'bg-gray-900 text-gray-100'
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation -->
    <LandingNavbar />

    <!-- Content -->
    <main class="flex-grow pt-32 pb-20 px-4 relative">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl md:text-5xl font-bold mb-8 text-white">
                <span class="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                    {{ title }}
                </span>
            </h1>
            
            <div class="prose prose-invert prose-lg max-w-none">
                <div class="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                    <p class="text-xl text-gray-300 mb-6">
                        This is a placeholder page for <strong>{{ slug }}</strong>.
                    </p>
                    <p class="text-gray-400">
                        Content for this section is currently being prepared. Please check back later.
                    </p>
                    
                    <div class="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                         <h3 class="font-semibold text-white mb-2">Developers Note:</h3>
                         <p class="text-sm text-gray-400">
                            To customize this content, create specific components or fetch content from a CMS using the slug: <code>{{ route.params.slug }}</code>.
                         </p>
                    </div>
                </div>
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
