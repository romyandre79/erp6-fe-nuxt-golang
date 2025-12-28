<script setup lang="ts">
import PricingCalculator from '~/components/PricingCalculator.vue';

definePageMeta({
  layout: 'customer',
});

const crmApps = [
  { id: 'crm_basic', name: 'CRM Basic', price: 50000, icon: '👥' },
  { id: 'pipeline', name: 'Sales Pipeline', price: 50000, icon: '📈' },
  { id: 'helpdesk', name: 'Helpdesk & Support', price: 40000, icon: '🎧' },
  { id: 'loyalty', name: 'Loyalty Upgrade', price: 60000, icon: '🎁' },
];
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">New Order</button>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="text-gray-500 text-sm font-medium">Active Orders</div>
          <div class="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
        </div>
        <div class="text-3xl font-bold text-gray-900">12</div>
        <div class="text-sm text-green-600 mt-2 flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          +2 this week
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="text-gray-500 text-sm font-medium">Total Spend</div>
          <div class="p-2 bg-green-50 text-green-600 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div class="text-3xl font-bold text-gray-900">$12,450</div>
        <div class="text-sm text-gray-500 mt-2">Life time value</div>
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="text-gray-500 text-sm font-medium">Outstanding Invoices</div>
          <div class="p-2 bg-orange-50 text-orange-600 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
        <div class="text-3xl font-bold text-gray-900">3</div>
        <div class="text-sm text-red-500 mt-2">Due in 5 days</div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900">Recent Procurement Activity</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th class="px-6 py-3">Order ID</th>
              <th class="px-6 py-3">Item</th>
              <th class="px-6 py-3">Date</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b hover:bg-gray-50">
              <td class="px-6 py-4 font-medium text-gray-900">#ORD-2024-001</td>
              <td class="px-6 py-4">Office Supplies Bulk</td>
              <td class="px-6 py-4">Dec 14, 2024</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Processing</span>
              </td>
              <td class="px-6 py-4">$1,200.00</td>
            </tr>
            <tr class="border-b hover:bg-gray-50">
              <td class="px-6 py-4 font-medium text-gray-900">#ORD-2024-002</td>
              <td class="px-6 py-4">Dell XPS 15 (x2)</td>
              <td class="px-6 py-4">Dec 12, 2024</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Delivered</span>
              </td>
              <td class="px-6 py-4">$4,500.00</td>
            </tr>
            <tr class="border-b hover:bg-gray-50">
              <td class="px-6 py-4 font-medium text-gray-900">#ORD-2024-003</td>
              <td class="px-6 py-4">Networking Equipment</td>
              <td class="px-6 py-4">Dec 10, 2024</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Shipped</span>
              </td>
              <td class="px-6 py-4">$850.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pricing Calculator -->
    <div class="mt-8">
      <h2 class="text-xl font-bold mb-4">Subscription Plan</h2>
      <PricingCalculator
        :available-apps="crmApps"
        theme="light"
        module-name="CRM"
        :initial-selected-apps="['crm_basic', 'pipeline']"
      />
    </div>
  </div>
</template>
