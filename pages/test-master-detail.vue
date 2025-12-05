<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Master Detail Test</h1>
    
    <FormRender
      :schema="schema"
      @onsubmit="handleSubmit"
    />

    <div v-if="submittedData" class="mt-8 p-4 border rounded bg-gray-50">
      <h2 class="font-bold mb-2">Submitted Data:</h2>
      <pre>{{ submittedData }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const schema = [
  {
    type: 'text',
    props: { key: 'master_name', text: 'Master Name', place: 'Enter master name' }
  },
  {
    type: 'tables',
    props: { key: 'detail_items', text: 'Order Items', isinput: true },
    children: [
      {
        type: 'columns',
        children: [
            { type: 'text', props: { key: 'item_name', text: 'Item Name' } },
            { type: 'number', props: { key: 'qty', text: 'Quantity' } },
            { type: 'select', props: { key: 'unit', text: 'Unit', options: [{label: 'Pcs', value: 'pcs'}, {label: 'Kg', value: 'kg'}] } }
        ]
      }
    ]
  },
  {
    type: 'button',
    props: { text: 'Submit Data', onClick: 'onSubmit', class: 'bg-blue-600 text-white' }
  }
];

const submittedData = ref(null);

function handleSubmit(data: any) {
  console.log('Form Submitted:', data);
  submittedData.value = data;
}
</script>
