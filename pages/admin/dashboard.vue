<template>
  <div class="p-6 space-y-10">
    <section>
      <WidgetGrid moduleName="admin" />
    </section>
  </div>
</template>

<script setup lang="ts">
import WidgetGrid from '~/components/Widgets.vue'

definePageMeta({
  layout: 'auth',
  middleware: ['auth']
})
</script>
