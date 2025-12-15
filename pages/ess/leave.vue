<template>
  <div class="max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-slate-800">Leave Request</h1>
        <p class="text-slate-500 mt-1">Submit a new leave request for approval</p>
      </div>

      <div class="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
          <form @submit.prevent="submitLeave">
              <div class="space-y-6">
                  <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Leave Type</label>
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <label class="relative flex flex-col p-4 bg-white border rounded-xl cursor-pointer hover:bg-slate-50 group focus-within:ring-2 ring-blue-500 ring-offset-2" :class="{'bg-blue-50 border-blue-500 ring-1': form.type === 'annual'}">
                              <input type="radio" v-model="form.type" value="annual" class="sr-only" />
                              <span class="font-bold text-slate-800 mb-1">Annual</span>
                              <span class="text-xs text-slate-500">Regular paid leave</span>
                          </label>
                           <label class="relative flex flex-col p-4 bg-white border rounded-xl cursor-pointer hover:bg-slate-50 group focus-within:ring-2 ring-blue-500 ring-offset-2" :class="{'bg-blue-50 border-blue-500 ring-1': form.type === 'unpaid'}">
                              <input type="radio" v-model="form.type" value="unpaid" class="sr-only" />
                              <span class="font-bold text-slate-800 mb-1">Unpaid</span>
                              <span class="text-xs text-slate-500">Loss of pay leave</span>
                          </label>
                           <label class="relative flex flex-col p-4 bg-white border rounded-xl cursor-pointer hover:bg-slate-50 group focus-within:ring-2 ring-blue-500 ring-offset-2" :class="{'bg-blue-50 border-blue-500 ring-1': form.type === 'maternity'}">
                              <input type="radio" v-model="form.type" value="maternity" class="sr-only" />
                              <span class="font-bold text-slate-800 mb-1">Parental</span>
                              <span class="text-xs text-slate-500">Maternity/Paternity</span>
                          </label>
                      </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label class="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
                          <input type="date" v-model="form.startDate" class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 shadow-sm" />
                      </div>
                      <div>
                          <label class="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
                          <input type="date" v-model="form.endDate" class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 shadow-sm" />
                      </div>
                  </div>

                   <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">Reason (Optional)</label>
                      <textarea v-model="form.reason" rows="4" class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 shadow-sm resize-none" placeholder="Enter any additional details for your manager..."></textarea>
                  </div>

                  <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div class="text-sm text-slate-500">
                          Estimated Duration: <span class="font-bold text-slate-800">3 Days</span>
                      </div>
                      <div class="flex space-x-3">
                         <button type="button" class="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                         <button type="submit" class="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">Submit Request</button>
                      </div>
                  </div>
              </div>
          </form>
      </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

definePageMeta({
  layout: 'ess'
})

const form = reactive({
    type: 'annual',
    startDate: '',
    endDate: '',
    reason: ''
})

const submitLeave = () => {
    alert('Leave requested! (Mock)')
    // Logic to submit
}
</script>
