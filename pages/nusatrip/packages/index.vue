<script setup lang="ts">
import { ref, reactive } from 'vue';

definePageMeta({
  layout: 'nusatrip',
});

useHead({
  title: 'Travel Packages - Flight + Hotel Bundles | NusaTrip',
  meta: [
    { name: 'description', content: 'Save big with all-inclusive travel packages. Combine flights and hotels for the best vacation deals.' },
  ],
});

const isSearching = ref(false);

const form = reactive({
  destination: '',
  departDate: '',
  returnDate: '',
  travelers: 2,
});

// Demo packages
const packages = ref([
  { 
    id: '1', 
    title: '5D4N Bali Paradise', 
    destination: 'Bali', 
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 
    rating: 4.9, 
    reviews: 1250,
    originalPrice: 12000000,
    price: 8500000,
    includes: ['Flights', '4-Star Hotel', 'Breakfast', 'Airport Transfer', 'Tour Guide'],
    highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Kuta Beach', 'Spa Treatment'],
    duration: '5 Days 4 Nights'
  },
  { 
    id: '2', 
    title: '4D3N Raja Ampat Diving', 
    destination: 'Raja Ampat', 
    image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=800', 
    rating: 4.8, 
    reviews: 567,
    originalPrice: 18000000,
    price: 14500000,
    includes: ['Flights', 'Resort', 'All Meals', 'Diving Equipment', 'Boat Tours'],
    highlights: ['3 Dive Sites', 'Snorkeling', 'Island Hopping', 'Sunset Cruise'],
    duration: '4 Days 3 Nights'
  },
  { 
    id: '3', 
    title: '3D2N Yogyakarta Heritage', 
    destination: 'Yogyakarta', 
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800', 
    rating: 4.7, 
    reviews: 890,
    originalPrice: 5500000,
    price: 4200000,
    includes: ['Flights', '3-Star Hotel', 'Breakfast', 'Transport', 'Entrance Fees'],
    highlights: ['Borobudur', 'Prambanan', 'Malioboro', 'Batik Workshop'],
    duration: '3 Days 2 Nights'
  },
  { 
    id: '4', 
    title: '6D5N Lombok Adventure', 
    destination: 'Lombok', 
    image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800', 
    rating: 4.8, 
    reviews: 432,
    originalPrice: 15000000,
    price: 11000000,
    includes: ['Flights', 'Beach Resort', 'All Meals', 'Activities', 'Guide'],
    highlights: ['Mount Rinjani', 'Gili Islands', 'Pink Beach', 'Sasak Village'],
    duration: '6 Days 5 Nights'
  },
]);

const handleSearch = async () => {
  isSearching.value = true;
  await new Promise(resolve => setTimeout(resolve, 800));
  isSearching.value = false;
};

const viewPackage = (pkg: any) => {
  navigateTo(`/nusatrip/packages/${pkg.id}`);
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
};

const calculateDiscount = (original: number, current: number) => {
  return Math.round((1 - current / original) * 100);
};
</script>

<template>
  <div class="pt-20 min-h-screen bg-slate-50">
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920"
          alt="Travel Package"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-slate-900/80"></div>
      </div>
      
      <div class="relative z-10 max-w-6xl mx-auto px-4 py-20">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          <i class="fa-solid fa-gift mr-3 text-indigo-300"></i>
          Travel Packages
        </h1>
        <p class="text-indigo-100/80 text-lg mb-8 max-w-xl">
          All-inclusive vacation bundles with flights, hotels & experiences. Save up to 40%!
        </p>

        <!-- Search Card -->
        <div class="bg-white rounded-2xl shadow-xl p-6 max-w-4xl">
          <div class="grid md:grid-cols-5 gap-4">
            <div class="md:col-span-2 relative">
              <label class="block text-xs font-medium text-slate-500 mb-1">Where to?</label>
              <input 
                v-model="form.destination"
                type="text" 
                placeholder="Bali, Raja Ampat..."
                class="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
              <i class="fa-solid fa-magnifying-glass absolute left-4 top-9 text-slate-400"></i>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Departure</label>
              <input v-model="form.departDate" type="date" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none" />
            </div>
            
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Return</label>
              <input v-model="form.returnDate" type="date" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none" />
            </div>
            
            <button 
              @click="handleSearch"
              :disabled="isSearching"
              class="text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:scale-[1.02] transition-all mt-5 flex items-center justify-center gap-2 disabled:opacity-50" 
              style="background: linear-gradient(90deg, #6366f1, #4f46e5);"
            >
              <i v-if="isSearching" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-magnifying-glass"></i>
              {{ isSearching ? 'Searching...' : 'Search' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Packages -->
    <section class="py-16 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="text-2xl font-bold text-slate-900">Popular Packages</h2>
            <p class="text-slate-500">Curated travel experiences for you</p>
          </div>
          <select class="px-4 py-2 rounded-lg border border-slate-200 text-sm">
            <option>Sort by: Recommended</option>
            <option>Sort by: Price Low to High</option>
            <option>Sort by: Highest Discount</option>
          </select>
        </div>

        <div class="space-y-6">
          <article 
            v-for="pkg in packages" 
            :key="pkg.id"
            class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all flex flex-col lg:flex-row"
          >
            <!-- Image -->
            <div class="lg:w-80 relative shrink-0">
              <img :src="pkg.image" :alt="pkg.title" class="w-full h-56 lg:h-full object-cover" />
              <div class="absolute top-4 left-4 text-white text-sm font-bold px-3 py-1 rounded-full" style="background-color: #FF5A5F;">
                Save {{ calculateDiscount(pkg.originalPrice, pkg.price) }}%
              </div>
              <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
                <i class="fa-regular fa-clock mr-1 text-indigo-500"></i>
                {{ pkg.duration }}
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 p-6 flex flex-col">
              <div class="flex-1">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <h3 class="text-xl font-bold text-slate-900 mb-1">{{ pkg.title }}</h3>
                    <p class="text-slate-500 text-sm">
                      <i class="fa-solid fa-location-dot mr-1"></i>
                      {{ pkg.destination }}, Indonesia
                    </p>
                  </div>
                  <div class="flex items-center gap-1 bg-indigo-100 px-2 py-1 rounded">
                    <i class="fa-solid fa-star text-yellow-400 text-sm"></i>
                    <span class="font-semibold text-indigo-700">{{ pkg.rating }}</span>
                    <span class="text-indigo-400 text-sm">({{ pkg.reviews }})</span>
                  </div>
                </div>

                <!-- Includes -->
                <div class="mb-4">
                  <p class="text-xs font-medium text-slate-500 mb-2">INCLUDES:</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="item in pkg.includes" :key="item" class="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                      <i class="fa-solid fa-check text-green-500"></i>
                      {{ item }}
                    </span>
                  </div>
                </div>

                <!-- Highlights -->
                <div>
                  <p class="text-xs font-medium text-slate-500 mb-2">HIGHLIGHTS:</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="item in pkg.highlights" :key="item" class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      {{ item }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Price & Book -->
              <div class="mt-6 pt-4 border-t border-slate-100 flex items-end justify-between">
                <div>
                  <span class="text-slate-400 line-through text-sm">{{ formatPrice(pkg.originalPrice) }}</span>
                  <div class="text-2xl font-bold text-indigo-600">{{ formatPrice(pkg.price) }}</div>
                  <span class="text-xs text-slate-500">/person</span>
                </div>
                <button 
                  @click="viewPackage(pkg)"
                  class="px-6 py-3 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-all" 
                  style="background: linear-gradient(90deg, #6366f1, #4f46e5);"
                >
                  View Package
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Why Choose Section -->
    <section class="py-16 px-4 bg-gradient-to-br from-indigo-600 to-indigo-800">
      <div class="max-w-6xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-white mb-12">Why Book Packages with NusaTrip?</h2>
        <div class="grid md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
              <i class="fa-solid fa-piggy-bank text-2xl text-white"></i>
            </div>
            <h3 class="font-semibold text-white mb-2">Save Up to 40%</h3>
            <p class="text-indigo-200 text-sm">Bundle deals beat booking separately</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
              <i class="fa-solid fa-shield-check text-2xl text-white"></i>
            </div>
            <h3 class="font-semibold text-white mb-2">Best Price Guarantee</h3>
            <p class="text-indigo-200 text-sm">Find it cheaper? We'll match it</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
              <i class="fa-solid fa-headset text-2xl text-white"></i>
            </div>
            <h3 class="font-semibold text-white mb-2">24/7 Support</h3>
            <p class="text-indigo-200 text-sm">Expert help whenever you need</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
              <i class="fa-solid fa-rotate-left text-2xl text-white"></i>
            </div>
            <h3 class="font-semibold text-white mb-2">Free Cancellation</h3>
            <p class="text-indigo-200 text-sm">Flexible bookings on select packages</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.text-indigo-300 { color: #a5b4fc; }
.text-indigo-600 { color: #4f46e5; }
.text-indigo-700 { color: #4338ca; }
.bg-indigo-100 { background-color: #e0e7ff; }
.bg-indigo-500 { background-color: #6366f1; }
.bg-coral-500 { background-color: #FF5A5F; }
.from-indigo-500 { --tw-gradient-from: #6366f1; }
.to-indigo-600 { --tw-gradient-to: #4f46e5; }
.focus\:border-indigo-500:focus { border-color: #6366f1; }
.focus\:ring-indigo-500\/20:focus { --tw-ring-color: rgba(99, 102, 241, 0.2); }
</style>
