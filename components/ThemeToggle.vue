<template>
  <select data-choose-theme class="select select-bordered w-36">
    <option disabled selected>Theme</option>
    <option v-for="theme in themes" :key="theme" :value="theme">{{ theme }}</option>
  </select>
</template>

<script setup>
const themes = ['light', 'dark', 'cupcake', 'corporate']
</script>