<script setup>
import { ref, reactive } from 'vue';
const table = reactive({
  name: '',
  columns: [{ name: 'id', type: 'bigint', nullable: false, primary: true, autoIncrement: true, default: null }],
  ifNotExists: true,
});
const target = ref('postgres');
const execute = ref(false);
const sqlPreview = ref('');

function addColumn() {
  table.columns.push({ name: 'col_' + (table.columns.length + 1), type: 'varchar(255)', nullable: true });
}
function removeColumn(i) {
  table.columns.splice(i, 1);
}
async function generate() {
  const payload = { target: target.value, connectionId: 'default', table, execute: false };
  const r = await $fetch('/api/ddl/create-table', { method: 'POST', body: payload });
  sqlPreview.value = r.sql;
}
async function submit() {
  const payload = { target: target.value, connectionId: 'default', table, execute: true };
  const r = await $fetch('/api/ddl/create-table', { method: 'POST', body: payload });
  if (r.ok) alert('Table created');
  else alert('Error: ' + r.error);
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Create Table</h1>

    <div class="mb-4">
      <label class="block mb-1">Target DB</label>
      <select v-model="target" class="border rounded p-2">
        <option value="postgres">Postgres</option>
        <option value="mysql">MySQL</option>
        <option value="mssql">SQL Server</option>
      </select>
    </div>

    <div class="mb-4">
      <label class="block mb-1">Table Name</label>
      <input v-model="table.name" class="border rounded p-2 w-full" placeholder="users" />
    </div>

    <div class="mb-4">
      <label class="block font-semibold mb-2">Columns</label>
      <div v-for="(c, i) in table.columns" :key="i" class="grid grid-cols-6 gap-2 items-center mb-2">
        <input v-model="c.name" class="col-span-2 border rounded p-2" />
        <input v-model="c.type" class="col-span-2 border rounded p-2" />
        <div class="col-span-2 flex gap-2">
          <label class="flex items-center"><input type="checkbox" v-model="c.nullable" /> nullable</label>
          <label class="flex items-center"><input type="checkbox" v-model="c.primary" /> PK</label>
          <button class="ml-auto text-red-500" @click="removeColumn(i)">Remove</button>
        </div>
      </div>
      <button class="bg-blue-600 text-white px-3 py-1 rounded" @click="addColumn">Add Column</button>
    </div>

    <div class="flex gap-2">
      <button class="bg-gray-700 text-white px-4 py-2 rounded" @click="generate">Preview SQL</button>
      <button class="bg-green-600 text-white px-4 py-2 rounded" @click="submit">Execute</button>
    </div>

    <div v-if="sqlPreview" class="mt-4">
      <h2 class="font-semibold mb-2">SQL Preview</h2>
      <pre class="p-4 bg-gray-900 text-white rounded overflow-auto whitespace-pre-wrap">{{ sqlPreview }}</pre>
    </div>
  </div>
</template>
