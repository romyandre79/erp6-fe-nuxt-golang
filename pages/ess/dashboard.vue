<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-800">Employee Dashboard</h1>
      <p class="text-slate-500 mt-1">Welcome back, here's your overview.</p>
    </div>

    <!-- Summary Tiles -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group"
      >
        <div
          class="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"
        ></div>
        <div class="relative z-10">
          <div class="text-sm font-medium text-slate-500 mb-2">Annual Leave Balance</div>
          <div class="flex items-baseline space-x-1">
            <span class="text-3xl font-bold text-slate-800">12</span>
            <span class="text-sm text-slate-500">days</span>
          </div>
        </div>
      </div>
      <div
        class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group"
      >
        <div
          class="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"
        ></div>
        <div class="relative z-10">
          <div class="text-sm font-medium text-slate-500 mb-2">Sick Leave Used</div>
          <div class="flex items-baseline space-x-1">
            <span class="text-3xl font-bold text-slate-800">2</span>
            <span class="text-sm text-slate-500">days</span>
          </div>
        </div>
      </div>
      <div
        class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group"
      >
        <div
          class="absolute right-0 top-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"
        ></div>
        <div class="relative z-10">
          <div class="text-sm font-medium text-slate-500 mb-2">Pending Requests</div>
          <div class="flex items-baseline space-x-1">
            <span class="text-3xl font-bold text-slate-800">1</span>
            <span class="text-sm text-slate-500">request</span>
          </div>
        </div>
      </div>
      <div
        class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group"
      >
        <div
          class="absolute right-0 top-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"
        ></div>
        <div class="relative z-10">
          <div class="text-sm font-medium text-slate-500 mb-2">Next Holiday</div>
          <div class="flex flex-col">
            <span class="text-xl font-bold text-slate-800">Dec 25</span>
            <span class="text-xs text-slate-500">Christmas Day</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Quick Actions -->
      <div class="lg:col-span-2 space-y-8">
        <section>
          <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NuxtLink
              to="/ess/leave"
              class="flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div
                class="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-slate-800">New Leave Request</h3>
                <p class="text-sm text-slate-500">Apply for annual or unpaid leave</p>
              </div>
            </NuxtLink>
            <NuxtLink
              to="/ess/sick"
              class="flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-red-400 hover:shadow-md transition-all group"
            >
              <div
                class="w-12 h-12 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mr-4 group-hover:bg-red-600 group-hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-slate-800">Report Sickness</h3>
                <p class="text-sm text-slate-500">Submit sick leave with attachment</p>
              </div>
            </NuxtLink>
            <NuxtLink
              to="/ess/profile"
              class="flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-400 hover:shadow-md transition-all group"
            >
              <div
                class="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mr-4 group-hover:bg-purple-600 group-hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-slate-800">Update Profile</h3>
                <p class="text-sm text-slate-500">Change address or contact info</p>
              </div>
            </NuxtLink>
          </div>
        </section>

        <section>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-slate-800">Recent Request History</h2>
            <a href="#" class="text-sm text-blue-600 hover:underline">View All</a>
          </div>
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th class="px-6 py-4">Type</th>
                  <th class="px-6 py-4">Date Requested</th>
                  <th class="px-6 py-4">Duration</th>
                  <th class="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 font-medium text-slate-800">Annual Leave</td>
                  <td class="px-6 py-4 text-slate-500">Oct 20, 2024</td>
                  <td class="px-6 py-4 text-slate-500">3 Days</td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"
                      >Approved</span
                    >
                  </td>
                </tr>
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 font-medium text-slate-800">Sick Leave</td>
                  <td class="px-6 py-4 text-slate-500">Sep 15, 2024</td>
                  <td class="px-6 py-4 text-slate-500">1 Day</td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"
                      >Approved</span
                    >
                  </td>
                </tr>
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 font-medium text-slate-800">Annual Leave</td>
                  <td class="px-6 py-4 text-slate-500">Dec 01, 2024</td>
                  <td class="px-6 py-4 text-slate-500">5 Days</td>
                  <td class="px-6 py-4">
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700"
                      >Pending</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- Right Column -->
      <div class="space-y-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 class="font-bold text-slate-800 mb-4">Announcements</h3>
          <div class="space-y-4">
            <div class="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div class="text-xs font-semibold text-blue-500 mb-1">HR UPDATE</div>
              <div class="text-sm font-medium text-slate-800 mb-1">Company Policy Update</div>
              <div class="text-xs text-slate-500 line-clamp-2">
                Please review the updated employee handbook regarding remote work policies effectively immediately.
              </div>
            </div>
            <div class="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div class="text-xs font-semibold text-green-500 mb-1">EVENT</div>
              <div class="text-sm font-medium text-slate-800 mb-1">Annual Town Hall</div>
              <div class="text-xs text-slate-500 line-clamp-2">
                Join us for the annual town hall meeting next Friday at 10 AM.
              </div>
            </div>
          </div>
        </div>

        <div class="bg-slate-800 p-6 rounded-xl shadow-lg text-white">
          <h3 class="font-bold mb-2">Need Help?</h3>
          <p class="text-sm text-slate-300 mb-4">
            Contact HR support if you have any issues with your leave balance or profile data.
          </p>
          <button class="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'ess',
});
</script>
