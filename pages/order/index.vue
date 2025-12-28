<template>
  <div class="bg-indigo-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 class="text-4xl md:text-6xl font-extrabold text-indigo-900 mb-6">Smart Order Management</h1>
        <p class="text-xl text-indigo-700 max-w-2xl mx-auto mb-12">
            Centralize your orders from all channels. Automate processing, shipping, and inventory updates in real-time.
        </p>
        <div class="flex justify-center gap-4 mb-20">
            <NuxtLink to="/customer/orders" class="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all">
                Enter Dashboard
            </NuxtLink>
            <button class="px-8 py-4 bg-white text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 transition-all">
                Learn More
            </button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

</script>
