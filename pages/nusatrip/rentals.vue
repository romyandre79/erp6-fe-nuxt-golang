<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

definePageMeta({
  layout: 'nusatrip',
});

useHead({
  title: 'Car Rental - Easy & Affordable | NusaTrip',
  meta: [
    { name: 'description', content: 'Rent cars, motorcycles, and vans at competitive rates. Convenient pickup locations across Indonesia.' },
  ],
});

const isSearching = ref(false);

const form = reactive({
  pickupLocation: '',
  pickupDate: '',
  pickupTime: '',
  dropoffDate: '',
  dropoffTime: '',
  withDriver: false,
});

const activeCategory = ref('all');

const categories = [
  { id: 'all', name: 'All Vehicles' },
  { id: 'car', name: 'Cars' },
  { id: 'motorcycle', name: 'Motorcycles' },
  { id: 'van', name: 'Vans' },
  { id: 'luxury', name: 'Luxury' },
];

// Demo rentals
const rentals = ref([
  { id: '1', name: 'Toyota Avanza', category: 'car', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', seats: 7, transmission: 'Automatic', fuel: 'Petrol', price: 350000, provider: 'Bali Rent Car', rating: 4.8 },
  { id: '2', name: 'Honda PCX 160', category: 'motorcycle', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', seats: 2, transmission: 'Automatic', fuel: 'Petrol', price: 100000, provider: 'Scooter Bali', rating: 4.7 },
  { id: '3', name: 'Toyota Innova', category: 'car', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800', seats: 7, transmission: 'Automatic', fuel: 'Diesel', price: 550000, provider: 'Premium Cars', rating: 4.9 },
  { id: '4', name: 'Hiace Commuter', category: 'van', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800', seats: 16, transmission: 'Manual', fuel: 'Diesel', price: 850000, provider: 'Group Transport', rating: 4.6 },
  { id: '5', name: 'Mercedes E-Class', category: 'luxury', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', seats: 5, transmission: 'Automatic', fuel: 'Petrol', price: 2500000, provider: 'Luxury Rides', rating: 4.9 },
  { id: '6', name: 'Yamaha NMAX', category: 'motorcycle', image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800', seats: 2, transmission: 'Automatic', fuel: 'Petrol', price: 85000, provider: 'Scooter Bali', rating: 4.8 },
]);

const filteredRentals = computed(() => {
  if (activeCategory.value === 'all') return rentals.value;
  return rentals.value.filter(r => r.category === activeCategory.value);
});

const handleSearch = async () => {
  isSearching.value = true;
  await new Promise(resolve => setTimeout(resolve, 800));
  isSearching.value = false;
};

const rentNow = (rental: any) => {
  navigateTo(`/nusatrip/rentals/${rental.id}`);
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
};
</script>

<template>
  <div class="pt-20 min-h-screen bg-slate-50">
    <!-- Hero Search -->
    <section class="bg-gradient-to-br from-orange-500 via-orange-600 to-slate-900 py-12 px-4">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
          <i class="fa-solid fa-car mr-3 text-orange-200"></i>
          Rent a Vehicle
        </h1>
        <p class="text-orange-100/80 mb-8">Cars, motorcycles & more at best prices</p>

        <!-- Search Card -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <div class="grid md:grid-cols-6 gap-4">
            <div class="md:col-span-2 relative">
              <label class="block text-xs font-medium text-slate-500 mb-1">Pickup Location</label>
              <input 
                v-model="form.pickupLocation"
                type="text" 
                placeholder="Bali Airport (DPS)"
                class="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
              />
              <i class="fa-solid fa-location-dot absolute left-4 top-9 text-slate-400"></i>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Pickup Date</label>
              <input v-model="form.pickupDate" type="date" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 outline-none" />
            </div>
            
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Pickup Time</label>
              <input v-model="form.pickupTime" type="time" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 outline-none" />
            </div>
            
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Drop-off Date</label>
              <input v-model="form.dropoffDate" type="date" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 outline-none" />
            </div>
            
            <button 
              @click="handleSearch"
              :disabled="isSearching"
              class="text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:scale-[1.02] transition-all mt-5 flex items-center justify-center gap-2 disabled:opacity-50" 
              style="background: linear-gradient(90deg, #f97316, #ea580c);"
            >
              <i v-if="isSearching" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-magnifying-glass"></i>
              {{ isSearching ? 'Searching...' : 'Search' }}
            </button>
          </div>

          <!-- With Driver Toggle -->
          <div class="mt-4 pt-4 border-t border-slate-100">
            <label class="flex items-center gap-3 cursor-pointer">
              <input v-model="form.withDriver" type="checkbox" class="w-5 h-5 rounded text-orange-500" />
              <span class="text-sm text-slate-700">With Driver (+IDR 200,000/day)</span>
            </label>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="py-6 px-4 border-b border-slate-200 sticky top-20 bg-white/95 backdrop-blur-xl z-30">
      <div class="max-w-6xl mx-auto flex gap-3 overflow-x-auto">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          @click="activeCategory = cat.id"
          :class="[
            'px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all',
            activeCategory === cat.id 
              ? 'text-white shadow-lg' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]"
          :style="activeCategory === cat.id ? 'background-color: #f97316' : ''"
        >
          {{ cat.name }}
        </button>
      </div>
    </section>

    <!-- Results -->
    <section class="py-12 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <article 
            v-for="rental in filteredRentals" 
            :key="rental.id"
            class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
          >
            <!-- Image -->
            <div class="relative h-48 overflow-hidden bg-slate-100">
              <img :src="rental.image" :alt="rental.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <span :class="[
                'absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold uppercase',
                rental.category === 'luxury' ? 'bg-yellow-500 text-white' : 'bg-slate-800 text-white'
              ]">
                {{ rental.category }}
              </span>
            </div>

            <!-- Content -->
            <div class="p-5">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-slate-900">{{ rental.name }}</h3>
                <div class="flex items-center gap-1">
                  <i class="fa-solid fa-star text-yellow-400 text-sm"></i>
                  <span class="text-sm font-medium">{{ rental.rating }}</span>
                </div>
              </div>
              
              <p class="text-slate-500 text-sm mb-4">{{ rental.provider }}</p>

              <!-- Specs -->
              <div class="flex items-center gap-4 text-xs text-slate-500 mb-4">
                <span class="flex items-center gap-1">
                  <i class="fa-solid fa-user"></i>
                  {{ rental.seats }}
                </span>
                <span class="flex items-center gap-1">
                  <i class="fa-solid fa-gear"></i>
                  {{ rental.transmission }}
                </span>
                <span class="flex items-center gap-1">
                  <i class="fa-solid fa-gas-pump"></i>
                  {{ rental.fuel }}
                </span>
              </div>

              <!-- Price -->
              <div class="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <div class="font-bold text-orange-500 text-xl">{{ formatPrice(rental.price) }}</div>
                  <span class="text-slate-500 text-xs">/day</span>
                </div>
                <button 
                  @click="rentNow(rental)"
                  class="px-5 py-2.5 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-all" 
                  style="background: linear-gradient(90deg, #f97316, #ea580c);"
                >
                  Rent Now
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.text-orange-200 { color: #fed7aa; }
.text-orange-500 { color: #f97316; }
.bg-orange-500 { background-color: #f97316; }
.from-orange-500 { --tw-gradient-from: #f97316; }
.to-orange-600 { --tw-gradient-to: #ea580c; }
.focus\:border-orange-500:focus { border-color: #f97316; }
.focus\:ring-orange-500\/20:focus { --tw-ring-color: rgba(249, 115, 22, 0.2); }
</style>
