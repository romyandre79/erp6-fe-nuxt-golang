<template>
  <div class="bg-slate-50 min-h-screen py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Welcome Header -->
      <div class="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Hello, John 👋</h1>
          <p class="text-slate-600 mt-1">Here is what's happening with your job applications.</p>
        </div>
        <NuxtLink
          to="/applicant/jobs"
          class="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-teal-500/30"
        >
          Find More Jobs
        </NuxtLink>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 bg-blue-50 rounded-lg text-blue-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
            </div>
            <span class="text-3xl font-bold text-slate-900">12</span>
          </div>
          <h3 class="text-sm font-medium text-slate-500 text-right uppercase tracking-wide">Applied</h3>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 bg-purple-50 rounded-lg text-purple-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <span class="text-3xl font-bold text-slate-900">3</span>
          </div>
          <h3 class="text-sm font-medium text-slate-500 text-right uppercase tracking-wide">Interviews</h3>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 bg-green-50 rounded-lg text-green-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <span class="text-3xl font-bold text-slate-900">1</span>
          </div>
          <h3 class="text-sm font-medium text-slate-500 text-right uppercase tracking-wide">Offers</h3>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div class="flex items-center justify-between mb-4">
            <div class="p-2 bg-amber-50 rounded-lg text-amber-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                ></path>
              </svg>
            </div>
            <span class="text-3xl font-bold text-slate-900">5</span>
          </div>
          <h3 class="text-sm font-medium text-slate-500 text-right uppercase tracking-wide">Saved</h3>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Applications List -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 class="text-lg font-bold text-slate-900">Recent Applications</h2>
              <a href="#" class="text-sm text-teal-600 hover:text-teal-700 font-medium">View All</a>
            </div>
            <div class="divide-y divide-slate-100">
              <!-- App Item 1 -->
              <div class="p-6 hover:bg-slate-50 transition-colors">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="font-bold text-slate-900">Senior Frontend Developer</h3>
                    <p class="text-sm text-slate-500">GoTo Financial</p>
                  </div>
                  <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold"
                    >Interview Scheduled</span
                  >
                </div>
                <div class="flex items-center justify-between mt-4">
                  <div class="text-sm text-slate-500">Applied on Dec 12, 2024</div>
                  <button class="text-sm font-medium text-slate-700 hover:text-teal-600">View Status</button>
                </div>
              </div>
              <!-- App Item 2 -->
              <div class="p-6 hover:bg-slate-50 transition-colors">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="font-bold text-slate-900">Product Designer</h3>
                    <p class="text-sm text-slate-500">Traveloka</p>
                  </div>
                  <span class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold"
                    >Assessment Test</span
                  >
                </div>
                <div class="flex items-center justify-between mt-4">
                  <div class="text-sm text-slate-500">Applied on Dec 10, 2024</div>
                  <button class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded transition-colors">
                    Start Assessment
                  </button>
                </div>
              </div>
              <!-- App Item 3 -->
              <div class="p-6 hover:bg-slate-50 transition-colors">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="font-bold text-slate-900">Backend Engineer</h3>
                    <p class="text-sm text-slate-500">Bukalapak</p>
                  </div>
                  <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"
                    >Under Review</span
                  >
                </div>
                <div class="flex items-center justify-between mt-4">
                  <div class="text-sm text-slate-500">Applied on Dec 08, 2024</div>
                  <button class="text-sm font-medium text-slate-700 hover:text-teal-600">View Status</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Widget -->
        <div class="space-y-6">
          <!-- Upcoming Interviews -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div class="p-6 border-b border-slate-100">
              <h2 class="text-lg font-bold text-slate-900">Upcoming Interviews</h2>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex gap-4">
                <div class="w-14 flex-shrink-0 flex flex-col items-center bg-teal-50 rounded-lg p-2 text-teal-700">
                  <span class="text-xs font-bold uppercase">Dec</span>
                  <span class="text-xl font-bold">18</span>
                </div>
                <div>
                  <h4 class="font-bold text-slate-900 text-sm">Technical Round</h4>
                  <p class="text-xs text-slate-500 mb-1">GoTo Financial</p>
                  <span class="text-xs text-slate-400">10:00 AM - 11:30 AM</span>
                </div>
              </div>
              <div class="flex gap-4">
                <div class="w-14 flex-shrink-0 flex flex-col items-center bg-teal-50 rounded-lg p-2 text-teal-700">
                  <span class="text-xs font-bold uppercase">Dec</span>
                  <span class="text-xl font-bold">19</span>
                </div>
                <div>
                  <h4 class="font-bold text-slate-900 text-sm">Design Review</h4>
                  <p class="text-xs text-slate-500 mb-1">Traveloka</p>
                  <span class="text-xs text-slate-400">02:00 PM - 03:00 PM</span>
                </div>
              </div>
            </div>
            <div class="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <a href="#" class="text-sm text-teal-600 font-medium hover:text-teal-700">View Calendar</a>
            </div>
          </div>

          <!-- Profile Completion -->
          <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 text-white">
            <h2 class="text-lg font-bold mb-2">Complete Profile</h2>
            <p class="text-sm text-slate-400 mb-4">Your profile is 80% complete. Add your resume to get noticed.</p>

            <div class="w-full bg-slate-700 rounded-full h-2 mb-4">
              <div class="bg-teal-500 h-2 rounded-full" style="width: 80%"></div>
            </div>

            <button class="w-full py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-sm font-medium transition-colors">
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'applicant',
});
</script>
