<template>
  <div class="overflow-x-auto">
    <table class="table w-full">
      <thead>
        <tr>
          <th>#</th>
          <th>{{$t('NAME')}}</th>
          <th>{{$t('EMAIL')}}</th>
          <th>{{$t('STATUS')}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, i) in users" :key="i">
          <td>{{ i + 1 }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <span :class="user.status === 'active' ? 'badge badge-success' : 'badge badge-error'">
              {{ user.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const users = [
  { name: 'John Doe', email: 'john@example.com', status: 'active' },
  { name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  { name: 'Michael', email: 'mike@example.com', status: 'active' }
]
</script>