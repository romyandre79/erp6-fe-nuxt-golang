<template>
        <h2 class="text-2xl font-semibold mb-3">{{ title }}</h2>
  <div
    :class="[
      'overflow-x-auto rounded-xl border shadow-sm transition-colors duration-300',
      isDark
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
    ]"
  >
    <table
     class="table w-full">
      <!-- Header -->
      <thead
        :class="[
          'text-sm uppercase font-semibold',
          isDark
            ? 'bg-gray-700 text-gray-100'
            : 'bg-gray-100 text-gray-700'
        ]"
      >
        <tr>
          <th
            v-for="header in headers"
            :key="header"
            class="px-4 py-3 text-left tracking-wide"
          >
            {{ header }}
          </th>
        </tr>
      </thead>

      <!-- Body -->
      <tbody>
        <tr
          v-for="(row, index) in rows"
          :key="index"
          :class="[
            'transition-colors duration-200',
            isDark
              ? 'hover:bg-gray-700/60 text-gray-100'
              : 'hover:bg-gray-100 text-gray-800'
          ]"
        >
          <td
            v-for="(value, key) in row"
            :key="key"
            class="px-4 py-3 text-sm"
          >
            {{ value }}
          </td>
        </tr>
      </tbody>

      <!-- Empty state -->
      <tfoot v-if="!rows?.length">
        <tr>
          <td
            :colspan="headers.length"
            :class="[
              'text-center py-6 text-sm',
              isDark ? 'text-gray-400' : 'text-gray-500'
            ]"
          >
            No data available
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '~/store/theme'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.theme === 'dark')

defineProps({
  title: String,
  headers: Array,
  rows: Array
})
</script>
