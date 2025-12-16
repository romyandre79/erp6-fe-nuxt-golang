<script setup lang="ts">
// Simple redirect to customer orders or login
definePageMeta({
  layout: false
})

onMounted(() => {
  const router = useRouter();
  // In a real app, check auth state here.
  // For now, redirect to customer dashboard (or orders as requested plan)
  router.push('/customer/orders');
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Redirecting to Customer Portal...</p>
    </div>
  </div>
</template>
