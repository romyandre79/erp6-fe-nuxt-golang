<script setup>
import { useUserStore } from '~/store/user'

const userStore = useUserStore()

</script>
<template>
    <div class="bg-gray-800 py-4 px-4">
    <NuxtLink class="text-white p-2 hover:bg-gray-700" to="/">{{$t('HOME')}}</NuxtLink>
    <NuxtLink
        v-if="!userStore.token"
        class="text-white p-2 hover:bg-gray-700"
        to="/login"
        >{{$t('SIGN_IN')}}</NuxtLink
    >
    </div>
</template>