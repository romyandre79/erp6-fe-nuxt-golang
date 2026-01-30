<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useNusaTripStore } from '~/store/nusatrip';

definePageMeta({ layout: 'nusatrip' });

const route = useRoute();
const router = useRouter();
const store = useNusaTripStore();
const rentalId = route.params.id as string;

const allRentals = [
  { id: '1', name: 'Toyota Avanza', category: 'car', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', seats: 7, transmission: 'Automatic', fuel: 'Petrol', price: 350000, provider: 'Bali Rent Car', rating: 4.8, description: 'Perfect family MPV for comfortable trips around Bali.', features: ['AC', 'Bluetooth', 'USB Charging', 'GPS'] },
  { id: '2', name: 'Honda PCX 160', category: 'motorcycle', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', seats: 2, transmission: 'Automatic', fuel: 'Petrol', price: 100000, provider: 'Scooter Bali', rating: 4.7, description: 'Premium scooter for exploring Bali with style.', features: ['Helmet', 'Phone Holder', 'Storage Box'] },
  { id: '3', name: 'Toyota Innova', category: 'car', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800', seats: 7, transmission: 'Automatic', fuel: 'Diesel', price: 550000, provider: 'Premium Cars', rating: 4.9, description: 'Spacious and powerful SUV for any adventure.', features: ['AC', 'Leather Seats', 'USB Charging', 'GPS', 'Backup Camera'] },
  { id: '4', name: 'Hiace Commuter', category: 'van', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800', seats: 16, transmission: 'Manual', fuel: 'Diesel', price: 850000, provider: 'Group Transport', rating: 4.6, description: 'Ideal for group travel and corporate events.', features: ['AC', 'Reclining Seats', 'Large Luggage Space'] },
  { id: '5', name: 'Mercedes E-Class', category: 'luxury', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', seats: 5, transmission: 'Automatic', fuel: 'Petrol', price: 2500000, provider: 'Luxury Rides', rating: 4.9, description: 'Experience luxury and sophistication.', features: ['Premium Sound', 'Leather Interior', 'Sunroof', 'GPS', 'WiFi'] },
  { id: '6', name: 'Yamaha NMAX', category: 'motorcycle', image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800', seats: 2, transmission: 'Automatic', fuel: 'Petrol', price: 85000, provider: 'Scooter Bali', rating: 4.8, description: 'Fuel-efficient scooter for daily commuting.', features: ['Helmet', 'Phone Holder'] },
];

const rental = computed(() => allRentals.find(r => r.id === rentalId) || allRentals[0]);

const booking = ref({ pickupDate: '', pickupTime: '09:00', dropoffDate: '', withDriver: false, fullName: '', email: '', phone: '' });
const isBooking = ref(false);
const bookingComplete = ref(false);
const bookingRef = ref('');

useHead({ title: computed(() => `${rental.value.name} Rental | NusaTrip`) });

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

const days = computed(() => {
  if (!booking.value.pickupDate || !booking.value.dropoffDate) return 1;
  const diff = new Date(booking.value.dropoffDate).getTime() - new Date(booking.value.pickupDate).getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

const driverFee = computed(() => booking.value.withDriver ? 200000 * days.value : 0);
const totalPrice = computed(() => (rental.value.price * days.value) + driverFee.value);
const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

const confirmBooking = async () => {
  // Check if user is logged in
  if (!store.isAuthenticated) {
    store.setRedirectUrl(route.fullPath);
    router.push('/nusatrip/login');
    return;
  }

  if (!booking.value.fullName || !booking.value.email || !booking.value.pickupDate || !booking.value.dropoffDate) { alert('Please fill in all fields'); return; }
  isBooking.value = true;
  await new Promise(r => setTimeout(r, 1500));
  bookingRef.value = 'NT-RT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  bookingComplete.value = true;
  isBooking.value = false;
};

const goBack = () => router.push('/nusatrip/rentals');
</script>

<template>
  <div class="pt-20 min-h-screen bg-slate-50">
    <section class="relative h-64 md:h-80">
      <img :src="rental.image" :alt="rental.name" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
      <div class="absolute top-24 left-6 px-3 py-1 text-white text-xs font-semibold uppercase rounded-full" :class="rental.category === 'luxury' ? 'bg-yellow-500' : 'bg-slate-800'">{{ rental.category }}</div>
      <div class="absolute bottom-0 left-0 right-0 p-6">
        <div class="max-w-4xl mx-auto">
          <button @click="goBack" class="text-white/80 hover:text-white mb-3 flex items-center gap-2"><i class="fa-solid fa-arrow-left"></i> Back</button>
          <h1 class="text-2xl md:text-4xl font-bold text-white">{{ rental.name }}</h1>
          <p class="text-white/80">{{ rental.provider }}</p>
        </div>
      </div>
    </section>

    <div class="max-w-4xl mx-auto px-4 py-8">
      <div v-if="bookingComplete" class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"><i class="fa-solid fa-check text-4xl text-green-500"></i></div>
        <h2 class="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
        <div class="bg-slate-50 rounded-xl p-4 mb-6 inline-block"><p class="text-sm text-slate-500">Reference</p><p class="text-2xl font-bold text-orange-500">{{ bookingRef }}</p></div>
        <p class="text-sm text-slate-500 mb-6">Confirmation sent to {{ booking.email }}</p>
        <button @click="goBack" class="px-6 py-3 text-white font-semibold rounded-xl" style="background: linear-gradient(90deg, #f97316, #ea580c);">Browse More Vehicles</button>
      </div>

      <div v-else class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center gap-4 mb-4"><div class="flex items-center gap-1"><i class="fa-solid fa-star text-yellow-400"></i><span class="font-bold">{{ rental.rating }}</span></div></div>
            <p class="text-slate-600 mb-4">{{ rental.description }}</p>
            <div class="flex gap-6 text-sm text-slate-600 mb-4"><span><i class="fa-solid fa-user mr-2"></i>{{ rental.seats }} seats</span><span><i class="fa-solid fa-gear mr-2"></i>{{ rental.transmission }}</span><span><i class="fa-solid fa-gas-pump mr-2"></i>{{ rental.fuel }}</span></div>
            <h3 class="font-bold text-slate-900 mb-3">Features</h3>
            <div class="flex flex-wrap gap-2"><span v-for="f in rental.features" :key="f" class="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm">{{ f }}</span></div>
          </div>

          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="font-bold text-lg text-slate-900 mb-4">Rental Details</h2>
            <div class="grid md:grid-cols-2 gap-4">
              <div><label class="block text-sm text-slate-600 mb-2">Pickup Date</label><input v-model="booking.pickupDate" type="date" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
              <div><label class="block text-sm text-slate-600 mb-2">Pickup Time</label><input v-model="booking.pickupTime" type="time" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
              <div><label class="block text-sm text-slate-600 mb-2">Drop-off Date</label><input v-model="booking.dropoffDate" type="date" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
              <div class="flex items-center"><label class="flex items-center gap-3 cursor-pointer"><input v-model="booking.withDriver" type="checkbox" class="w-5 h-5 rounded" style="accent-color: #f97316;" /><span class="text-slate-700">With Driver (+IDR 200K/day)</span></label></div>
              <div class="md:col-span-2"><label class="block text-sm text-slate-600 mb-2">Full Name</label><input v-model="booking.fullName" type="text" placeholder="John Doe" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
              <div><label class="block text-sm text-slate-600 mb-2">Email</label><input v-model="booking.email" type="email" placeholder="john@example.com" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
              <div><label class="block text-sm text-slate-600 mb-2">Phone</label><input v-model="booking.phone" type="tel" placeholder="+62 812 3456 7890" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" /></div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <div class="text-center mb-4"><div class="text-3xl font-bold text-orange-500">{{ formatPrice(rental.price) }}</div><span class="text-slate-500 text-sm">/day</span></div>
            <div class="space-y-3 mb-4 border-t pt-4">
              <div class="flex justify-between text-slate-600"><span>{{ days }} day(s)</span><span>{{ formatPrice(rental.price * days) }}</span></div>
              <div v-if="booking.withDriver" class="flex justify-between text-slate-600"><span>Driver ({{ days }} days)</span><span>{{ formatPrice(driverFee) }}</span></div>
              <div class="border-t pt-3 flex justify-between font-bold text-lg"><span>Total</span><span class="text-orange-500">{{ formatPrice(totalPrice) }}</span></div>
            </div>
            <button @click="confirmBooking" :disabled="isBooking" class="w-full py-4 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2" style="background: linear-gradient(90deg, #f97316, #ea580c);"><i v-if="isBooking" class="fa-solid fa-spinner fa-spin"></i>{{ isBooking ? 'Processing...' : 'Rent Now' }}</button>
            <p class="text-xs text-slate-500 text-center mt-4"><i class="fa-solid fa-shield-check mr-1"></i>Free cancellation 24h before</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>.text-orange-500 { color: #f97316; }</style>
