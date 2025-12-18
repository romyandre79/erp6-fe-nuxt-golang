<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-slate-800">ESS Portal</h1>
        <p class="text-slate-500">Employee Self Service Login</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Employee ID or Email</label>
          <input 
            v-model="email"
            type="text" 
            class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="e.g. 100293 or john@company.com"
          />
        </div>

        <div>
           <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-slate-700">Password</label>
              <a href="#" class="text-xs text-blue-600 hover:underline">Forgot password?</a>
           </div>
          <input 
            v-model="password"
            type="password" 
            class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
        >
          Sign In
        </button>
      </form>
      
      <div class="mt-8 text-center text-xs text-slate-400">
        &copy; 2024 ERP System. All rights reserved.
      </div>
    </div>

    <!-- Pricing Section -->
    <div class="w-full max-w-7xl mx-auto mt-24">
       <PricingCalculator 
        :available-apps="essApps"
        theme="light"
        module-name="ESS"
        :initial-selected-apps="['attendance', 'leave']"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PricingCalculator from '~/components/PricingCalculator.vue'
import '@/assets/css/landing.css'

definePageMeta({
  layout: false
})

const essApps = [
  { id: 'attendance', name: 'Mobile Attendance', price: 20000, icon: '📍' },
  { id: 'leave', name: 'Leave Management', price: 15000, icon: '📅' },
  { id: 'payslip', name: 'Digital Payslip', price: 15000, icon: '💸' },
  { id: 'claims', name: 'Expense Claims', price: 20000, icon: '🧾' },
]

const router = useRouter()
const email = ref('')
const password = ref('')

const handleLogin = () => {
    // Mock login for now
    if (email.value && password.value) {
        router.push('/ess/dashboard')
    } else {
      alert('Please enter credentials')
    }
}
</script>
