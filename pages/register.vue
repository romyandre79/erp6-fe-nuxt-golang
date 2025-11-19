<script setup lang="ts">
definePageMeta({ middleware: 'guest' });
const { register } = useAuth();
const form = reactive({ username: '', email: '', password: '' });
const error = ref('');
const loading = ref(false);

const submit = async () => {
  try {
    loading.value = true;
    await register(form);
  } catch (err: any) {
    error.value = err?.data?.message || 'Register gagal';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-6 rounded shadow-md w-96">
      <h1 class="text-2xl font-bold mb-4">Register</h1>
      <form @submit.prevent="submit">
        <input v-model="form.username" placeholder="Username" class="border w-full mb-3 p-2 rounded" />
        <input v-model="form.email" type="email" placeholder="Email" class="border w-full mb-3 p-2 rounded" />
        <input v-model="form.password" type="password" placeholder="Password" class="border w-full mb-3 p-2 rounded" />
        <button :disabled="loading" class="bg-blue-600 text-white w-full py-2 rounded">
          {{ loading ? 'Loading...' : 'Register' }}
        </button>
      </form>
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    </div>
  </div>
</template>
