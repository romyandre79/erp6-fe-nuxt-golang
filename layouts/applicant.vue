<template>
  <div class="min-h-screen font-sans text-slate-800 bg-white selection:bg-teal-500 selection:text-white">
    <!-- Navbar -->
    <nav
      class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300"
      :class="{ 'shadow-sm': isScrolled }"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center gap-2 cursor-pointer" @click="navigateTo('/applicant')">
            <div
              class="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-teal-500/30"
            >
              C
            </div>
            <span
              class="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600"
            >
              Career<span class="text-teal-600">Portal</span>
            </span>
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center space-x-8">
            <NuxtLink
              to="/applicant"
              class="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
              active-class="text-teal-600 font-semibold"
              >Home</NuxtLink
            >
            <NuxtLink
              to="/applicant/jobs"
              class="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
              active-class="text-teal-600 font-semibold"
              >Browse Jobs</NuxtLink
            >
            <NuxtLink
              to="/applicant/dashboard"
              class="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
              active-class="text-teal-600 font-semibold"
              >My Applications</NuxtLink
            >
          </div>

          <!-- Auth Buttons -->
          <div class="hidden md:flex items-center space-x-4">
            <NuxtLink
              to="/applicant/login"
              class="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Log in
            </NuxtLink>
            <NuxtLink
              to="/applicant/register"
              class="px-4 py-2 rounded-full bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30 transition-all transform hover:-translate-y-0.5"
            >
              Get Started
            </NuxtLink>
          </div>

          <!-- Mobile menu button -->
          <div class="flex items-center md:hidden">
            <button
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none ring-offset-2 focus:ring-2 ring-teal-500"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                v-if="!isMobileMenuOpen"
                class="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                v-else
                class="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-2 opacity-0"
      >
        <div v-if="isMobileMenuOpen" class="md:hidden bg-white border-b border-slate-100 shadow-lg">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NuxtLink
              to="/applicant"
              class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-slate-50"
              active-class="text-teal-600 bg-teal-50"
              >Home</NuxtLink
            >
            <NuxtLink
              to="/applicant/jobs"
              class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-slate-50"
              active-class="text-teal-600 bg-teal-50"
              >Browse Jobs</NuxtLink
            >
            <NuxtLink
              to="/applicant/dashboard"
              class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-slate-50"
              active-class="text-teal-600 bg-teal-50"
              >My Applications</NuxtLink
            >
          </div>
          <div class="pt-4 pb-4 border-t border-slate-100">
            <div class="flex items-center px-5 space-x-3">
              <NuxtLink
                to="/applicant/login"
                class="flex-1 text-center px-4 py-2 border border-slate-300 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Log in
              </NuxtLink>
              <NuxtLink
                to="/applicant/register"
                class="flex-1 text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700"
              >
                Join Now
              </NuxtLink>
            </div>
          </div>
        </div>
      </transition>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 border-t border-slate-800 text-slate-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">C</div>
              <span class="font-bold text-xl tracking-tight text-white"
                >Career<span class="text-teal-500">Portal</span></span
              >
            </div>
            <p class="text-sm leading-relaxed max-w-sm">
              We connect the world's best talent with the world's best companies. Join us to find your dream job and
              accelerate your career.
            </p>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-white tracking-wider uppercase mb-4">For Candidates</h3>
            <ul class="space-y-3">
              <li>
                <NuxtLink to="/applicant/jobs" class="text-sm hover:text-teal-400 transition-colors"
                  >Browse Jobs</NuxtLink
                >
              </li>
              <li>
                <NuxtLink to="/applicant/dashboard" class="text-sm hover:text-teal-400 transition-colors"
                  >Candidate Dashboard</NuxtLink
                >
              </li>
              <li><a href="#" class="text-sm hover:text-teal-400 transition-colors">Job Alerts</a></li>
              <li><a href="#" class="text-sm hover:text-teal-400 transition-colors">Career Advice</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-white tracking-wider uppercase mb-4">Company</h3>
            <ul class="space-y-3">
              <li><a href="#" class="text-sm hover:text-teal-400 transition-colors">About Us</a></li>
              <li><a href="#" class="text-sm hover:text-teal-400 transition-colors">Contact</a></li>
              <li><a href="#" class="text-sm hover:text-teal-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="text-sm hover:text-teal-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm">&copy; {{ new Date().getFullYear() }} Capella Career Portal. All rights reserved.</p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <!-- Social icons could go here -->
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import '@/assets/css/landing.css';

const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* Optional specific styles if Tailwind isn't enough */
</style>
