<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNusaTripStore } from '~/store/nusatrip';

definePageMeta({
  layout: 'nusatrip',
});

useHead({
  title: 'NusaTrip - Book Flights, Hotels & Experiences | Best Travel Deals',
  meta: [
    { name: 'description', content: "Discover amazing travel deals on flights, hotels, and experiences. Book your dream vacation with NusaTrip - Indonesia's trusted travel platform." },
    { name: 'keywords', content: 'travel, flights, hotels, vacation, Indonesia, Bali, booking, experiences, tours' },
    { property: 'og:title', content: 'NusaTrip - Book Flights, Hotels & Experiences' },
    { property: 'og:description', content: "Indonesia's trusted travel platform for flights, hotels, and experiences" },
    { property: 'og:type', content: 'website' },
  ],
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "NusaTrip",
        "url": "https://nusatrip.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://nusatrip.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      })
    }
  ]
});

const store = useNusaTripStore();
const activeTab = ref<'flights' | 'hotels' | 'experiences'>('flights');

// Demo data for destinations
const destinations = ref([
  { id: '1', name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', rating: 4.9, priceFrom: 1200000 },
  { id: '2', name: 'Raja Ampat', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=800', rating: 4.8, priceFrom: 3500000 },
  { id: '3', name: 'Yogyakarta', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800', rating: 4.7, priceFrom: 800000 },
  { id: '4', name: 'Lombok', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800', rating: 4.8, priceFrom: 1500000 },
  { id: '5', name: 'Komodo Island', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800', rating: 4.9, priceFrom: 2800000 },
  { id: '6', name: 'Labuan Bajo', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800', rating: 4.7, priceFrom: 2200000 },
]);

// Demo data for deals
const deals = ref([
  { id: '1', title: 'Jakarta to Bali', type: 'flight', discount: 25, originalPrice: 1200000, discountedPrice: 900000, image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600', expiresIn: '2h 30m' },
  { id: '2', title: 'The Mulia Resort', type: 'hotel', discount: 40, originalPrice: 5000000, discountedPrice: 3000000, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600', expiresIn: '5h 15m' },
  { id: '3', title: 'Ubud Rainforest Package', type: 'package', discount: 30, originalPrice: 8000000, discountedPrice: 5600000, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', expiresIn: '12h 45m' },
]);

// Demo categories
const categories = [
  { name: 'Beach', icon: 'fa-solid fa-umbrella-beach', color: 'from-cyan-400 to-blue-500' },
  { name: 'Mountain', icon: 'fa-solid fa-mountain-sun', color: 'from-emerald-400 to-green-600' },
  { name: 'City', icon: 'fa-solid fa-city', color: 'from-violet-400 to-purple-600' },
  { name: 'Adventure', icon: 'fa-solid fa-person-hiking', color: 'from-orange-400 to-red-500' },
  { name: 'Wellness', icon: 'fa-solid fa-spa', color: 'from-pink-400 to-rose-500' },
  { name: 'Culture', icon: 'fa-solid fa-landmark', color: 'from-amber-400 to-yellow-500' },
];

// Demo reviews
const reviews = ref([
  { id: '1', name: 'Sarah M.', avatar: 'https://i.pravatar.cc/100?img=1', rating: 5, text: 'Amazing experience booking through NusaTrip! Got great deals on my Bali trip.', trip: 'Bali Adventure' },
  { id: '2', name: 'John D.', avatar: 'https://i.pravatar.cc/100?img=3', rating: 5, text: 'The hotel recommendations were perfect. Customer service was exceptional!', trip: 'Raja Ampat Diving' },
  { id: '3', name: 'Lisa W.', avatar: 'https://i.pravatar.cc/100?img=5', rating: 5, text: 'Easy to use platform with best prices. Highly recommended for travelers!', trip: 'Yogyakarta Culture Tour' },
]);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
};
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920"
          alt="Beautiful Bali Temple"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-900"></div>
      </div>

      <!-- Floating Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-20 h-20 bg-coral-500/20 rounded-full blur-xl animate-float"></div>
        <div class="absolute top-40 right-20 w-32 h-32 bg-teal-500/20 rounded-full blur-xl animate-float-delayed"></div>
        <div class="absolute bottom-40 left-1/4 w-24 h-24 bg-yellow-500/20 rounded-full blur-xl animate-float"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Discover Paradise in
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-yellow-400"> Indonesia</span>
        </h1>
        <p class="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
          Book flights, hotels, and unique experiences across 17,000+ islands. Your adventure starts here.
        </p>

        <!-- Search Card -->
        <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 max-w-4xl mx-auto">
          <!-- Tabs -->
          <div class="flex gap-2 mb-6 p-1 bg-slate-100 rounded-2xl">
            <button 
              v-for="tab in ['flights', 'hotels', 'experiences']" 
              :key="tab"
              @click="activeTab = tab as any"
              :class="[
                'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200',
                activeTab === tab 
                  ? 'bg-white text-coral-600 shadow-lg' 
                  : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              <i :class="[
                tab === 'flights' ? 'fa-solid fa-plane' : 
                tab === 'hotels' ? 'fa-solid fa-hotel' : 'fa-solid fa-compass'
              ]"></i>
              {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
            </button>
          </div>

          <!-- Search Form - Flights -->
          <div v-if="activeTab === 'flights'" class="grid md:grid-cols-4 gap-4">
            <div class="relative">
              <label class="block text-xs font-medium text-slate-500 mb-1">From</label>
              <input 
                type="text" 
                placeholder="Jakarta (CGK)"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all"
              />
              <i class="fa-solid fa-location-dot absolute right-4 top-9 text-slate-400"></i>
            </div>
            <div class="relative">
              <label class="block text-xs font-medium text-slate-500 mb-1">To</label>
              <input 
                type="text" 
                placeholder="Bali (DPS)"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all"
              />
              <i class="fa-solid fa-location-dot absolute right-4 top-9 text-slate-400"></i>
            </div>
            <div class="relative">
              <label class="block text-xs font-medium text-slate-500 mb-1">Date</label>
              <input 
                type="date" 
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all"
              />
            </div>
            <button class="text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 mt-5" style="background: linear-gradient(90deg, #FF5A5F, #e04e52);">
              <i class="fa-solid fa-magnifying-glass"></i>
              Search
            </button>
          </div>

          <!-- Search Form - Hotels -->
          <div v-else-if="activeTab === 'hotels'" class="grid md:grid-cols-4 gap-4">
            <div class="relative md:col-span-2">
              <label class="block text-xs font-medium text-slate-500 mb-1">Destination</label>
              <input 
                type="text" 
                placeholder="Bali, Indonesia"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all"
              />
              <i class="fa-solid fa-location-dot absolute right-4 top-9 text-slate-400"></i>
            </div>
            <div class="relative">
              <label class="block text-xs font-medium text-slate-500 mb-1">Check-in / Check-out</label>
              <input 
                type="text" 
                placeholder="Select dates"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all"
              />
            </div>
            <button class="text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 mt-5" style="background: linear-gradient(90deg, #FF5A5F, #e04e52);">
              <i class="fa-solid fa-magnifying-glass"></i>
              Search
            </button>
          </div>

          <!-- Search Form - Experiences -->
          <div v-else class="grid md:grid-cols-3 gap-4">
            <div class="relative">
              <label class="block text-xs font-medium text-slate-500 mb-1">Location</label>
              <input 
                type="text" 
                placeholder="Where to explore?"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all"
              />
            </div>
            <div class="relative">
              <label class="block text-xs font-medium text-slate-500 mb-1">Category</label>
              <select class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all appearance-none bg-white">
                <option>All Categories</option>
                <option>Tours</option>
                <option>Adventures</option>
                <option>Food & Drink</option>
                <option>Wellness</option>
              </select>
            </div>
            <button class="text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 mt-5" style="background: linear-gradient(90deg, #FF5A5F, #e04e52);">
              <i class="fa-solid fa-magnifying-glass"></i>
              Explore
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-white mb-1">500+</div>
            <div class="text-white/60 text-sm">Destinations</div>
          </div>
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-white mb-1">10K+</div>
            <div class="text-white/60 text-sm">Hotels</div>
          </div>
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-white mb-1">50+</div>
            <div class="text-white/60 text-sm">Airlines</div>
          </div>
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-white mb-1">1M+</div>
            <div class="text-white/60 text-sm">Happy Travelers</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Flash Deals Section -->
    <section class="py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-2">
              <i class="fa-solid fa-bolt text-yellow-400 mr-2"></i>
              Flash Deals
            </h2>
            <p class="text-slate-400">Limited time offers you don't want to miss</p>
          </div>
          <a href="#" class="hidden sm:flex items-center gap-2 text-coral-400 hover:text-coral-300 font-semibold transition-colors">
            View All <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <article 
            v-for="deal in deals" 
            :key="deal.id"
            class="group relative bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-coral-500/50 transition-all duration-300"
          >
            <!-- Image -->
            <div class="relative h-48 overflow-hidden">
              <img :src="deal.image" :alt="deal.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              
              <!-- Discount Badge -->
              <div class="absolute top-4 left-4 bg-coral-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                -{{ deal.discount }}%
              </div>
              
              <!-- Timer -->
              <div class="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <i class="fa-solid fa-clock text-yellow-400 text-sm"></i>
                <span class="text-white text-sm font-medium">{{ deal.expiresIn }}</span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-5">
              <div class="flex items-center gap-2 mb-2">
                <span :class="[
                  'px-2 py-0.5 rounded text-xs font-medium',
                  deal.type === 'flight' ? 'bg-blue-500/20 text-blue-400' :
                  deal.type === 'hotel' ? 'bg-green-500/20 text-green-400' : 
                  'bg-purple-500/20 text-purple-400'
                ]">
                  {{ deal.type.charAt(0).toUpperCase() + deal.type.slice(1) }}
                </span>
              </div>
              <h3 class="text-lg font-semibold text-white mb-3">{{ deal.title }}</h3>
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-slate-500 line-through text-sm">{{ formatPrice(deal.originalPrice) }}</span>
                  <div class="text-coral-400 font-bold text-xl">{{ formatPrice(deal.discountedPrice) }}</div>
                </div>
                <button class="w-10 h-10 rounded-full bg-coral-500 hover:bg-coral-600 text-white flex items-center justify-center transition-colors">
                  <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Popular Destinations -->
    <section class="py-20 px-4 bg-slate-50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Popular Destinations</h2>
          <p class="text-slate-600 max-w-2xl mx-auto">Explore the most stunning places across Indonesia's beautiful archipelago</p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <article 
            v-for="dest in destinations" 
            :key="dest.id"
            class="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <!-- Image -->
            <div class="aspect-[4/3] relative overflow-hidden">
              <img :src="dest.image" :alt="dest.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            </div>

            <!-- Content -->
            <div class="absolute bottom-0 left-0 right-0 p-5">
              <div class="flex items-center gap-2 mb-2">
                <i class="fa-solid fa-star text-yellow-400 text-sm"></i>
                <span class="text-white font-medium">{{ dest.rating }}</span>
              </div>
              <h3 class="text-2xl font-bold text-white mb-1">{{ dest.name }}</h3>
              <p class="text-white/70 text-sm mb-3">{{ dest.country }}</p>
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-white/60 text-xs">Starting from</span>
                  <div class="text-white font-bold">{{ formatPrice(dest.priceFrom) }}</div>
                </div>
                <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <i class="fa-solid fa-arrow-right text-white"></i>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="py-20 px-4 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Travel Your Way</h2>
          <p class="text-slate-600">Choose your adventure style</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div 
            v-for="cat in categories" 
            :key="cat.name"
            class="group flex flex-col items-center p-6 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div :class="[
              'w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br',
              cat.color,
              'shadow-lg group-hover:scale-110 transition-transform duration-300'
            ]">
              <i :class="[cat.icon, 'text-2xl text-white']"></i>
            </div>
            <span class="font-semibold text-slate-700 group-hover:text-coral-600 transition-colors">{{ cat.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Reviews -->
    <section class="py-20 px-4 bg-gradient-to-br from-coral-500 to-coral-600">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">What Travelers Say</h2>
          <p class="text-white/80">Real experiences from our happy customers</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <article 
            v-for="review in reviews" 
            :key="review.id"
            class="bg-white rounded-2xl p-6 shadow-xl"
          >
            <div class="flex items-center gap-4 mb-4">
              <img :src="review.avatar" :alt="review.name" class="w-12 h-12 rounded-full object-cover" />
              <div>
                <div class="font-semibold text-slate-900">{{ review.name }}</div>
                <div class="text-sm text-slate-500">{{ review.trip }}</div>
              </div>
            </div>
            <div class="flex gap-1 mb-3">
              <i v-for="n in review.rating" :key="n" class="fa-solid fa-star text-yellow-400"></i>
            </div>
            <p class="text-slate-600 leading-relaxed">"{{ review.text }}"</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="py-20 px-4 bg-slate-900">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Get Exclusive Deals</h2>
        <p class="text-slate-400 mb-8">Subscribe to our newsletter and never miss a travel deal</p>
        
        <form class="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email"
            class="flex-1 px-6 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all"
          />
          <button class="px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-all duration-200" style="background: linear-gradient(90deg, #FF5A5F, #e04e52);">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Custom Colors */
.text-coral-400 { color: #ff7b7b; }
.text-coral-500 { color: #FF5A5F; }
.text-coral-600 { color: #e04e52; }
.bg-coral-500 { background-color: #FF5A5F; }
.bg-coral-600 { background-color: #e04e52; }
.from-coral-400 { --tw-gradient-from: #ff7b7b; }
.from-coral-500 { --tw-gradient-from: #FF5A5F; }
.to-coral-600 { --tw-gradient-to: #e04e52; }
.hover\:text-coral-600:hover { color: #e04e52; }
.hover\:bg-coral-600:hover { background-color: #e04e52; }
.border-coral-500 { border-color: #FF5A5F; }
.focus\:border-coral-500:focus { border-color: #FF5A5F; }
.focus\:ring-coral-500\/20:focus { --tw-ring-color: rgba(255, 90, 95, 0.2); }
.shadow-coral-500\/30 { --tw-shadow-color: rgba(255, 90, 95, 0.3); }
.shadow-coral-500\/40 { --tw-shadow-color: rgba(255, 90, 95, 0.4); }

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
  animation-delay: 1s;
}
</style>
