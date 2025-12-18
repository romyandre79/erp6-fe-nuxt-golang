<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'hris'
})

const features = [
  {
    title: 'Smart Payroll',
    description: 'Automated tax calculations, salary disbursement, and payslip generation in one click.',
    icon: '💰'
  },
  {
    title: 'Attendance Tracking',
    description: 'Real-time attendance monitoring with geofencing and biometric integration.',
    icon: '⏰'
  },
  {
    title: 'Talent Acquisition',
    description: 'Streamline your recruitment process from job posting to onboarding.',
    icon: '🤝'
  },
  {
    title: 'Performance Management',
    description: 'Set goals, track progress, and conduct 360-degree appraisals seamlessly.',
    icon: '📈'
  },
  {
    title: 'Employee Self-Service',
    description: 'Empower employees to manage their profiles, leaves, and claims.',
    icon: '📱'
  },
  {
    title: 'Analytics & Reports',
    description: 'Data-driven insights to help you make better HR decisions.',
    icon: '📊'
  }
]

// Pricing Logic
const availableSubModules = [
  { id: 'org_mgmt', name: 'Organization Mgmt', price: 50000, icon: '🏢' },
  { id: 'time_mgmt', name: 'Time Management', price: 50000, icon: '⏳' },
  { id: 'ess', name: 'Employee Self Service', price: 30000, icon: '📱' },
  { id: 'payroll', name: 'Payroll', price: 75000, icon: '💸' },
]

const selectedSubModules = ref(['org_mgmt', 'time_mgmt', 'ess', 'payroll'])
const employeeCount = ref(50)

// New Configuration States
const deploymentMode = ref('cloud') // 'cloud', 'onprem_license', 'onprem_source'
const consultationHours = ref(0)
const transportDays = ref(0) // Default not needed unless on-prem

const CONSULTATION_RATE = 200000 // Per Hour Per Module
const TRANSPORT_RATE = 2500000 // Per Day (Travel + Accom assumption)
const LICENSE_MULTIPLIER = 12 // 1 year equivalent for perpetual
const SOURCE_CODE_MULTIPLIER = 50 // Premium for source code

const toggleSubModule = (mod) => {
  if (selectedSubModules.value.includes(mod.id)) selectedSubModules.value = selectedSubModules.value.filter(id => id !== mod.id)
  else selectedSubModules.value.push(mod.id)
}

const baseMonthlyCost = computed(() => {
  let modCostPerEmployee = 0
  selectedSubModules.value.forEach(modId => {
    const mod = availableSubModules.find(m => m.id === modId)
    if (mod) modCostPerEmployee += mod.price
  })
  
  return modCostPerEmployee * employeeCount.value
})

const implementationFee = computed(() => {
  // Price per hour per module selected
  return consultationHours.value * CONSULTATION_RATE * Math.max(selectedSubModules.value.length, 1)
})

const transportFee = computed(() => {
  return transportDays.value * TRANSPORT_RATE
})

const oneTimeFee = computed(() => {
  let fee = implementationFee.value + transportFee.value
  
  if (deploymentMode.value === 'onprem_license') {
    fee += baseMonthlyCost.value * LICENSE_MULTIPLIER
  } else if (deploymentMode.value === 'onprem_source') {
    fee += baseMonthlyCost.value * SOURCE_CODE_MULTIPLIER
  }
  
  return fee
})

const monthlyRecurring = computed(() => {
  if (deploymentMode.value === 'cloud') {
    return baseMonthlyCost.value
  }
  return 0 // No monthly for On-Prem (excluding support contracts for now)
})

const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num)
}

// Demo Form Logic
const loading = ref(false)
const message = ref('')
const messageType = ref('')
const form = ref({
  name: '',
  email: '',
  phone: ''
})

const submitDemo = async () => {
  loading.value = true
  message.value = ''
  
  try {
    const payload = {
       ...form.value,
       selectedSubModules: selectedSubModules.value,
       employeeCount: employeeCount.value,
       deploymentMode: deploymentMode.value,
       consultationHours: consultationHours.value,
       transportDays: transportDays.value,
       monthlyRecurring: monthlyRecurring.value,
       oneTimeFee: oneTimeFee.value,
       module: 'HRIS'
    }

    const { data, error } = await useFetch('http://localhost:8888/api/public/request-demo', {
      method: 'POST',
      body: payload
    })

    if (error.value) {
      throw new Error(error.value.message || 'Failed to send request')
    }

    message.value = 'Thank you! Your demo request has been sent successfully.'
    messageType.value = 'success'
    form.value = { name: '', email: '', phone: '' } // Reset form
  } catch (err) {
    message.value = 'Something went wrong. Please try again later.'
    messageType.value = 'error'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="relative overflow-hidden bg-slate-900 text-slate-100 font-sans">
    <!-- Hero Section -->
    <section class="relative pt-20 pb-32 lg:pt-32 lg:pb-48">
        <!-- Background Effects -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
            <div class="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
            <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] mix-blend-screen"></div>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-8 backdrop-blur-sm">
                <span class="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping"></span>
                <span>The Future of Work is Here</span>
            </div>
            
            <h1 class="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
                Empower Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Workforce</span>
                <br />
                <span class="text-4xl md:text-6xl text-slate-400 font-normal">Simplify Your HR</span>
            </h1>
            
            <p class="mt-6 text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Connect your people, processes, and tools in one unified platform. 
                Experience the next generation of Human Resource Information Systems.
            </p>
            
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <NuxtLink to="/login" class="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:scale-105">
                    Get Started Now
                </NuxtLink>
                <div class="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all backdrop-blur-sm hover:scale-105 cursor-pointer">
                    View Demo
                </div>
            </div>
        </div>
    </section>

    <!-- Features Grid -->
    <section id="features" class="relative py-24 bg-slate-900/50 border-t border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-white mb-4">Everything you need to manage your team</h2>
                <p class="text-slate-400">Powerful features designed for modern organizations.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div v-for="(feature, index) in features" :key="index" 
                     class="group p-8 rounded-2xl bg-slate-800/50 border border-white/5 hover:border-indigo-500/30 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1">
                    <div class="text-4xl mb-6 bg-slate-900/50 w-16 h-16 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform duration-300">
                        {{ feature.icon }}
                    </div>
                    <h3 class="text-xl font-semibold text-white mb-3 group-hover:text-indigo-400 transition-colors">{{ feature.title }}</h3>
                    <p class="text-slate-400 leading-relaxed">
                        {{ feature.description }}
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-24 bg-slate-950 relative border-t border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-white mb-4">Flexible Pricing</h2>
          <p class="text-slate-400">Choose the plan that fits your organization structure.</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-8 items-start">
          <!-- Left Column Wrapper -->
          <div class="w-full lg:w-2/3">
            <!-- Deployment Mode -->
            <div class="mb-12">
               <h3 class="text-lg font-semibold text-white mb-6">Choose Deployment</h3>
               <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <button 
                  @click="deploymentMode = 'cloud'" 
                  :class="`p-4 rounded-xl border-2 text-left transition-all ${deploymentMode === 'cloud' ? 'border-indigo-600 bg-indigo-900/20 ring-2 ring-indigo-500/50' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`"
                 >
                   <div :class="`font-bold ${deploymentMode === 'cloud'? 'text-indigo-400' : 'text-slate-300'}`">Cloud</div>
                   <div class="text-xs text-slate-500 mt-1">Monthly Subscription. Managed Infrastructure.</div>
                 </button>
                 <button 
                  @click="deploymentMode = 'onprem_license'" 
                  :class="`p-4 rounded-xl border-2 text-left transition-all ${deploymentMode === 'onprem_license' ? 'border-indigo-600 bg-indigo-900/20 ring-2 ring-indigo-500/50' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`"
                 >
                   <div :class="`font-bold ${deploymentMode === 'onprem_license'? 'text-indigo-400' : 'text-slate-300'}`">On-Premise</div>
                   <div class="text-xs text-slate-500 mt-1">One-time License. No Source Code.</div>
                 </button>
                 <button 
                  @click="deploymentMode = 'onprem_source'" 
                  :class="`p-4 rounded-xl border-2 text-left transition-all ${deploymentMode === 'onprem_source' ? 'border-indigo-600 bg-indigo-900/20 ring-2 ring-indigo-500/50' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`"
                 >
                   <div :class="`font-bold ${deploymentMode === 'onprem_source'? 'text-indigo-400' : 'text-slate-300'}`">Full Source</div>
                   <div class="text-xs text-slate-500 mt-1">One-time Purchase. With Source Code.</div>
                 </button>
               </div>
            </div>

            <!-- Sub Modules Selection -->
            <div class="w-full">
            <h3 class="text-lg font-semibold text-white mb-6">Select Modules</h3>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                v-for="mod in availableSubModules" 
                :key="mod.id"
                @click="toggleSubModule(mod)"
                :class="`cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center text-center hover:scale-105 active:scale-95 ${selectedSubModules.includes(mod.id) ? 'border-indigo-600 bg-indigo-900/20 shadow-[0_0_15px_-5px_rgba(99,102,241,0.3)]' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`"
              >
                <!-- Checkmark -->
                <div v-if="selectedSubModules.includes(mod.id)" class="absolute top-2 right-2 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px]">
                  ✓
                </div>

                <div class="text-3xl mb-3">{{ mod.icon }}</div>
                <h4 :class="`font-medium text-sm h-10 flex items-center justify-center ${selectedSubModules.includes(mod.id) ? 'text-white' : 'text-slate-400'}`">{{ mod.name }}</h4>
                <p class="text-xs text-slate-500 mt-2">Rp {{ formatNumber(mod.price) }}/emp</p>
              </div>
            </div>

            <!-- Users & Employees Config -->
            <div class="mt-12 space-y-8">
               <div class="bg-slate-900 p-8 rounded-2xl border border-white/10">
                  <div class="flex items-center justify-between mb-4">
                     <h3 class="text-lg font-semibold text-white">Employee Count</h3>
                      <div class="flex items-center space-x-4">
                        <button @click="employeeCount > 10 ? employeeCount-=10 : null" class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-700 font-bold text-xl hover:scale-110 transition-transform active:scale-95">-</button>
                        <input type="number" v-model.number="employeeCount" class="w-24 text-center bg-transparent text-xl font-bold outline-none text-white border-b border-indigo-500/50 focus:border-indigo-500" min="10" step="10">
                        <button @click="employeeCount+=10" class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-700 font-bold text-xl hover:scale-110 transition-transform active:scale-95">+</button>
                      </div>
                  </div>
                  <p class="text-slate-500 text-sm">Total number of active employees for payroll and ESS calculation.</p>
               </div>
            </div>

            <!-- Services Section -->
            <div class="mt-12">
               <h3 class="text-lg font-semibold text-white mb-6">Implementation Services</h3>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="bg-slate-900 p-6 rounded-2xl border border-white/10">
                     <label class="block font-semibold text-slate-300 mb-2">Consultation</label>
                     <div class="flex items-center space-x-2">
                       <input type="number" v-model.number="consultationHours" class="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600" min="0">
                       <span class="text-slate-500 text-sm">Hours</span>
                     </div>
                     <p class="text-xs text-slate-500 mt-2">Rate: Rp {{ formatNumber(CONSULTATION_RATE) }} / hr / module</p>
                  </div>
                  <div class="bg-slate-900 p-6 rounded-2xl border border-white/10">
                     <label class="block font-semibold text-slate-300 mb-2">Transport & Accom.</label>
                     <div class="flex items-center space-x-2">
                       <input type="number" v-model.number="transportDays" class="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600" min="0">
                       <span class="text-slate-500 text-sm">Days</span>
                     </div>
                     <p class="text-xs text-slate-500 mt-2">Rate: Rp {{ formatNumber(TRANSPORT_RATE) }} / day</p>
                  </div>
               </div>
            </div>
          </div>
          </div>

          <!-- Sticky Summary -->
          <div class="w-full lg:w-1/3 lg:sticky lg:top-24">
            <div class="bg-slate-900 rounded-2xl shadow-xl border border-white/10 p-8">
              <h3 class="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">Estimated Investment</h3>
              
              <div class="space-y-3 mb-6">
                 <!-- Deployment Info -->
                 <div class="flex justify-between text-sm text-slate-400 font-medium bg-slate-800 p-2 rounded border border-white/5">
                  <span>Deployment</span>
                  <span class="capitalize text-indigo-400">{{ deploymentMode.replace('_', ' ') }}</span>
                </div>

                <div class="flex justify-between text-sm text-slate-400">
                  <span>Employees ({{ employeeCount }})</span>
                  <span>Variable</span>
                </div>
                <div class="flex justify-between text-sm text-slate-400">
                  <span>Selected Modules ({{ selectedSubModules.length }})</span>
                  <span class="text-white">{{ selectedSubModules.length }}</span>
                </div>
              </div>

               <!-- One Time Fees -->
               <div v-if="oneTimeFee > 0" class="pt-4 border-t border-white/10 mb-4">
                  <div class="flex justify-between text-sm text-slate-400 mb-1">
                    <span>Implementation Services</span>
                    <span>Rp {{ formatNumber(implementationFee) }}</span>
                  </div>
                  <div class="flex justify-between text-sm text-slate-400 mb-1">
                    <span>Transport & Accom.</span>
                    <span>Rp {{ formatNumber(transportFee) }}</span>
                  </div>
                  <div v-if="deploymentMode !== 'cloud'" class="flex justify-between text-sm text-white font-bold mt-2">
                    <span>One-Time License/Source</span>
                    <span>Rp {{ formatNumber(oneTimeFee - implementationFee - transportFee) }}</span>
                  </div>
                   <div class="flex justify-between text-lg font-bold text-indigo-400 mt-2 pt-2 border-t border-dashed border-white/10">
                    <span>Total One-Time</span>
                    <span>Rp {{ formatNumber(oneTimeFee) }}</span>
                  </div>
               </div>
              
              <div class="pt-6 border-t border-white/10">
                 <p class="text-xs text-slate-500 mb-1">Recurring Monthly Investment</p>
                 <div class="text-3xl font-extrabold text-white mb-2">
                   Rp {{ formatNumber(monthlyRecurring) }}
                 </div>
                 <p v-if="deploymentMode === 'cloud'" class="text-xs text-slate-500">Billed Annually. Per Employee / Month.</p>
                 <p v-else class="text-xs text-slate-500">No monthly fee (excluding support).</p>
              </div>

              <div class="mt-8 pt-6 border-t border-white/10">
                  <button class="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] hover:bg-indigo-500 transition-all hover:-translate-y-1">
                    Request Proposal
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Request Demo Section -->
    <section id="demo" class="py-24 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-white/5">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-xl border border-white/10 p-10 md:p-16">
          <div class="text-center mb-10">
            <h2 class="text-3xl font-bold text-white mb-4">Ready to Modernize Your HR?</h2>
            <p class="text-slate-400">Schedule a personalized demo with our HR tech experts.</p>
          </div>

          <form @submit.prevent="submitDemo" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="col-span-1">
                <label class="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input v-model="form.name" type="text" required class="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" placeholder="John Doe">
              </div>
              <div class="col-span-1">
                <label class="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                <input v-model="form.phone" type="tel" required class="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" placeholder="+1 (555) 000-0000">
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Work Email</label>
              <input v-model="form.email" type="email" required class="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" placeholder="john@company.com">
            </div>

            <button 
              type="submit" 
              :disabled="loading"
              class="w-full py-4 rounded-xl bg-white text-slate-900 font-bold text-lg shadow-lg hover:bg-slate-200 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span v-if="!loading">Send Request</span>
              <span v-else>Sending...</span>
            </button> 

            <p v-if="message" :class="`text-center text-sm font-medium ${messageType === 'success' ? 'text-green-400' : 'text-red-400'}`">
              {{ message }}
            </p>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>
