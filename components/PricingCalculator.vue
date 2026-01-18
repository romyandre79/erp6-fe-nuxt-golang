<template>
  <div class="pricing-calculator space-y-24">
    <!-- Pricing Section -->
    <section id="pricing" :class="`py-24 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 :class="`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`">{{ $t('ERP.PRICING.TITLE') || 'Calculate Your Price' }}</h2>
          <p :class="`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`">{{ $t('ERP.PRICING.SUBTITLE') || 'Select the applications you need and the number of users.' }}</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-8 items-start">
          <!-- Left Column Wrapper -->
          <div class="w-full lg:w-2/3">
            <!-- Deployment Mode -->
            <div class="mb-12">
               <h3 :class="`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`">{{ $t('ERP.PRICING.CHOOSE_DEPLOYMENT') }}</h3>
               <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <button 
                  v-for="mode in ['cloud', 'onprem_license', 'onprem_source']"
                  :key="mode"
                  @click="deploymentMode = mode" 
                  :class="`p-4 rounded-xl border-2 text-left transition-all ${getDeploymentClass(mode)}`"
                 >
                   <div :class="`font-bold ${getDeploymentTextClass(mode)}`">{{ getDeploymentTitle(mode) }}</div>
                   <div :class="`text-xs mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`">{{ getDeploymentDesc(mode) }}</div>
                 </button>
               </div>
            </div>

            <!-- Cloud Billing Type Selection -->
            <div v-if="deploymentMode === 'cloud'" class="mb-8">
               <label :class="`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`">{{ $t('ERP.PRICING.BILLING_MODEL') }}</label>
               <div :class="`inline-flex p-1 rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100 border border-slate-200'}`">
                 <button 
                   @click="cloudBillingType = 'subscription'"
                   :class="`px-5 py-2 rounded-lg text-sm font-bold transition-all ${cloudBillingType === 'subscription' ? (theme === 'dark' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-blue-600 shadow-md') : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')}`"
                 >
                   {{ $t('ERP.PRICING.SUBSCRIPTION') }}
                 </button>
                 <button 
                   @click="cloudBillingType = 'payg'"
                   :class="`px-5 py-2 rounded-lg text-sm font-bold transition-all ${cloudBillingType === 'payg' ? (theme === 'dark' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-blue-600 shadow-md') : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')}`"
                 >
                   {{ $t('ERP.PRICING.PAY_AS_YOU_GO') }}
                 </button>
               </div>
               <p :class="`text-xs mt-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`">
                 {{ cloudBillingType === 'subscription' ? $t('ERP.PRICING.BILLING_SUBSCRIPTION_NOTE') : $t('ERP.PRICING.BILLING_PAYG_NOTE') }}
               </p>
            </div>

            <!-- Billing Period (Monthly/Yearly) for Subscription -->
            <div v-if="deploymentMode === 'cloud' && cloudBillingType === 'subscription'" class="mb-8">
               <label :class="`block text-sm font-bold mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`">{{ $t('ERP.PRICING.BILLING_PERIOD') }}</label>
               <div :class="`inline-flex p-1 rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100 border border-slate-200'}`">
                 <button 
                   @click="billingPeriod = 'monthly'"
                   :class="`px-5 py-2 rounded-lg text-sm font-bold transition-all ${billingPeriod === 'monthly' ? (theme === 'dark' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-blue-600 shadow-md') : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')}`"
                 >
                   {{ $t('ERP.PRICING.MONTHLY') }}
                 </button>
                 <button 
                   @click="billingPeriod = 'yearly'"
                   :class="`px-5 py-2 rounded-lg text-sm font-bold transition-all ${billingPeriod === 'yearly' ? (theme === 'dark' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-blue-600 shadow-md') : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')}`"
                 >
                   {{ $t('ERP.PRICING.YEARLY') }}
                   <span :class="`ml-2 px-2 py-0.5 rounded-full text-xs ${billingPeriod === 'yearly' ? 'bg-green-500 text-white' : 'bg-green-500/20 text-green-400'}`">{{ $t('ERP.PRICING.SAVE') }} {{yearlyDiscount * 100}}%</span>
                 </button>
               </div>
               <p :class="`text-xs mt-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`">
                 {{ billingPeriod === 'monthly' ? $t('ERP.PRICING.BILLING_MONTHLY_NOTE') : $t('ERP.PRICING.BILLING_YEARLY_NOTE', { percentage: yearlyDiscount * 100 }) }}
               </p>
            </div>

            <!-- Apps Selection (Hidden in PAYG) -->
            <div v-show="!(deploymentMode === 'cloud' && cloudBillingType === 'payg')" class="w-full mb-12">
              <h3 :class="`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`">{{ $t('ERP.PRICING.SELECT_APPS') }}</h3>
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                  v-for="app in computedAvailableApps" 
                  :key="app.id"
                  @click="toggleApp(app)"
                  :class="`cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center text-center hover:scale-105 active:scale-95 ${getModuleClass(app.id)}`"
                >
                  <!-- Checkmark -->
                  <div v-if="selectedApps.includes(app.id)" :class="`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-blue-600 text-white'}`">
                    ✓
                  </div>

                  <div class="text-3xl mb-3">{{ app.icon }}</div>
                  <h4 :class="`font-medium text-sm h-10 flex items-center justify-center ${getModuleTextClass(app.id)}`">{{ app.name }}</h4>
                  <p :class="`text-xs mt-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`">{{ formatCurrency(app.price) }}</p>
                </div>
              </div>
            </div>



            <!-- Transaction Volume (PAYG Only) -->
            <div v-if="deploymentMode === 'cloud' && cloudBillingType === 'payg'" class="mb-12 bg-opacity-50 p-8 rounded-2xl border" :class="theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-slate-50 border-slate-100'">
                <h3 :class="`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`">Estimated Monthly Transactions</h3>
                
                <div class="space-y-6">
                   <!-- Accounting -->
                   <div>
                     <div class="flex justify-between mb-2">
                       <label :class="`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`">Accounting & Finance</label>
                       <span :class="`text-xs font-bold ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`">Rp 5.000 / tx</span>
                     </div>
                     <input type="range" min="0" max="10000" step="100" v-model.number="txAccounting" :class="`w-full h-2 rounded-lg appearance-none cursor-pointer ${theme === 'dark' ? 'bg-slate-700 accent-indigo-500' : 'bg-slate-200 accent-blue-600'}`">
                     <div class="flex justify-between mt-1">
                        <input type="number" v-model.number="txAccounting" :class="`w-24 text-sm bg-transparent border-b ${theme === 'dark' ? 'border-slate-700 text-white' : 'border-slate-300 text-slate-900'} focus:outline-none`">
                        <span :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-400'">transactions</span>
                     </div>
                   </div>

                   <!-- Production -->
                   <div>
                     <div class="flex justify-between mb-2">
                       <label :class="`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`">Production</label>
                       <span :class="`text-xs font-bold ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`">Rp 5.000 / tx</span>
                     </div>
                     <input type="range" min="0" max="10000" step="100" v-model.number="txProduction" :class="`w-full h-2 rounded-lg appearance-none cursor-pointer ${theme === 'dark' ? 'bg-slate-700 accent-indigo-500' : 'bg-slate-200 accent-blue-600'}`">
                      <div class="flex justify-between mt-1">
                        <input type="number" v-model.number="txProduction" :class="`w-24 text-sm bg-transparent border-b ${theme === 'dark' ? 'border-slate-700 text-white' : 'border-slate-300 text-slate-900'} focus:outline-none`">
                        <span :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-400'">transactions</span>
                     </div>
                   </div>

                   <!-- Inventory/Procurement/Order -->
                   <div>
                     <div class="flex justify-between mb-2">
                       <label :class="`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`">Inventory / Procurement / Order</label>
                       <span :class="`text-xs font-bold ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`">Rp 3.000 / tx</span>
                     </div>
                     <input type="range" min="0" max="10000" step="100" v-model.number="txInventory" :class="`w-full h-2 rounded-lg appearance-none cursor-pointer ${theme === 'dark' ? 'bg-slate-700 accent-indigo-500' : 'bg-slate-200 accent-blue-600'}`">
                      <div class="flex justify-between mt-1">
                        <input type="number" v-model.number="txInventory" :class="`w-24 text-sm bg-transparent border-b ${theme === 'dark' ? 'border-slate-700 text-white' : 'border-slate-300 text-slate-900'} focus:outline-none`">
                        <span :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-400'">transactions</span>
                     </div>
                   </div>
                   
                   <!-- Other -->
                   <div>
                     <div class="flex justify-between mb-2">
                       <label :class="`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`">Other Modules</label>
                       <span :class="`text-xs font-bold ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`">Rp 3.000 / tx</span>
                     </div>
                     <input type="range" min="0" max="5000" step="50" v-model.number="txOther" :class="`w-full h-2 rounded-lg appearance-none cursor-pointer ${theme === 'dark' ? 'bg-slate-700 accent-indigo-500' : 'bg-slate-200 accent-blue-600'}`">
                      <div class="flex justify-between mt-1">
                        <input type="number" v-model.number="txOther" :class="`w-24 text-sm bg-transparent border-b ${theme === 'dark' ? 'border-slate-700 text-white' : 'border-slate-300 text-slate-900'} focus:outline-none`">
                        <span :class="theme === 'dark' ? 'text-slate-500' : 'text-slate-400'">transactions</span>
                     </div>
                   </div>
                </div>
             </div>

            <!-- Users Configuration (Hidden in PAYG) -->
             <div v-show="!(deploymentMode === 'cloud' && cloudBillingType === 'payg')" class="mb-12 bg-opacity-50 p-8 rounded-2xl border" :class="theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-slate-50 border-slate-100'">
                <h3 :class="`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`">{{ $t('ERP.PRICING.USERS_COUNT') }}</h3>
                
                <div class="space-y-4">
                  <!-- Administrator -->
                  <div class="flex items-center justify-between">
                     <label :class="`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`">{{ $t('ERP.PRICING.USERS_ADMIN') }}</label>
                     <div class="flex items-center space-x-4">
                       <button @click="usersAdmin > 0 ? usersAdmin-- : null" :class="getUserBtnClass()">-</button>
                       <input type="number" v-model.number="usersAdmin" :class="getUserInputClass()" min="0">
                       <button @click="usersAdmin++" :class="getUserBtnClass()">+</button>
                     </div>
                  </div>
                  <!-- Operational -->
                  <div class="flex items-center justify-between">
                     <label :class="`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`">{{ $t('ERP.PRICING.USERS_OPERATIONAL') }}</label>
                     <div class="flex items-center space-x-4">
                       <button @click="usersOperational > 0 ? usersOperational-- : null" :class="getUserBtnClass()">-</button>
                       <input type="number" v-model.number="usersOperational" :class="getUserInputClass()" min="0">
                       <button @click="usersOperational++" :class="getUserBtnClass()">+</button>
                     </div>
                  </div>
                  <!-- Viewer -->
                   <div class="flex items-center justify-between">
                     <label :class="`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`">{{ $t('ERP.PRICING.USERS_VIEWER') }}</label>
                     <div class="flex items-center space-x-4">
                       <button @click="usersViewer > 0 ? usersViewer-- : null" :class="getUserBtnClass()">-</button>
                       <input type="number" v-model.number="usersViewer" :class="getUserInputClass()" min="0">
                       <button @click="usersViewer++" :class="getUserBtnClass()">+</button>
                     </div>
                  </div>
                </div>

                <p :class="`text-xs mt-4 italic ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`">{{ $t('ERP.PRICING.USERS_NOTE') }}</p>
             </div>

             <!-- Storage (Cloud Only) -->
             <div v-if="deploymentMode === 'cloud'" class="mb-12 bg-opacity-50 p-8 rounded-2xl border" :class="theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-slate-50 border-slate-100'">
                <div class="flex items-center justify-between mb-2">
                   <h3 :class="`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`">{{ $t('ERP.PRICING.STORAGE') }}</h3>
                   <span :class="`font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-blue-600'}`">{{ storageSize }} GB</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="500" 
                  step="10" 
                  v-model.number="storageSize"
                  :class="`w-full h-2 rounded-lg appearance-none cursor-pointer ${theme === 'dark' ? 'bg-slate-700 accent-indigo-500' : 'bg-slate-200 accent-blue-600'}`"
                >
                <p :class="`text-sm mt-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`">{{ $t('ERP.PRICING.STORAGE_NOTE') }}</p>
             </div>

             <!-- Services -->
             <div class="mt-12">
               <h3 :class="`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`">{{ $t('ERP.PRICING.SERVICES') }}</h3>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="p-6 rounded-2xl border" :class="theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-slate-50 border-slate-100'">
                     <label :class="`block font-semibold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`">{{ $t('ERP.PRICING.CONSULTATION') }}</label>
                     <div class="flex items-center space-x-2">
                       <input type="number" v-model.number="consultationHours" :class="getServiceInputClass()" min="0">
                       <span :class="`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`">Hours</span>
                     </div>
                     <p :class="`text-xs mt-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`">Rate: {{ formatCurrency(CONSULTATION_RATE) }} / hr / module</p>
                  </div>
                  <div class="p-6 rounded-2xl border" :class="theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-slate-50 border-slate-100'">
                     <label :class="`block font-semibold mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`">{{ $t('ERP.PRICING.TRANSPORT') }}</label>
                     <div class="flex items-center space-x-2">
                       <input type="number" v-model.number="transportDays" :class="getServiceInputClass()" min="0">
                       <span :class="`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`">Days</span>
                     </div>
                     <p :class="`text-xs mt-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`">Rate: {{ formatCurrency(TRANSPORT_RATE) }} / day</p>
                  </div>
               </div>
            </div>

            <!-- Workflow Components Selection -->
             <div v-if="workflowCategories && Object.keys(workflowCategories).length > 0" class="mt-12">
               <h3 :class="`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`">{{ $t('ERP.PRICING.WORKFLOWS') }}</h3>
               <div class="space-y-6">
                 <div v-for="(workflows, category) in workflowCategories" :key="category">
                    <h4 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">{{ category }}</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div 
                        v-for="wf in workflows" 
                        :key="wf.id" 
                        @click="toggleWorkflow(wf)"
                        :class="`cursor-pointer relative p-3 rounded-lg border flex items-center space-x-3 transition-all hover:shadow-md ${getWorkflowClass(wf.id)}`"
                      >
                         <div class="text-2xl">{{ wf.icon }}</div>
                         <div class="flex-1">
                           <div :class="`font-medium text-sm ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`">{{ wf.name }}</div>
                           <div class="text-xs text-slate-500">{{ formatCurrency(wf.price) }} / mo</div>
                         </div>
                         <div v-if="selectedWorkflows.includes(wf.id)" :class="`font-bold ${theme === 'dark' ? 'text-indigo-400' : 'text-blue-600'}`">✓</div>
                      </div>
                    </div>
                 </div>
               </div>
             </div>

          </div>

          <!-- Sticky Summary -->
          <div class="w-full lg:w-1/3 lg:sticky lg:top-24">
            <div :class="`rounded-2xl shadow-xl border p-8 ${theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`">
              <h3 :class="`text-lg font-bold mb-6 border-b pb-4 ${theme === 'dark' ? 'text-white border-white/5' : 'text-slate-900 border-slate-100'}`">{{ $t('ERP.PRICING.ESTIMATED_COST') }}</h3>
              
              <div class="space-y-3 mb-6">
                 <!-- Deployment Info -->
                 <div :class="`flex justify-between text-sm font-medium p-2 rounded border ${theme === 'dark' ? 'bg-slate-800 border-white/5 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-600'}`">
                  <span>{{ $t('ERP.PRICING.DEPLOYMENT') }}</span>
                  <div class="text-right">
                     <span :class="`block capitalize ${theme === 'dark' ? 'text-indigo-400' : 'text-blue-600'}`">{{ deploymentModeTitle }}</span>
                     <span v-if="deploymentMode === 'cloud'" :class="`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`">{{ cloudBillingType === 'subscription' ? 'Subscription' : 'Pay As You Go' }}</span>
                  </div>
                </div>

                <template v-if="!(deploymentMode === 'cloud' && cloudBillingType === 'payg')">
                <div :class="`flex justify-between text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`">
                  <span>Total Users</span>
                  <span>{{ totalUsers }}</span>
                </div>
                <div :class="`flex justify-between text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`">
                  <span>Selected Apps ({{ selectedApps.length-1 }})</span>
                  <span>{{ selectedApps.length-1 }}</span>
                </div>
                 <div v-if="selectedWorkflows.length > 0" :class="`flex justify-between text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`">
                  <span>Workflows ({{ selectedWorkflows.length }})</span>
                  <span>{{ selectedWorkflows.length }}</span>
                </div>
                </template>

                 <template v-if="deploymentMode === 'cloud' && cloudBillingType === 'payg'">
                   <div :class="`flex justify-between text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`">
                     <span>Transactions (Est.)</span>
                     <span>{{ totalTransactions }}</span>
                   </div>
                    <div :class="`flex justify-between text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`">
                     <span>Overage Rate (Avg)</span>
                     <span>{{ formatCurrency(totalTransactions > 5000 ? Math.round(avgTxRate) : 0) }}</span>
                   </div>
                 </template>
                 <div v-if="deploymentMode === 'cloud'" :class="`flex justify-between text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`">
                  <span>Storage ({{ storageSize }} GB)</span>
                  <span>{{ formatCurrency(extraStorageCost) }}</span>
                </div>
                <div v-if="discountPercentage > 0" :class="`flex justify-between text-sm font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`">
                  <span>Discount ({{ discountPercentage }}%)</span>
                  <span>- {{ formatCurrency(discountAmount) }}</span>
                </div>
              </div>

               <!-- One Time Fees -->
               <div v-if="oneTimeFee > 0" :class="`pt-4 border-t mb-4 ${theme === 'dark' ? 'border-white/10' : 'border-slate-100'}`">
                  <div :class="`flex justify-between text-sm mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`">
                    <span>Implementation Services</span>
                    <span>{{ formatCurrency(implementationFee) }}</span>
                  </div>
                  <div :class="`flex justify-between text-sm mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`">
                    <span>Transport & Accom.</span>
                    <span>{{ formatCurrency(transportFee) }}</span>
                  </div>
                  <div v-if="deploymentMode !== 'cloud'" :class="`flex justify-between text-sm font-bold mt-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`">
                    <span>One-Time License/Source</span>
                    <span>{{ formatCurrency(oneTimeFee - implementationFee - transportFee) }}</span>
                  </div>
                   <div :class="`flex justify-between text-lg font-bold mt-2 pt-2 border-t border-dashed ${theme === 'dark' ? 'text-indigo-400 border-white/10' : 'text-slate-800 border-slate-200'}`">
                    <span>{{ $t('ERP.PRICING.TOTAL_ONE_TIME') }}</span>
                    <span>{{ formatCurrency(oneTimeFee) }}</span>
                  </div>
               </div>
              
              <div :class="`pt-6 border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-100'}`">
                 <p :class="`text-xs mb-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`">{{ billingPeriod === 'yearly' ? $t('ERP.PRICING.TOTAL_YEARLY_COST') : $t('ERP.PRICING.TOTAL_MONTHLY') }}</p>
                 <div :class="`text-3xl font-extrabold mb-2 ${theme === 'dark' ? 'text-white' : 'text-blue-600'}`">
                   {{ formatCurrency(finalRecurringCost) }}
                 </div>
                 <p v-if="deploymentMode === 'cloud' && cloudBillingType === 'subscription' && billingPeriod === 'monthly'" class="text-xs text-slate-500">{{ $t('ERP.PRICING.BILLED_MONTHLY') }}</p>
                 <p v-else-if="deploymentMode === 'cloud' && cloudBillingType === 'subscription' && billingPeriod === 'yearly'" class="text-xs text-slate-500">{{ $t('ERP.PRICING.BILLED_YEARLY', { percentage: yearlyDiscount * 100, amount: formatNumber(convertCurrency(Math.round(finalRecurringCost / 12))) }) }}</p>
                 <p v-else-if="deploymentMode === 'cloud' && cloudBillingType === 'payg'" class="text-xs text-slate-500">{{ $t('ERP.PRICING.PAYG_NOTE') }}</p>
                 <p v-else class="text-xs text-slate-500">{{ $t('ERP.PRICING.NO_MONTHLY_FEE') }}</p>
              </div>

              <div class="mt-8 pt-6 border-t" :class="theme === 'dark' ? 'border-white/10' : 'border-slate-100'">
                <button 
                  @click="scrollToDemo"
                  :class="`w-full py-3 rounded-xl font-bold shadow-lg transition-all hover:-translate-y-1 ${theme === 'dark' ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-900 text-white hover:bg-slate-800'}`"
                >
                  {{ $t('ERP.PRICING.REQUEST_QUOTE') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Request Demo Section -->
    <section id="demo" ref="demoSection" :class="`py-24 ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-t border-white/5' : 'bg-slate-50 border-t border-slate-200'}`">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div :class="`rounded-3xl shadow-xl p-10 md:p-16 border ${theme === 'dark' ? 'bg-slate-800/50 backdrop-blur-xl border-white/10' : 'bg-white border-slate-100'}`">
          <div class="text-center mb-10">
            <h2 :class="`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`">{{ $t('ERP.DEMO.TITLE') }}</h2>
            <p :class="`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`">{{ $t('ERP.DEMO.SUBTITLE') }}</p>
          </div>

          <form @submit.prevent="submitDemo" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="col-span-1">
                <label :class="`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`">{{ $t('ERP.DEMO.NAME') }}</label>
                <input v-model="form.name" type="text" required :class="getFormInputClass()" placeholder="John Doe">
              </div>
              <div class="col-span-1">
                <label :class="`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`">{{ $t('ERP.DEMO.PHONE') }}</label>
                <input v-model="form.phone" type="tel" required :class="getFormInputClass()" placeholder="+1 (555) 000-0000">
              </div>
            </div>
            
            <div>
              <label :class="`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`">{{ $t('ERP.DEMO.EMAIL') }}</label>
              <input v-model="form.email" type="email" required :class="getFormInputClass()" placeholder="john@company.com">
            </div>

            <button 
              type="submit" 
              :disabled="loading"
              :class="`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed ${theme === 'dark' ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`"
            >
              <span v-if="!loading">{{ $t('ERP.DEMO.SEND') }}</span>
              <span v-else>{{ $t('ERP.DEMO.SENDING') }}</span>
            </button> 

            <p v-if="message" :class="`text-center text-sm font-medium ${messageType === 'success' ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')}`">
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
import { title } from 'process'

const props = defineProps({
  availableApps: { type: Array, required: true },
  availableComponent: { type: Array, required: true },
  availableWorkflows: { type: Array, default: () => [] },
  theme: { type: String, default: 'light' },
  moduleName: { type: String, default: 'ERP' },
  initialSelectedApps: { type: Array, default: () => [] },
  initialSelectedWorkflows: { type: Array, default: () => [] }
})

const { t } = useI18n()

// Config vars
const CONSULTATION_RATE = 200000 
const TRANSPORT_RATE = 1000000 
const LICENSE_MULTIPLIER = 12 
const SOURCE_CODE_MULTIPLIER = 100

const USER_WEIGHTS = {
  admin: 0.1,
  operational: 0.05,
  viewer: 0.03
}

// PAYG Rates
const PAYG_MIN_FEE = 500000
const PAYG_FREE_TX = 5000
const TX_RATES = {
  accounting: 5000,
  production: 5000,
  inventory: 3000,
  other: 3000
}
const yearlyDiscount = 0.10 // 10% discount for yearly billing


// State
const selectedApps = ref([...props.initialSelectedApps])
const selectedWorkflows = ref([...props.initialSelectedWorkflows])
const usersAdmin = ref(1)
const usersOperational = ref(10)
const usersViewer = ref(10)
const storageSize = ref(10)
const deploymentMode = ref('cloud')
const consultationHours = ref(0)
const transportDays = ref(0)
const cloudBillingType = ref('subscription') // 'subscription' | 'payg'
const billingPeriod = ref('monthly') // 'monthly' | 'yearly'
const discountPercentage = ref(0) // 0-100

// PAYG Inputs
const txAccounting = ref(1000)
const txProduction = ref(500)
const txInventory = ref(2000)
const txOther = ref(500)

const demoSection = ref(null)

// Computed
const computedAvailableApps = computed(() => {
  let multiplier = 1
  if (deploymentMode.value === 'onprem_license') multiplier = LICENSE_MULTIPLIER
  if (deploymentMode.value === 'onprem_source') multiplier = SOURCE_CODE_MULTIPLIER

  return props.availableApps.map(app => ({
    ...app,
    // If external page passed pre-translated name, use it, else try to translate if key exists
    name: app.i18nKey ? t(app.i18nKey) : app.name,
    price: app.price * multiplier
  }))
})

const workflowCategories = computed(() => {
  if (!props.availableWorkflows.length) return {}
  const categories = {}
  props.availableWorkflows.forEach(wf => {
    if (!categories[wf.category]) categories[wf.category] = []
    categories[wf.category].push(wf)
  })
  return categories
})

const totalUsers = computed(() => usersAdmin.value + usersOperational.value + usersViewer.value)

const totalTransactions = computed(() => txAccounting.value + txProduction.value + txInventory.value + txOther.value)

const avgTxRate = computed(() => {
  if (totalTransactions.value === 0) return 0
  const totalVal = (txAccounting.value * TX_RATES.accounting) + 
                   (txProduction.value * TX_RATES.production) + 
                   (txInventory.value * TX_RATES.inventory) + 
                   (txOther.value * TX_RATES.other)
  return totalVal / totalTransactions.value
})

const totalModuleBasePrice = computed(() => {
  let total = 0
  selectedApps.value.forEach(appId => {
    const app = props.availableApps.find(a => a.id === appId)
    if (app) total += app.price
  })
  return total
})

const extraStorageCost = computed(() => {
  if (deploymentMode.value !== 'cloud') return 0 
  if (storageSize.value <= 10) return 0
  const extra = storageSize.value - 10
  return Math.ceil(extra / 10) * 20000
})

const baseMonthlyCost = computed(() => {
  // PAYG Logic
  if (deploymentMode.value === 'cloud' && cloudBillingType.value === 'payg') {
    const totalTx = totalTransactions.value
    if (totalTx <= PAYG_FREE_TX) {
      return PAYG_MIN_FEE
    }
    
    // Calculate cost of excess
    const excessTx = totalTx - PAYG_FREE_TX
    const excessCost = excessTx * avgTxRate.value
    
    return PAYG_MIN_FEE + excessCost
  }

  // Subscription Logic
  const userFactor = (usersAdmin.value * USER_WEIGHTS.admin) + 
                     (usersOperational.value * USER_WEIGHTS.operational) + 
                     (usersViewer.value * USER_WEIGHTS.viewer)
  
  const appCost = totalModuleBasePrice.value * Math.max(userFactor, 1)
  
  let workflowCost = 0
  selectedWorkflows.value.forEach(wfId => {
    const wf = props.availableWorkflows.find(w => w.id === wfId)
    if (wf) workflowCost += wf.price
  })

  return appCost + workflowCost
})

const implementationFee = computed(() => {
  return consultationHours.value * CONSULTATION_RATE * Math.max(selectedApps.value.length, 1)
})

const transportFee = computed(() => {
  return transportDays.value * TRANSPORT_RATE
})

const oneTimeFee = computed(() => {
  let fee = implementationFee.value + transportFee.value
  
  if (deploymentMode.value === 'onprem_license') {
    fee += totalModuleBasePrice.value * LICENSE_MULTIPLIER
  } else if (deploymentMode.value === 'onprem_source') {
    fee += totalModuleBasePrice.value * SOURCE_CODE_MULTIPLIER
  } else {
    fee = 0
  }
  
  return fee
})

const monthlyRecurring = computed(() => {
  if (deploymentMode.value === 'cloud') {
    return baseMonthlyCost.value + extraStorageCost.value
  }
  return 0
})

const discountAmount = computed(() => {
  if (discountPercentage.value <= 0 || discountPercentage.value > 100) return 0
  return Math.round((monthlyRecurring.value * discountPercentage.value) / 100)
})

const monthlyAfterDiscount = computed(() => {
  return monthlyRecurring.value - discountAmount.value
})

const finalRecurringCost = computed(() => {
  if (deploymentMode.value !== 'cloud' || cloudBillingType.value === 'payg') {
    return monthlyAfterDiscount.value
  }
  
  if (billingPeriod.value === 'yearly') {
    // Apply yearly discount on top of custom discount
    const yearlyBase = monthlyAfterDiscount.value * 12
    return Math.round(yearlyBase * (1 - yearlyDiscount))
  }
  
  return monthlyAfterDiscount.value
})

const deploymentModeTitle = computed(() => {
  if (deploymentMode.value === 'cloud') return 'Cloud'
  if (deploymentMode.value === 'onprem_license') return 'On-Premise'
  if (deploymentMode.value === 'onprem_source') return 'Full Source'
  return ''
})

// Currency based on locale
const { locale } = useI18n()

// Exchange rates (base currency: IDR/Rupiah)
const exchangeRates = {
  'id': 1,        // Rupiah (base currency)
  'en': 15000,    // 1 USD = 15,000 IDR
  'zh': 2100      // 1 CNY = 2,100 IDR
}

const currencySymbol = computed(() => {
  switch (locale.value) {
    case 'id':
      return 'Rp'
    case 'zh':
      return '¥'
    case 'en':
    default:
      return '$'
  }
})

// Convert price from IDR to selected currency
const convertCurrency = (amountInIDR) => {
  const rate = exchangeRates[locale.value] || 1
  return Math.round(amountInIDR / rate)
}

// Methods
const toggleApp = (app) => {
  if (selectedApps.value.includes(app.id)) selectedApps.value = selectedApps.value.filter(id => id !== app.id)
  else selectedApps.value.push(app.id)
}

const toggleWorkflow = (wf) => {
  if (selectedWorkflows.value.includes(wf.id)) selectedWorkflows.value = selectedWorkflows.value.filter(id => id !== wf.id)
  else selectedWorkflows.value.push(wf.id)
}

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num)

const formatCurrency = (num) => {
  const converted = convertCurrency(num)
  return `${currencySymbol.value} ${formatNumber(converted)}`
}

const scrollToDemo = () => {
  if (demoSection.value) {
    demoSection.value.scrollIntoView({ behavior: 'smooth' })
  }
}

// Styling Helpers
const getDeploymentClass = (mode) => {
  const isActive = deploymentMode.value === mode
  if (props.theme === 'dark') {
    return isActive ? 'border-indigo-600 bg-indigo-900/20 ring-2 ring-indigo-500/50' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
  } else {
    return isActive ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-200 bg-white hover:border-blue-200'
  }
}

const getDeploymentTextClass = (mode) => {
  const isActive = deploymentMode.value === mode
  if (props.theme === 'dark') {
    return isActive ? 'text-indigo-400' : 'text-slate-300'
  } else {
    return 'text-slate-800'
  }
}

const getDeploymentTitle = (mode) => {
  if (mode === 'cloud') return 'Cloud'
  if (mode === 'onprem_license') return 'On-Premise'
  return 'Full Source'
}

const getDeploymentDesc = (mode) => {
  if (mode === 'cloud') return $t('ERP.PRICING.MONTHLY_SUBSCRIPTION')
  if (mode === 'onprem_license') return $t('ERP.PRICING.ONETIME_NOCODE')
  return $t('ERP.PRICING.ONETIME_CODE')
}

const getModuleClass = (id) => {
  const isSelected = selectedApps.value.includes(id)
  if (props.theme === 'dark') {
    return isSelected ? 'border-indigo-600 bg-indigo-900/20 shadow-[0_0_15px_-5px_rgba(99,102,241,0.3)]' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
  } else {
    return isSelected ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-300'
  }
}

const getModuleTextClass = (id) => {
  const isSelected = selectedApps.value.includes(id)
  if (props.theme === 'dark') {
    return isSelected ? 'text-white' : 'text-slate-400'
  } else {
    return 'text-slate-800'
  }
}

const getWorkflowClass = (id) => {
  const isSelected = selectedWorkflows.value.includes(id)
  if (props.theme === 'dark') {
    return isSelected ? 'border-indigo-500 bg-indigo-900/20' : 'border-slate-800 bg-slate-900 hover:border-slate-700'
  } else {
     return isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'
  }
}

const getUserBtnClass = () => {
  if (props.theme === 'dark') {
    return 'w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-700 font-bold hover:scale-110 transition-transform active:scale-95'
  } else {
    return 'w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold hover:scale-110 transition-transform active:scale-95'
  }
}

const getUserInputClass = () => {
   if (props.theme === 'dark') {
     return 'w-16 text-center bg-transparent font-bold outline-none text-white'
   } else {
     return 'w-16 text-center bg-transparent font-bold outline-none text-slate-900'
   }
}

const getServiceInputClass = () => {
  if (props.theme === 'dark') {
    return 'w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600'
  } else {
    return 'w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500'
  }
}

const getFormInputClass = () => {
  if (props.theme === 'dark') {
    return 'w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none'
  } else {
    return 'w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none'
  }
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
       usersAdmin: usersAdmin.value,
       usersOperational: usersOperational.value,
       usersViewer: usersViewer.value,
       storageSize: storageSize.value,
       deploymentMode: deploymentMode.value,
       consultationHours: consultationHours.value,
       transportDays: transportDays.value,
       monthlyRecurring: monthlyRecurring.value,
       oneTimeFee: oneTimeFee.value,
       cloudBillingType: cloudBillingType.value,
       transactions: cloudBillingType.value === 'payg' ? {
         accounting: txAccounting.value,
         production: txProduction.value,
         inventory: txInventory.value,
         other: txOther.value
       } : null,
       module: props.moduleName
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
    form.value = { name: '', email: '', phone: '' } 
  } catch (err) {
    message.value = 'Something went wrong. Please try again later.'
    messageType.value = 'error'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>
