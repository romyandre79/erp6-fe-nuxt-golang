<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

definePageMeta({
  layout: 'nusatrip',
});

useHead({
  title: 'Cheap Flights & Airline Tickets | NusaTrip',
  meta: [
    { name: 'description', content: 'Compare and book cheap flights to destinations worldwide. Find the best airline deals with flexible booking options.' },
  ],
});

const tripType = ref<'oneway' | 'roundtrip' | 'multicity'>('roundtrip');
const cabinClass = ref('economy');
const isSearching = ref(false);
const hasSearched = ref(false);
const sortBy = ref('price');
const selectedFlight = ref<string | null>(null);

// Filters
const filters = reactive({
  nonStop: true,
  oneStop: true,
  multiStop: false,
  airlines: ['Garuda Indonesia', 'Lion Air', 'Batik Air', 'Citilink', 'Singapore Airlines'],
  maxPrice: 5000000,
});

const form = reactive({
  origin: '',
  destination: '',
  departDate: '',
  returnDate: '',
  passengers: { adults: 1, children: 0, infants: 0 },
});

// All available flights (demo data)
const allFlights = ref([
  { id: '1', airline: 'Garuda Indonesia', logo: '🇮🇩', origin: 'CGK', originCity: 'Jakarta', destination: 'DPS', destCity: 'Bali', departTime: '06:00', arriveTime: '08:30', duration: '1h 30m', stops: 0, price: 1250000, class: 'Economy' },
  { id: '2', airline: 'Lion Air', logo: '🦁', origin: 'CGK', originCity: 'Jakarta', destination: 'DPS', destCity: 'Bali', departTime: '08:15', arriveTime: '10:45', duration: '1h 30m', stops: 0, price: 850000, class: 'Economy' },
  { id: '3', airline: 'Batik Air', logo: '🎨', origin: 'CGK', originCity: 'Jakarta', destination: 'DPS', destCity: 'Bali', departTime: '10:30', arriveTime: '13:15', duration: '1h 45m', stops: 1, price: 950000, class: 'Economy' },
  { id: '4', airline: 'Citilink', logo: '✈️', origin: 'CGK', originCity: 'Jakarta', destination: 'DPS', destCity: 'Bali', departTime: '14:00', arriveTime: '16:30', duration: '1h 30m', stops: 0, price: 780000, class: 'Economy' },
  { id: '5', airline: 'Singapore Airlines', logo: '🇸🇬', origin: 'CGK', originCity: 'Jakarta', destination: 'DPS', destCity: 'Bali', departTime: '16:45', arriveTime: '19:30', duration: '1h 45m', stops: 1, price: 2100000, class: 'Business' },
  { id: '6', airline: 'Garuda Indonesia', logo: '🇮🇩', origin: 'CGK', originCity: 'Jakarta', destination: 'JOG', destCity: 'Yogyakarta', departTime: '07:00', arriveTime: '08:15', duration: '1h 15m', stops: 0, price: 650000, class: 'Economy' },
  { id: '7', airline: 'Lion Air', logo: '🦁', origin: 'DPS', originCity: 'Bali', destination: 'CGK', destCity: 'Jakarta', departTime: '17:00', arriveTime: '17:30', duration: '1h 30m', stops: 0, price: 890000, class: 'Economy' },
  { id: '8', airline: 'AirAsia', logo: '❤️', origin: 'CGK', originCity: 'Jakarta', destination: 'DPS', destCity: 'Bali', departTime: '20:00', arriveTime: '22:30', duration: '1h 30m', stops: 0, price: 720000, class: 'Economy' },
]);

// Filtered and sorted flights
const flights = computed(() => {
  let result = [...allFlights.value];
  
  // Filter by stops
  result = result.filter(f => {
    if (f.stops === 0 && filters.nonStop) return true;
    if (f.stops === 1 && filters.oneStop) return true;
    if (f.stops > 1 && filters.multiStop) return true;
    return false;
  });
  
  // Filter by airlines
  result = result.filter(f => filters.airlines.includes(f.airline));
  
  // Filter by max price
  result = result.filter(f => f.price <= filters.maxPrice);
  
  // Filter by origin/destination if searching
  if (hasSearched.value) {
    if (form.origin) {
      const origin = form.origin.toLowerCase();
      result = result.filter(f => 
        f.origin.toLowerCase().includes(origin) || 
        f.originCity.toLowerCase().includes(origin)
      );
    }
    if (form.destination) {
      const dest = form.destination.toLowerCase();
      result = result.filter(f => 
        f.destination.toLowerCase().includes(dest) || 
        f.destCity.toLowerCase().includes(dest)
      );
    }
  }
  
  // Sort
  if (sortBy.value === 'price') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === 'duration') {
    result.sort((a, b) => a.duration.localeCompare(b.duration));
  } else if (sortBy.value === 'departure') {
    result.sort((a, b) => a.departTime.localeCompare(b.departTime));
  }
  
  return result;
});

const handleSearch = async () => {
  isSearching.value = true;
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  hasSearched.value = true;
  isSearching.value = false;
};

const selectFlight = (flightId: string) => {
  navigateTo(`/nusatrip/flights/${flightId}`);
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
};

// Get unique airlines from all flights
const availableAirlines = computed(() => {
  const airlines = new Set(allFlights.value.map(f => f.airline));
  return Array.from(airlines).sort();
});

// Toggle airline in filter
const toggleAirline = (airline: string) => {
  const index = filters.airlines.indexOf(airline);
  if (index >= 0) {
    filters.airlines.splice(index, 1);
  } else {
    filters.airlines.push(airline);
  }
};
</script>

<template>
  <div class="pt-20 min-h-screen bg-slate-50">
    <!-- Hero Search Section -->
    <section class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
          <i class="fa-solid fa-plane mr-3 text-coral-400"></i>
          Search Flights
        </h1>
        <p class="text-slate-400 mb-8">Find the best deals on flights to any destination</p>

        <!-- Search Card -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <!-- Trip Type -->
          <div class="flex gap-4 mb-6">
            <button 
              v-for="type in [{ value: 'oneway', label: 'One-way' }, { value: 'roundtrip', label: 'Round-trip' }, { value: 'multicity', label: 'Multi-city' }]"
              :key="type.value"
              @click="tripType = type.value as any"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                tripType === type.value 
                  ? 'text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              ]"
              :style="tripType === type.value ? 'background-color: #FF5A5F' : ''"
            >
              {{ type.label }}
            </button>
          </div>

          <!-- Search Form -->
          <div class="grid md:grid-cols-5 gap-4">
            <div class="relative">
              <label class="block text-xs font-medium text-slate-500 mb-1">From</label>
              <input 
                v-model="form.origin"
                type="text" 
                placeholder="Jakarta (CGK)"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none"
              />
            </div>
            
            <div class="relative">
              <label class="block text-xs font-medium text-slate-500 mb-1">To</label>
              <input 
                v-model="form.destination"
                type="text" 
                placeholder="Bali (DPS)"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none"
              />
            </div>
            
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Departure</label>
              <input 
                v-model="form.departDate"
                type="date" 
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none"
              />
            </div>
            
            <div v-if="tripType === 'roundtrip'">
              <label class="block text-xs font-medium text-slate-500 mb-1">Return</label>
              <input 
                v-model="form.returnDate"
                type="date" 
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none"
              />
            </div>
            
            <button 
              @click="handleSearch"
              :disabled="isSearching"
              class="text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:scale-[1.02] transition-all mt-5 flex items-center justify-center gap-2 disabled:opacity-50" 
              style="background: linear-gradient(90deg, #FF5A5F, #e04e52);"
            >
              <i v-if="isSearching" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-magnifying-glass"></i>
              {{ isSearching ? 'Searching...' : 'Search' }}
            </button>
          </div>

          <!-- Options Row -->
          <div class="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100">
            <select v-model="cabinClass" class="px-4 py-2 rounded-lg border border-slate-200 text-sm">
              <option value="economy">Economy</option>
              <option value="premium">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
            <div class="text-sm text-slate-600">
              <span class="font-medium">{{ form.passengers.adults }}</span> Adult
              <span v-if="form.passengers.children">, <span class="font-medium">{{ form.passengers.children }}</span> Child</span>
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
              
              <!-- Stops -->
              <div class="mb-6">
                <h4 class="text-sm font-medium text-slate-700 mb-3">Stops</h4>
                <div class="space-y-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="filters.nonStop" class="rounded" style="accent-color: #FF5A5F;" />
                    <span class="text-sm text-slate-600">Non-stop</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="filters.oneStop" class="rounded" style="accent-color: #FF5A5F;" />
                    <span class="text-sm text-slate-600">1 Stop</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="filters.multiStop" class="rounded" style="accent-color: #FF5A5F;" />
                    <span class="text-sm text-slate-600">2+ Stops</span>
                  </label>
                </div>
              </div>

              <!-- Airlines -->
              <div class="mb-6">
                <h4 class="text-sm font-medium text-slate-700 mb-3">Airlines</h4>
                <div class="space-y-2">
                  <label v-for="airline in availableAirlines" :key="airline" class="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      :checked="filters.airlines.includes(airline)" 
                      @change="toggleAirline(airline)"
                      class="rounded" 
                      style="accent-color: #FF5A5F;" 
                    />
                    <span class="text-sm text-slate-600">{{ airline }}</span>
                  </label>
                </div>
              </div>

              <!-- Price Range -->
              <div>
                <h4 class="text-sm font-medium text-slate-700 mb-3">Max Price: {{ formatPrice(filters.maxPrice) }}</h4>
                <input type="range" v-model="filters.maxPrice" min="500000" max="5000000" step="100000" class="w-full" style="accent-color: #FF5A5F;" />
                <div class="flex justify-between text-xs text-slate-500 mt-1">
                  <span>IDR 500K</span>
                  <span>IDR 5M</span>
                </div>
              </div>
            </div>
          </aside>

            <!-- Results -->
            <div class="flex-1 space-y-4">
              <div class="flex items-center justify-between mb-4">
                <p class="text-slate-600">{{ flights.length }} flights found</p>
                <select v-model="sortBy" class="px-4 py-2 rounded-lg border border-slate-200 text-sm">
                  <option value="price">Sort by: Lowest Price</option>
                  <option value="duration">Sort by: Shortest Duration</option>
                  <option value="departure">Sort by: Earliest Departure</option>
                </select>
              </div>

            <!-- Flight Cards -->
            <article 
              v-for="flight in flights" 
              :key="flight.id"
              class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div class="flex flex-col md:flex-row md:items-center gap-6">
                <!-- Airline Info -->
                <div class="flex items-center gap-4 md:w-40">
                  <span class="text-3xl">{{ flight.logo }}</span>
                  <div>
                    <div class="font-semibold text-slate-900">{{ flight.airline }}</div>
                    <div class="text-sm text-slate-500">{{ flight.class }}</div>
                  </div>
                </div>

                <!-- Flight Times -->
                <div class="flex-1 flex items-center gap-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-slate-900">{{ flight.departTime }}</div>
                    <div class="text-sm text-slate-500">{{ flight.origin }}</div>
                  </div>
                  
                  <div class="flex-1 flex flex-col items-center">
                    <div class="text-xs text-slate-500 mb-1">{{ flight.duration }}</div>
                    <div class="w-full flex items-center gap-2">
                      <div class="h-px flex-1 bg-slate-300"></div>
                      <i class="fa-solid fa-plane text-coral-500 text-xs"></i>
                      <div class="h-px flex-1 bg-slate-300"></div>
                    </div>
                    <div class="text-xs mt-1" :class="flight.stops === 0 ? 'text-green-600' : 'text-orange-500'">
                      {{ flight.stops === 0 ? 'Direct' : flight.stops + ' Stop' }}
                    </div>
                  </div>
                  
                  <div class="text-center">
                    <div class="text-2xl font-bold text-slate-900">{{ flight.arriveTime }}</div>
                    <div class="text-sm text-slate-500">{{ flight.destination }}</div>
                  </div>
                </div>

                <!-- Price & Book -->
                <div class="md:w-48 flex flex-col items-end gap-2">
                  <div class="text-2xl font-bold" style="color: #FF5A5F;">{{ formatPrice(flight.price) }}</div>
                  <div class="text-xs text-slate-500">/person</div>
                  <button 
                    @click="selectFlight(flight.id)"
                    class="w-full md:w-auto px-6 py-2.5 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-all" 
                    style="background: linear-gradient(90deg, #FF5A5F, #e04e52);"
                  >
                    Select
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.text-coral-400 { color: #ff7b7b; }
.text-coral-500 { color: #FF5A5F; }
.bg-coral-500 { background-color: #FF5A5F; }
.from-coral-500 { --tw-gradient-from: #FF5A5F; }
.to-coral-600 { --tw-gradient-to: #e04e52; }
.focus\:border-coral-500:focus { border-color: #FF5A5F; }
.focus\:ring-coral-500\/20:focus { --tw-ring-color: rgba(255, 90, 95, 0.2); }
.accent-coral-500 { accent-color: #FF5A5F; }
</style>
