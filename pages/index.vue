<script setup lang="ts">
import '@/assets/css/landing.css';
import PricingCalculator from '~/components/PricingCalculator.vue'

// Consolidated list of popular apps from various modules for the main landing page
const allApps = [
  { id: 'engine', name: 'Capella', price: 2500000, icon: '📊' },
  { id: 'accounting', name: 'Accounting', price: 250000, icon: '📊' },
  { id: 'warehouse', name: 'Warehouse / Inventory', price: 150000, icon: '📊' },
  { id: 'erp_prod', name: 'ERP Production', price: 250000, icon: '📊' },
  { id: 'erp_proj', name: 'ERP Project', price: 250000, icon: '📊' },
  { id: 'hris_ess', name: 'HRIS', price: 150000, icon: '👥' },
  { id: 'ess', name: 'ESS', price: 100000, icon: '👥' },
  { id: 'e-proc', name: 'E-Procurement', price: 100000, icon: '👥' },
  { id: 'career', name: 'Career', price: 100000, icon: '👥' },
  { id: 'customer_pro', name: 'Customer Professional', price: 50000, icon: '🤝' },
  { id: 'eproc_adv', name: 'E-Procurement Advanced', price: 100000, icon: '🛒' },
  { id: 'pos_retail', name: 'POS Retail', price: 100000, icon: '🏪' },
  { id: 'pentest', name: 'Security Scanner', price: 2000000, icon: '🛡️' },
  { id: 'remindax', name: 'Remindax', price: 50000, icon: '🔔' },
]

definePageMeta({
  layout: false,
});


useHead({
  title: 'Capella Engine v6 - Platform Modern dengan Workflow Automation Indonesia',
  meta: [
    { charset: 'UTF-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'title', content: 'Capella Engine v6 - Platform ERP Modern dengan Workflow Automation Indonesia' },
    { name: 'description', content: 'Capella Engine v6 adalah platform ERP modern dengan visual workflow automation seperti n8n. Otomatisasi proses bisnis, integrasi 1000+ apps, dan tingkatkan produktivitas perusahaan Anda.' },
    { name: 'keywords', content: 'ERP Indonesia, workflow automation, n8n alternative, business automation, visual workflow builder, enterprise resource planning, sistem ERP, otomasi bisnis, capella erp' },
    { name: 'robots', content: 'index, follow' },
    { name: 'language', content: 'Indonesian' },
    { name: 'author', content: 'Capella ERP' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://capellaerp.com/' },
    { property: 'og:title', content: 'Capella Engine v6 - Platform ERP Modern dengan Workflow Automation' },
    { property: 'og:description', content: 'Otomatisasi proses bisnis dengan visual workflow builder. 500+ template, 1000+ integrasi, dan 99.9% uptime SLA.' },
    { property: 'og:image', content: 'https://capellaerp.com/og-image.jpg' },
    { property: 'og:locale', content: 'id_ID' },
    { property: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:url', content: 'https://capellaerp.com/' },
    { property: 'twitter:title', content: 'Capella Engine v6 - Platform ERP Modern dengan Workflow Automation' },
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
        "name": "Capella Engine v6",
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
                <a href="#demo-video" class="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold text-lg transition border border-gray-700 inline-block text-center">
                    {{ $t('LANDING.HERO.WATCH_DEMO') }}
                </a>
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

    <!-- Demo Video Section -->
    <section id="demo-video" class="py-20 px-4 bg-gray-900">
        <div class="max-w-5xl mx-auto">
            <div class="text-center mb-12">
                <h2 class="text-4xl md:text-5xl font-bold mb-4">
                    <span class="text-gradient">Watch Capella in Action</span>
                </h2>
                <p class="text-xl text-gray-400">See how Capella Engine v6 transforms your workflow automation</p>
            </div>
            
            <div class="relative w-full" style="padding-bottom: 56.25%;">
                <iframe 
                    class="absolute top-0 left-0 w-full h-full rounded-2xl shadow-2xl border border-gray-700"
                    src="https://www.youtube.com/embed/1fO4u2Nf0sI?si=jbvPy5-06mBGyFoj" 
                    title="Capella Engine Demo" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen
                ></iframe>
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

    <!-- Applications Showcase -->
    <section id="applications" class="py-20 px-4 bg-gray-900">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold mb-4">
                    <span class="text-white">Applications Built with</span> <span class="text-gradient">Capella Engine v6</span>
                </h2>
                <p class="text-xl text-gray-400">Powerful platforms powered by Capella Engine v6 engine</p>
            </div>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- App 1: Manufaktur -->
                <article class="card-hover bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
                    <div class="h-48 bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center relative overflow-hidden">
                        <svg
  viewBox="0 0 512 512"
  xmlns="http://www.w3.org/2000/svg"
  class="w-full h-auto max-h-48 mx-auto text-slate-300"
  fill="none"
  stroke="currentColor"
  stroke-width="12"
  stroke-linecap="round"
  stroke-linejoin="round"
  preserveAspectRatio="xMidYMid meet"
>
  <!-- Factory Base -->
  <rect x="64" y="240" width="384" height="176" rx="16" />

  <!-- Roof -->
  <path d="M64 240L144 176L224 240L304 176L384 240" />

  <!-- Chimney -->
  <rect x="352" y="112" width="48" height="128" rx="8" />
  <path d="M376 112V80" />
  <path d="M360 64C360 48 392 48 392 64" />

  <!-- Windows -->
  <rect x="96" y="272" width="48" height="48" rx="6" />
  <rect x="160" y="272" width="48" height="48" rx="6" />
  <rect x="224" y="272" width="48" height="48" rx="6" />
  <rect x="288" y="272" width="48" height="48" rx="6" />

  <!-- Conveyor Belt -->
  <rect x="96" y="352" width="320" height="24" rx="12" />
  <circle cx="128" cy="364" r="6" />
  <circle cx="176" cy="364" r="6" />
  <circle cx="224" cy="364" r="6" />
  <circle cx="272" cy="364" r="6" />
  <circle cx="320" cy="364" r="6" />
  <circle cx="368" cy="364" r="6" />

  <!-- Gear -->
  <circle cx="256" cy="208" r="24" />
  <path d="M256 176V160" />
  <path d="M256 256V240" />
  <path d="M224 208H208" />
  <path d="M304 208H288" />
  <path d="M236 188L224 176" />
  <path d="M276 228L288 240" />
  <path d="M236 228L224 240" />
  <path d="M276 188L288 176" />
</svg>

                        <div class="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center mb-3">
                            <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">Manufacturing</span>
                        </div>
                        <h3 class="text-2xl font-bold mb-3 text-white">Capella Smart ERP</h3>
                        <p class="text-gray-400 mb-4">Manufacturing Execution System with real-time production monitoring, integrated quality control, and automated scheduling.</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Production Planning</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">IoT Integration</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Quality Control</span>
                        </div>
                        <div class="flex items-center justify-between pt-4 border-t border-gray-700">
                            <span class="text-sm text-gray-500">500+ active workflows</span>
                            <NuxtLink to="/erp" class="text-blue-400 hover:text-blue-300 text-sm font-semibold">View Details →</NuxtLink>
                        </div>
                    </div>
                </article>

                <article class="card-hover bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
                    <div class="h-48 bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 flex items-center justify-center relative overflow-hidden">
                       <svg
  viewBox="0 0 512 512"
  xmlns="http://www.w3.org/2000/svg"
  class="w-full h-auto max-h-48 mx-auto text-slate-300"
  fill="none"
  stroke="currentColor"
  stroke-width="12"
  stroke-linecap="round"
  stroke-linejoin="round"
  preserveAspectRatio="xMidYMid meet"
>
  <!-- Building -->
  <rect x="96" y="160" width="320" height="240" rx="16" />

  <!-- Roof -->
  <path d="M64 176L256 64L448 176" />

  <!-- Door -->
  <rect x="224" y="288" width="64" height="112" rx="8" />

  <!-- Clock -->
  <circle cx="256" cy="192" r="32" />
  <path d="M256 192V176" />
  <path d="M256 192H272" />

  <!-- Windows -->
  <rect x="128" y="224" width="48" height="48" rx="6" />
  <rect x="192" y="224" width="48" height="48" rx="6" />
  <rect x="272" y="224" width="48" height="48" rx="6" />
  <rect x="336" y="224" width="48" height="48" rx="6" />

  <!-- Books (Education System) -->
  <rect x="120" y="416" width="64" height="24" rx="6" />
  <rect x="200" y="416" width="64" height="24" rx="6" />
  <rect x="280" y="416" width="64" height="24" rx="6" />
</svg>

                        <div class="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center mb-3">
                            <span class="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold">Education</span>
                        </div>
                        <h3 class="text-2xl font-bold mb-3 text-white">School Management System</h3>
                        <p class="text-gray-400 mb-4">Complete e-learning platform with course management, automated grading, attendance tracking, and parent portal.</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Online Classes</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Auto Grading</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Analytics</span>
                        </div>
                        <div class="flex items-center justify-between pt-4 border-t border-gray-700">
                            <span class="text-sm text-gray-500">50K+ students</span>
                            <NuxtLink class="text-indigo-400 hover:text-indigo-300 text-sm font-semibold" to="/hijra">View Details →</NuxtLink>
                        </div>
                    </div>
                </article>

                <article class="card-hover bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
                    <div class="h-48 bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 flex items-center justify-center relative overflow-hidden">
                        <svg
  viewBox="0 0 512 512"
  xmlns="http://www.w3.org/2000/svg"
  class="w-full h-auto max-h-48 mx-auto text-amber-400"
  fill="none"
  stroke="currentColor"
  stroke-width="12"
  stroke-linecap="round"
  stroke-linejoin="round"
  preserveAspectRatio="xMidYMid meet"
>
  <!-- Building -->
  <rect x="96" y="176" width="320" height="224" rx="16" />
  <path d="M64 192L256 96L448 192" />

  <!-- Door -->
  <rect x="224" y="288" width="64" height="112" rx="8" />

  <!-- Scale -->
  <line x1="256" y1="176" x2="256" y2="240" />
  <line x1="208" y1="200" x2="304" y2="200" />

  <path d="M208 200L176 256H240L208 200Z" />
  <path d="M304 200L272 256H336L304 200Z" />

  <!-- Gold Bar -->
  <rect x="208" y="416" width="96" height="32" rx="8" />
</svg>

                        <div class="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center mb-3">
                            <span class="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold">Business</span>
                        </div>
                        <h3 class="text-2xl font-bold mb-3 text-white">Pusat Gadai Indonesia</h3>
                        <p class="text-gray-400 mb-4">Complete e-learning platform with course management, automated grading, attendance tracking, and parent portal.</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Online Classes</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Auto Grading</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Analytics</span>
                        </div>
                        <div class="flex items-center justify-between pt-4 border-t border-gray-700">
                            <span class="text-sm text-gray-500">50K+ students</span>
                            <NuxtLink class="text-indigo-400 hover:text-indigo-300 text-sm font-semibold" to="/pusatgadai">View Details →</NuxtLink>
                        </div>
                    </div>
                </article>

                <article class="card-hover bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
                    <div class="h-48 bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 flex items-center justify-center relative overflow-hidden">
                        <svg
  viewBox="0 0 512 512"
  xmlns="http://www.w3.org/2000/svg"
  class="w-full h-auto max-h-48 mx-auto text-emerald-400"
  fill="none"
  stroke="currentColor"
  stroke-width="12"
  stroke-linecap="round"
  stroke-linejoin="round"
  preserveAspectRatio="xMidYMid meet"
>
  <!-- Building -->
  <rect x="112" y="176" width="288" height="224" rx="16" />
  <path d="M96 192L256 96L416 192" />

  <!-- Door -->
  <rect x="232" y="288" width="48" height="112" rx="8" />

  <!-- People -->
  <circle cx="176" cy="256" r="24" />
  <circle cx="336" cy="256" r="24" />

  <!-- Connection -->
  <path d="M200 256H312" />

  <!-- Hands / Unity -->
  <path d="M160 304C160 272 192 272 192 304" />
  <path d="M320 304C320 272 352 272 352 304" />
</svg>

                        <div class="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center mb-3">
                            <span class="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold">Business</span>
                        </div>
                        <h3 class="text-2xl font-bold mb-3 text-white">Koperasi</h3>
                        <p class="text-gray-400 mb-4">Complete e-learning platform with course management, automated grading, attendance tracking, and parent portal.</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Online Classes</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Auto Grading</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Analytics</span>
                        </div>
                        <div class="flex items-center justify-between pt-4 border-t border-gray-700">
                            <span class="text-sm text-gray-500">50K+ students</span>
                            <NuxtLink class="text-indigo-400 hover:text-indigo-300 text-sm font-semibold" to="/koperasi">View Details →</NuxtLink>
                        </div>
                    </div>
                </article>

                <article class="card-hover bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
                    <div class="h-48 bg-gradient-to-br from-emerald-500/20 to-cyan-600/10 flex items-center justify-center relative overflow-hidden">
                        <svg
  viewBox="0 0 512 512"
  xmlns="http://www.w3.org/2000/svg"
  class="w-full h-auto max-h-48 mx-auto text-emerald-300"
  fill="none"
  stroke="currentColor"
  stroke-width="12"
  stroke-linecap="round"
  stroke-linejoin="round"
  preserveAspectRatio="xMidYMid meet"
>
  <!-- Warehouse/Building -->
  <rect x="64" y="160" width="384" height="240" rx="16" />
  <path d="M64 160L256 64L448 160" />

  <!-- Door -->
  <rect x="208" y="272" width="96" height="128" rx="8" />

  <!-- Boxes -->
  <rect x="96" y="320" width="64" height="64" rx="4" />
  <rect x="352" y="320" width="64" height="64" rx="4" />
  <rect x="96" y="240" width="64" height="64" rx="4" />
  
  <!-- Checkmark -->
  <circle cx="368" cy="240" r="48" class="text-emerald-400" fill="currentColor" opacity="0.2" stroke="none"/>
  <path d="M344 240l16 16l32-32" stroke-width="16" class="text-emerald-400"/>
</svg>

                        <div class="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center mb-3">
                            <span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold">Supply Chain</span>
                        </div>
                        <h3 class="text-2xl font-bold mb-3 text-white">E-Procurement</h3>
                        <p class="text-gray-400 mb-4">Advanced vendor portal and procurement management system with real-time tender tracking and automated workflows.</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Vendor Portal</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Tender Management</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Analytics</span>
                        </div>
                        <div class="flex items-center justify-between pt-4 border-t border-gray-700">
                            <span class="text-sm text-gray-500">200+ Active Vendors</span>
                            <NuxtLink class="text-emerald-400 hover:text-emerald-300 text-sm font-semibold" to="/e-procurement">View Details →</NuxtLink>
                        </div>
                    </div>
                </article>

                <article class="card-hover bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
                    <div class="h-48 bg-gradient-to-br from-purple-500/20 to-pink-600/10 flex items-center justify-center relative overflow-hidden">
                        <svg
                          viewBox="0 0 512 512"
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-full h-auto max-h-48 mx-auto text-purple-300"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="12"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <!-- User / Customer -->
                          <circle cx="256" cy="160" r="64" />
                          <path d="M160 368c0-53 43-96 96-96s96 43 96 96" />
                          
                          <!-- Shopping Cart / Order -->
                          <circle cx="368" cy="400" r="24" />
                          <circle cx="144" cy="400" r="24" />
                          <path d="M112 400h-32l-32-160h384l-32 160h-32" />
                          <path d="M256 320v-80" />
                          <path d="M256 240l-32 32m32-32l32 32" />
                        </svg>

                        <div class="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center mb-3">
                            <span class="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold">CRM</span>
                        </div>
                        <h3 class="text-2xl font-bold mb-3 text-white">Customer Management</h3>
                        <p class="text-gray-400 mb-4">Dedicated customer portal for order tracking, invoice management, and payment history.</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Order Tracking</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Invoices</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Payments</span>
                        </div>
                        <div class="flex items-center justify-between pt-4 border-t border-gray-700">
                            <span class="text-sm text-gray-500">Self-service Portal</span>
                            <NuxtLink class="text-purple-400 hover:text-purple-300 text-sm font-semibold" to="/order">View Details →</NuxtLink>
                        </div>
                    </div>
                </article>

            <!-- Employee Self-Service Card -->
                <article class="card-hover bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
                    <div class="h-48 bg-gradient-to-br from-blue-400/20 to-cyan-500/10 flex items-center justify-center relative overflow-hidden">
                        <svg
                          viewBox="0 0 512 512"
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-full h-auto max-h-48 mx-auto text-blue-300"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="12"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <!-- Card Base (ID Card theme) -->
                          <rect x="128" y="96" width="256" height="320" rx="16" />
                          <circle cx="256" cy="192" r="48" />
                          <path d="M192 288h128" /> <!-- Name line -->
                          <path d="M192 336h80" />  <!-- Detail line -->
                          
                          <!-- Checkmark/Approval -->
                          <path d="M352 352l32 32l64-64" class="text-green-400" stroke-width="24" />
                        </svg>

                        <div class="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center mb-3">
                            <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">HR Tech</span>
                        </div>
                        <h3 class="text-2xl font-bold mb-3 text-white">Employee Self-Service</h3>
                        <p class="text-gray-400 mb-4">Empower employees with self-service capabilities for leave requests, profile management, and attendance.</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Leave Mgmt</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Profile Update</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Sick Reports</span>
                        </div>
                        <div class="flex items-center justify-between pt-4 border-t border-gray-700">
                            <span class="text-sm text-gray-500">1000+ Employees</span>
                            <NuxtLink class="text-blue-400 hover:text-blue-300 text-sm font-semibold" to="/ess">View Details →</NuxtLink>
                        </div>
                    </div>
                </article>

                <!-- Career Portal Card -->
                <article class="card-hover bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
                    <div class="h-48 bg-gradient-to-br from-teal-400/20 to-cyan-500/10 flex items-center justify-center relative overflow-hidden">
                        <svg
                          viewBox="0 0 512 512"
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-full h-auto max-h-48 mx-auto text-teal-300"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="12"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <!-- Briefcase -->
                          <rect x="112" y="176" width="288" height="208" rx="16" />
                          <path d="M176 176V128a32 32 0 0132-32h96a32 32 0 0132 32v48" />
                          
                          <!-- User search -->
                          <circle cx="256" cy="256" r="32" />
                          <path d="M256 320c-32 0-64 16-64 48v16h128v-16c0-32-32-48-64-48" />
                          
                          <!-- Magnifying Glass -->
                          <circle cx="336" cy="336" r="24" class="text-cyan-400" />
                          <path d="M352 352l24 24" class="text-cyan-400" stroke-width="24" />
                        </svg>

                        <div class="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center mb-3">
                            <span class="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-xs font-semibold">Recruitment</span>
                        </div>
                        <h3 class="text-2xl font-bold mb-3 text-white">Career Portal</h3>
                        <p class="text-gray-400 mb-4">Complete applicant tracking system (ATS) with job postings, candidate dashboard, and interview scheduling.</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Job Listings</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Applications</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Interviews</span>
                        </div>
                        <div class="flex items-center justify-between pt-4 border-t border-gray-700">
                            <span class="text-sm text-gray-500">Find top talent</span>
                            <NuxtLink class="text-teal-400 hover:text-teal-300 text-sm font-semibold" to="/applicant">View Details →</NuxtLink>
                        </div>
                    </div>
                </article>
            <!-- HRIS Card -->
                <article class="card-hover bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
                    <div class="h-48 bg-gradient-to-br from-pink-500/20 to-rose-600/10 flex items-center justify-center relative overflow-hidden">
                        <svg
                          viewBox="0 0 512 512"
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-full h-auto max-h-48 mx-auto text-pink-300"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="12"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <!-- People Network -->
                          <circle cx="256" cy="128" r="48" />
                          <circle cx="128" cy="304" r="40" />
                          <circle cx="384" cy="304" r="40" />
                          
                          <!-- Connections -->
                          <path d="M256 176L128 264" />
                          <path d="M256 176L384 264" />
                          <path d="M128 344V400H384V344" />
                          
                          <!-- Heart/Care symbol -->
                          <path d="M256 368C256 368 288 352 304 336C320 320 320 304 320 304" class="text-rose-400" stroke-width="16" stroke-linecap="round"/>
                          <path d="M256 368C256 368 224 352 208 336C192 320 192 304 192 304" class="text-rose-400" stroke-width="16" stroke-linecap="round"/>
                        </svg>

                        <div class="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center mb-3">
                            <span class="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs font-semibold">Human Resources</span>
                        </div>
                        <h3 class="text-2xl font-bold mb-3 text-white">Capella HRIS</h3>
                        <p class="text-gray-400 mb-4">Modern Human Resource Information System with automated payroll, attendance tracking, and performance management.</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Payroll</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Attendance</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Performance</span>
                        </div>
                        <div class="flex items-center justify-between pt-4 border-t border-gray-700">
                            <span class="text-sm text-gray-500">Simplify HR</span>
                            <NuxtLink class="text-pink-400 hover:text-pink-300 text-sm font-semibold" to="/hris">View Details →</NuxtLink>
                        </div>
                    </div>
                </article>

                                <article class="card-hover bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
                    <div class="h-48 bg-gradient-to-br from-orange-500/20 to-red-600/10 flex items-center justify-center relative overflow-hidden">
                        <svg
                          viewBox="0 0 512 512"
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-full h-auto max-h-48 mx-auto text-orange-300"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="12"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <!-- Clock -->
                          <circle cx="256" cy="256" r="192" />
                          <path d="M256 128V256L352 320" stroke-width="24" />
                          
                          <!-- Notification Bell -->
                          <path d="M416 96L448 64" stroke-width="24" class="text-red-400" />
                          <path d="M448 96L416 64" stroke-width="24" class="text-red-400" />
                          <path d="M96 96L64 64" stroke-width="24" class="text-red-400" />
                          <path d="M64 96L96 64" stroke-width="24" class="text-red-400" />
                        </svg>

                        <div class="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center mb-3">
                            <span class="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold">Productivity</span>
                        </div>
                        <h3 class="text-2xl font-bold mb-3 text-white">Remindax</h3>
                        <p class="text-gray-400 mb-4">Smart reminder and scheduling system. Never miss a deadline with multi-channel notifications via WhatsApp & Email.</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Scheduling</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">WhatsApp</span>
                            <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">Recurring</span>
                        </div>
                        <div class="flex items-center justify-between pt-4 border-t border-gray-700">
                            <span class="text-sm text-gray-500">Stay Organized</span>
                            <NuxtLink class="text-orange-400 hover:text-orange-300 text-sm font-semibold" to="/remindax">View Details →</NuxtLink>
                        </div>
                    </div>
                </article>
            </div>

            <!-- Stats Banner -->
            <div class="mt-16 bg-gradient-to-r from-red-500/10 to-purple-500/10 rounded-2xl p-8 border border-red-500/20">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div class="text-4xl font-bold text-red-500 mb-2">50+</div>
                        <div class="text-gray-400">Enterprise Apps</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold text-red-500 mb-2">10M+</div>
                        <div class="text-gray-400">Daily Transactions</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold text-red-500 mb-2">15K+</div>
                        <div class="text-gray-400">Active Workflows</div>
                    </div>
                    <div>
                        <div class="text-4xl font-bold text-red-500 mb-2">99.98%</div>
                        <div class="text-gray-400">System Uptime</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-20 px-4 bg-gray-900 border-t border-gray-800">
        <div class="max-w-7xl mx-auto">
             <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold mb-4 text-white">
                    Transparent Pricing
                </h2>
                <p class="text-xl text-gray-400">Build your perfect stack. Select the modules you need and get an instant estimate.</p>
            </div>
            
            <PricingCalculator 
              :available-apps="allApps"
              theme="dark"
              module-name="Enterprise Bundle"
              :initial-selected-apps="['erp_core', 'hris_ess']"
            />
        </div>
    </section>

    <!-- Footer -->
    <LandingFooter />
  </div>
</template>

<style>
/* @import '@/assets/css/landing.css'; - Moved to script */

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
