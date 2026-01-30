<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Mobile menu state
const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);

// Navigation items
const navItems = [
  { name: 'Flights', icon: 'fa-solid fa-plane', href: '/nusatrip/flights' },
  { name: 'Hotels', icon: 'fa-solid fa-hotel', href: '/nusatrip/hotels' },
  { name: 'Experiences', icon: 'fa-solid fa-compass', href: '/nusatrip/experiences' },
  { name: 'Rentals', icon: 'fa-solid fa-car', href: '/nusatrip/rentals' },
  { name: 'Packages', icon: 'fa-solid fa-gift', href: '/nusatrip/packages' },
];

// Handle scroll for navbar effect
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>

<template>
  <div class="nusatrip-layout min-h-screen bg-slate-50">
    <!-- Navbar -->
    <header 
      :class="[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-100' 
          : 'bg-gradient-to-b from-black/50 to-transparent'
      ]"
    >
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <NuxtLink to="/nusatrip" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" style="background: linear-gradient(135deg, #FF5A5F, #e04e52);">
              <i class="fa-solid fa-paper-plane text-white text-lg"></i>
            </div>
            <span :class="[
              'text-2xl font-bold tracking-tight transition-colors',
              isScrolled ? 'text-slate-900' : 'text-white'
            ]">
              Nusa<span style="color: #FF5A5F;">Trip</span>
            </span>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center gap-1">
            <NuxtLink
              v-for="item in navItems"
              :key="item.name"
              :to="item.href"
              :class="[
                'flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-200',
                isScrolled 
                  ? 'text-slate-600 hover:text-coral-600 hover:bg-coral-50' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              ]"
            >
              <i :class="[item.icon, 'text-xs']"></i>
              {{ item.name }}
            </NuxtLink>
          </div>

          <!-- Right Section -->
          <div class="flex items-center gap-3">
            <!-- Language Switcher -->
            <LanguageWatcher :class="isScrolled ? 'text-slate-600' : 'text-white'" />
            
            <!-- Auth Buttons -->
            <div class="hidden sm:flex items-center gap-2">
              <NuxtLink 
                to="/nusatrip/login"
                :class="[
                  'px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200',
                  isScrolled 
                    ? 'text-slate-700 hover:text-coral-600 hover:bg-slate-100' 
                    : 'text-white hover:bg-white/10'
                ]"
              >
                Log in
              </NuxtLink>
              <NuxtLink 
                to="/nusatrip/register"
                class="px-5 py-2.5 rounded-full text-white font-semibold text-sm shadow-lg hover:scale-105 transition-all duration-200"
                style="background: linear-gradient(90deg, #FF5A5F, #e04e52);"
              >
                Sign up
              </NuxtLink>
            </div>

            <!-- Mobile Menu Button -->
            <button 
              @click="toggleMobileMenu"
              :class="[
                'lg:hidden p-2.5 rounded-xl transition-colors',
                isScrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              ]"
            >
              <i :class="isMobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" class="text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <div 
            v-if="isMobileMenuOpen" 
            class="lg:hidden absolute left-4 right-4 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
          >
            <div class="p-4 space-y-1">
              <NuxtLink
                v-for="item in navItems"
                :key="item.name"
                :to="item.href"
                @click="isMobileMenuOpen = false"
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-coral-50 hover:text-coral-600 font-medium transition-colors"
              >
                <i :class="[item.icon, 'w-5 text-coral-500']"></i>
                {{ item.name }}
              </NuxtLink>
            </div>
            <div class="border-t border-slate-100 p-4 flex gap-2">
              <NuxtLink 
                to="/nusatrip/login"
                @click="isMobileMenuOpen = false"
                class="flex-1 py-3 text-center rounded-xl font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Log in
              </NuxtLink>
              <NuxtLink 
                to="/nusatrip/register"
                @click="isMobileMenuOpen = false"
                class="flex-1 py-3 text-center rounded-xl bg-gradient-to-r from-coral-500 to-coral-600 text-white font-semibold shadow-lg"
              >
                Sign up
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </nav>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 text-white pt-20 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Main Footer Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-12 border-b border-slate-800">
          <!-- Brand Column -->
          <div class="col-span-2">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center">
                <i class="fa-solid fa-paper-plane text-white"></i>
              </div>
              <span class="text-2xl font-bold">Nusa<span class="text-coral-500">Trip</span></span>
            </div>
            <p class="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Your trusted travel partner for discovering Indonesia and beyond. Book flights, hotels, and experiences with confidence.
            </p>
            <!-- Social Links -->
            <div class="flex gap-3">
              <a href="#" class="w-10 h-10 rounded-full bg-slate-800 hover:bg-coral-500 flex items-center justify-center transition-colors">
                <i class="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-slate-800 hover:bg-coral-500 flex items-center justify-center transition-colors">
                <i class="fa-brands fa-instagram"></i>
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-slate-800 hover:bg-coral-500 flex items-center justify-center transition-colors">
                <i class="fa-brands fa-twitter"></i>
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-slate-800 hover:bg-coral-500 flex items-center justify-center transition-colors">
                <i class="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>

          <!-- Destinations -->
          <div>
            <h4 class="font-semibold text-white mb-4">Top Destinations</h4>
            <ul class="space-y-2.5">
              <li><a href="#" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">Bali</a></li>
              <li><a href="#" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">Jakarta</a></li>
              <li><a href="#" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">Yogyakarta</a></li>
              <li><a href="#" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">Lombok</a></li>
              <li><a href="#" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">Raja Ampat</a></li>
            </ul>
          </div>

          <!-- Products -->
          <div>
            <h4 class="font-semibold text-white mb-4">Products</h4>
            <ul class="space-y-2.5">
              <li><a href="/nusatrip/flights" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">Flights</a></li>
              <li><a href="/nusatrip/hotels" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">Hotels</a></li>
              <li><a href="/nusatrip/experiences" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">Experiences</a></li>
              <li><a href="/nusatrip/rentals" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">Car Rentals</a></li>
              <li><a href="/nusatrip/packages" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">Packages</a></li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h4 class="font-semibold text-white mb-4">Company</h4>
            <ul class="space-y-2.5">
              <li><a href="#" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">About Us</a></li>
              <li><a href="#" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">Careers</a></li>
              <li><a href="#" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">Press</a></li>
              <li><a href="#" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">Blog</a></li>
              <li><a href="#" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">Contact</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h4 class="font-semibold text-white mb-4">Support</h4>
            <ul class="space-y-2.5">
              <li><a href="#" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">Help Center</a></li>
              <li><a href="#" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">Safety Info</a></li>
              <li><a href="#" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">Cancellation</a></li>
              <li><a href="#" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">COVID-19</a></li>
              <li><a href="#" class="text-slate-400 hover:text-coral-400 text-sm transition-colors">Report Issue</a></li>
            </ul>
          </div>
        </div>

        <!-- Payment Methods -->
        <div class="py-8 border-b border-slate-800">
          <h4 class="text-sm font-medium text-slate-400 mb-4">Payment Partners</h4>
          <div class="flex flex-wrap gap-4">
            <div class="h-8 px-4 bg-white/10 rounded-md flex items-center justify-center">
              <i class="fa-brands fa-cc-visa text-2xl text-slate-300"></i>
            </div>
            <div class="h-8 px-4 bg-white/10 rounded-md flex items-center justify-center">
              <i class="fa-brands fa-cc-mastercard text-2xl text-slate-300"></i>
            </div>
            <div class="h-8 px-4 bg-white/10 rounded-md flex items-center justify-center">
              <i class="fa-brands fa-paypal text-2xl text-slate-300"></i>
            </div>
            <div class="h-8 px-4 bg-white/10 rounded-md flex items-center justify-center text-xs text-slate-300 font-semibold">GoPay</div>
            <div class="h-8 px-4 bg-white/10 rounded-md flex items-center justify-center text-xs text-slate-300 font-semibold">OVO</div>
            <div class="h-8 px-4 bg-white/10 rounded-md flex items-center justify-center text-xs text-slate-300 font-semibold">Dana</div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-slate-500 text-sm">© {{ new Date().getFullYear() }} NusaTrip. All rights reserved.</p>
          <div class="flex items-center gap-6">
            <a href="#" class="text-slate-500 hover:text-coral-400 text-sm transition-colors">Privacy Policy</a>
            <a href="#" class="text-slate-500 hover:text-coral-400 text-sm transition-colors">Terms of Service</a>
            <a href="#" class="text-slate-500 hover:text-coral-400 text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.nusatrip-layout {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Custom Coral Color */
.text-coral-400 { color: #ff7b7b; }
.text-coral-500 { color: #FF5A5F; }
.text-coral-600 { color: #e04e52; }
.bg-coral-50 { background-color: #fff5f5; }
.bg-coral-500 { background-color: #FF5A5F; }
.bg-coral-600 { background-color: #e04e52; }
.from-coral-500 { --tw-gradient-from: #FF5A5F; }
.to-coral-600 { --tw-gradient-to: #e04e52; }
.hover\:text-coral-400:hover { color: #ff7b7b; }
.hover\:text-coral-600:hover { color: #e04e52; }
.hover\:bg-coral-50:hover { background-color: #fff5f5; }
.hover\:bg-coral-500:hover { background-color: #FF5A5F; }
.shadow-coral-500\/30 { --tw-shadow-color: rgba(255, 90, 95, 0.3); }
.shadow-coral-500\/40 { --tw-shadow-color: rgba(255, 90, 95, 0.4); }
</style>
