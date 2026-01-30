<script setup lang="ts">
import { ref, reactive } from 'vue';

definePageMeta({
  layout: 'nusatrip',
});

useHead({
  title: 'Hotel Booking - Best Rates Guaranteed | NusaTrip',
  meta: [
    { name: 'description', content: 'Book hotels at the lowest prices. From luxury resorts to budget stays, find your perfect accommodation.' },
  ],
});

const isSearching = ref(false);

const form = reactive({
  destination: '',
  checkIn: '',
  checkOut: '',
  rooms: 1,
  guests: 2,
});

// Demo hotel results
const hotels = ref([
  { id: '1', name: 'The Mulia Bali', location: 'Nusa Dua, Bali', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', rating: 4.9, reviews: 1250, stars: 5, price: 4500000, amenities: ['Pool', 'Spa', 'Beach', 'WiFi'], discount: 30 },
  { id: '2', name: 'Alila Ubud', location: 'Ubud, Bali', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', rating: 4.8, reviews: 890, stars: 5, price: 3200000, amenities: ['Pool', 'Spa', 'Restaurant', 'View'], discount: 0 },
  { id: '3', name: 'COMO Uma Canggu', location: 'Canggu, Bali', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', rating: 4.7, reviews: 654, stars: 4, price: 2800000, amenities: ['Pool', 'Surf', 'Gym', 'WiFi'], discount: 15 },
  { id: '4', name: 'Potato Head Suites', location: 'Seminyak, Bali', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', rating: 4.6, reviews: 432, stars: 4, price: 2100000, amenities: ['Pool', 'Beach', 'Bar', 'Restaurant'], discount: 20 },
  { id: '5', name: 'Kayumanis Nusa Dua', location: 'Nusa Dua, Bali', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', rating: 4.9, reviews: 567, stars: 5, price: 5500000, amenities: ['Villa', 'Pool', 'Spa', 'Beach'], discount: 0 },
]);

const handleSearch = async () => {
  isSearching.value = true;
  await new Promise(resolve => setTimeout(resolve, 800));
  isSearching.value = false;
};

const viewDeal = (hotel: any) => {
  navigateTo(`/nusatrip/hotels/${hotel.id}`);
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
};
</script>

<template>
  <div class="pt-20 min-h-screen bg-slate-50">
    <!-- Hero Search Section -->
    <section class="bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 py-12 px-4">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
          <i class="fa-solid fa-hotel mr-3 text-teal-300"></i>
          Find Your Perfect Stay
        </h1>
        <p class="text-teal-100/80 mb-8">Discover amazing hotels at the best prices</p>

        <!-- Search Card -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <div class="grid md:grid-cols-5 gap-4">
            <div class="md:col-span-2 relative">
              <label class="block text-xs font-medium text-slate-500 mb-1">Destination</label>
              <input 
                v-model="form.destination"
                type="text" 
                placeholder="Bali, Indonesia"
                class="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
              />
              <i class="fa-solid fa-location-dot absolute left-4 top-9 text-slate-400"></i>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Check-in</label>
              <input 
                v-model="form.checkIn"
                type="date" 
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
              />
            </div>
            
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Check-out</label>
              <input 
                v-model="form.checkOut"
                type="date" 
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
              />
            </div>
            
            <button 
              @click="handleSearch"
              :disabled="isSearching"
              class="text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:scale-[1.02] transition-all mt-5 flex items-center justify-center gap-2 disabled:opacity-50" 
              style="background: linear-gradient(90deg, #14b8a6, #0d9488);"
            >
              <i v-if="isSearching" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-magnifying-glass"></i>
              {{ isSearching ? 'Searching...' : 'Search' }}
            </button>
          </div>

          <!-- Options Row -->
          <div class="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100">
            <div class="flex items-center gap-2 text-sm text-slate-600">
              <i class="fa-solid fa-door-open text-slate-400"></i>
              <span class="font-medium">{{ form.rooms }}</span> Room
            </div>
            <div class="flex items-center gap-2 text-sm text-slate-600">
              <i class="fa-solid fa-user text-slate-400"></i>
              <span class="font-medium">{{ form.guests }}</span> Guests
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Results Section -->
    <section class="py-8 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Filters Sidebar -->
          <aside class="lg:w-64 shrink-0">
            <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 class="font-bold text-slate-900 mb-4">Filters</h3>
              
              <!-- Star Rating -->
              <div class="mb-6">
                <h4 class="text-sm font-medium text-slate-700 mb-3">Star Rating</h4>
                <div class="flex gap-2">
                  <button v-for="star in [5, 4, 3]" :key="star" class="px-3 py-1.5 rounded-lg border border-slate-200 text-sm hover:border-teal-500 hover:bg-teal-50 transition-colors">
                    {{ star }} <i class="fa-solid fa-star text-yellow-400 text-xs"></i>
                  </button>
                </div>
              </div>

              <!-- Amenities -->
              <div class="mb-6">
                <h4 class="text-sm font-medium text-slate-700 mb-3">Amenities</h4>
                <div class="space-y-2">
                  <label v-for="amenity in ['Pool', 'Spa', 'Beach Access', 'Free WiFi', 'Restaurant', 'Gym']" :key="amenity" class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" class="rounded text-teal-500" />
                    <span class="text-sm text-slate-600">{{ amenity }}</span>
                  </label>
                </div>
              </div>

              <!-- Price Range -->
              <div>
                <h4 class="text-sm font-medium text-slate-700 mb-3">Price/Night</h4>
                <input type="range" min="0" max="10000000" class="w-full accent-teal-500" />
                <div class="flex justify-between text-xs text-slate-500 mt-1">
                  <span>IDR 0</span>
                  <span>IDR 10M</span>
                </div>
              </div>
            </div>
          </aside>

          <!-- Results -->
          <div class="flex-1">
            <div class="flex items-center justify-between mb-4">
              <p class="text-slate-600">{{ hotels.length }} hotels found</p>
              <select class="px-4 py-2 rounded-lg border border-slate-200 text-sm">
                <option>Sort by: Recommended</option>
                <option>Sort by: Lowest Price</option>
                <option>Sort by: Highest Rating</option>
              </select>
            </div>

            <!-- Hotel Cards -->
            <div class="space-y-4">
              <article 
                v-for="hotel in hotels" 
                :key="hotel.id"
                class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col md:flex-row"
              >
                <!-- Image -->
                <div class="md:w-72 relative">
                  <img :src="hotel.image" :alt="hotel.name" class="w-full h-48 md:h-full object-cover" />
                  <div v-if="hotel.discount" class="absolute top-4 left-4 text-white text-sm font-bold px-3 py-1 rounded-full" style="background-color: #FF5A5F;">
                    -{{ hotel.discount }}%
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-1 p-6 flex flex-col">
                  <div class="flex-1">
                    <!-- Stars -->
                    <div class="flex gap-1 mb-2">
                      <i v-for="n in hotel.stars" :key="n" class="fa-solid fa-star text-yellow-400 text-xs"></i>
                    </div>
                    
                    <h3 class="text-xl font-bold text-slate-900 mb-1">{{ hotel.name }}</h3>
                    <p class="text-slate-500 text-sm mb-3">
                      <i class="fa-solid fa-location-dot mr-1"></i>
                      {{ hotel.location }}
                    </p>

                    <!-- Rating -->
                    <div class="flex items-center gap-2 mb-3">
                      <span class="bg-teal-500 text-white text-sm font-bold px-2 py-1 rounded">{{ hotel.rating }}</span>
                      <span class="text-sm text-slate-600">Excellent · {{ hotel.reviews }} reviews</span>
                    </div>

                    <!-- Amenities -->
                    <div class="flex flex-wrap gap-2">
                      <span v-for="amenity in hotel.amenities" :key="amenity" class="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                        {{ amenity }}
                      </span>
                    </div>
                  </div>

                  <!-- Price -->
                  <div class="mt-4 pt-4 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      <span v-if="hotel.discount" class="text-slate-400 line-through text-sm mr-2">
                        {{ formatPrice(hotel.price) }}
                      </span>
                      <div class="text-2xl font-bold text-teal-600">
                        {{ formatPrice(hotel.discount ? hotel.price * (1 - hotel.discount / 100) : hotel.price) }}
                      </div>
                      <span class="text-xs text-slate-500">/night incl. taxes</span>
                    </div>
                    <button 
                      @click="viewDeal(hotel)"
                      class="px-6 py-2.5 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-all" 
                      style="background: linear-gradient(90deg, #14b8a6, #0d9488);"
                    >
                      View Deal
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.text-teal-300 { color: #5eead4; }
.text-teal-600 { color: #0d9488; }
.bg-teal-500 { background-color: #14b8a6; }
.bg-coral-500 { background-color: #FF5A5F; }
.from-teal-500 { --tw-gradient-from: #14b8a6; }
.to-teal-600 { --tw-gradient-to: #0d9488; }
.focus\:border-teal-500:focus { border-color: #14b8a6; }
.focus\:ring-teal-500\/20:focus { --tw-ring-color: rgba(20, 184, 166, 0.2); }
.hover\:border-teal-500:hover { border-color: #14b8a6; }
.hover\:bg-teal-50:hover { background-color: #f0fdfa; }
.accent-teal-500 { accent-color: #14b8a6; }
</style>
