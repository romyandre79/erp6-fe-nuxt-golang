<template>
  <div class="bg-slate-50 min-h-screen py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Sidebar Filters -->
        <aside class="w-full md:w-64 flex-shrink-0">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 sticky top-24">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-bold text-slate-900">Filters</h3>
              <button class="text-sm text-teal-600 font-medium hover:text-teal-700">Clear All</button>
            </div>

            <!-- Categories -->
            <div class="mb-8">
              <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Departments</h4>
              <div class="space-y-2">
                <label class="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" class="h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500" />
                  <span class="text-slate-600 group-hover:text-teal-600 transition-colors">Engineering (12)</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" class="h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500" />
                  <span class="text-slate-600 group-hover:text-teal-600 transition-colors">Design (5)</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" class="h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500" />
                  <span class="text-slate-600 group-hover:text-teal-600 transition-colors">Marketing (8)</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" class="h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500" />
                  <span class="text-slate-600 group-hover:text-teal-600 transition-colors">Sales (3)</span>
                </label>
              </div>
            </div>

            <!-- Job Type -->
            <div class="mb-8">
              <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Job Type</h4>
              <div class="space-y-2">
                <label class="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" class="h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500" />
                  <span class="text-slate-600 group-hover:text-teal-600 transition-colors">Full-time</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" class="h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500" />
                  <span class="text-slate-600 group-hover:text-teal-600 transition-colors">Part-time</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" class="h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500" />
                  <span class="text-slate-600 group-hover:text-teal-600 transition-colors">Contract</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" class="h-4 w-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500" />
                  <span class="text-slate-600 group-hover:text-teal-600 transition-colors">Remote</span>
                </label>
              </div>
            </div>

            <!-- Locations -->
            <div>
              <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Locations</h4>
              <select
                class="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5"
              >
                <option selected>All Locations</option>
                <option value="jkt">Jakarta</option>
                <option value="bdg">Bandung</option>
                <option value="sg">Singapore</option>
              </select>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1">
          <!-- Search Header -->
          <div
            class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <h1 class="text-2xl font-bold text-slate-900">All Open Positions</h1>
            <div class="relative w-full sm:w-80">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  class="h-5 w-5 text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                class="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-2.5"
                placeholder="Search jobs..."
              />
            </div>
          </div>

          <!-- Job List -->
          <div class="space-y-4">
            <!-- Job Card 1 -->
            <div
              class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xl"
                  >
                    G
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-slate-900 hover:text-teal-600 transition-colors">
                      Senior Frontend Developer
                    </h3>
                    <p class="text-slate-500 text-sm">GoTo Financial</p>
                  </div>
                </div>
                <span class="mt-2 sm:mt-0 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold"
                  >Full Time</span
                >
              </div>
              <div class="flex items-center gap-6 text-sm text-slate-500 mb-4">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  Jakarta, Indonesia
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  IDR 25M - 40M
                </div>
              </div>
              <p class="text-slate-600 text-sm mb-4 line-clamp-2">
                We are looking for an experienced Frontend Developer to join our team. You will be responsible for
                building high-quality, scalable web applications using Vue.js and TypeScript.
              </p>
              <div class="flex justify-between items-center border-t border-slate-100 pt-4">
                <div class="text-slate-400 text-xs">Posted 2 days ago</div>
                <button class="text-teal-600 font-semibold text-sm hover:text-teal-700 hover:underline">
                  View Details
                </button>
              </div>
            </div>

            <!-- Job Card 2 -->
            <div
              class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-xl"
                  >
                    T
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-slate-900 hover:text-teal-600 transition-colors">
                      Product Designer (UI/UX)
                    </h3>
                    <p class="text-slate-500 text-sm">Traveloka</p>
                  </div>
                </div>
                <span class="mt-2 sm:mt-0 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold"
                  >Remote</span
                >
              </div>
              <div class="flex items-center gap-6 text-sm text-slate-500 mb-4">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  Singapore
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  Competitive
                </div>
              </div>
              <p class="text-slate-600 text-sm mb-4 line-clamp-2">
                Join our design team to create delightful user experiences for millions of travelers. We value
                creativity, empathy, and attention to detail.
              </p>
              <div class="flex justify-between items-center border-t border-slate-100 pt-4">
                <div class="text-slate-400 text-xs">Posted 5 hours ago</div>
                <button class="text-teal-600 font-semibold text-sm hover:text-teal-700 hover:underline">
                  View Details
                </button>
              </div>
            </div>

            <!-- Job Card 3 -->
            <div
              class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold text-xl"
                  >
                    B
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-slate-900 hover:text-teal-600 transition-colors">
                      Backend Engineer
                    </h3>
                    <p class="text-slate-500 text-sm">Bukalapak</p>
                  </div>
                </div>
                <span class="mt-2 sm:mt-0 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold"
                  >Contract</span
                >
              </div>
              <div class="flex items-center gap-6 text-sm text-slate-500 mb-4">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  Bandung, Indonesia
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  IDR 15M - 25M
                </div>
              </div>
              <p class="text-slate-600 text-sm mb-4 line-clamp-2">
                We need a backend specialist to optimize our high-traffic services. Experience with Golang and
                distributed systems is required.
              </p>
              <div class="flex justify-between items-center border-t border-slate-100 pt-4">
                <div class="text-slate-400 text-xs">Posted 1 day ago</div>
                <button class="text-teal-600 font-semibold text-sm hover:text-teal-700 hover:underline">
                  View Details
                </button>
              </div>
            </div>

            <!-- Pagination -->
            <div class="mt-8 flex justify-center">
              <button
                class="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors"
              >
                Load More Jobs
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'applicant',
});
</script>
