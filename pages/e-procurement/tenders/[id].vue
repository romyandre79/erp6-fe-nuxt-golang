<script setup lang="ts">
definePageMeta({
  layout: 'e-procurement',
});

const route = useRoute();
const tenderId = route.params.id;

// Mock data based on ID - in a real app this would be a fetch
const tender = computed(() => {
  return {
    id: tenderId,
    title: 'Upcoming IT IT Infrastructure Upgrade',
    company: 'TechGlobal Corp',
    category: 'Technology',
    budget: '$500k - $1M',
    deadline: '2025-12-25',
    status: 'Open',
    description:
      'We are seeking a qualified vendor to upgrade our core IT infrastructure across 5 regional offices. The project includes network hardware replacement, server consolidation, and implementation of a new secure Wi-Fi mesh system.',
    requirements: [
      'Proven experience in enterprise network architecture (min 5 years)',
      'Cisco or Juniper certified engineers',
      'Ability to support 24/7 during transition period',
      'ISO 27001 certification required',
    ],
    timeline: [
      { date: '2025-12-25', event: 'Proposal Deadline' },
      { date: '2026-01-05', event: 'Vendor Shortlisting' },
      { date: '2026-01-15', event: 'Final Presentations' },
      { date: '2026-02-01', event: 'Contract Award' },
    ],
  };
});
</script>

<template>
  <div class="min-h-screen bg-slate-900 pt-24 pb-20 px-4">
    <div class="max-w-5xl mx-auto">
      <!-- Breadcrumb -->
      <nav class="flex mb-8 text-sm text-slate-500">
        <NuxtLink to="/e-procurement" class="hover:text-emerald-400 transition-colors">Home</NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink to="/e-procurement/tenders" class="hover:text-emerald-400 transition-colors">Tenders</NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-slate-300 truncate max-w-xs">{{ tender.title }}</span>
      </nav>

      <!-- Header Content -->
      <div class="bg-slate-800 rounded-2xl p-8 border border-white/5 mb-8 relative overflow-hidden">
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"
        ></div>

        <div class="flex flex-col md:flex-row justify-between gap-6 relative z-10">
          <div>
            <div class="flex items-center gap-3 mb-3">
              <span
                class="px-3 py-1 bg-slate-700/50 rounded-full text-xs font-semibold text-slate-300 border border-white/5"
                >{{ tender.category }}</span
              >
              <span class="text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                {{ tender.status }}
              </span>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">{{ tender.title }}</h1>
            <div class="text-slate-400 text-lg">{{ tender.company }}</div>
          </div>

          <div class="flex flex-col gap-3 shrink-0">
            <button
              class="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
            >
              Apply Now
            </button>
            <button
              class="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors border border-white/5"
            >
              Download Docs
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/5">
          <div>
            <div class="text-slate-500 text-sm mb-1">Budget</div>
            <div class="text-white font-semibold flex items-center gap-2">
              <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              {{ tender.budget }}
            </div>
          </div>
          <div>
            <div class="text-slate-500 text-sm mb-1">Closing Date</div>
            <div class="text-white font-semibold flex items-center gap-2">
              <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              {{ tender.deadline }}
            </div>
          </div>
          <div>
            <div class="text-slate-500 text-sm mb-1">Location</div>
            <div class="text-white font-semibold">Multiple Sites</div>
          </div>
          <div>
            <div class="text-slate-500 text-sm mb-1">Type</div>
            <div class="text-white font-semibold">RFP</div>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <!-- Main Details -->
        <div class="md:col-span-2 space-y-8">
          <div class="bg-slate-800/50 rounded-xl p-8 border border-white/5">
            <h2 class="text-xl font-bold text-white mb-4">Project Overview</h2>
            <p class="text-slate-300 leading-relaxed mb-6">{{ tender.description }}</p>

            <h3 class="text-lg font-semibold text-white mb-3">Key Requirements</h3>
            <ul class="space-y-3">
              <li v-for="(req, index) in tender.requirements" :key="index" class="flex items-start text-slate-300">
                <svg
                  class="w-5 h-5 text-emerald-500 mr-3 mt-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>{{ req }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Timeline & sidebar -->
        <div class="space-y-6">
          <div class="bg-slate-800/50 rounded-xl p-6 border border-white/5">
            <h3 class="text-lg font-bold text-white mb-4">Project Timeline</h3>
            <div class="space-y-6 relative ml-2">
              <div class="absolute left-0 top-2 bottom-2 w-0.5 bg-slate-700"></div>

              <div v-for="(item, index) in tender.timeline" :key="index" class="relative pl-6">
                <div
                  class="absolute left-[-5px] top-1.5 w-3 h-3 rounded-full bg-slate-900 border-2"
                  :class="index === 0 ? 'border-emerald-500 bg-emerald-500' : 'border-slate-500'"
                ></div>
                <div class="text-sm text-slate-400 mb-0.5">{{ item.date }}</div>
                <div class="font-medium text-white" :class="index === 0 ? 'text-emerald-400' : ''">
                  {{ item.event }}
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 rounded-xl p-6 border border-indigo-500/20">
            <h3 class="font-semibold text-white mb-2">Need help?</h3>
            <p class="text-sm text-slate-400 mb-4">Contact our procurement support team for clarifications.</p>
            <button class="text-indigo-400 text-sm font-medium hover:text-indigo-300 flex items-center">
              Contact Support
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
