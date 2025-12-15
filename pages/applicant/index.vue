<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-slate-900 py-32 lg:py-48 overflow-hidden">
        <!-- Background Decor -->
        <div class="absolute inset-0 overflow-hidden">
           <div class="absolute -top-[30%] -right-[10%] w-[70%] h-[120%] bg-gradient-to-b from-teal-500/20 to-transparent rotate-12 blur-3xl opacity-30 pointer-events-none"></div>
           <div class="absolute top-[60%] -left-[10%] w-[50%] h-[80%] bg-gradient-to-t from-cyan-500/20 to-transparent -rotate-12 blur-3xl opacity-20 pointer-events-none"></div>
        </div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 class="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Find Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Dream Job</span> Today
          </h1>
          <p class="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Join thousands of professionals who have found their next career move with us.
            Explore opportunities in Tech, Marketing, Finance, and more.
          </p>

          <!-- Search Bar -->
          <div class="bg-white p-2 rounded-xl shadow-2xl max-w-3xl mx-auto flex flex-col md:flex-row gap-2">
             <div class="flex-grow flex items-center px-4 py-3 bg-slate-50 rounded-lg">
                <svg class="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input type="text" placeholder="Job title, keywords, or company" class="bg-transparent w-full focus:outline-none text-slate-700 placeholder-slate-400 font-medium">
             </div>
             <div class="flex-grow flex items-center px-4 py-3 bg-slate-50 rounded-lg border-l-0 md:border-l border-slate-200">
                 <svg class="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                 <select class="bg-transparent w-full focus:outline-none text-slate-700 font-medium appearance-none cursor-pointer">
                    <option>Any Location</option>
                    <option>Remote</option>
                    <option>Jakarta, ID</option>
                    <option>Singapore, SG</option>
                 </select>
             </div>
             <button class="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg shadow-teal-500/30 transform hover:scale-[1.02]">
                Search
             </button>
          </div>
          
          <div class="mt-8 flex justify-center gap-4 text-sm text-slate-400">
             <span>Popular Queries:</span>
             <span class="text-teal-400 cursor-pointer hover:underline">Software Engineer</span>
             <span class="text-teal-400 cursor-pointer hover:underline">Product Manager</span>
             <span class="text-teal-400 cursor-pointer hover:underline">Data Analyst</span>
          </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="border-b border-slate-100 bg-white">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
                <div>
                   <div class="text-3xl font-bold text-slate-900">500+</div>
                   <div class="text-sm text-slate-500 mt-1 uppercase tracking-wider font-semibold">Active Jobs</div>
                </div>
                <div>
                   <div class="text-3xl font-bold text-slate-900">12k+</div>
                   <div class="text-sm text-slate-500 mt-1 uppercase tracking-wider font-semibold">Candidates</div>
                </div>
                 <div>
                   <div class="text-3xl font-bold text-slate-900">300+</div>
                   <div class="text-sm text-slate-500 mt-1 uppercase tracking-wider font-semibold">Companies</div>
                </div>
                 <div>
                   <div class="text-3xl font-bold text-slate-900">50+</div>
                   <div class="text-sm text-slate-500 mt-1 uppercase tracking-wider font-semibold">Countries</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Jobs -->
    <section class="py-20 bg-slate-50">
       <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
              <h2 class="text-3xl font-bold text-slate-900 mb-4">Featured Opportunities</h2>
              <p class="text-slate-600 max-w-2xl mx-auto">Hand-picked jobs that are trending right now. Apply before they are gone.</p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             <!-- Job Card 1 -->
             <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-100 group cursor-pointer" @click="navigateTo('/applicant/jobs/1')">
                 <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xl">G</div>
                    <span class="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold">Full Time</span>
                 </div>
                 <h3 class="text-lg font-bold text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">Senior Frontend Developer</h3>
                 <div class="text-slate-500 text-sm mb-4">GoTo Financial</div>
                 <div class="flex items-center gap-4 text-sm text-slate-400 mb-6">
                    <div class="flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Jakarta</div>
                    <div class="flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 2 days ago</div>
                 </div>
                 <div class="flex flex-wrap gap-2">
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">Vue.js</span>
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">TypeScript</span>
                 </div>
             </div>

              <!-- Job Card 2 -->
             <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-100 group cursor-pointer" @click="navigateTo('/applicant/jobs/2')">
                 <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-xl">T</div>
                    <span class="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold">Remote</span>
                 </div>
                 <h3 class="text-lg font-bold text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">Product Designer (UI/UX)</h3>
                 <div class="text-slate-500 text-sm mb-4">Traveloka</div>
                 <div class="flex items-center gap-4 text-sm text-slate-400 mb-6">
                    <div class="flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Singapore</div>
                    <div class="flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 5 hours ago</div>
                 </div>
                 <div class="flex flex-wrap gap-2">
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">Figma</span>
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">Design Systems</span>
                 </div>
             </div>

              <!-- Job Card 3 -->
             <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all border border-slate-100 group cursor-pointer" @click="navigateTo('/applicant/jobs/3')">
                 <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold text-xl">B</div>
                    <span class="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold">Contract</span>
                 </div>
                 <h3 class="text-lg font-bold text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">Backend Engineer (Golang)</h3>
                 <div class="text-slate-500 text-sm mb-4">Bukalapak</div>
                 <div class="flex items-center gap-4 text-sm text-slate-400 mb-6">
                    <div class="flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Bandung</div>
                    <div class="flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 1 day ago</div>
                 </div>
                 <div class="flex flex-wrap gap-2">
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">Golang</span>
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">Microservices</span>
                 </div>
             </div>
          </div>
          
           <div class="mt-12 text-center">
              <NuxtLink to="/applicant/jobs" class="inline-flex items-center text-teal-600 font-semibold hover:text-teal-700">
                  View All Jobs <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </NuxtLink>
           </div>
       </div>
    </section>

    <!-- Why Join Us -->
    <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div class="relative">
                    <div class="absolute inset-0 bg-teal-200 rounded-2xl transform rotate-3 scale-95 opacity-50"></div>
                     <div class="relative bg-slate-900 rounded-2xl p-8 text-white h-96 flex items-center justify-center">
                        <div class="text-center">
                            <h3 class="text-2xl font-bold mb-2">Grow Your Career</h3>
                            <p class="text-slate-400">Join a community of innovators and achievers.</p>
                             <!-- Simple chart or illustration placeholder -->
                            <div class="mt-8 flex justify-center space-x-2">
                                <span class="block w-3 h-12 bg-teal-500 rounded-t"></span>
                                <span class="block w-3 h-16 bg-teal-400 rounded-t"></span>
                                <span class="block w-3 h-24 bg-teal-300 rounded-t"></span>
                                <span class="block w-3 h-20 bg-teal-400 rounded-t"></span>
                                <span class="block w-3 h-28 bg-teal-500 rounded-t"></span>
                            </div>
                        </div>
                     </div>
                </div>
                <div>
                   <h2 class="text-3xl font-bold text-slate-900 mb-6">Why start your journey here?</h2>
                   <div class="space-y-6">
                       <div class="flex items-start">
                           <div class="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600">
                              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                           </div>
                           <div class="ml-4">
                               <h3 class="text-xl font-bold text-slate-900">Fast Application Process</h3>
                               <p class="text-slate-600 mt-1">One-click apply for most jobs. No lengthy forms or repetitive data entry.</p>
                           </div>
                       </div>
                       <div class="flex items-start">
                           <div class="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                           </div>
                           <div class="ml-4">
                               <h3 class="text-xl font-bold text-slate-900">Verified Companies</h3>
                               <p class="text-slate-600 mt-1">We vet every company to ensure you are applying to legitimate and quality workplaces.</p>
                           </div>
                       </div>
                        <div class="flex items-start">
                           <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                           </div>
                           <div class="ml-4">
                               <h3 class="text-xl font-bold text-slate-900">Real-time Updates</h3>
                               <p class="text-slate-600 mt-1">Track your application status in real-time. Get notified when you get shortlisted.</p>
                           </div>
                       </div>
                   </div>
                </div>
            </div>
        </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'applicant',
});
</script>
