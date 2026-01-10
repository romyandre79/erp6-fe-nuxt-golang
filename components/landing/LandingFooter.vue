<template>
    <footer class="gradient-bg py-12 px-4 border-t border-gray-800">
        <div class="max-w-7xl mx-auto">
            <div class="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                    <div class="flex items-center space-x-2 mb-4">
                        <div class="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg"></div>
                        <span class="text-lg font-bold text-white">Capella</span>
                    </div>
                    <p class="text-gray-400 text-sm">{{ $t('LANDING.FOOTER.TAGLINE') }}</p>
                </div>
                <div>
                    <h4 class="font-semibold text-white mb-4">{{ $t('LANDING.FOOTER.PRODUCT') }}</h4>
                    <ul class="space-y-2 text-gray-400 text-sm">
                        <li><NuxtLink to="/#features" class="hover:text-white transition">{{ $t('LANDING.NAV.FEATURES') }}</NuxtLink></li>
                        <li><NuxtLink to="/#pricing" class="hover:text-white transition">{{ $t('LANDING.NAV.PRICING') }}</NuxtLink></li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                <p>{{ $t('LANDING.FOOTER.COPYRIGHT') }}</p>
            </div>
        </div>
    </footer>
</template>
