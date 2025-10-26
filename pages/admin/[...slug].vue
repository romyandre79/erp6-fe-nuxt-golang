<template>
    <div class="flex items-center justify-between sticky top-0 z-50 px-6 py-3 transition-colors duration-300 backdrop-blur-md">
      <h1 class="text-xl font-bold tracking-tight">{{  $t(route.params.slug[0].replace(/\s+/g, '_').toUpperCase())  }}</h1>
    </div>
    <div class="flex items-center justify-between sticky top-0 z-50 px-6 py-3 transition-colors duration-300 backdrop-blur-md">
            <FormRenderer  v-if="formSchema" :schema="formSchema" :formtype="formType"/>
    </div>
</template>

<script setup lang="ts">
import FormRenderer from '~/components/FormRenderer.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const { getMenuForm } = useAuth()
const formSchema = ref<Record<string, any> | null>(null)
const formType = ref(String)

definePageMeta({
  layout: 'auth',                
  middleware: ['auth'] 
})

onMounted(async() => {
  try {
    const res = await getMenuForm(route.params.slug)
    if (res?.code === 200) {
      formType.value = res.data.menutype
      formSchema.value = JSON.parse(res.data.menuform)
    } else {
      console.error('Invalid response from /auth/me', res)
    }
  } catch (err) {
    console.error('Error loading user info:', err)
  }
})

</script>
