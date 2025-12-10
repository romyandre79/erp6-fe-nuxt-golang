<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: 'Capella ERP v6 - Platform ERP Modern dengan Workflow Automation Indonesia',
  meta: [
    { charset: 'UTF-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'title', content: 'Capella ERP v6 - Platform ERP Modern dengan Workflow Automation Indonesia' },
    { name: 'description', content: 'Capella ERP v6 adalah platform ERP modern dengan visual workflow automation seperti n8n. Otomatisasi proses bisnis, integrasi 1000+ apps, dan tingkatkan produktivitas perusahaan Anda.' },
    { name: 'keywords', content: 'ERP Indonesia, workflow automation, n8n alternative, business automation, visual workflow builder, enterprise resource planning, sistem ERP, otomasi bisnis, capella erp' },
    { name: 'robots', content: 'index, follow' },
    { name: 'language', content: 'Indonesian' },
    { name: 'author', content: 'Capella ERP' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://capellaerp.com/' },
    { property: 'og:title', content: 'Capella ERP v6 - Platform ERP Modern dengan Workflow Automation' },
    { property: 'og:description', content: 'Otomatisasi proses bisnis dengan visual workflow builder. 500+ template, 1000+ integrasi, dan 99.9% uptime SLA.' },
    { property: 'og:image', content: 'https://capellaerp.com/og-image.jpg' },
    { property: 'og:locale', content: 'id_ID' },
    { property: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:url', content: 'https://capellaerp.com/' },
    { property: 'twitter:title', content: 'Capella ERP v6 - Platform ERP Modern dengan Workflow Automation' },
    { property: 'twitter:description', content: 'Otomatisasi proses bisnis dengan visual workflow builder. 500+ template, 1000+ integrasi, dan 99.9% uptime SLA.' },
    { property: 'twitter:image', content: 'https://capellaerp.com/twitter-image.jpg' }
  ],
  link: [
    { rel: 'canonical', href: 'https://capellaerp.com/' },
    { rel: 'icon', type: 'image/png', href: '/favicon.png' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Capella ERP v6",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, Windows, macOS, Linux",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "IDR",
          "priceValidUntil": "2025-12-31",
          "availability": "https://schema.org/InStock",
          "url": "https://capellaerp.com/pricing"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "1250"
        },
        "description": "Platform ERP modern dengan workflow automation terintegrasi. Visual flow builder untuk otomasi proses bisnis tanpa coding.",
        "featureList": [
          "Visual Workflow Builder",
          "1000+ App Integrations",
          "Real-time Processing",
          "Enterprise Security",
          "Advanced Analytics",
          "Custom Nodes Support"
        ],
        "screenshot": "https://capellaerp.com/screenshot.jpg",
        "softwareVersion": "6.0"
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Capella ERP",
        "url": "https://capellaerp.com",
        "logo": "https://capellaerp.com/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+62-xxx-xxxx-xxxx",
          "contactType": "Customer Service",
          "areaServed": "ID",
          "availableLanguage": ["Indonesian", "English"]
        },
        "sameAs": [
          "https://facebook.com/capellaerp",
          "https://twitter.com/capellaerp",
          "https://linkedin.com/company/capellaerp",
          "https://instagram.com/capellaerp"
        ]
      })
    }
  ],
  bodyAttrs: {
    class: 'bg-gray-900 text-gray-100'
  }
});
</script>

<template>
  <div>
    <!-- Navigation -->
    <LandingNavbar />

    <!-- Hero Section -->
    <section class="gradient-bg pt-32 pb-20 px-4 relative overflow-hidden" itemscope itemtype="https://schema.org/Product">
        <div class="absolute inset-0 opacity-10">
            <svg class="w-full h-full" viewBox="0 0 800 600">
                <circle class="node-animation" cx="100" cy="100" r="4" fill="#ff4757"/>
                <circle class="node-animation" cx="300" cy="150" r="4" fill="#ff6348" style="animation-delay: 0.3s"/>
                <circle class="node-animation" cx="500" cy="200" r="4" fill="#ff4757" style="animation-delay: 0.6s"/>
                <circle class="node-animation" cx="700" cy="100" r="4" fill="#ff6348" style="animation-delay: 0.9s"/>
                <line class="flow-line" x1="100" y1="100" x2="300" y2="150" stroke="#ff4757" stroke-width="1"/>
                <line class="flow-line" x1="300" y1="150" x2="500" y2="200" stroke="#ff6348" stroke-width="1" style="animation-delay: 0.3s"/>
                <line class="flow-line" x1="500" y1="200" x2="700" y2="100" stroke="#ff4757" stroke-width="1" style="animation-delay: 0.6s"/>
            </svg>
        </div>
        
        <div class="max-w-7xl mx-auto text-center relative z-10">
            <h1 class="text-5xl md:text-7xl font-bold mb-6" itemprop="name">
                <span class="text-white">{{ $t('LANDING.HERO.TITLE_PREFIX') }}</span>
                <br/>
                <span class="text-gradient">{{ $t('LANDING.HERO.TITLE_SUFFIX') }}</span>
            </h1>
            <p class="text-xl text-gray-300 mb-8 max-w-3xl mx-auto" itemprop="description">
                {{ $t('LANDING.HERO.SUBTITLE') }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button class="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-lg transition glow">
                    {{ $t('LANDING.HERO.START_TRIAL') }}
                </button>
                <button class="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold text-lg transition border border-gray-700">
                    {{ $t('LANDING.HERO.WATCH_DEMO') }}
                </button>
            </div>
            
            <!-- Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
                <div>
                    <div class="text-4xl font-bold text-red-500 mb-2">500+</div>
                    <div class="text-gray-400">{{ $t('LANDING.STATS.TEMPLATES') }}</div>
                </div>
                <div>
                    <div class="text-4xl font-bold text-red-500 mb-2">99.9%</div>
                    <div class="text-gray-400">{{ $t('LANDING.STATS.UPTIME') }}</div>
                </div>
                <div>
                    <div class="text-4xl font-bold text-red-500 mb-2">1000+</div>
                    <div class="text-gray-400">{{ $t('LANDING.STATS.INTEGRATIONS') }}</div>
                </div>
                <div>
                    <div class="text-4xl font-bold text-red-500 mb-2">24/7</div>
                    <div class="text-gray-400">{{ $t('LANDING.STATS.SUPPORT') }}</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 px-4 bg-gray-900" itemscope itemtype="https://schema.org/ItemList">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold mb-4" itemprop="name">
                    <span class="text-gradient">{{ $t('LANDING.FEATURES.TITLE') }}</span>
                </h2>
                <p class="text-xl text-gray-400" itemprop="description">{{ $t('LANDING.FEATURES.SUBTITLE') }}</p>
            </div>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Feature Card 1 -->
                <article class="card-hover bg-gray-800 p-8 rounded-2xl border border-gray-700" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    <meta itemprop="position" content="1">
                    <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold mb-2 text-white" itemprop="name">{{ $t('LANDING.FEATURES.VISUAL_BUILDER.TITLE') }}</h3>
                    <p class="text-gray-400" itemprop="description">{{ $t('LANDING.FEATURES.VISUAL_BUILDER.DESC') }}</p>
                </article>

                <!-- Feature Card 2 -->
                <article class="card-hover bg-gray-800 p-8 rounded-2xl border border-gray-700" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    <meta itemprop="position" content="2">
                    <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold mb-2 text-white" itemprop="name">{{ $t('LANDING.FEATURES.REALTIME.TITLE') }}</h3>
                    <p class="text-gray-400" itemprop="description">{{ $t('LANDING.FEATURES.REALTIME.DESC') }}</p>
                </article>

                <!-- Feature Card 3 -->
                <article class="card-hover bg-gray-800 p-8 rounded-2xl border border-gray-700" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    <meta itemprop="position" content="3">
                    <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold mb-2 text-white" itemprop="name">{{ $t('LANDING.FEATURES.SECURITY.TITLE') }}</h3>
                    <p class="text-gray-400" itemprop="description">{{ $t('LANDING.FEATURES.SECURITY.DESC') }}</p>
                </article>

                <!-- Feature Card 4 -->
                <article class="card-hover bg-gray-800 p-8 rounded-2xl border border-gray-700" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    <meta itemprop="position" content="4">
                    <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold mb-2 text-white" itemprop="name">{{ $t('LANDING.FEATURES.ANALYTICS.TITLE') }}</h3>
                    <p class="text-gray-400" itemprop="description">{{ $t('LANDING.FEATURES.ANALYTICS.DESC') }}</p>
                </article>

                <!-- Feature Card 5 -->
                <article class="card-hover bg-gray-800 p-8 rounded-2xl border border-gray-700" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    <meta itemprop="position" content="5">
                    <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold mb-2 text-white" itemprop="name">{{ $t('LANDING.FEATURES.MODULAR.TITLE') }}</h3>
                    <p class="text-gray-400" itemprop="description">{{ $t('LANDING.FEATURES.MODULAR.DESC') }}</p>
                </article>

                <!-- Feature Card 6 -->
                <article class="card-hover bg-gray-800 p-8 rounded-2xl border border-gray-700" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    <meta itemprop="position" content="6">
                    <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold mb-2 text-white" itemprop="name">{{ $t('LANDING.FEATURES.CUSTOM_NODES.TITLE') }}</h3>
                    <p class="text-gray-400" itemprop="description">{{ $t('LANDING.FEATURES.CUSTOM_NODES.DESC') }}</p>
                </article>
            </div>
        </div>
    </section>

    <!-- Automation Showcase -->
    <section id="automation" class="py-20 px-4 gradient-bg">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold mb-4">
                    <span class="text-white">{{ $t('LANDING.AUTOMATION.TITLE_PREFIX') }}</span> <span class="text-gradient">{{ $t('LANDING.AUTOMATION.TITLE_SUFFIX') }}</span>
                </h2>
                <p class="text-xl text-gray-300">{{ $t('LANDING.AUTOMATION.SUBTITLE') }}</p>
            </div>
            
            <div class="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <div class="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 class="text-3xl font-bold mb-6 text-white">{{ $t('LANDING.AUTOMATION.COMPLEX_WORKFLOWS') }}</h3>
                        <ul class="space-y-4">
                            <li class="flex items-start">
                                <svg class="w-6 h-6 text-red-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                <div>
                                    <div class="font-semibold text-white">{{ $t('LANDING.AUTOMATION.TRIGGER.TITLE') }}</div>
                                    <div class="text-gray-400">{{ $t('LANDING.AUTOMATION.TRIGGER.DESC') }}</div>
                                </div>
                            </li>
                            <li class="flex items-start">
                                <svg class="w-6 h-6 text-red-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                <div>
                                    <div class="font-semibold text-white">{{ $t('LANDING.AUTOMATION.LOGIC.TITLE') }}</div>
                                    <div class="text-gray-400">{{ $t('LANDING.AUTOMATION.LOGIC.DESC') }}</div>
                                </div>
                            </li>
                            <li class="flex items-start">
                                <svg class="w-6 h-6 text-red-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                <div>
                                    <div class="font-semibold text-white">{{ $t('LANDING.AUTOMATION.TRANSFORM.TITLE') }}</div>
                                    <div class="text-gray-400">{{ $t('LANDING.AUTOMATION.TRANSFORM.DESC') }}</div>
                                </div>
                            </li>
                            <li class="flex items-start">
                                <svg class="w-6 h-6 text-red-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                <div>
                                    <div class="font-semibold text-white">{{ $t('LANDING.AUTOMATION.INTEGRATION.TITLE') }}</div>
                                    <div class="text-gray-400">{{ $t('LANDING.AUTOMATION.INTEGRATION.DESC') }}</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="bg-gray-900 rounded-xl p-6 border border-gray-700">
                        <div class="space-y-4">
                            <div class="flex items-center space-x-4">
                                <div class="w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center border-2 border-green-500">
                                    <span class="text-xs font-bold text-green-500">START</span>
                                </div>
                                <svg class="w-8 h-1 text-gray-600" fill="currentColor" viewBox="0 0 24 4">
                                    <rect width="24" height="4" rx="2"/>
                                </svg>
                                <div class="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center border-2 border-blue-500">
                                    <span class="text-xs font-bold text-blue-500">HTTP</span>
                                </div>
                            </div>
                            <div class="flex items-center space-x-4 ml-20">
                                <svg class="w-8 h-1 text-gray-600" fill="currentColor" viewBox="0 0 24 4">
                                    <rect width="24" height="4" rx="2"/>
                                </svg>
                                <div class="w-16 h-16 bg-purple-500/20 rounded-lg flex items-center justify-center border-2 border-purple-500">
                                    <span class="text-xs font-bold text-purple-500">IF</span>
                                </div>
                            </div>
                            <div class="flex items-center space-x-4 ml-40">
                                <svg class="w-8 h-1 text-gray-600" fill="currentColor" viewBox="0 0 24 4">
                                    <rect width="24" height="4" rx="2"/>
                                </svg>
                                <div class="w-16 h-16 bg-red-500/20 rounded-lg flex items-center justify-center border-2 border-red-500">
                                    <span class="text-xs font-bold text-red-500">DB</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 bg-gray-900">
        <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-4xl md:text-5xl font-bold mb-6 text-white">
                {{ $t('LANDING.CTA.TITLE') }}
            </h2>
            <p class="text-xl text-gray-400 mb-8">
                {{ $t('LANDING.CTA.SUBTITLE') }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button class="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-lg transition glow">
                    {{ $t('LANDING.CTA.START_TRIAL') }}
                </button>
                <button class="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold text-lg transition border border-gray-700">
                    {{ $t('LANDING.CTA.SCHEDULE_DEMO') }}
                </button>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <LandingFooter />
  </div>
</template>

<style>
@import '@/assets/css/landing.css';

* {
    font-family: 'Inter', sans-serif;
}

.gradient-bg {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.node-animation {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.7;
        transform: scale(1.05);
    }
}

.flow-line {
    stroke-dasharray: 5, 5;
    animation: flow 2s linear infinite;
}

@keyframes flow {
    to {
        stroke-dashoffset: -10;
    }
}

.card-hover {
    transition: all 0.3s ease;
}

.card-hover:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(255, 71, 87, 0.2);
}

.glow {
    box-shadow: 0 0 20px rgba(255, 71, 87, 0.3);
}

.text-gradient {
    background: linear-gradient(90deg, #ff4757, #ff6348);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
</style>
