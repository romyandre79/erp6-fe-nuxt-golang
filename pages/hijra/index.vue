<template>
  <div class="min-h-screen bg-white dark:bg-zinc-950">
    <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 px-6">
      <div class="text-center">
        <!-- Header / Logo -->
        <div class="flex items-center justify-center gap-3 mb-6">
          <div class="h-12 w-12 rounded-lg bg-[#00AB84] flex items-center justify-center shadow-md">
            <span class="font-bold text-white text-2xl font-sans">H</span>
          </div>
          <h1 class="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl font-sans">
            Hijra for School
          </h1>
        </div>

        <!-- Description -->
        <p class="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Empowering Islamic schools with a Syariah-compliant financial operating system. Effortless payments for
          parents, streamlined management for schools.
        </p>

        <!-- Cards Grid -->
        <div class="mt-10 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
          <!-- Parent Portal -->
          <NuxtLink to="/hijra/parent" class="block group hover:bg-transparent dark:hover:bg-transparent">
            <div
              class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 shadow-sm text-left h-full transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1"
            >
              <div class="flex flex-col space-y-1.5 p-6">
                <div class="font-semibold leading-none tracking-tight">Parent Portal</div>
                <div class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                  Manage your child's payments with ease and peace of mind.
                </div>
              </div>
              <div class="p-6 pt-0">
                <button
                  class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 w-full text-white shadow btn-gradient"
                >
                  Enter Parent Portal
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-arrow-right ml-2 h-4 w-4"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </NuxtLink>

          <!-- School Admin Dashboard -->
          <NuxtLink to="/admin/dashboard" class="block group hover:bg-transparent dark:hover:bg-transparent">
            <div
              class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 shadow-sm text-left h-full transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1"
            >
              <div class="flex flex-col space-y-1.5 p-6">
                <div class="font-semibold leading-none tracking-tight">School Admin Dashboard</div>
                <div class="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                  Oversee financial operations with transparency and amanah.
                </div>
              </div>
              <div class="p-6 pt-0">
                <button
                  class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 h-9 px-4 py-2 w-full"
                >
                  Enter Admin Dashboard
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-arrow-right ml-2 h-4 w-4"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Pricing Section -->
      <div class="mt-24 w-full">
        <PricingCalculator
          :available-apps="hijraApps"
          theme="light"
          module-name="Hijra"
          :initial-selected-apps="['syariah_accounting', 'tuition']"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import PricingCalculator from '~/components/PricingCalculator.vue';

definePageMeta({
  layout: 'hijra',
});

const hijraApps = [
  { id: 'syariah_accounting', name: 'Syariah Accounting', price: 75000, icon: '🕌' },
  { id: 'tuition', name: 'Tuition Payment', price: 30000, icon: '🎓' },
  { id: 'donation', name: 'Infaq & Sadaqah Mgmt', price: 40000, icon: '🤲' },
  { id: 'reporting', name: 'Financial Reporting', price: 50000, icon: '📈' },
];
</script>

<style scoped>
.btn-gradient {
  background: linear-gradient(90deg, #00ab84, #fbbf24);
  background-size: 200% auto;
  transition: background-position 0.5s ease;
}
.btn-gradient:hover {
  background-position: right center;
}
</style>
