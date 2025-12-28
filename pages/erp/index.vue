<template>
  <div class="erp-page">
    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl shadow-2xl animate-pulse-slow"></div>
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl shadow-2xl animate-pulse-slow" style="animation-delay: 2s;"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          <span class="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{{ $t('ERP.HERO.TITLE_PREFIX') }}</span><br />
          <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{{ $t('ERP.HERO.TITLE_SUFFIX') }}</span>
        </h1>
        <p class="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
          {{ $t('ERP.HERO.SUBTITLE') }}
        </p>
        <div class="flex justify-center gap-4">
          <button class="px-8 py-4 rounded-full bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all transform hover:-translate-y-1">
            {{ $t('ERP.HERO.GET_STARTED') }}
          </button>
          <button class="px-8 py-4 rounded-full bg-white text-slate-700 font-semibold border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
            {{ $t('ERP.HERO.LEARN_MORE') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-24 bg-white relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900 mb-4">{{ $t('ERP.FEATURES.TITLE') }}</h2>
          <p class="text-slate-500">{{ $t('ERP.FEATURES.SUBTITLE') }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            :title="$t('LANDING.FEATURES.VISUAL_BUILDER.TITLE')"
            :description="$t('LANDING.FEATURES.VISUAL_BUILDER.DESC')"
            icon="✨"
            color="bg-purple-50 text-purple-600"
          />
          <FeatureCard 
            title="Drag n Drop" 
            description="Intuitive interface for effortless management."
            icon="👆"
            color="bg-blue-50 text-blue-600"
          />
          <FeatureCard 
            title="Form Design" 
            description="Create custom forms in minutes, no code required."
            icon="📝"
            color="bg-green-50 text-green-600"
          />
          <FeatureCard 
            title="Workflow Design" 
            description="Visualise and optimize your business processes."
            icon="🔄"
            color="bg-orange-50 text-orange-600"
          />
          <FeatureCard 
            title="Widget Design" 
            description="Personalize your dashboard with custom widgets."
            icon="🧩"
            color="bg-pink-50 text-pink-600"
          />
          <FeatureCard 
            title="Table Design" 
            description="Powerful data grids with advanced sorting and filtering."
            icon="📊"
            color="bg-cyan-50 text-cyan-600"
          />
        </div>
      </div>
    </section>

    <!-- Modules Section -->
    <section id="modules" class="py-24 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900 mb-4">{{ $t('ERP.MODULES.TITLE') }}</h2>
          <p class="text-slate-500">{{ $t('ERP.MODULES.SUBTITLE') }}</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ModuleCard :title="$t('ERP.APPS.ACCOUNTING')" icon="💰" />
          <ModuleCard :title="$t('ERP.APPS.WAREHOUSE')" icon="🏭" />
          <ModuleCard :title="$t('ERP.APPS.PRODUCTION')" icon="⚙️" />
          <ModuleCard :title="$t('ERP.APPS.HR')" icon="👥" />
          <ModuleCard :title="$t('ERP.APPS.ORDER')" icon="🛒" />
          <ModuleCard :title="$t('ERP.APPS.PROCUREMENT')" icon="🛍️" />
          <ModuleCard :title="$t('ERP.APPS.PROJECT')" icon="📉" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import PricingCalculator from '~/components/PricingCalculator.vue'

const { t } = useI18n()

definePageMeta({
  layout: 'erp'
})

import { h } from 'vue'

const FeatureCard = (props) => {
  return h('div', { class: 'group p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1' }, [
    h('div', { class: `w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 ${props.color} group-hover:scale-110 transition-transform` }, props.icon),
    h('h3', { class: 'text-xl font-bold text-slate-900 mb-2' }, props.title),
    h('p', { class: 'text-slate-500 leading-relaxed' }, props.description)
  ])
}

const ModuleCard = (props) => {
  return h('div', { class: 'flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group' }, [
    h('div', { class: 'text-4xl mb-4 group-hover:scale-110 transition-transform duration-300' }, props.icon),
    h('h3', { class: 'font-semibold text-slate-700 group-hover:text-blue-600 transition-colors' }, props.title)
  ])
}
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.15;
    transform: scale(1.1);
  }
}
</style>