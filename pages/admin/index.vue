<script setup>
import CardStats from '../../components/CardStats.vue'
import TableData from '../../components/TableData.vue'

definePageMeta({
  layout: 'auth',                
  middleware: ['auth'] 
})
const isDark = useState('isDark', () => false)

</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
    <CardStats title="USERS" value="1,245" icon="mdi-account" />
    <CardStats title="SALES" value="$12,500" icon="mdi-cash" />
    <CardStats title="ORDERS" value="345" icon="mdi-cart" />

    <div class="col-span-3 mt-6">
      <TableData />
    </div>
  </div>
</template>