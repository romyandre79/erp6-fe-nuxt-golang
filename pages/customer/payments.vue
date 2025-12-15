<script setup lang="ts">
definePageMeta({
  layout: 'customer'
})

const payments = [
  { id: 'PAY-9982', date: '2024-12-12', method: 'Credit Card (**** 4242)', amount: '$4,500.00', status: 'Completed' },
  { id: 'PAY-9981', date: '2024-12-10', method: 'Bank Transfer', amount: '$850.00', status: 'Completed' },
  { id: 'PAY-9980', date: '2024-11-28', method: 'PayPal', amount: '$3,200.00', status: 'Completed' },
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Payments</h1>
      <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
        Manage Payment Methods
      </button>
    </div>

    <!-- Active Payment Methods -->
    <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Saved Payment Methods</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-6 bg-blue-600 rounded"></div>
                    <div>
                        <div class="font-medium text-gray-900">Visa ending in 4242</div>
                        <div class="text-sm text-gray-500">Expires 12/28</div>
                    </div>
                </div>
                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Default</span>
            </div>
             <div class="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-6 bg-blue-800 rounded"></div>
                    <div>
                        <div class="font-medium text-gray-900">Mastercard ending in 8888</div>
                        <div class="text-sm text-gray-500">Expires 10/26</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Payment History -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900">Payment History</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th class="px-6 py-3">Payment ID</th>
              <th class="px-6 py-3">Date</th>
              <th class="px-6 py-3">Method</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pay in payments" :key="pay.id" class="border-b hover:bg-gray-50">
              <td class="px-6 py-4 font-medium text-gray-900">{{ pay.id }}</td>
              <td class="px-6 py-4">{{ pay.date }}</td>
              <td class="px-6 py-4">{{ pay.method }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  {{ pay.status }}
                </span>
              </td>
              <td class="px-6 py-4 font-medium">{{ pay.amount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
