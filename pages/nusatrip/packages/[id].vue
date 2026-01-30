<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useNusaTripStore } from '~/store/nusatrip';

definePageMeta({ layout: 'nusatrip' });

const route = useRoute();
const router = useRouter();
const store = useNusaTripStore();
const pkgId = route.params.id as string;

const allPackages = [
  { id: '1', title: '5D4N Bali Paradise', destination: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', rating: 4.9, reviews: 1250, originalPrice: 12000000, price: 8500000, includes: ['Flights', '4-Star Hotel', 'Breakfast', 'Airport Transfer', 'Tour Guide'], highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Kuta Beach', 'Spa Treatment'], duration: '5 Days 4 Nights', description: 'Experience the best of Bali with this all-inclusive package.' },
  { id: '2', title: '4D3N Raja Ampat Diving', destination: 'Raja Ampat', image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=800', rating: 4.8, reviews: 567, originalPrice: 18000000, price: 14500000, includes: ['Flights', 'Resort', 'All Meals', 'Diving Equipment', 'Boat Tours'], highlights: ['3 Dive Sites', 'Snorkeling', 'Island Hopping', 'Sunset Cruise'], duration: '4 Days 3 Nights', description: 'Explore the underwater paradise of Raja Ampat.' },
  { id: '3', title: '3D2N Yogyakarta Heritage', destination: 'Yogyakarta', image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800', rating: 4.7, reviews: 890, originalPrice: 5500000, price: 4200000, includes: ['Flights', '3-Star Hotel', 'Breakfast', 'Transport', 'Entrance Fees'], highlights: ['Borobudur', 'Prambanan', 'Malioboro', 'Batik Workshop'], duration: '3 Days 2 Nights', description: 'Discover the cultural heart of Java.' },
  { id: '4', title: '6D5N Lombok Adventure', destination: 'Lombok', image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800', rating: 4.8, reviews: 432, originalPrice: 15000000, price: 11000000, includes: ['Flights', 'Beach Resort', 'All Meals', 'Activities', 'Guide'], highlights: ['Mount Rinjani', 'Gili Islands', 'Pink Beach', 'Sasak Village'], duration: '6 Days 5 Nights', description: 'Adventure awaits in beautiful Lombok.' },
];

const pkg = computed(() => allPackages.find(p => p.id === pkgId) || allPackages[0]);
const discount = computed(() => Math.round((1 - pkg.value.price / pkg.value.originalPrice) * 100));

const booking = ref({ departDate: '', travelers: 2, fullName: '', email: '', phone: '' });
const isBooking = ref(false);
const bookingComplete = ref(false);
const bookingRef = ref('');

useHead({ title: computed(() => `${pkg.value.title} | NusaTrip Packages`) });

// Prefill user data if logged in
const prefillUserData = () => {
  if (store.isAuthenticated && store.user) {
    booking.value.fullName = store.user.fullname || '';
    booking.value.email = store.user.email || '';
    booking.value.phone = store.user.phone || '';
  }
};

onMounted(() => {
  prefillUserData();
});

watch(() => store.isAuthenticated, (newVal) => {
  if (newVal) prefillUserData();
});

const totalPrice = computed(() => pkg.value.price * booking.value.travelers);
const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

const confirmBooking = async () => {
  // Check if user is logged in
  if (!store.isAuthenticated) {
    store.setRedirectUrl(route.fullPath);
    router.push('/nusatrip/login');
    return;
  }

  if (!booking.value.fullName || !booking.value.email || !booking.value.departDate) { alert('Please fill in all fields'); return; }
  isBooking.value = true;
  await new Promise(r => setTimeout(r, 1500));
  bookingRef.value = 'NT-PK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  bookingComplete.value = true;
  isBooking.value = false;
};

const goBack = () => router.push('/nusatrip/packages');
</script>

<template>
  <div class="pt-20 min-h-screen bg-slate-50">
    <section class="relative h-64 md:h-80">
      <img :src="pkg.image" :alt="pkg.title" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
      <div class="absolute top-24 left-6 px-3 py-1 text-white text-sm font-bold rounded-full" style="background-color: #FF5A5F;">Save {{ discount }}%</div>
      <div class="absolute bottom-0 left-0 right-0 p-6">
        <div class="max-w-4xl mx-auto">
          <button @click="goBack" class="text-white/80 hover:text-white mb-3 flex items-center gap-2"><i class="fa-solid fa-arrow-left"></i> Back</button>
          <div class="flex items-center gap-2 mb-2"><i class="fa-regular fa-clock text-indigo-300"></i><span class="text-white/80">{{ pkg.duration }}</span></div>
          <h1 class="text-2xl md:text-4xl font-bold text-white">{{ pkg.title }}</h1>
          <p class="text-white/80"><i class="fa-solid fa-location-dot mr-2"></i>{{ pkg.destination }}, Indonesia</p>
        </div>
      </div>
    </section>

    <div class="max-w-4xl mx-auto px-4 py-8">
      <div v-if="bookingComplete" class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"><i class="fa-solid fa-check text-4xl text-green-500"></i></div>
        <h2 class="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
        <div class="bg-slate-50 rounded-xl p-4 mb-6 inline-block"><p class="text-sm text-slate-500">Reference</p><p class="text-2xl font-bold text-indigo-600">{{ bookingRef }}</p></div>
        <p class="text-sm text-slate-500 mb-6">Confirmation sent to {{ booking.email }}</p>
        <button @click="goBack" class="px-6 py-3 text-white font-semibold rounded-xl" style="background: linear-gradient(90deg, #6366f1, #4f46e5);">Explore More Packages</button>
      </div>

      <div v-else class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center gap-4 mb-4"><div class="bg-indigo-100 px-3 py-1 rounded-lg flex items-center gap-1"><i class="fa-solid fa-star text-yellow-400"></i><span class="font-bold text-indigo-700">{{ pkg.rating }}</span><span class="text-indigo-400">({{ pkg.reviews }})</span></div></div>
            <p class="text-slate-600 mb-4">{{ pkg.description }}</p>
            <h3 class="font-bold text-slate-900 mb-3">What's Included</h3>
            <div class="flex flex-wrap gap-2 mb-4"><span v-for="item in pkg.includes" :key="item" class="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full"><i class="fa-solid fa-check text-green-500"></i>{{ item }}</span></div>
            <h3 class="font-bold text-slate-900 mb-3">Highlights</h3>
            <div class="flex flex-wrap gap-2"><span v-for="item in pkg.highlights" :key="item" class="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">{{ item }}</span></div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="font-bold text-lg text-slate-900 mb-4">Booking Details</h2>
            <div class="grid md:grid-cols-2 gap-4">
              <div><label class="block text-sm text-slate-600 mb-2">Departure Date</label><input v-model="booking.departDate" type="date" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
              <div><label class="block text-sm text-slate-600 mb-2">Travelers</label><div class="flex items-center gap-3"><button @click="booking.travelers = Math.max(1, booking.travelers - 1)" class="w-12 h-12 rounded-xl border flex items-center justify-center"><i class="fa-solid fa-minus"></i></button><span class="text-xl font-bold w-12 text-center">{{ booking.travelers }}</span><button @click="booking.travelers++" class="w-12 h-12 rounded-xl border flex items-center justify-center"><i class="fa-solid fa-plus"></i></button></div></div>
              <div class="md:col-span-2"><label class="block text-sm text-slate-600 mb-2">Full Name</label><input v-model="booking.fullName" type="text" placeholder="John Doe" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
              <div><label class="block text-sm text-slate-600 mb-2">Email</label><input v-model="booking.email" type="email" placeholder="john@example.com" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
              <div><label class="block text-sm text-slate-600 mb-2">Phone</label><input v-model="booking.phone" type="tel" placeholder="+62 812 3456 7890" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <div class="text-center mb-4"><span class="text-slate-400 line-through text-sm">{{ formatPrice(pkg.originalPrice) }}</span><div class="text-3xl font-bold text-indigo-600">{{ formatPrice(pkg.price) }}</div><span class="text-slate-500 text-sm">/person</span></div>
            <div class="space-y-3 mb-4 border-t pt-4"><div class="flex justify-between text-slate-600"><span>{{ booking.travelers }} traveler(s)</span><span>{{ formatPrice(totalPrice) }}</span></div><div class="border-t pt-3 flex justify-between font-bold text-lg"><span>Total</span><span class="text-indigo-600">{{ formatPrice(totalPrice) }}</span></div></div>
            <button @click="confirmBooking" :disabled="isBooking" class="w-full py-4 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2" style="background: linear-gradient(90deg, #6366f1, #4f46e5);"><i v-if="isBooking" class="fa-solid fa-spinner fa-spin"></i>{{ isBooking ? 'Processing...' : 'Book Package' }}</button>
            <p class="text-xs text-slate-500 text-center mt-4"><i class="fa-solid fa-shield-check mr-1"></i>Best price guarantee</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>.text-indigo-600 { color: #4f46e5; }.text-indigo-300 { color: #a5b4fc; }.text-indigo-400 { color: #818cf8; }.text-indigo-700 { color: #4338ca; }.bg-indigo-100 { background-color: #e0e7ff; }</style>
