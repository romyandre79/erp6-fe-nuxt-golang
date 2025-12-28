<script setup lang="ts">
definePageMeta({
  layout: 'customer',
});

const invoices = [
  { id: 'INV-2024-001', date: '2024-12-14', due: '2025-01-14', amount: '$1,200.00', status: 'Unpaid' },
  { id: 'INV-2024-002', date: '2024-12-12', due: '2025-01-12', amount: '$4,500.00', status: 'Paid' },
  { id: 'INV-2024-003', date: '2024-12-10', due: '2025-01-10', amount: '$850.00', status: 'Paid' },
  { id: 'INV-2024-004', date: '2024-11-28', due: '2024-12-28', amount: '$3,200.00', status: 'Overdue' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'bg-green-100 text-green-800';
    case 'Unpaid':
      return 'bg-orange-100 text-orange-800';
    case 'Overdue':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Invoices</h1>
      <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Download All</button>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th class="px-6 py-3">Invoice ID</th>
              <th class="px-6 py-3">Date Issued</th>
              <th class="px-6 py-3">Due Date</th>
              <th class="px-6 py-3">Amount</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="inf in invoices" :key="inf.id" class="border-b hover:bg-gray-50">
              <td class="px-6 py-4 font-medium text-gray-900">{{ inf.id }}</td>
              <td class="px-6 py-4">{{ inf.date }}</td>
              <td class="px-6 py-4">{{ inf.due }}</td>
              <td class="px-6 py-4 font-medium">{{ inf.amount }}</td>
              <td class="px-6 py-4">
                <span :class="['px-2 py-1 text-xs font-semibold rounded-full', getStatusColor(inf.status)]">
                  {{ inf.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button class="text-indigo-600 hover:text-indigo-900 font-medium mr-3">View</button>
                <button class="text-gray-600 hover:text-gray-900 font-medium">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
