<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  layout: 'nusatrip',
});

useHead({
  title: 'Tours & Activities - Unique Local Experiences | NusaTrip',
  meta: [
    { name: 'description', content: 'Discover unique tours, activities, and local experiences. Create unforgettable memories with expert-led adventures.' },
  ],
});

const isSearching = ref(false);
const searchQuery = ref('');
const searchLocation = ref('');

const activeCategory = ref('all');

const categories = [
  { id: 'all', name: 'All', icon: 'fa-solid fa-globe' },
  { id: 'tours', name: 'Tours', icon: 'fa-solid fa-map-marked-alt' },
  { id: 'adventure', name: 'Adventure', icon: 'fa-solid fa-person-hiking' },
  { id: 'food', name: 'Food & Drink', icon: 'fa-solid fa-utensils' },
  { id: 'wellness', name: 'Wellness', icon: 'fa-solid fa-spa' },
  { id: 'culture', name: 'Culture', icon: 'fa-solid fa-landmark' },
];

// Demo experiences
const experiences = ref([
  { id: '1', title: 'Sunrise Mount Batur Trek', category: 'adventure', location: 'Kintamani, Bali', image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800', rating: 4.9, reviews: 2340, duration: '6 hours', groupSize: 'Up to 15', price: 450000, host: { name: 'Made Wirawan', avatar: 'https://i.pravatar.cc/40?img=11' } },
  { id: '2', title: 'Balinese Cooking Class', category: 'food', location: 'Ubud, Bali', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', rating: 4.8, reviews: 1560, duration: '4 hours', groupSize: 'Up to 8', price: 550000, host: { name: 'Wayan Sari', avatar: 'https://i.pravatar.cc/40?img=21' } },
  { id: '3', title: 'Traditional Spa & Massage', category: 'wellness', location: 'Seminyak, Bali', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800', rating: 4.9, reviews: 890, duration: '2 hours', groupSize: 'Private', price: 750000, host: { name: 'Spa Wellness', avatar: 'https://i.pravatar.cc/40?img=31' } },
  { id: '4', title: 'Temple & Rice Terrace Tour', category: 'culture', location: 'Ubud, Bali', image: 'https://images.unsplash.com/photo-1558005137-d9619a5c539f?w=800', rating: 4.7, reviews: 1230, duration: '8 hours', groupSize: 'Up to 10', price: 650000, host: { name: 'Ketut', avatar: 'https://i.pravatar.cc/40?img=41' } },
  { id: '5', title: 'Surfing Lesson Canggu', category: 'adventure', location: 'Canggu, Bali', image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800', rating: 4.8, reviews: 567, duration: '2 hours', groupSize: 'Up to 4', price: 400000, host: { name: 'Surf School', avatar: 'https://i.pravatar.cc/40?img=51' } },
  { id: '6', title: 'Snorkeling Blue Lagoon', category: 'adventure', location: 'Padang Bai, Bali', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', rating: 4.6, reviews: 432, duration: '5 hours', groupSize: 'Up to 12', price: 580000, host: { name: 'Dive Center', avatar: 'https://i.pravatar.cc/40?img=61' } },
]);

const filteredExperiences = computed(() => {
  if (activeCategory.value === 'all') return experiences.value;
  return experiences.value.filter(e => e.category === activeCategory.value);
});

const handleSearch = async () => {
  isSearching.value = true;
  await new Promise(resolve => setTimeout(resolve, 800));
  isSearching.value = false;
};

const bookExperience = (exp: any) => {
  navigateTo(`/nusatrip/experiences/${exp.id}`);
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
};
</script>

<template>
  <div class="pt-20 min-h-screen bg-slate-50">
    <!-- Hero -->
    <section class="bg-gradient-to-br from-purple-600 via-purple-700 to-slate-900 py-16 px-4 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          <i class="fa-solid fa-compass mr-3 text-purple-300"></i>
          Unforgettable Experiences
        </h1>
        <p class="text-purple-100/80 text-lg mb-8">Discover unique activities and tours led by local experts</p>
        
        <!-- Search -->
        <div class="bg-white rounded-2xl shadow-xl p-4 flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="What do you want to experience?"
              class="w-full px-4 py-4 pl-12 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
            />
            <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          </div>
          <div class="relative md:w-48">
            <input 
              v-model="searchLocation"
              type="text" 
              placeholder="Location"
              class="w-full px-4 py-4 pl-12 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
            />
            <i class="fa-solid fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          </div>
          <button 
            @click="handleSearch"
            :disabled="isSearching"
            class="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <i v-if="isSearching" class="fa-solid fa-spinner fa-spin"></i>
            {{ isSearching ? 'Searching...' : 'Search' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="py-8 px-4 border-b border-slate-200 sticky top-20 bg-white/95 backdrop-blur-xl z-30">
      <div class="max-w-6xl mx-auto flex gap-3 overflow-x-auto pb-2">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          @click="activeCategory = cat.id"
          :class="[
            'flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all',
            activeCategory === cat.id 
              ? 'bg-purple-600 text-white shadow-lg' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]"
        >
          <i :class="cat.icon"></i>
          {{ cat.name }}
        </button>
      </div>
    </section>

    <!-- Experiences Grid -->
    <section class="py-12 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <article 
            v-for="exp in filteredExperiences" 
            :key="exp.id"
            class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
            @click="bookExperience(exp)"
          >
            <!-- Image -->
            <div class="relative h-52 overflow-hidden">
              <img :src="exp.image" :alt="exp.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <button class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                <i class="fa-regular fa-heart text-slate-600"></i>
              </button>
            </div>

            <!-- Content -->
            <div class="p-5">
              <!-- Host -->
              <div class="flex items-center gap-2 mb-3">
                <img :src="exp.host.avatar" :alt="exp.host.name" class="w-6 h-6 rounded-full" />
                <span class="text-xs text-slate-500">Hosted by {{ exp.host.name }}</span>
              </div>

              <h3 class="font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">{{ exp.title }}</h3>
              
              <p class="text-slate-500 text-sm mb-3">
                <i class="fa-solid fa-location-dot mr-1"></i>
                {{ exp.location }}
              </p>

              <!-- Details -->
              <div class="flex items-center gap-4 text-xs text-slate-500 mb-4">
                <span><i class="fa-regular fa-clock mr-1"></i>{{ exp.duration }}</span>
                <span><i class="fa-solid fa-users mr-1"></i>{{ exp.groupSize }}</span>
              </div>

              <!-- Rating & Price -->
              <div class="flex items-center justify-between pt-4 border-t border-slate-100">
                <div class="flex items-center gap-1">
                  <i class="fa-solid fa-star text-yellow-400 text-sm"></i>
                  <span class="font-semibold text-slate-900">{{ exp.rating }}</span>
                  <span class="text-slate-400 text-sm">({{ exp.reviews }})</span>
                </div>
                <div class="text-right">
                  <span class="text-slate-500 text-xs">From</span>
                  <div class="font-bold text-purple-600">{{ formatPrice(exp.price) }}</div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.text-purple-300 { color: #d8b4fe; }
.text-purple-600 { color: #9333ea; }
.bg-purple-600 { background-color: #9333ea; }
.from-purple-500 { --tw-gradient-from: #a855f7; }
.from-purple-600 { --tw-gradient-from: #9333ea; }
.to-purple-600 { --tw-gradient-to: #9333ea; }
.focus\:border-purple-500:focus { border-color: #a855f7; }
.focus\:ring-purple-500\/20:focus { --tw-ring-color: rgba(168, 85, 247, 0.2); }
.hover\:text-purple-600:hover { color: #9333ea; }
</style>
