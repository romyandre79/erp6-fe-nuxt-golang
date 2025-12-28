<script setup lang="ts">
definePageMeta({
  layout: 'customer',
});

const orders = [
  { id: 'ORD-2024-001', date: '2024-12-14', total: '$1,200.00', status: 'Processing', items: 'Office Supplies Bulk' },
  { id: 'ORD-2024-002', date: '2024-12-12', total: '$4,500.00', status: 'Delivered', items: 'Dell XPS 15 (x2)' },
  { id: 'ORD-2024-003', date: '2024-12-10', total: '$850.00', status: 'Shipped', items: 'Networking Equipment' },
  {
    id: 'ORD-2024-004',
    date: '2024-11-28',
    total: '$3,200.00',
    status: 'Delivered',
    items: 'Conference Room Furniture',
  },
  { id: 'ORD-2024-005', date: '2024-11-15', total: '$150.00', status: 'Cancelled', items: 'Printer Ink' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Processing':
      return 'bg-blue-100 text-blue-800';
    case 'Delivered':
      return 'bg-green-100 text-green-800';
    case 'Shipped':
      return 'bg-gray-100 text-gray-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">My Orders</h1>
      <div class="flex gap-2">
        <input
          type="text"
          placeholder="Search orders..."
          class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Filter</button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th class="px-6 py-3">Order ID</th>
              <th class="px-6 py-3">Date</th>
              <th class="px-6 py-3">Items</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3">Total</th>
              <th class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" class="border-b hover:bg-gray-50">
              <td class="px-6 py-4 font-medium text-gray-900">{{ order.id }}</td>
              <td class="px-6 py-4">{{ order.date }}</td>
              <td class="px-6 py-4">{{ order.items }}</td>
              <td class="px-6 py-4">
                <span :class="['px-2 py-1 text-xs font-semibold rounded-full', getStatusColor(order.status)]">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 font-medium">{{ order.total }}</td>
              <td class="px-6 py-4">
                <button class="text-indigo-600 hover:text-indigo-900 font-medium">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 border-t border-gray-100 flex justify-between items-center">
        <span class="text-sm text-gray-500">Showing 1 to 5 of 12 results</span>
        <div class="flex gap-2">
          <button
            class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <button class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>
