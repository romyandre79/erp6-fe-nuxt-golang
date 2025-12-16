<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
        <div>
            <h1 class="text-2xl font-bold text-slate-800">My Profile</h1>
            <p class="text-slate-500 mt-1">Manage your personal information</p>
        </div>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            Save Changes
        </button>
    </div>

    <!-- Layout Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Column: Avatar & Summary -->
        <div class="space-y-6">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
                <div class="relative w-32 h-32 mx-auto mb-4">
                    <div class="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400 border-4 border-white shadow-md">JD</div>
                    <button class="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>
                <h2 class="text-xl font-bold text-slate-800">John Doe</h2>
                <p class="text-slate-500 mb-4">Software Engineer</p>
                <div class="flex justify-center space-x-2">
                     <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span>
                     <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Full-Time</span>
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 class="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Work Info</h3>
                <div class="space-y-4">
                    <div>
                        <div class="text-xs text-slate-500 uppercase">Department</div>
                        <div class="font-medium text-slate-800">Engineering</div>
                    </div>
                     <div>
                        <div class="text-xs text-slate-500 uppercase">Manager</div>
                        <div class="font-medium text-slate-800">Jane Smith</div>
                    </div>
                     <div>
                        <div class="text-xs text-slate-500 uppercase">Date Joined</div>
                        <div class="font-medium text-slate-800">Jan 10, 2022</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Column: Forms -->
        <div class="lg:col-span-2 space-y-6">
            
            <!-- Personal Information -->
            <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <h3 class="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">Personal Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                        <input type="text" value="John" class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700 bg-slate-50" readonly>
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                        <input type="text" value="Doe" class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700 bg-slate-50" readonly>
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                         <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </span>
                            <input type="email" value="john.doe@company.com" class="w-full pl-10 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700">
                         </div>
                    </div>
                     <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                         <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </span>
                             <input type="tel" value="+1 (555) 123-4567" class="w-full pl-10 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700">
                         </div>
                    </div>
                </div>
            </div>

            <!-- Address Information -->
            <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <h3 class="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100">Address Information</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
                        <input type="text" value="123 Main St, Apt 4B" class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                             <label class="block text-sm font-medium text-slate-700 mb-2">City</label>
                             <input type="text" value="New York" class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700">
                        </div>
                         <div>
                             <label class="block text-sm font-medium text-slate-700 mb-2">State/Province</label>
                             <input type="text" value="NY" class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700">
                        </div>
                         <div>
                             <label class="block text-sm font-medium text-slate-700 mb-2">Zip Code</label>
                             <input type="text" value="10001" class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-700">
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'ess'
})
</script>
