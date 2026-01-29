<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useNusaTripStore } from '~/store/nusatrip';
import { useNusaTrip } from '~/composables/useNusaTrip';

definePageMeta({
  layout: 'nusatrip',
});

useHead({
  title: 'Sign Up | NusaTrip',
  meta: [
    { name: 'description', content: 'Create your NusaTrip account and start booking flights, hotels, and experiences.' },
  ],
});

const store = useNusaTripStore();
const api = useNusaTrip();
const router = useRouter();

const isLoading = ref(false);
const showPassword = ref(false);
const error = ref('');

const form = reactive({
  fullname: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
});

const handleSubmit = async () => {
  error.value = '';
  
  // Validation
  if (!form.fullname || !form.email || !form.phone || !form.password) {
    error.value = 'Please fill in all fields';
    return;
  }

  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match';
    return;
  }

  if (form.password.length < 8) {
    error.value = 'Password must be at least 8 characters';
    return;
  }

  if (!form.agreeTerms) {
    error.value = 'Please agree to the Terms of Service';
    return;
  }

  isLoading.value = true;
  
  try {
    const res: any = await api.userRegister({
      fullname: form.fullname,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });
    
    if (res?.code === 200 && res.data) {
      store.setUser(res.data.user);
      router.push('/nusatrip');
    } else {
      error.value = res?.message || 'Registration failed. Please try again.';
    }
  } catch (err: any) {
    error.value = err.message || 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Form -->
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
          <h2 class="text-2xl font-bold text-slate-900 mb-2">Create your account</h2>
          <p class="text-slate-500 mb-8">Already have an account? 
            <NuxtLink to="/nusatrip/login" class="text-coral-500 hover:text-coral-600 font-semibold">Log in</NuxtLink>
          </p>

          <!-- Error Message -->
          <div v-if="error" class="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3">
            <i class="fa-solid fa-circle-exclamation"></i>
            {{ error }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Full Name -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Full name</label>
              <div class="relative">
                <input 
                  v-model="form.fullname"
                  type="text"
                  placeholder="Enter your full name"
                  class="w-full px-4 py-3.5 pl-12 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all"
                />
                <i class="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              </div>
            </div>

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

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Phone number</label>
              <div class="relative">
                <input 
                  v-model="form.phone"
                  type="tel"
                  placeholder="+62 812 3456 7890"
                  class="w-full px-4 py-3.5 pl-12 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all"
                />
                <i class="fa-solid fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              </div>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div class="relative">
                <input 
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Create a password (min 8 characters)"
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

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Confirm password</label>
              <div class="relative">
                <input 
                  v-model="form.confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Confirm your password"
                  class="w-full px-4 py-3.5 pl-12 rounded-xl border border-slate-200 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-none transition-all"
                />
                <i class="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              </div>
            </div>

            <!-- Terms Checkbox -->
            <label class="flex items-start gap-3 cursor-pointer">
              <input 
                v-model="form.agreeTerms"
                type="checkbox" 
                class="w-5 h-5 mt-0.5 rounded border-slate-300 text-coral-500 focus:ring-coral-500"
              />
              <span class="text-sm text-slate-600">
                I agree to the 
                <a href="#" class="text-coral-500 hover:underline">Terms of Service</a> and 
                <a href="#" class="text-coral-500 hover:underline">Privacy Policy</a>
              </span>
            </label>

            <!-- Submit Button -->
            <button 
              type="submit"
              :disabled="isLoading"
              class="w-full py-4 text-white font-semibold rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style="background: linear-gradient(90deg, #FF5A5F, #e04e52);"
            >
              <span v-if="isLoading" class="flex items-center justify-center gap-2">
                <i class="fa-solid fa-circle-notch fa-spin"></i>
                Creating account...
              </span>
              <span v-else>Create account</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="my-8 flex items-center gap-4">
            <div class="flex-1 h-px bg-slate-200"></div>
            <span class="text-sm text-slate-400">Or sign up with</span>
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
      </div>
    </div>

    <!-- Right Side - Image -->
    <div class="hidden lg:flex lg:w-1/2 relative">
      <img 
        src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1920"
        alt="Komodo Island"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-bl from-teal-600/90 to-slate-900/90"></div>
      
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
          <h1 class="text-4xl font-bold mb-4">Start Your Adventure</h1>
          <p class="text-white/80 text-lg mb-8">Join millions of travelers discovering Indonesia's hidden gems</p>
          
          <!-- Benefits -->
          <div class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <i class="fa-solid fa-tag text-yellow-400"></i>
              </div>
              <span>Exclusive member discounts up to 50%</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <i class="fa-solid fa-bolt text-yellow-400"></i>
              </div>
              <span>Faster booking with saved preferences</span>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <i class="fa-solid fa-gift text-yellow-400"></i>
              </div>
              <span>Earn points on every booking</span>
            </div>
          </div>
        </div>
        
        <div class="text-white/40 text-sm">
          © {{ new Date().getFullYear() }} NusaTrip. All rights reserved.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-coral-500 { color: #FF5A5F; }
.text-coral-600 { color: #e04e52; }
.bg-coral-500 { background-color: #FF5A5F; }
.from-coral-500 { --tw-gradient-from: #FF5A5F; }
.to-coral-600 { --tw-gradient-to: #e04e52; }
.hover\:text-coral-600:hover { color: #e04e52; }
.border-coral-500 { border-color: #FF5A5F; }
.focus\:border-coral-500:focus { border-color: #FF5A5F; }
.focus\:ring-coral-500:focus { --tw-ring-color: #FF5A5F; }
.focus\:ring-coral-500\/20:focus { --tw-ring-color: rgba(255, 90, 95, 0.2); }
.shadow-coral-500\/30 { --tw-shadow-color: rgba(255, 90, 95, 0.3); }
.shadow-coral-500\/40 { --tw-shadow-color: rgba(255, 90, 95, 0.4); }
</style>
