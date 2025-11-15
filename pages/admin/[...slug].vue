<template>

    <div class="flex items-center justify-between sticky top-0 z-50 px-6 py-3 transition-colors duration-300 backdrop-blur-md">
      <FormRender  v-if="formSchema" :schema="formSchema" :menuName="menuName" :formType="formType" :title="formTitle"/>
    </div>
</template>

<script setup lang="ts">
//import FormRenderer from '~/components/FormRenderer.vue'
import FormRender from '~/components/FormRender.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const { getMenuForm } = useAuth()
const formSchema = ref<Record<string, any> | null>(null)
const formType = ref(String)
const formTitle = ref(String)
const menuName = ref(String)

definePageMeta({
  layout: 'auth',                
  middleware: ['auth'] 
})

onMounted(async() => {
  try {
    menuName.value = route.params.slug
    const res = await getMenuForm(route.params.slug)
    if (res?.code == 200) {
      formTitle.value = res.data.data.description
      formType.value = res.data.data.menutype
      formSchema.value = JSON.parse(res.data.data.menuform)
    } else {
      console.error('Invalid response from /auth/me', res)
    }
  } catch (err) {
    console.error('Error loading user info:', err)
  }
})

</script>
