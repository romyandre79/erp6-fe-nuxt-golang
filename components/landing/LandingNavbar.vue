<script setup lang="ts">
import { useUserStore } from '~/store/user';

const userStore = useUserStore();

onMounted(async () => {
  await userStore.loadAuth();
});
</script>

<template>
    <nav class="fixed w-full z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <NuxtLink to="/" class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                    </div>
                    <span class="text-xl font-bold text-white">Capella</span>
                    <span class="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded">v6</span>
                </NuxtLink>
                <div class="hidden md:flex space-x-8">
                    <NuxtLink to="/#features" class="text-gray-300 hover:text-white transition">{{ $t('LANDING.NAV.FEATURES') }}</NuxtLink>
                    <NuxtLink to="/#automation" class="text-gray-300 hover:text-white transition">{{ $t('LANDING.NAV.AUTOMATION') }}</NuxtLink>
                    <NuxtLink to="/#pricing" class="text-gray-300 hover:text-white transition">{{ $t('LANDING.NAV.PRICING') }}</NuxtLink>
                    <NuxtLink to="/#contact" class="text-gray-300 hover:text-white transition">{{ $t('LANDING.NAV.CONTACT') }}</NuxtLink>
                </div>
                <div class="flex items-center gap-4">
                    <LandingLanguageSelector />
                    
                    <NuxtLink v-if="!userStore.token" to="/login" class="text-gray-300 hover:text-white font-medium transition">{{ $t('LANDING.NAV.LOGIN') }}</NuxtLink>
                    <NuxtLink v-else to="/admin/dashboard" class="text-gray-300 hover:text-white font-medium transition">Admin</NuxtLink>
                    <button class="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-medium">
                        {{ $t('LANDING.NAV.GET_STARTED') }}
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>
