<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

definePageMeta({
  layout: 'nusatrip',
});

const route = useRoute();
const router = useRouter();
const flightId = route.params.id as string;

// Demo flights data (would come from API/store in production)
const allFlights = [
  { id: '1', airline: 'Garuda Indonesia', logo: '🛫', origin: 'CGK', destination: 'DPS', departTime: '06:00', arriveTime: '08:45', duration: '1h 45m', stops: 0, price: 1250000, class: 'Economy', aircraft: 'Boeing 737-800', baggage: '20kg', meals: true },
  { id: '2', airline: 'Lion Air', logo: '🦁', origin: 'CGK', destination: 'DPS', departTime: '08:30', arriveTime: '11:15', duration: '1h 45m', stops: 0, price: 850000, class: 'Economy', aircraft: 'Airbus A320', baggage: '15kg', meals: false },
  { id: '3', airline: 'Batik Air', logo: '🎨', origin: 'CGK', destination: 'DPS', departTime: '10:00', arriveTime: '13:30', duration: '2h 30m', stops: 1, price: 950000, class: 'Economy', aircraft: 'Boeing 737 MAX', baggage: '20kg', meals: true },
  { id: '4', airline: 'Garuda Indonesia', logo: '🛫', origin: 'CGK', destination: 'DPS', departTime: '14:00', arriveTime: '16:45', duration: '1h 45m', stops: 0, price: 1450000, class: 'Business', aircraft: 'Airbus A330', baggage: '30kg', meals: true },
  { id: '5', airline: 'Citilink', logo: '🟢', origin: 'CGK', destination: 'DPS', departTime: '16:30', arriveTime: '19:15', duration: '1h 45m', stops: 0, price: 750000, class: 'Economy', aircraft: 'Airbus A320neo', baggage: '20kg', meals: false },
];

const flight = computed(() => allFlights.find(f => f.id === flightId) || allFlights[0]);

const passengers = ref({
  adults: 1,
  children: 0,
  infants: 0,
});

const contactInfo = ref({
  fullName: '',
  email: '',
  phone: '',
});

const isBooking = ref(false);
const bookingComplete = ref(false);
const bookingRef = ref('');

useHead({
  title: computed(() => `${flight.value.airline} Flight to ${flight.value.destination} | NusaTrip`),
});

const totalPassengers = computed(() => passengers.value.adults + passengers.value.children);
const totalPrice = computed(() => {
  const adultPrice = flight.value.price * passengers.value.adults;
  const childPrice = flight.value.price * 0.75 * passengers.value.children;
  return adultPrice + childPrice;
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
};

const confirmBooking = async () => {
  if (!contactInfo.value.fullName || !contactInfo.value.email || !contactInfo.value.phone) {
    alert('Please fill in all contact information');
    return;
  }
  
  isBooking.value = true;
  await new Promise(resolve => setTimeout(resolve, 1500));
  bookingRef.value = 'NT-FL-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  bookingComplete.value = true;
  isBooking.value = false;
};

const goBack = () => {
  router.push('/nusatrip/flights');
};
</script>

<template>
  <div class="pt-20 min-h-screen bg-slate-50">
    <!-- Header -->
    <section class="py-8 px-4" style="background: linear-gradient(135deg, #FF5A5F, #e04e52, #1e293b);">
      <div class="max-w-4xl mx-auto">
        <button @click="goBack" class="text-white/80 hover:text-white mb-4 flex items-center gap-2">
          <i class="fa-solid fa-arrow-left"></i> Back to search
        </button>
        <h1 class="text-2xl md:text-3xl font-bold text-white">
          <i class="fa-solid fa-plane mr-3"></i>
          Complete Your Booking
        </h1>
      </div>
    </section>

    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Booking Complete -->
      <div v-if="bookingComplete" class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <i class="fa-solid fa-check text-4xl text-green-500"></i>
        </div>
        <h2 class="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
        <p class="text-slate-600 mb-4">Your flight has been booked successfully.</p>
        <div class="bg-slate-50 rounded-xl p-4 mb-6 inline-block">
          <p class="text-sm text-slate-500">Booking Reference</p>
          <p class="text-2xl font-bold text-coral-500">{{ bookingRef }}</p>
        </div>
        <p class="text-sm text-slate-500 mb-6">Confirmation details have been sent to {{ contactInfo.email }}</p>
        <button @click="goBack" class="px-6 py-3 text-white font-semibold rounded-xl" style="background: linear-gradient(90deg, #FF5A5F, #e04e52);">
          Search More Flights
        </button>
      </div>

      <!-- Booking Form -->
      <div v-else class="space-y-6">
        <!-- Flight Summary -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="font-bold text-lg text-slate-900 mb-4">Flight Details</h2>
          <div class="flex items-center gap-4 mb-4">
            <span class="text-4xl">{{ flight.logo }}</span>
            <div>
              <div class="font-bold text-slate-900">{{ flight.airline }}</div>
              <div class="text-sm text-slate-500">{{ flight.class }} • {{ flight.aircraft }}</div>
            </div>
          </div>
          
          <div class="flex items-center justify-between bg-slate-50 rounded-xl p-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-slate-900">{{ flight.departTime }}</div>
              <div class="text-slate-500">{{ flight.origin }}</div>
            </div>
            <div class="flex-1 flex flex-col items-center px-4">
              <div class="text-sm text-slate-500">{{ flight.duration }}</div>
              <div class="w-full flex items-center gap-2 my-1">
                <div class="h-px flex-1 bg-slate-300"></div>
                <i class="fa-solid fa-plane text-coral-500"></i>
                <div class="h-px flex-1 bg-slate-300"></div>
              </div>
              <div class="text-xs" :class="flight.stops === 0 ? 'text-green-600' : 'text-orange-500'">
                {{ flight.stops === 0 ? 'Direct' : flight.stops + ' Stop' }}
              </div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-slate-900">{{ flight.arriveTime }}</div>
              <div class="text-slate-500">{{ flight.destination }}</div>
            </div>
          </div>

          <div class="flex gap-6 mt-4 text-sm text-slate-600">
            <span><i class="fa-solid fa-suitcase-rolling mr-2"></i>{{ flight.baggage }}</span>
            <span v-if="flight.meals"><i class="fa-solid fa-utensils mr-2"></i>Meals included</span>
          </div>
        </div>

        <!-- Passengers -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="font-bold text-lg text-slate-900 mb-4">Passengers</h2>
          <div class="grid md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm text-slate-600 mb-2">Adults (12+)</label>
              <div class="flex items-center gap-3">
                <button @click="passengers.adults = Math.max(1, passengers.adults - 1)" class="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                  <i class="fa-solid fa-minus"></i>
                </button>
                <span class="text-xl font-bold w-8 text-center">{{ passengers.adults }}</span>
                <button @click="passengers.adults++" class="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm text-slate-600 mb-2">Children (2-11)</label>
              <div class="flex items-center gap-3">
                <button @click="passengers.children = Math.max(0, passengers.children - 1)" class="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                  <i class="fa-solid fa-minus"></i>
                </button>
                <span class="text-xl font-bold w-8 text-center">{{ passengers.children }}</span>
                <button @click="passengers.children++" class="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm text-slate-600 mb-2">Infants (0-2)</label>
              <div class="flex items-center gap-3">
                <button @click="passengers.infants = Math.max(0, passengers.infants - 1)" class="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                  <i class="fa-solid fa-minus"></i>
                </button>
                <span class="text-xl font-bold w-8 text-center">{{ passengers.infants }}</span>
                <button @click="passengers.infants++" class="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="font-bold text-lg text-slate-900 mb-4">Contact Information</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm text-slate-600 mb-2">Full Name</label>
              <input v-model="contactInfo.fullName" type="text" placeholder="John Doe" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none" />
            </div>
            <div>
              <label class="block text-sm text-slate-600 mb-2">Email</label>
              <input v-model="contactInfo.email" type="email" placeholder="john@example.com" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none" />
            </div>
            <div>
              <label class="block text-sm text-slate-600 mb-2">Phone</label>
              <input v-model="contactInfo.phone" type="tel" placeholder="+62 812 3456 7890" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none" />
            </div>
          </div>
        </div>

        <!-- Price Summary & Book -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h2 class="font-bold text-lg text-slate-900 mb-4">Price Summary</h2>
          <div class="space-y-3 mb-4">
            <div class="flex justify-between text-slate-600">
              <span>{{ passengers.adults }} Adult(s) × {{ formatPrice(flight.price) }}</span>
              <span>{{ formatPrice(flight.price * passengers.adults) }}</span>
            </div>
            <div v-if="passengers.children > 0" class="flex justify-between text-slate-600">
              <span>{{ passengers.children }} Child(ren) × {{ formatPrice(flight.price * 0.75) }}</span>
              <span>{{ formatPrice(flight.price * 0.75 * passengers.children) }}</span>
            </div>
            <div class="border-t border-slate-200 pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span class="text-coral-500">{{ formatPrice(totalPrice) }}</span>
            </div>
          </div>
          
          <button 
            @click="confirmBooking"
            :disabled="isBooking"
            class="w-full py-4 text-white font-bold rounded-xl shadow-lg hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style="background: linear-gradient(90deg, #FF5A5F, #e04e52);"
          >
            <i v-if="isBooking" class="fa-solid fa-spinner fa-spin"></i>
            {{ isBooking ? 'Processing...' : 'Confirm Booking' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-coral-500 { color: #FF5A5F; }
.bg-coral-500 { background-color: #FF5A5F; }
.from-coral-500 { --tw-gradient-from: #FF5A5F; }
.to-coral-600 { --tw-gradient-to: #e04e52; }
.focus\:border-coral-500:focus { border-color: #FF5A5F; }
.focus\:ring-coral-500\/20:focus { --tw-ring-color: rgba(255, 90, 95, 0.2); }
</style>
