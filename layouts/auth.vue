<script lang="ts">
import { useUserStore } from '~/store/user'

const userStore = useUserStore()
userStore.loadFromStorage()
userStore.user?.menus

</script>
<template>
  <div class="flex min-h-screen">
    <aside class="w-64 bg-gray-900 text-white p-4 space-y-4">
      <h2 class="text-xl font-bold">{{$t('ADMIN')}}</h2>
      <nav class="flex flex-col space-y-2">
        <NuxtLink to="/admin/dashboard">{{$t('Dashboard')}}</NuxtLink>
        <NuxtLink to="/admin/users">{{$t('Users')}}</NuxtLink>
      </nav>
    </aside>
    <main class="flex-1 bg-gray-100">
      <NavbarAdmin />
      <NuxtPage />
    </main>
  </div>
</template>