<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
          <div class="text-center">
              <h2 class="text-3xl font-extrabold text-slate-900">Create Account</h2>
              <p class="mt-2 text-sm text-slate-600">
                  Already have an account? <NuxtLink to="/applicant/login" class="font-medium text-teal-600 hover:text-teal-500">Sign in</NuxtLink>
              </p>
          </div>
          <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
              <div class="grid grid-cols-2 gap-4">
                  <div>
                      <label for="first-name" class="sr-only">First Name</label>
                      <input id="first-name" name="first-name" type="text" required class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="First Name">
                  </div>
                   <div>
                      <label for="last-name" class="sr-only">Last Name</label>
                      <input id="last-name" name="last-name" type="text" required class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="Last Name">
                  </div>
              </div>
              <div>
                  <label for="email-address" class="sr-only">Email address</label>
                  <input id="email-address" name="email" type="email" autocomplete="email" required class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="Email address">
              </div>
              <div>
                  <label for="password" class="sr-only">Password</label>
                  <input id="password" name="password" type="password" autocomplete="new-password" required class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="Password">
              </div>
               <div>
                  <label for="password-confirm" class="sr-only">Confirm Password</label>
                  <input id="password-confirm" name="password-confirm" type="password" autocomplete="new-password" required class="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm" placeholder="Confirm Password">
              </div>

              <div class="flex items-center">
                  <input id="terms" name="terms" type="checkbox" required class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded">
                  <label for="terms" class="ml-2 block text-sm text-slate-900">
                    I agree to the <a href="#" class="text-teal-600 hover:text-teal-500">Terms of Service</a> and <a href="#" class="text-teal-600 hover:text-teal-500">Privacy Policy</a>
                  </label>
              </div>

              <div>
                  <button type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all shadow-lg shadow-teal-500/30">
                      Sign Up
                  </button>
              </div>
          </form>
      </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'applicant',
});

const handleRegister = () => {
    // Logic to be implemented
    navigateTo('/applicant/dashboard');
}
</script>
