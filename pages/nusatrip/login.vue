<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useNusaTripStore } from '~/store/nusatrip';
import { useNusaTrip } from '~/composables/useNusaTrip';

definePageMeta({
  layout: 'nusatrip',
});

useHead({
  title: 'Login | NusaTrip',
  meta: [
    { name: 'description', content: 'Log in to your NusaTrip account to manage bookings and access exclusive deals.' },
  ],
});

const store = useNusaTripStore();
const api = useNusaTrip();
const router = useRouter();

const isLoading = ref(false);
const showPassword = ref(false);
const error = ref('');

const form = reactive({
  email: '',
  password: '',
  rememberMe: false,
});

const handleSubmit = async () => {
  error.value = '';
  
  if (!form.email || !form.password) {
    error.value = 'Please fill in all fields';
    return;
  }

  isLoading.value = true;
  
  try {
    const res: any = await api.userLogin({
      email: form.email,
      password: form.password,
    });
    
    if (res?.code === 200 && res.data) {
      store.setUser(res.data.user);
      router.push('/nusatrip');
    } else {
      error.value = res?.message || 'Invalid email or password';
    }
  } catch (err: any) {
    error.value = err.message || 'Login failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Image -->
    <div class="hidden lg:flex lg:w-1/2 relative">
      <img 
        src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920"
        alt="Beautiful Bali"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-coral-600/90 to-slate-900/90"></div>
      
      <!-- Content Overlay -->
      <div class="relative z-10 flex flex-col justify-between p-12 text-white">
        <div>
          <NuxtLink to="/nusatrip" class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <i class="fa-solid fa-paper-plane text-white"></i>
            </div>
            <span class="text-2xl font-bold">NusaTrip</span>
          </NuxtLink>
        </div>
        
        <div>
          <h1 class="text-4xl font-bold mb-4">Welcome Back, Traveler!</h1>
          <p class="text-white/80 text-lg mb-8">Log in to continue your journey and access exclusive deals</p>
          
          <div class="flex items-center gap-6">
            <div class="flex -space-x-3">
              <img src="https://i.pravatar.cc/40?img=1" class="w-10 h-10 rounded-full border-2 border-white" />
              <img src="https://i.pravatar.cc/40?img=2" class="w-10 h-10 rounded-full border-2 border-white" />
              <img src="https://i.pravatar.cc/40?img=3" class="w-10 h-10 rounded-full border-2 border-white" />
              <img src="https://i.pravatar.cc/40?img=4" class="w-10 h-10 rounded-full border-2 border-white" />
            </div>
            <div>
              <div class="font-semibold">1M+ Happy Travelers</div>
              <div class="text-white/60 text-sm">Join our community</div>
            </div>
          </div>
        </div>
        
        <div class="text-white/40 text-sm">
          © {{ new Date().getFullYear() }} NusaTrip. All rights reserved.
        </div>
      </div>
    </div>

    <!-- Right Side - Form -->
    <div class="flex-1 flex items-center justify-center p-8 bg-slate-50 pt-24">
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden mb-8 text-center">
          <NuxtLink to="/nusatrip" class="inline-flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, #FF5A5F, #e04e52);">
              <i class="fa-solid fa-paper-plane text-white"></i>
            </div>
            <span class="text-2xl font-bold text-slate-900">Nusa<span class="text-coral-500">Trip</span></span>
          </NuxtLink>
        </div>

        <div class="bg-white rounded-3xl shadow-xl p-8">
          <h2 class="text-2xl font-bold text-slate-900 mb-2">Log in to your account</h2>
          <p class="text-slate-500 mb-8">Don't have an account? 
            <NuxtLink to="/nusatrip/register" class="text-coral-500 hover:text-coral-600 font-semibold">Sign up</NuxtLink>
          </p>

          <!-- Error Message -->
          <div v-if="error" class="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3">
            <i class="fa-solid fa-circle-exclamation"></i>
            {{ error }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Email address</label>
              <div class="relative">
                <input 
                  v-model="form.email"
                  type="email"
                  placeholder="Enter your email"
                  class="w-full px-4 py-3.5 pl-12 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all"
                />
                <i class="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              </div>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div class="relative">
                <input 
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  class="w-full px-4 py-3.5 pl-12 pr-12 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all"
                />
                <i class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>
              </div>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 cursor-pointer">
                <input 
                  v-model="form.rememberMe"
                  type="checkbox" 
                  class="w-4 h-4 rounded border-slate-300 text-coral-500 focus:ring-coral-500"
                />
                <span class="text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" class="text-sm text-coral-500 hover:text-coral-600 font-medium">Forgot password?</a>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit"
              :disabled="isLoading"
              class="w-full py-4 text-white font-semibold rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style="background: linear-gradient(90deg, #FF5A5F, #e04e52);"
            >
              <span v-if="isLoading" class="flex items-center justify-center gap-2">
                <i class="fa-solid fa-circle-notch fa-spin"></i>
                Logging in...
              </span>
              <span v-else>Log in</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="my-8 flex items-center gap-4">
            <div class="flex-1 h-px bg-slate-200"></div>
            <span class="text-sm text-slate-400">Or continue with</span>
            <div class="flex-1 h-px bg-slate-200"></div>
          </div>

          <!-- Social Login -->
          <div class="grid grid-cols-2 gap-4">
            <button class="flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <i class="fa-brands fa-google text-red-500"></i>
              <span class="font-medium text-slate-700">Google</span>
            </button>
            <button class="flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <i class="fa-brands fa-facebook text-blue-600"></i>
              <span class="font-medium text-slate-700">Facebook</span>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <p class="text-center text-slate-500 text-sm mt-8">
          By logging in, you agree to our 
          <a href="#" class="text-coral-500 hover:underline">Terms of Service</a> and 
          <a href="#" class="text-coral-500 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-coral-500 { color: #FF5A5F; }
.text-coral-600 { color: #e04e52; }
.bg-coral-500 { background-color: #FF5A5F; }
.from-coral-500 { --tw-gradient-from: #FF5A5F; }
.from-coral-600 { --tw-gradient-from: #e04e52; }
.to-coral-600 { --tw-gradient-to: #e04e52; }
.hover\:text-coral-600:hover { color: #e04e52; }
.border-coral-500 { border-color: #FF5A5F; }
.focus\:border-coral-500:focus { border-color: #FF5A5F; }
.focus\:ring-coral-500:focus { --tw-ring-color: #FF5A5F; }
.focus\:ring-coral-500\/20:focus { --tw-ring-color: rgba(255, 90, 95, 0.2); }
.shadow-coral-500\/30 { --tw-shadow-color: rgba(255, 90, 95, 0.3); }
.shadow-coral-500\/40 { --tw-shadow-color: rgba(255, 90, 95, 0.4); }
</style>
