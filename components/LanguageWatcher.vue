<script setup lang="ts">
const { locale, setLocale, locales } = useI18n();

const items = computed(() => [
  locales.value.map((l: any) => ({
    label: l.name,
    click: () => setLocale(l.code),
    icon: l.code === locale.value ? 'i-heroicons-check-20-solid' : undefined,
  })),
]);

const currentLocaleName = computed(() => {
  const current = locales.value.find((l: any) => l.code === locale.value) as any;
  return current ? current.code.toUpperCase() : locale.value;
});
</script>

<template>
  <UDropdown :items="items" :popper="{ placement: 'bottom-end' }">
    <UButton
      color="gray"
      variant="ghost"
      trailing-icon="i-heroicons-chevron-down-20-solid"
      class="font-medium"
      :label="currentLocaleName"
    />
  </UDropdown>
</template>
