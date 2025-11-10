<template>
  <div class="p-6 space-y-10">
      <div v-for="(value,i) in recordWidget" class="p-5 w-full rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 
             bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300">
             <h1 class="text-xl font-bold tracking-tight">{{ $t(value.description.toUpperCase()) }}</h1>
        <FormRenderer  v-if="fetchForm(i)" :schema="fetchForm(i)" formtype="MASTER"/>
      </div>
  </div>
</template>

<script setup lang="ts">
import FormRenderer from '~/components/WidgetRenderer.vue'

definePageMeta({
  layout: 'auth',
  middleware: ['auth']
})

const { fetchWidgets } = useWidgets()
const recordWidget = ref<Record<string, any> | null>(null)
let res : any

const fetchData = async() => {
 try {
    res = await fetchWidgets("admin")
    if (res?.code === 200) { 
      recordWidget.value = res?.data
    } else {
      console.error('Invalid response from /auth/me', res)
    }
  } catch (err) {
    console.error('Error loading user info:', err)
  }
}

const fetchForm = (rec : any) => {
  if (res.data[rec].widgetform != '') {
    return JSON.parse(res.data[rec].widgetform)
  }
}

onMounted(async() => {
  fetchData()
})
</script>
