<template>
  <div class="erp-page">
    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl shadow-2xl animate-pulse-slow"></div>
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl shadow-2xl animate-pulse-slow" style="animation-delay: 2s;"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          <span class="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{{ $t('ERP.HERO.TITLE_PREFIX') }}</span><br />
          <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{{ $t('ERP.HERO.TITLE_SUFFIX') }}</span>
        </h1>
        <p class="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
          {{ $t('ERP.HERO.SUBTITLE') }}
        </p>
        <div class="flex justify-center gap-4">
          <button class="px-8 py-4 rounded-full bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all transform hover:-translate-y-1">
            {{ $t('ERP.HERO.GET_STARTED') }}
          </button>
          <button class="px-8 py-4 rounded-full bg-white text-slate-700 font-semibold border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
            {{ $t('ERP.HERO.LEARN_MORE') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-24 bg-white relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900 mb-4">{{ $t('ERP.FEATURES.TITLE') }}</h2>
          <p class="text-slate-500">{{ $t('ERP.FEATURES.SUBTITLE') }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            :title="$t('LANDING.FEATURES.VISUAL_BUILDER.TITLE')"
            :description="$t('LANDING.FEATURES.VISUAL_BUILDER.DESC')"
            icon="✨"
            color="bg-purple-50 text-purple-600"
          />
          <FeatureCard 
            title="Drag n Drop" 
            description="Intuitive interface for effortless management."
            icon="👆"
            color="bg-blue-50 text-blue-600"
          />
          <FeatureCard 
            title="Form Design" 
            description="Create custom forms in minutes, no code required."
            icon="📝"
            color="bg-green-50 text-green-600"
          />
          <FeatureCard 
            title="Workflow Design" 
            description="Visualise and optimize your business processes."
            icon="🔄"
            color="bg-orange-50 text-orange-600"
          />
          <FeatureCard 
            title="Widget Design" 
            description="Personalize your dashboard with custom widgets."
            icon="🧩"
            color="bg-pink-50 text-pink-600"
          />
          <FeatureCard 
            title="Table Design" 
            description="Powerful data grids with advanced sorting and filtering."
            icon="📊"
            color="bg-cyan-50 text-cyan-600"
          />
        </div>
      </div>
    </section>

    <!-- Modules Section -->
    <section id="modules" class="py-24 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900 mb-4">{{ $t('ERP.MODULES.TITLE') }}</h2>
          <p class="text-slate-500">{{ $t('ERP.MODULES.SUBTITLE') }}</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ModuleCard :title="$t('ERP.APPS.ACCOUNTING')" icon="💰" />
          <ModuleCard :title="$t('ERP.APPS.WAREHOUSE')" icon="🏭" />
          <ModuleCard :title="$t('ERP.APPS.PRODUCTION')" icon="⚙️" />
          <ModuleCard :title="$t('ERP.APPS.HR')" icon="👥" />
          <ModuleCard :title="$t('ERP.APPS.ORDER')" icon="🛒" />
          <ModuleCard :title="$t('ERP.APPS.PROCUREMENT')" icon="🛍️" />
          <ModuleCard :title="$t('ERP.APPS.PROJECT')" icon="📉" />
        </div>
      </div>
    </section>
    <!-- Pricing Section -->
    <section id="pricing" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900 mb-4">{{ $t('ERP.PRICING.TITLE') }}</h2>
          <p class="text-slate-500">{{ $t('ERP.PRICING.SUBTITLE') }}</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-8 items-start">
          <!-- Left Column Wrapper -->
          <div class="w-full lg:w-2/3">
            <!-- Deployment Mode -->
            <div class="mb-12">
               <h3 class="text-lg font-semibold text-slate-900 mb-6">{{ $t('ERP.PRICING.CHOOSE_DEPLOYMENT') }}</h3>
               <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <button 
                  @click="deploymentMode = 'cloud'" 
                  :class="`p-4 rounded-xl border-2 text-left transition-all ${deploymentMode === 'cloud' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 bg-white'}`"
                 >
                   <div class="font-bold text-slate-800">Cloud</div>
                   <div class="text-xs text-slate-500 mt-1">Monthly Subscription. Managed Infrastructure.</div>
                 </button>
                 <button 
                  @click="deploymentMode = 'onprem_license'" 
                  :class="`p-4 rounded-xl border-2 text-left transition-all ${deploymentMode === 'onprem_license' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 bg-white'}`"
                 >
                   <div class="font-bold text-slate-800">On-Premise</div>
                   <div class="text-xs text-slate-500 mt-1">One-time License. No Source Code.</div>
                 </button>
                 <button 
                  @click="deploymentMode = 'onprem_source'" 
                  :class="`p-4 rounded-xl border-2 text-left transition-all ${deploymentMode === 'onprem_source' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 bg-white'}`"
                 >
                   <div class="font-bold text-slate-800">Full Source</div>
                   <div class="text-xs text-slate-500 mt-1">One-time Purchase. With Source Code.</div>
                 </button>
               </div>
            </div>

            <!-- Apps Selection -->
            <div class="w-full">
            <h3 class="text-lg font-semibold text-slate-900 mb-6">{{ $t('ERP.PRICING.SELECT_APPS') }}</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div 
                v-for="app in availableApps" 
                :key="app.id"
                @click="toggleApp(app)"
                :class="`cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center text-center hover:scale-105 active:scale-95 ${selectedApps.includes(app.id) ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-300'}`"
              >
                <!-- Checkmark -->
                <div v-if="selectedApps.includes(app.id)" class="absolute top-2 right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                  ✓
                </div>

                <div class="text-4xl mb-3">{{ app.icon }}</div>
                <h4 class="font-medium text-slate-800 text-sm h-10 flex items-center justify-center">{{ app.name }}</h4>
                <p class="text-xs text-slate-500 mt-2">Rp {{ formatNumber(app.price) }}</p>
              </div>
            </div>

            <!-- Users & Storage Config -->
            <div class="mt-12 space-y-8">
               <div class="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                  <div class="flex items-center justify-between mb-4">
                     <h3 class="text-lg font-semibold text-slate-900">{{ $t('ERP.PRICING.USERS_COUNT') }}</h3>
                      <div class="flex items-center space-x-4">
                        <button @click="usersCount > 1 ? usersCount-- : null" class="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold text-xl hover:scale-110 transition-transform active:scale-95">-</button>
                        <input type="number" v-model.number="usersCount" class="w-20 text-center bg-transparent text-xl font-bold outline-none" min="1">
                        <button @click="usersCount++" class="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold text-xl hover:scale-110 transition-transform active:scale-95">+</button>
                      </div>
                  </div>
                  <p class="text-slate-500 text-sm">{{ $t('ERP.PRICING.USERS_NOTE') }}</p>
               </div>

               <div v-if="deploymentMode === 'cloud'" class="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                  <div class="flex items-center justify-between mb-2">
                     <h3 class="text-lg font-semibold text-slate-900">{{ $t('ERP.PRICING.STORAGE') }}</h3>
                     <span class="font-bold text-blue-600">{{ storageSize }} GB</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="500" 
                    step="10" 
                    v-model.number="storageSize"
                    class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  >
                  <p class="text-sm text-slate-400 mt-2">{{ $t('ERP.PRICING.STORAGE_NOTE') }}</p>
               </div>
            </div>

            <!-- Services Section -->
            <div class="mt-12">
               <h3 class="text-lg font-semibold text-slate-900 mb-6">{{ $t('ERP.PRICING.SERVICES') }}</h3>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                     <label class="block font-semibold text-slate-700 mb-2">{{ $t('ERP.PRICING.CONSULTATION') }}</label>
                     <div class="flex items-center space-x-2">
                       <input type="number" v-model.number="consultationHours" class="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500" min="0">
                       <span class="text-slate-500 text-sm">Hours</span>
                     </div>
                     <p class="text-xs text-slate-400 mt-2">Rate: Rp {{ formatNumber(CONSULTATION_RATE) }} / hr / module</p>
                  </div>
                  <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                     <label class="block font-semibold text-slate-700 mb-2">{{ $t('ERP.PRICING.TRANSPORT') }}</label>
                     <div class="flex items-center space-x-2">
                       <input type="number" v-model.number="transportDays" class="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500" min="0">
                       <span class="text-slate-500 text-sm">Days</span>
                     </div>
                     <p class="text-xs text-slate-400 mt-2">Rate: Rp {{ formatNumber(TRANSPORT_RATE) }} / day</p>
                  </div>
               </div>
            </div>

            <!-- Workflow Components Selection -->
             <div class="mt-12">
               <h3 class="text-lg font-semibold text-slate-900 mb-6">{{ $t('ERP.PRICING.WORKFLOWS') }}</h3>
               <div class="space-y-6">
                 <div v-for="(workflows, category) in workflowCategories" :key="category">
                    <h4 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">{{ category }}</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div 
                        v-for="wf in workflows" 
                        :key="wf.id" 
                        @click="toggleWorkflow(wf)"
                        :class="`cursor-pointer relative p-3 rounded-lg border flex items-center space-x-3 transition-all hover:shadow-md ${selectedWorkflows.includes(wf.id) ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`"
                      >
                         <div class="text-2xl">{{ wf.icon }}</div>
                         <div class="flex-1">
                           <div class="font-medium text-slate-800 text-sm">{{ wf.name }}</div>
                           <div class="text-xs text-slate-500">Rp {{ formatNumber(wf.price) }} / mo</div>
                         </div>
                         <div v-if="selectedWorkflows.includes(wf.id)" class="text-blue-600 font-bold">✓</div>
                      </div>
                    </div>
                 </div>
               </div>
             </div>

          </div>
          </div>

          <!-- Sticky Summary -->
          <div class="w-full lg:w-1/3 lg:sticky lg:top-24">
            <div class="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
              <h3 class="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">{{ $t('ERP.PRICING.ESTIMATED_COST') }}</h3>
              
              <div class="space-y-3 mb-6">
                 <!-- Deployment Info -->
                 <div class="flex justify-between text-sm text-slate-600 font-medium bg-slate-50 p-2 rounded">
                  <span>{{ $t('ERP.PRICING.DEPLOYMENT') }}</span>
                  <span class="capitalize">{{ deploymentMode.replace('_', ' ') }}</span>
                </div>

                <div class="flex justify-between text-sm text-slate-600">
                  <span>Users ({{ usersCount }})</span>
                  <span>{{ usersCount }} x User Rate</span>
                </div>
                <div class="flex justify-between text-sm text-slate-600">
                  <span>Selected Apps ({{ selectedApps.length }})</span>
                  <span class="cursor-pointer text-blue-600 hover:underline" title="View details">Details</span>
                </div>
                 <div class="flex justify-between text-sm text-slate-600">
                  <span>Workflows ({{ selectedWorkflows.length }})</span>
                  <span class="cursor-pointer text-blue-600 hover:underline">Details</span>
                </div>
                 <div v-if="deploymentMode === 'cloud'" class="flex justify-between text-sm text-slate-600">
                  <span>Storage ({{ storageSize }} GB)</span>
                  <span>Rp {{ formatNumber(extraStorageCost) }}</span>
                </div>
              </div>

               <!-- One Time Fees -->
               <div v-if="oneTimeFee > 0" class="pt-4 border-t border-slate-100 mb-4">
                  <div class="flex justify-between text-sm text-slate-600 mb-1">
                    <span>Implementation Services</span>
                    <span>Rp {{ formatNumber(implementationFee) }}</span>
                  </div>
                  <div class="flex justify-between text-sm text-slate-600 mb-1">
                    <span>Transport & Accom.</span>
                    <span>Rp {{ formatNumber(transportFee) }}</span>
                  </div>
                  <div v-if="deploymentMode !== 'cloud'" class="flex justify-between text-sm text-slate-900 font-bold mt-2">
                    <span>One-Time License/Source</span>
                    <span>Rp {{ formatNumber(oneTimeFee - implementationFee - transportFee) }}</span>
                  </div>
                   <div class="flex justify-between text-lg font-bold text-slate-800 mt-2 pt-2 border-t border-dashed border-slate-200">
                    <span>{{ $t('ERP.PRICING.TOTAL_ONE_TIME') }}</span>
                    <span>Rp {{ formatNumber(oneTimeFee) }}</span>
                  </div>
               </div>
              
              <div class="pt-6 border-t border-slate-100">
                 <p class="text-xs text-slate-500 mb-1">{{ $t('ERP.PRICING.TOTAL_MONTHLY') }}</p>
                 <div class="text-3xl font-extrabold text-blue-600 mb-2">
                   Rp {{ formatNumber(monthlyRecurring) }}
                 </div>
                 <p v-if="deploymentMode === 'cloud'" class="text-xs text-slate-400">Billed Annually</p>
                 <p v-else class="text-xs text-slate-400">No monthly fee (excluding support).</p>
              </div>

              <button class="w-full mt-8 py-3 rounded-xl bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all hover:-translate-y-1">
                {{ $t('ERP.PRICING.REQUEST_QUOTE') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Request Demo Section -->
    <section id="demo" class="py-24 bg-slate-50">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-3xl shadow-xl p-10 md:p-16">
          <div class="text-center mb-10">
            <h2 class="text-3xl font-bold text-slate-900 mb-4">{{ $t('ERP.DEMO.TITLE') }}</h2>
            <p class="text-slate-500">{{ $t('ERP.DEMO.SUBTITLE') }}</p>
          </div>

          <form @submit.prevent="submitDemo" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="col-span-1">
                <label class="block text-sm font-medium text-slate-700 mb-2">{{ $t('ERP.DEMO.NAME') }}</label>
                <input v-model="form.name" type="text" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="John Doe">
              </div>
              <div class="col-span-1">
                <label class="block text-sm font-medium text-slate-700 mb-2">{{ $t('ERP.DEMO.PHONE') }}</label>
                <input v-model="form.phone" type="tel" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="+1 (555) 000-0000">
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">{{ $t('ERP.DEMO.EMAIL') }}</label>
              <input v-model="form.email" type="email" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="john@company.com">
            </div>

            <button 
              type="submit" 
              :disabled="loading"
              class="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span v-if="!loading">{{ $t('ERP.DEMO.SEND') }}</span>
              <span v-else>{{ $t('ERP.DEMO.SENDING') }}</span>
            </button> 

            <p v-if="message" :class="`text-center text-sm font-medium ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`">
              {{ message }}
            </p>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

definePageMeta({
  layout: 'erp'
})

// Pricing Logic
const availableApps = computed(() => [
  { id: 'accounting', name: t('ERP.APPS.ACCOUNTING'), price: 250000, icon: '💰' },
  { id: 'warehouse', name: t('ERP.APPS.WAREHOUSE'), price: 150000, icon: '🏭' },
  { id: 'production', name: t('ERP.APPS.PRODUCTION'), price: 200000, icon: '⚙️' },
  { id: 'order', name: t('ERP.APPS.ORDER'), price: 80000, icon: '🛒' },
  { id: 'procurement', name: t('ERP.APPS.PROCUREMENT'), price: 80000, icon: '🛍️' },
  { id: 'eprocurement', name: t('ERP.APPS.EPROCUREMENT'), price: 80000, icon: '🌐' },
  { id: 'hr', name: t('ERP.APPS.HR'), price: 0, icon: '👥' },
  { id: 'project', name: t('ERP.APPS.PROJECT'), price: 0, icon: '📉' }
])


const availableWorkflows = [
  // AI & Analytics (Cat 5, 6)
  { id: 'ai_assistant', name: 'AI Assistant', price: 150000, category: 'AI & Data', icon: '✨' },
  { id: 'openai', name: 'ChatGPT (OpenAI)', price: 100000, category: 'AI & Data', icon: '🧠' },
  { id: 'data_analytic', name: 'Data Analytics', price: 120000, category: 'AI & Data', icon: '📊' },
  { id: 'ocr_extractor', name: 'OCR Extractor', price: 80000, category: 'AI & Data', icon: '📄' },

  // Communication (Cat 7)
  { id: 'whatsapp', name: 'WhatsApp Cloud API', price: 100000, category: 'Communication', icon: '💬' },
  { id: 'telegram', name: 'Telegram Bot', price: 50000, category: 'Communication', icon: '✈️' },
  { id: 'slack', name: 'Slack Integration', price: 50000, category: 'Communication', icon: '🗨️' },
  { id: 'gmail', name: 'Gmail Integration', price: 50000, category: 'Communication', icon: '📧' },
  { id: 'smtp', name: 'STMP Email', price: 20000, category: 'Communication', icon: '📨' },

  // E-Commerce & Marketing (Cat 12, 13)
  { id: 'shopee', name: 'Shopee Integration', price: 150000, category: 'E-Commerce', icon: '🛍️' },
  { id: 'tokopedia', name: 'Tokopedia Integration', price: 150000, category: 'E-Commerce', icon: '🏪' },
  { id: 'tiktok_shop', name: 'TikTok Shop', price: 150000, category: 'E-Commerce', icon: '🎵' },
  { id: 'lazada', name: 'Lazada Integration', price: 150000, category: 'E-Commerce', icon: '📦' },
  { id: 'facebook', name: 'Facebook Ads', price: 80000, category: 'Marketing', icon: '👍' },
  { id: 'instagram', name: 'Instagram', price: 80000, category: 'Marketing', icon: '📸' },

  // Finance (Cat 11)
  { id: 'bca', name: 'BCA Banking', price: 200000, category: 'Finance', icon: '🏦' },
  { id: 'bri', name: 'Bank BRI', price: 200000, category: 'Finance', icon: '🏦' },
  { id: 'xendit', name: 'Xendit Payment', price: 150000, category: 'Finance', icon: '💳' },
  { id: 'midtrans', name: 'Midtrans Payment', price: 150000, category: 'Finance', icon: '💳' },
  { id: 'paypal', name: 'PayPal', price: 100000, category: 'Finance', icon: '🅿️' },
  { id: 'jurnal', name: 'Jurnal.id', price: 100000, category: 'Finance', icon: '📒' },

  // Database & Storage (Cat 3)
  { id: 'mysql', name: 'MySQL Database', price: 50000, category: 'Database', icon: '🗄️' },
  { id: 'postgres', name: 'PostgreSQL', price: 50000, category: 'Database', icon: '🐘' },
  { id: 'sqlserver', name: 'SQL Server', price: 100000, category: 'Database', icon: '💾' },
  { id: 'oracle', name: 'Oracle Database', price: 150000, category: 'Database', icon: '🔴' },
  { id: 'gdrive', name: 'Google Drive', price: 40000, category: 'Storage', icon: '📁' },
  { id: 's3', name: 'S3 / MinIO', price: 40000, category: 'Storage', icon: '☁️' },

  // Developer Tools (Cat 9, 10, etc.)
  { id: 'github', name: 'GitHub', price: 30000, category: 'DevTools', icon: '🐙' },
  { id: 'gitlab', name: 'GitLab', price: 30000, category: 'DevTools', icon: '🦊' },
  { id: 'webhook', name: 'Webhook', price: 20000, category: 'DevTools', icon: '🔗' },
  { id: 'api', name: 'API Call', price: 20000, category: 'DevTools', icon: '🔌' },
]

const selectedApps = ref(['accounting', 'warehouse'])
const selectedWorkflows = ref([])
const usersCount = ref(10)
const storageSize = ref(10)

// New Configuration States
const deploymentMode = ref('cloud') // 'cloud', 'onprem_license', 'onprem_source'
const consultationHours = ref(0)
const transportDays = ref(0)

const CONSULTATION_RATE = 200000 // Per Hour Per Module
const TRANSPORT_RATE = 2500000 // Per Day (Travel + Accom assumption)
const LICENSE_MULTIPLIER = 12 // 1 year equivalent for perpetual
const SOURCE_CODE_MULTIPLIER = 50 // Premium for source code

const workflowCategories = computed(() => {
  const categories = {}
  availableWorkflows.forEach(wf => {
    if (!categories[wf.category]) categories[wf.category] = []
    categories[wf.category].push(wf)
  })
  return categories
})

const toggleApp = (app) => {
  if (selectedApps.value.includes(app.id)) selectedApps.value = selectedApps.value.filter(id => id !== app.id)
  else selectedApps.value.push(app.id)
}

const toggleWorkflow = (wf) => {
  if (selectedWorkflows.value.includes(wf.id)) selectedWorkflows.value = selectedWorkflows.value.filter(id => id !== wf.id)
  else selectedWorkflows.value.push(wf.id)
}

const extraStorageCost = computed(() => {
  if (deploymentMode.value !== 'cloud') return 0 // No storage cost for on-prem
  if (storageSize.value <= 10) return 0
  const extra = storageSize.value - 10
  return Math.ceil(extra / 10) * 20000
})

const baseMonthlyCost = computed(() => {
  let appCostPerUser = 0
  selectedApps.value.forEach(appId => {
    const app = availableApps.find(a => a.id === appId)
    if (app) appCostPerUser += app.price
  })
  
  let workflowCost = 0
  selectedWorkflows.value.forEach(wfId => {
    const wf = availableWorkflows.find(w => w.id === wfId)
    // Assuming workflow is flat monthly
    if (wf) workflowCost += wf.price
  })

  return (appCostPerUser * usersCount.value) + workflowCost
})

const implementationFee = computed(() => {
  // Price per hour per module selected
  return consultationHours.value * CONSULTATION_RATE * Math.max(selectedApps.value.length, 1)
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
    return baseMonthlyCost.value + extraStorageCost.value
  }
  return 0 // No monthly for On-Prem (excluding support contracts for now)
})

const savings = computed(() => {
  if (deploymentMode.value === 'cloud') {
    return monthlyRecurring.value * 12 * 0.2
  }
  return 0
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
       selectedApps: selectedApps.value,
       selectedWorkflows: selectedWorkflows.value,
       usersCount: usersCount.value,
       storageSize: storageSize.value,
       deploymentMode: deploymentMode.value,
       consultationHours: consultationHours.value,
       transportDays: transportDays.value,
       monthlyRecurring: monthlyRecurring.value,
       oneTimeFee: oneTimeFee.value
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

<script>
// Inline components for simplicity within this single file structure, 
// or normally would be separate components. We define them here for immediate usage.
import { h } from 'vue'

const FeatureCard = (props) => {
  return h('div', { class: 'group p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1' }, [
    h('div', { class: `w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 ${props.color} group-hover:scale-110 transition-transform` }, props.icon),
    h('h3', { class: 'text-xl font-bold text-slate-900 mb-2' }, props.title),
    h('p', { class: 'text-slate-500 leading-relaxed' }, props.description)
  ])
}

const ModuleCard = (props) => {
  return h('div', { class: 'flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group' }, [
    h('div', { class: 'text-4xl mb-4 group-hover:scale-110 transition-transform duration-300' }, props.icon),
    h('h3', { class: 'font-semibold text-slate-700 group-hover:text-blue-600 transition-colors' }, props.title)
  ])
}
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.15;
    transform: scale(1.1);
  }
}
</style>
