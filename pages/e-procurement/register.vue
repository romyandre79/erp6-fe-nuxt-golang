<script setup lang="ts">
definePageMeta({
  layout: 'e-procurement',
});

const currentStep = ref(1);
const steps = [
  { id: 1, title: 'Company Info', icon: 'i-heroicons-building-office-2' },
  { id: 2, title: 'Compliance', icon: 'i-heroicons-document-check' },
  { id: 3, title: 'Documents', icon: 'i-heroicons-paper-clip' },
  { id: 4, title: 'Review', icon: 'i-heroicons-check-circle' },
];

const formData = ref({
  companyName: '',
  registrationNumber: '',
  address: '',
  contactName: '',
  email: '',
  phone: '',
  taxId: '',
  businessType: 'Corporation',
  termsAccepted: false,
});

const nextStep = () => {
  if (currentStep.value < steps.length) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const submitRegistration = () => {
  // Mock submission
  alert('Registration submitted successfully!');
  navigateTo('/e-procurement');
};
</script>

<template>
  <div class="relative min-h-screen pb-20 overflow-hidden">
    <!-- Background Accents -->
    <div
      class="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"
    ></div>
    <div
      class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"
    ></div>

    <div class="max-w-4xl mx-auto px-4 pt-12 relative z-10">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">Vendor Registration</h1>
        <p class="text-slate-400">Join our network of trusted suppliers and access exclusive opportunities.</p>
      </div>

      <!-- Steps Indicator -->
      <div class="flex justify-between items-center mb-12 relative">
        <div class="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10 transform -translate-y-1/2"></div>
        <div
          class="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -z-10 transform -translate-y-1/2 transition-all duration-500"
          :style="{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }"
        ></div>

        <div v-for="step in steps" :key="step.id" class="flex flex-col items-center gap-3 bg-slate-900 px-4">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300"
            :class="[
              currentStep >= step.id
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]'
                : 'bg-slate-800 border-slate-700 text-slate-500',
            ]"
          >
            <!-- <UIcon :name="step.icon" class="w-5 h-5" /> -->
            <span class="font-bold">{{ step.id }}</span>
          </div>
          <span
            class="text-sm font-medium transition-colors"
            :class="currentStep >= step.id ? 'text-emerald-400' : 'text-slate-500'"
          >
            {{ step.title }}
          </span>
        </div>
      </div>

      <!-- Form Container -->
      <div class="bg-slate-800/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 md:p-10 shadow-xl">
        <!-- Step 1: Company Info -->
        <div v-if="currentStep === 1" class="space-y-6 animate-fade-in">
          <h2 class="text-2xl font-semibold text-white mb-6">Company Information</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-400">Company Name</label>
              <input
                v-model="formData.companyName"
                type="text"
                class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                placeholder="Legal Entity Name"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-400">Registration Number</label>
              <input
                v-model="formData.registrationNumber"
                type="text"
                class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                placeholder="Business Reg. No."
              />
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm font-medium text-slate-400">Registered Address</label>
              <textarea
                v-model="formData.address"
                rows="3"
                class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                placeholder="Full Business Address"
              ></textarea>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-400">Contact Person</label>
              <input
                v-model="formData.contactName"
                type="text"
                class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                placeholder="Full Name"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-400">Email Address</label>
              <input
                v-model="formData.email"
                type="email"
                class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                placeholder="contact@company.com"
              />
            </div>
          </div>
        </div>

        <!-- Step 2: Compliance -->
        <div v-if="currentStep === 2" class="space-y-6 animate-fade-in">
          <h2 class="text-2xl font-semibold text-white mb-6">Tax & Compliance</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-400">Tax ID / NPWP</label>
              <input
                v-model="formData.taxId"
                type="text"
                class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                placeholder="Tax Identification Number"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-400">Business Type</label>
              <select
                v-model="formData.businessType"
                class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
              >
                <option>Corporation</option>
                <option>Limited Liability Company (LLC)</option>
                <option>Partnership</option>
                <option>Sole Proprietorship</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Step 3: Documents -->
        <div v-if="currentStep === 3" class="space-y-6 animate-fade-in">
          <h2 class="text-2xl font-semibold text-white mb-6">Document Upload</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div
              class="border-2 border-dashed border-slate-700/50 rounded-xl p-8 text-center hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors cursor-pointer group"
            >
              <div class="mb-4 text-slate-500 group-hover:text-emerald-400 transition-colors">
                <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <h3 class="font-semibold text-white mb-1">Company Profile</h3>
              <p class="text-xs text-slate-500">PDF up to 10MB</p>
            </div>
            <div
              class="border-2 border-dashed border-slate-700/50 rounded-xl p-8 text-center hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors cursor-pointer group"
            >
              <div class="mb-4 text-slate-500 group-hover:text-emerald-400 transition-colors">
                <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
              </div>
              <h3 class="font-semibold text-white mb-1">Tax Certificate</h3>
              <p class="text-xs text-slate-500">PDF or JPG</p>
            </div>
          </div>
        </div>

        <!-- Step 4: Review -->
        <div v-if="currentStep === 4" class="space-y-6 animate-fade-in">
          <h2 class="text-2xl font-semibold text-white mb-6">Review & Submit</h2>
          <div class="bg-slate-900/50 rounded-xl p-6 border border-white/5 space-y-4">
            <div class="flex justify-between border-b border-white/5 pb-4">
              <span class="text-slate-500">Company Name</span>
              <span class="text-white font-medium">{{ formData.companyName || '-' }}</span>
            </div>
            <div class="flex justify-between border-b border-white/5 pb-4">
              <span class="text-slate-500">Email</span>
              <span class="text-white font-medium">{{ formData.email || '-' }}</span>
            </div>
            <div class="flex justify-between border-b border-white/5 pb-4">
              <span class="text-slate-500">Tax ID</span>
              <span class="text-white font-medium">{{ formData.taxId || '-' }}</span>
            </div>
          </div>

          <div class="flex items-center gap-3 pt-4">
            <input
              v-model="formData.termsAccepted"
              type="checkbox"
              id="terms"
              class="w-5 h-5 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500/50 transition-colors"
            />
            <label for="terms" class="text-slate-400 text-sm"
              >I accept the <a href="#" class="text-emerald-400 hover:underline">Terms and Conditions</a> and
              <a href="#" class="text-emerald-400 hover:underline">Privacy Policy</a>.</label
            >
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between pt-8 mt-8 border-t border-white/5">
          <button
            @click="prevStep"
            :disabled="currentStep === 1"
            class="px-6 py-2.5 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>

          <button
            v-if="currentStep < steps.length"
            @click="nextStep"
            class="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
          >
            Continue
          </button>

          <button
            v-else
            @click="submitRegistration"
            :disabled="!formData.termsAccepted"
            class="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.4s ease-out forwards;
}
</style>
