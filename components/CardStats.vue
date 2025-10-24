<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body flex flex-row items-center gap-4">
      <div class="text-primary text-4xl"><i :class="icon"></i></div>
      <div>
        <h2 class="card-title">{{ $t(title) }}</h2>
        <p class="text-2xl font-bold">{{ value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  icon: String
})
</script>