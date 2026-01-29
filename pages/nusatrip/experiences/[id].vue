<script setup lang="ts">
import { ref, computed } from 'vue';

definePageMeta({ layout: 'nusatrip' });

const route = useRoute();
const router = useRouter();
const expId = route.params.id as string;

const allExperiences = [
  { id: '1', title: 'Sunrise Mount Batur Trek', category: 'adventure', location: 'Kintamani, Bali', image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800', rating: 4.9, reviews: 2340, duration: '6 hours', groupSize: 'Up to 15', price: 450000, host: { name: 'Made Wirawan', avatar: 'https://i.pravatar.cc/40?img=11' }, description: 'Trek to the summit for an unforgettable sunrise experience.', includes: ['Hotel pickup', 'Breakfast', 'Water', 'Flashlight', 'Guide'] },
  { id: '2', title: 'Balinese Cooking Class', category: 'food', location: 'Ubud, Bali', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', rating: 4.8, reviews: 1560, duration: '4 hours', groupSize: 'Up to 8', price: 550000, host: { name: 'Wayan Sari', avatar: 'https://i.pravatar.cc/40?img=21' }, description: 'Learn to cook authentic Balinese dishes.', includes: ['Market tour', 'Ingredients', 'Recipe book', 'Lunch'] },
  { id: '3', title: 'Traditional Spa & Massage', category: 'wellness', location: 'Seminyak, Bali', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800', rating: 4.9, reviews: 890, duration: '2 hours', groupSize: 'Private', price: 750000, host: { name: 'Spa Wellness', avatar: 'https://i.pravatar.cc/40?img=31' }, description: 'Traditional Balinese spa with aromatherapy.', includes: ['Welcome drink', 'Body scrub', 'Massage', 'Tea'] },
  { id: '4', title: 'Temple & Rice Terrace Tour', category: 'culture', location: 'Ubud, Bali', image: 'https://images.unsplash.com/photo-1558005137-d9619a5c539f?w=800', rating: 4.7, reviews: 1230, duration: '8 hours', groupSize: 'Up to 10', price: 650000, host: { name: 'Ketut', avatar: 'https://i.pravatar.cc/40?img=41' }, description: 'Explore temples and Tegalalang Rice Terraces.', includes: ['Transport', 'Entrance fees', 'Sarong', 'Lunch'] },
  { id: '5', title: 'Surfing Lesson Canggu', category: 'adventure', location: 'Canggu, Bali', image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800', rating: 4.8, reviews: 567, duration: '2 hours', groupSize: 'Up to 4', price: 400000, host: { name: 'Surf School', avatar: 'https://i.pravatar.cc/40?img=51' }, description: 'Learn to surf on the famous waves.', includes: ['Surfboard', 'Rash guard', 'Insurance', 'Photos'] },
  { id: '6', title: 'Snorkeling Blue Lagoon', category: 'adventure', location: 'Padang Bai, Bali', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', rating: 4.6, reviews: 432, duration: '5 hours', groupSize: 'Up to 12', price: 580000, host: { name: 'Dive Center', avatar: 'https://i.pravatar.cc/40?img=61' }, description: 'Discover the vibrant underwater world.', includes: ['Transport', 'Equipment', 'Lunch', 'Insurance'] },
];

const experience = computed(() => allExperiences.find(e => e.id === expId) || allExperiences[0]);

const booking = ref({ date: '', participants: 1, fullName: '', email: '', phone: '' });
const isBooking = ref(false);
const bookingComplete = ref(false);
const bookingRef = ref('');

useHead({ title: computed(() => `${experience.value.title} | NusaTrip`) });

const totalPrice = computed(() => experience.value.price * booking.value.participants);
const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

const confirmBooking = async () => {
  if (!booking.value.fullName || !booking.value.email || !booking.value.date) { alert('Please fill in all fields'); return; }
  isBooking.value = true;
  await new Promise(r => setTimeout(r, 1500));
  bookingRef.value = 'NT-EX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  bookingComplete.value = true;
  isBooking.value = false;
};

const goBack = () => router.push('/nusatrip/experiences');
</script>

<template>
  <div class="pt-20 min-h-screen bg-slate-50">
    <section class="relative h-64 md:h-80">
      <img :src="experience.image" :alt="experience.title" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 p-6">
        <div class="max-w-4xl mx-auto">
          <button @click="goBack" class="text-white/80 hover:text-white mb-3 flex items-center gap-2"><i class="fa-solid fa-arrow-left"></i> Back</button>
          <span class="px-3 py-1 bg-purple-600 text-white text-sm rounded-full mb-3 inline-block capitalize">{{ experience.category }}</span>
          <h1 class="text-2xl md:text-4xl font-bold text-white">{{ experience.title }}</h1>
          <p class="text-white/80"><i class="fa-solid fa-location-dot mr-2"></i>{{ experience.location }}</p>
        </div>
      </div>
    </section>

    <div class="max-w-4xl mx-auto px-4 py-8">
      <div v-if="bookingComplete" class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"><i class="fa-solid fa-check text-4xl text-green-500"></i></div>
        <h2 class="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
        <div class="bg-slate-50 rounded-xl p-4 mb-6 inline-block"><p class="text-sm text-slate-500">Reference</p><p class="text-2xl font-bold text-purple-600">{{ bookingRef }}</p></div>
        <p class="text-sm text-slate-500 mb-6">Confirmation sent to {{ booking.email }}</p>
        <button @click="goBack" class="px-6 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-purple-600">Explore More</button>
      </div>

      <div v-else class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <img :src="experience.host.avatar" class="w-12 h-12 rounded-full" />
                <div><p class="text-sm text-slate-500">Hosted by</p><p class="font-medium">{{ experience.host.name }}</p></div>
              </div>
              <div class="flex items-center gap-2"><i class="fa-solid fa-star text-yellow-400"></i><span class="font-bold">{{ experience.rating }}</span><span class="text-slate-500">({{ experience.reviews }})</span></div>
            </div>
            <div class="flex gap-6 text-sm text-slate-600 mb-4"><span><i class="fa-regular fa-clock mr-2"></i>{{ experience.duration }}</span><span><i class="fa-solid fa-users mr-2"></i>{{ experience.groupSize }}</span></div>
            <p class="text-slate-600">{{ experience.description }}</p>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="font-bold text-lg text-slate-900 mb-4">What's Included</h2>
            <div class="grid grid-cols-2 gap-3"><div v-for="item in experience.includes" :key="item" class="flex items-center gap-2 text-slate-600"><i class="fa-solid fa-check text-green-500"></i>{{ item }}</div></div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="font-bold text-lg text-slate-900 mb-4">Booking Details</h2>
            <div class="grid md:grid-cols-2 gap-4">
              <div><label class="block text-sm text-slate-600 mb-2">Date</label><input v-model="booking.date" type="date" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
              <div><label class="block text-sm text-slate-600 mb-2">Participants</label><div class="flex items-center gap-3"><button @click="booking.participants = Math.max(1, booking.participants - 1)" class="w-12 h-12 rounded-xl border flex items-center justify-center"><i class="fa-solid fa-minus"></i></button><span class="text-xl font-bold w-12 text-center">{{ booking.participants }}</span><button @click="booking.participants++" class="w-12 h-12 rounded-xl border flex items-center justify-center"><i class="fa-solid fa-plus"></i></button></div></div>
              <div class="md:col-span-2"><label class="block text-sm text-slate-600 mb-2">Full Name</label><input v-model="booking.fullName" type="text" placeholder="John Doe" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
              <div><label class="block text-sm text-slate-600 mb-2">Email</label><input v-model="booking.email" type="email" placeholder="john@example.com" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
              <div><label class="block text-sm text-slate-600 mb-2">Phone</label><input v-model="booking.phone" type="tel" placeholder="+62 812 3456 7890" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <div class="text-center mb-4"><span class="text-slate-500 text-sm">From</span><div class="text-3xl font-bold text-purple-600">{{ formatPrice(experience.price) }}</div><span class="text-slate-500 text-sm">/person</span></div>
            <div class="space-y-3 mb-4 border-t pt-4"><div class="flex justify-between text-slate-600"><span>{{ booking.participants }} person(s)</span><span>{{ formatPrice(totalPrice) }}</span></div><div class="border-t pt-3 flex justify-between font-bold text-lg"><span>Total</span><span class="text-purple-600">{{ formatPrice(totalPrice) }}</span></div></div>
            <button @click="confirmBooking" :disabled="isBooking" class="w-full py-4 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600"><i v-if="isBooking" class="fa-solid fa-spinner fa-spin"></i>{{ isBooking ? 'Processing...' : 'Book Now' }}</button>
            <p class="text-xs text-slate-500 text-center mt-4"><i class="fa-solid fa-shield-check mr-1"></i>Free cancellation 48h before</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>.text-purple-600 { color: #9333ea; }.bg-purple-600 { background-color: #9333ea; }</style>
