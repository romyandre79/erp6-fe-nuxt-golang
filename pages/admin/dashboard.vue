<template>
  <div class="p-6 space-y-10">
    <section>
      <div v-for="(value,i) in recordWidget">
        <FormRenderer  v-if="fetchForm(i)" :schema="fetchForm(i)" formtype="MASTER"/>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import FormRenderer from '~/components/FormRenderer.vue'

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
  await fetchData()
})
</script>
