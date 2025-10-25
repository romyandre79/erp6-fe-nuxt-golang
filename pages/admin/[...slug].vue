<template>
  <div>
    <h1>General Admin Page</h1>
    <FormRenderer :schema="formSchema" />
  </div>
</template>

<script setup lang="ts">
import FormRenderer from '~/components/FormRenderer.vue'
import { useUserStore } from '~/store/user'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()

definePageMeta({
  layout: 'auth',                
  middleware: ['auth'] 
})

onMounted(() => {
  const localUser = localStorage.getItem('user')
  if (localUser) {
    userStore.user = JSON.parse(localUser)
  }
})
const route = useRoute()
const menuForms = userStore.user?.menus.filter(m => m.menuname == route.params.slug)
//const formSchema = ref(menuForms.menuform)
console.log(menuForms.menuform)
</script>
