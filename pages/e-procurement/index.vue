<script setup lang="ts">
definePageMeta({
  layout: 'e-procurement'
})

const activeTenders = [
  {
    id: 1,
    title: 'IT Infrastructure Upgrade',
    company: 'TechGlobal Corp',
    category: 'Technology',
    budget: '$500k - $1M',
    deadline: '2 days left',
    status: 'Open'
  },
  {
    id: 2,
    title: 'Fleet Vehicle Maintenance',
    company: 'Logistics Pro',
    category: 'Services',
    budget: '$200k',
    deadline: '5 days left',
    status: 'Open'
  },
  {
    id: 3,
    title: 'Office Supplies Bulk Order',
    company: 'Retail Giant',
    category: 'Goods',
    budget: '$50k',
    deadline: 'Closing Soon',
    status: 'Urgent'
  }
]
</script>

<template>
  <div class="relative overflow-hidden">
    <!-- Background Accents -->
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in-up">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Next Gen Procurement
        </div>
        <h1 class="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 animate-fade-in-up delay-100">
          Streamline Your <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Supply Chain</span>
        </h1>
        <p class="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
          Connect with top-tier vendors, automate procurement workflows, and gain real-time insights into your spending.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
          <NuxtLink to="/e-procurement/tenders" class="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-xl font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-10px_rgba(16,185,129,0.6)] hover:-translate-y-1">
            Browse Opportunities
          </NuxtLink>
          <NuxtLink to="/e-procurement/register" class="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-lg transition-all backdrop-blur-sm hover:-translate-y-1">
            Vendor Registration
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Login / Register Split -->
    <section class="py-20 px-4 relative z-10">
      <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <!-- Login Card -->
        <div class="group relative p-8 rounded-3xl bg-slate-800/50 border border-white/5 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-900/20 backdrop-blur-md">
            <!-- Glow effect on hover -->
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            
            <h2 class="text-2xl font-bold text-white mb-2">Vendor Login</h2>
            <p class="text-slate-400 mb-6">Access your dashboard to manage tenders and orders.</p>
            
            <form class="space-y-4">
                <div>
                    <label class="block text-xs font-medium text-slate-500 uppercase mb-1">Email Address</label>
                    <input type="email" class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors" placeholder="name@company.com" />
                </div>
                <div>
                    <label class="block text-xs font-medium text-slate-500 uppercase mb-1">Password</label>
                    <input type="password" class="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors" placeholder="••••••••" />
                </div>
                <button type="button" class="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors">Sign In</button>
            </form>
        </div>

        <!-- Register Card -->
        <div class="group relative p-8 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/5 overflow-hidden">
            <div class="relative z-10">
                <h2 class="text-2xl font-bold text-white mb-2">New Vendor?</h2>
                <p class="text-slate-400 mb-8">Join thousands of suppliers growing their business.</p>
                
                <ul class="space-y-4 mb-8">
                    <li class="flex items-start text-slate-300">
                        <svg class="w-5 h-5 text-emerald-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        Access exclusive corporate tenders
                    </li>
                    <li class="flex items-start text-slate-300">
                        <svg class="w-5 h-5 text-emerald-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        Real-time order tracking
                    </li>
                    <li class="flex items-start text-slate-300">
                        <svg class="w-5 h-5 text-emerald-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        Direct communication with buyers
                    </li>
                </ul>

                <NuxtLink to="/e-procurement/register" class="w-full py-3 block text-center bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-lg transition-colors shadow-lg shadow-emerald-500/20">
                    Register as Supplier
                </NuxtLink>
            </div>
            
            <!-- Graphic Element -->
            <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>

    <!-- Procurement Showcase (Active Tenders) -->
    <section class="py-20 bg-slate-900/50 border-t border-white/5" id="opportunities">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex justify-between items-end mb-12">
                <div>
                    <h2 class="text-3xl font-bold text-white mb-2">Live Opportunities</h2>
                    <p class="text-slate-400">Companies actively looking for suppliers right now.</p>
                </div>
                <NuxtLink to="/e-procurement/tenders" class="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors flex items-center">
                    View All Tenders <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </NuxtLink>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="tender in activeTenders" :key="tender.id" class="group bg-slate-800 rounded-xl p-6 border border-white/5 hover:border-emerald-500/30 transition-all hover:-translate-y-1">
                    <div class="flex justify-between items-start mb-4">
                        <div class="px-3 py-1 bg-slate-700/50 rounded-full text-xs font-medium text-slate-300 border border-white/5">{{ tender.category }}</div>
                        <span :class="{'text-emerald-400': tender.status === 'Open', 'text-amber-400': tender.status === 'Urgent'}" class="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                            <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                            {{ tender.status }}
                        </span>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                        <NuxtLink :to="`/e-procurement/tenders/${tender.id}`">{{ tender.title }}</NuxtLink>
                    </h3>
                    <div class="text-slate-400 text-sm mb-4">by {{ tender.company }}</div>
                    
                    <div class="space-y-3 pt-4 border-t border-white/5">
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Est. Budget</span>
                            <span class="text-slate-200 font-semibold">{{ tender.budget }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Deadline</span>
                            <span class="text-slate-200">{{ tender.deadline }}</span>
                        </div>
                    </div>
                    
                    <NuxtLink :to="`/e-procurement/tenders/${tender.id}`" class="w-full mt-6 py-2 block text-center bg-slate-700 hover:bg-emerald-500 hover:text-slate-900 group-hover:shadow-lg group-hover:shadow-emerald-500/20 text-white rounded-lg text-sm font-semibold transition-all">
                        View Details
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>

  </div>
</template>

<style scoped>
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}
</style>
