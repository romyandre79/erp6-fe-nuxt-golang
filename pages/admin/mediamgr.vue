<template>
  <div class="min-h-screen bg-gray-50 dark:bg-black p-4">
    <MediaManager />
  </div>
</template>

<script setup lang="ts">
import MediaManager from '~/components/MediaManager.vue'
definePageMeta({
  layout: 'auth'
})
</script>