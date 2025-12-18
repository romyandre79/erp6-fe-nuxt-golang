<template>
  <div class="hris-page min-h-screen bg-slate-900 text-white">
    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl shadow-2xl animate-pulse-slow"></div>
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl shadow-2xl animate-pulse-slow" style="animation-delay: 2s;"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          <span class="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Modern HR</span><br />
          <span class="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Management</span>
        </h1>
        <p class="max-w-2xl mx-auto text-xl text-slate-400 mb-10 leading-relaxed">
          Simplify your HR processes. From recruitment to payroll, manage your entire employee lifecycle in one unified platform.
        </p>
        <div class="flex justify-center gap-4">
          <button class="px-8 py-4 rounded-full bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 hover:shadow-emerald-600/40 transition-all transform hover:-translate-y-1">
            Get Started
          </button>
          <button class="px-8 py-4 rounded-full bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm hover:bg-slate-700 transition-all">
            Live Demo
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-24 bg-slate-800/50 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-white mb-4">Everything you need</h2>
          <p class="text-slate-400">Complete suite of tools for the modern HR professional.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title" class="p-8 rounded-2xl bg-slate-800 border border-slate-700 hover:border-emerald-500/30 hover:bg-slate-700/50 transition-all duration-300">
             <div class="text-4xl mb-4">{{ feature.icon }}</div>
             <h3 class="text-xl font-bold text-white mb-2">{{ feature.title }}</h3>
             <p class="text-slate-400 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <div class="mt-0 w-full">
       <PricingCalculator 
        :available-apps="availableSubModules"
        theme="dark"
        module-name="HRIS"
        :initial-selected-apps="['org_mgmt', 'time_mgmt', 'ess', 'payroll']"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PricingCalculator from '~/components/PricingCalculator.vue'

definePageMeta({
  layout: 'hris'
})

const features = [
  {
    title: 'Smart Payroll',
    description: 'Automated tax calculations, salary disbursement, and payslip generation in one click.',
    icon: '💰'
  },
  {
    title: 'Attendance Tracking',
    description: 'Real-time attendance monitoring with geofencing and biometric integration.',
    icon: '⏰'
  },
  {
    title: 'Talent Acquisition',
    description: 'Streamline your recruitment process from job posting to onboarding.',
    icon: '🤝'
  },
  {
    title: 'Performance Management',
    description: 'Set goals, track progress, and conduct 360-degree appraisals seamlessly.',
    icon: '📈'
  },
  {
    title: 'Employee Self-Service',
    description: 'Empower employees to manage their profiles, leaves, and claims.',
    icon: '📱'
  },
  {
    title: 'Analytics & Reports',
    description: 'Data-driven insights to help you make better HR decisions.',
    icon: '📊'
  }
]

// Pricing Logic
const availableSubModules = [
  { id: 'org_mgmt', name: 'Organization Mgmt', price: 50000, icon: '🏢' },
  { id: 'time_mgmt', name: 'Time Management', price: 50000, icon: '⏳' },
  { id: 'ess', name: 'Employee Self Service', price: 30000, icon: '📱' },
  { id: 'payroll', name: 'Payroll', price: 75000, icon: '💸' },
]
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
