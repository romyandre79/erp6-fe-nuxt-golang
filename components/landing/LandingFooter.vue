<template>
    <footer class="gradient-bg py-12 px-4 border-t border-gray-800">
        <div class="max-w-7xl mx-auto">
            <div class="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                    <div class="flex items-center space-x-2 mb-4">
                        <div class="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg"></div>
                        <span class="text-lg font-bold text-white">Capella ERP</span>
                    </div>
                    <p class="text-gray-400 text-sm">{{ $t('LANDING.FOOTER.TAGLINE') }}</p>
                </div>
                <div>
                    <h4 class="font-semibold text-white mb-4">{{ $t('LANDING.FOOTER.PRODUCT') }}</h4>
                    <ul class="space-y-2 text-gray-400 text-sm">
                        <li><NuxtLink to="/#features" class="hover:text-white transition">{{ $t('LANDING.NAV.FEATURES') }}</NuxtLink></li>
                        <li><NuxtLink to="/#pricing" class="hover:text-white transition">{{ $t('LANDING.NAV.PRICING') }}</NuxtLink></li>
                        <li><NuxtLink to="/documentation" class="hover:text-white transition">{{ $t('LANDING.FOOTER.LINKS.DOCUMENTATION') }}</NuxtLink></li>
                        <li><NuxtLink to="/api" class="hover:text-white transition">{{ $t('LANDING.FOOTER.LINKS.API') }}</NuxtLink></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold text-white mb-4">{{ $t('LANDING.FOOTER.COMPANY') }}</h4>
                    <ul class="space-y-2 text-gray-400 text-sm">
                        <li><NuxtLink to="/about" class="hover:text-white transition">{{ $t('LANDING.FOOTER.LINKS.ABOUT') }}</NuxtLink></li>
                        <li><NuxtLink to="/blog" class="hover:text-white transition">{{ $t('LANDING.FOOTER.LINKS.BLOG') }}</NuxtLink></li>
                        <li><NuxtLink to="/careers" class="hover:text-white transition">{{ $t('LANDING.FOOTER.LINKS.CAREERS') }}</NuxtLink></li>
                        <li><NuxtLink to="/contact" class="hover:text-white transition">{{ $t('LANDING.NAV.CONTACT') }}</NuxtLink></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold text-white mb-4">{{ $t('LANDING.FOOTER.LEGAL') }}</h4>
                    <ul class="space-y-2 text-gray-400 text-sm">
                        <li><NuxtLink to="/privacy" class="hover:text-white transition">{{ $t('LANDING.FOOTER.LINKS.PRIVACY') }}</NuxtLink></li>
                        <li><NuxtLink to="/terms" class="hover:text-white transition">{{ $t('LANDING.FOOTER.LINKS.TERMS') }}</NuxtLink></li>
                        <li><NuxtLink to="/security" class="hover:text-white transition">{{ $t('LANDING.FOOTER.LINKS.SECURITY') }}</NuxtLink></li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
                <p>{{ $t('LANDING.FOOTER.COPYRIGHT') }}</p>
            </div>
        </div>
    </footer>
</template>
