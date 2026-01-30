<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useNusaTripStore } from '~/store/nusatrip';

definePageMeta({
  layout: 'nusatrip',
});

const route = useRoute();
const router = useRouter();
const store = useNusaTripStore();
const hotelId = route.params.id as string;

// Demo hotels data
const allHotels = [
  { id: '1', name: 'The Mulia Bali', location: 'Nusa Dua, Bali', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', rating: 4.9, reviews: 1250, stars: 5, price: 4500000, amenities: ['Pool', 'Spa', 'Beach', 'WiFi', 'Gym', 'Restaurant', 'Bar', 'Room Service'], discount: 30, description: 'Experience luxury at its finest with ocean views, world-class spa, and exceptional dining.' },
  { id: '2', name: 'Alila Ubud', location: 'Ubud, Bali', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', rating: 4.8, reviews: 890, stars: 5, price: 3200000, amenities: ['Pool', 'Spa', 'Restaurant', 'View', 'Yoga', 'WiFi'], discount: 0, description: 'Nestled in the highlands overlooking the Ayung River valley.' },
  { id: '3', name: 'COMO Uma Canggu', location: 'Canggu, Bali', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', rating: 4.7, reviews: 654, stars: 4, price: 2800000, amenities: ['Pool', 'Surf', 'Gym', 'WiFi', 'Restaurant'], discount: 15, description: 'Contemporary beach resort perfect for surfers and wellness seekers.' },
  { id: '4', name: 'Potato Head Suites', location: 'Seminyak, Bali', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', rating: 4.6, reviews: 432, stars: 4, price: 2100000, amenities: ['Pool', 'Beach', 'Bar', 'Restaurant', 'WiFi'], discount: 20, description: 'Creative and playful beachfront destination with unique design.' },
  { id: '5', name: 'Kayumanis Nusa Dua', location: 'Nusa Dua, Bali', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', rating: 4.9, reviews: 567, stars: 5, price: 5500000, amenities: ['Villa', 'Pool', 'Spa', 'Beach', 'Butler', 'WiFi'], discount: 0, description: 'Private villa resort offering the ultimate in personalized luxury.' },
];

const hotel = computed(() => allHotels.find(h => h.id === hotelId) || allHotels[0]);
const finalPrice = computed(() => hotel.value.discount ? hotel.value.price * (1 - hotel.value.discount / 100) : hotel.value.price);

const booking = ref({
  checkIn: '',
  checkOut: '',
  rooms: 1,
  guests: 2,
  fullName: '',
  email: '',
  phone: '',
  specialRequests: '',
});

const isBooking = ref(false);
const bookingComplete = ref(false);
const bookingRef = ref('');

useHead({
  title: computed(() => `${hotel.value.name} | NusaTrip Hotels`),
});

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

const nights = computed(() => {
  if (!booking.value.checkIn || !booking.value.checkOut) return 1;
  const diff = new Date(booking.value.checkOut).getTime() - new Date(booking.value.checkIn).getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

const totalPrice = computed(() => finalPrice.value * nights.value * booking.value.rooms);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
};

const confirmBooking = async () => {
  // Check if user is logged in
  if (!store.isAuthenticated) {
    store.setRedirectUrl(route.fullPath);
    router.push('/nusatrip/login');
    return;
  }

  if (!booking.value.fullName || !booking.value.email || !booking.value.checkIn || !booking.value.checkOut) {
    alert('Please fill in all required fields');
    return;
  }
  
  isBooking.value = true;
  await new Promise(resolve => setTimeout(resolve, 1500));
  bookingRef.value = 'NT-HT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  bookingComplete.value = true;
  isBooking.value = false;
};

const goBack = () => {
  router.push('/nusatrip/hotels');
};
</script>

<template>
  <div class="pt-20 min-h-screen bg-slate-50">
    <!-- Hero Image -->
    <section class="relative h-64 md:h-96">
      <img :src="hotel.image" :alt="hotel.name" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 p-6">
        <div class="max-w-4xl mx-auto">
          <button @click="goBack" class="text-white/80 hover:text-white mb-3 flex items-center gap-2">
            <i class="fa-solid fa-arrow-left"></i> Back to hotels
          </button>
          <div class="flex gap-1 mb-2">
            <i v-for="n in hotel.stars" :key="n" class="fa-solid fa-star text-yellow-400 text-sm"></i>
          </div>
          <h1 class="text-2xl md:text-4xl font-bold text-white mb-2">{{ hotel.name }}</h1>
          <p class="text-white/80"><i class="fa-solid fa-location-dot mr-2"></i>{{ hotel.location }}</p>
        </div>
      </div>
    </section>

    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Booking Complete -->
      <div v-if="bookingComplete" class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <i class="fa-solid fa-check text-4xl text-green-500"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
        <p class="text-slate-600 mb-4">Your hotel reservation has been made successfully.</p>
        <div class="bg-slate-50 rounded-xl p-4 mb-6 inline-block">
          <p class="text-sm text-slate-500">Booking Reference</p>
          <p class="text-2xl font-bold text-teal-600">{{ bookingRef }}</p>
        </div>
        <p class="text-sm text-slate-500 mb-6">Confirmation details have been sent to {{ booking.email }}</p>
        <button @click="goBack" class="px-6 py-3 text-white font-semibold rounded-xl" style="background: linear-gradient(90deg, #14b8a6, #0d9488);">
          Search More Hotels
        </button>
      </div>

      <!-- Booking Form -->
      <div v-else class="grid lg:grid-cols-3 gap-6">
        <!-- Left Column - Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- About -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="font-bold text-lg text-slate-900 mb-3">About</h2>
            <p class="text-slate-600 mb-4">{{ hotel.description }}</p>
            
            <div class="flex items-center gap-4 mb-4">
              <div class="bg-teal-500 text-white px-3 py-1 rounded-lg font-bold">{{ hotel.rating }}</div>
              <div>
                <div class="font-medium text-slate-900">Excellent</div>
                <div class="text-sm text-slate-500">{{ hotel.reviews }} reviews</div>
              </div>
            </div>

            <h3 class="font-medium text-slate-900 mb-3">Amenities</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="amenity in hotel.amenities" :key="amenity" class="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm">
                {{ amenity }}
              </span>
            </div>
          </div>

          <!-- Stay Details -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="font-bold text-lg text-slate-900 mb-4">Your Stay</h2>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-slate-600 mb-2">Check-in</label>
                <input v-model="booking.checkIn" type="date" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 outline-none" />
              </div>
              <div>
                <label class="block text-sm text-slate-600 mb-2">Check-out</label>
                <input v-model="booking.checkOut" type="date" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 outline-none" />
              </div>
              <div>
                <label class="block text-sm text-slate-600 mb-2">Rooms</label>
                <select v-model="booking.rooms" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 outline-none">
                  <option v-for="n in 5" :key="n" :value="n">{{ n }} Room{{ n > 1 ? 's' : '' }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-slate-600 mb-2">Guests</label>
                <select v-model="booking.guests" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 outline-none">
                  <option v-for="n in 8" :key="n" :value="n">{{ n }} Guest{{ n > 1 ? 's' : '' }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="font-bold text-lg text-slate-900 mb-4">Guest Information</h2>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm text-slate-600 mb-2">Full Name</label>
                <input v-model="booking.fullName" type="text" placeholder="John Doe" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
              </div>
              <div>
                <label class="block text-sm text-slate-600 mb-2">Email</label>
                <input v-model="booking.email" type="email" placeholder="john@example.com" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
              </div>
              <div>
                <label class="block text-sm text-slate-600 mb-2">Phone</label>
                <input v-model="booking.phone" type="tel" placeholder="+62 812 3456 7890" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" />
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm text-slate-600 mb-2">Special Requests (optional)</label>
                <textarea v-model="booking.specialRequests" rows="3" placeholder="Any special requests..." class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none resize-none"></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Price Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <h2 class="font-bold text-lg text-slate-900 mb-4">Price Summary</h2>
            
            <div class="space-y-3 mb-4">
              <div class="flex justify-between text-slate-600">
                <span>{{ nights }} night{{ nights > 1 ? 's' : '' }}</span>
                <span>{{ formatPrice(finalPrice * nights) }}</span>
              </div>
              <div v-if="booking.rooms > 1" class="flex justify-between text-slate-600">
                <span>× {{ booking.rooms }} rooms</span>
                <span></span>
              </div>
              <div v-if="hotel.discount" class="flex justify-between text-green-600">
                <span>Discount ({{ hotel.discount }}%)</span>
                <span>-{{ formatPrice(hotel.price * hotel.discount / 100 * nights * booking.rooms) }}</span>
              </div>
              <div class="border-t border-slate-200 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span class="text-teal-600">{{ formatPrice(totalPrice) }}</span>
              </div>
            </div>

            <button 
              @click="confirmBooking"
              :disabled="isBooking"
              class="w-full py-4 text-white font-bold rounded-xl shadow-lg hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style="background: linear-gradient(90deg, #14b8a6, #0d9488);"
            >
              <i v-if="isBooking" class="fa-solid fa-spinner fa-spin"></i>
              {{ isBooking ? 'Processing...' : 'Confirm Booking' }}
            </button>

            <p class="text-xs text-slate-500 text-center mt-4">
              <i class="fa-solid fa-shield-check mr-1"></i>
              Free cancellation up to 24 hours before check-in
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-teal-600 { color: #0d9488; }
.bg-teal-500 { background-color: #14b8a6; }
</style>
