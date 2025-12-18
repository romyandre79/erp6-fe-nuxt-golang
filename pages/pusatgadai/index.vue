<template>
  <div class="min-h-screen bg-white">
    <!-- Header (Glassmorphism Sticky) -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div class="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-[#1f3c88] to-[#2f6edb] text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-900/20">
            {{ branding.logoText }}
          </div>
          <span class="text-xl font-bold tracking-tight text-[#1f3c88]">{{ branding.name }}</span>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8">
          <NuxtLink 
            v-for="item in navigation" 
            :key="item.label" 
            :to="item.link" 
            class="text-sm font-medium text-gray-600 hover:text-[#1f3c88] transition-colors relative group"
          >
            {{ item.label }}
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1f3c88] transition-all duration-300 group-hover:w-full"></span>
          </NuxtLink>
        </nav>

        <!-- Mobile Menu Button (Placeholder) -->
        <button class="md:hidden text-gray-600">
            <UIcon name="i-heroicons-bars-3" class="w-6 h-6" />
        </button>
      </div>
    </header>

    <!-- Hero Section (Catchy & Animated) -->
    <section class="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0A1A3F]">
      <!-- Animated Mesh Gradient Background -->
      <div class="absolute inset-0 z-0">
          <div class="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-600/30 rounded-full blur-[120px] animate-blob"></div>
          <div class="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-purple-600/30 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
          <div class="absolute top-[30%] left-[40%] w-[50vw] h-[50vw] bg-indigo-500/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
          <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center w-full">
        <!-- Hero Content -->
        <div class="lg:col-span-7 text-center lg:text-left">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-orange-300 text-sm font-bold mb-8 backdrop-blur-md animate-fade-in-up">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
            Resmi Terdaftar & Diawasi OJK
          </div>
          
          <h1 class="text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tight animate-fade-in-up animation-delay-150">
            Butuh Dana <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#F4C430] via-orange-400 to-[#F4C430] bg-300% animate-gradient">Cepat & Aman?</span>
          </h1>
          
          <p class="text-xl text-blue-100/80 mb-12 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-300 font-light">
            {{ hero.subtitle }}
          </p>
          
          <div class="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start animate-fade-in-up animation-delay-450">
            <button class="group relative px-8 py-4 rounded-full bg-[#F4C430] text-[#0A1A3F] font-bold text-lg shadow-[0_0_20px_rgba(244,196,48,0.3)] hover:shadow-[0_0_30px_rgba(244,196,48,0.5)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <span class="relative z-10 flex items-center gap-2">
                {{ hero.ctaText }}
                <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
            
            <button class="group px-8 py-4 rounded-full text-white font-semibold border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-3">
              <UIcon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5" />
              {{ hero.secondaryCtaText }}
            </button>
          </div>

          <!-- Stats (Glass Strip) -->
          <div class="mt-16 inline-flex flex-wrap justify-center lg:justify-start gap-8 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 animate-fade-in-up animation-delay-600">
             <div v-for="(stat, index) in hero.stats" :key="stat.label" class="flex items-center gap-4 pr-4 border-r border-white/10 last:border-0 last:pr-0">
                 <div class="text-left">
                     <div class="text-2xl lg:text-3xl font-bold text-white">{{ stat.value }}</div>
                     <div class="text-xs text-blue-300 uppercase tracking-widest font-semibold">{{ stat.label }}</div>
                 </div>
             </div>
          </div>
        </div>

        <!-- Hero Visual (3D Floating Element) -->
        <div class="lg:col-span-5 relative hidden lg:block perspective-1000">
             <div class="relative z-10 animate-float-slow">
                 <!-- Main Card -->
                 <div class="relative w-full aspect-[4/5] rounded-[2.5rem] bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-xl border border-white/30 shadow-2xl p-4 overflow-hidden group hover:rotate-y-6 hover:rotate-x-6 transition-transform duration-500">
                    <div class="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent mix-blend-overlay"></div>
                    
                    <!-- Inner Phone / App Mockup concept -->
                    <div class="w-full h-full bg-[#0F2455] rounded-[2rem] overflow-hidden relative shadow-inner">
                        <!-- Screen Header -->
                        <div class="h-14 bg-[#152e69] flex items-center justify-between px-6">
                            <div class="w-20 h-3 bg-white/10 rounded-full"></div>
                            <div class="w-8 h-8 rounded-full bg-orange-400/20 flex items-center justify-center">
                                <div class="w-2 h-2 rounded-full bg-orange-400"></div>
                            </div>
                        </div>
                        
                        <!-- Screen Content -->
                        <div class="p-6">
                            <div class="text-white/60 text-sm mb-1">Total Taksiran</div>
                            <div class="text-3xl font-bold text-white mb-8">Rp 15.500.000</div>
                            
                            <div class="grid grid-cols-2 gap-4">
                                <div class="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <UIcon name="i-heroicons-device-phone-mobile" class="w-6 h-6 text-blue-400 mb-2" />
                                    <div class="text-xs text-white/50">Gadget</div>
                                    <div class="text-sm font-semibold text-white">iPhone 14</div>
                                </div>
                                <div class="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <UIcon name="i-heroicons-sparkles" class="w-6 h-6 text-yellow-400 mb-2" />
                                    <div class="text-xs text-white/50">Emas</div>
                                    <div class="text-sm font-semibold text-white">5 Gram</div>
                                </div>
                            </div>

                            <div class="mt-8 p-4 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl text-center shadow-lg transform group-hover:scale-105 transition-transform">
                                <span class="font-bold text-[#0A1A3F] text-sm">Ajukan Gadai Sekarang</span>
                            </div>
                        </div>
                        
                        <!-- Decorative glow -->
                        <div class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-600/20 to-transparent pointer-events-none"></div>
                    </div>
                 </div>

                 <!-- Floating Badges -->
                 <div class="absolute top-[10%] -left-[10%] p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl flex items-center gap-3 animate-float-reverse">
                     <div class="bg-green-100 p-2 rounded-lg text-green-600">
                         <UIcon name="i-heroicons-check-circle" class="w-6 h-6" />
                     </div>
                     <div class="text-sm font-bold text-slate-800">
                         Cair <br/> dlm 5 Menit
                     </div>
                 </div>
                 
                 <div class="absolute bottom-[20%] -right-[5%] p-4 bg-[#1f3c88] text-white rounded-2xl shadow-xl border border-white/10 animate-bounce-subtle">
                     <div class="text-xs text-blue-200">Bunga Mulai</div>
                     <div class="text-lg font-bold">0.9%</div>
                 </div>
             </div>
        </div>
      </div>

      <!-- Wave Divider Bottom -->
      <div class="absolute bottom-0 w-full leading-none z-10">
          <svg class="block w-full h-[100px] text-slate-50" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="currentColor" fill-opacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
      </div>
    </section>

    <!-- Services Section (Existing) -->
    <section id="produk" class="py-24 bg-slate-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Produk Layanan Unggulan</h2>
          <p class="text-slate-600">Pilih layanan gadai yang sesuai dengan kebutuhan Anda dengan proses yang transparan.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div 
            v-for="service in services" 
            :key="service.id" 
            class="group bg-white rounded-3xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300"
          >
            <div :class="`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`">
                <UIcon :name="service.icon" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">{{ service.title }}</h3>
            <p class="text-slate-500 leading-relaxed mb-6">
              {{ service.description }}
            </p>
            <a href="#" class="inline-flex items-center text-sm font-semibold text-[#1f3c88] group-hover:gap-2 transition-all">
                Pelajari Selengkapnya 
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-24 bg-white relative z-10">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
           <h2 class="text-3xl font-bold text-slate-900 mb-4">Investasi Sistem</h2>
           <p class="text-slate-600">Simulasi biaya investasi sistem gadai digital untuk bisnis anda.</p>
        </div>
        <PricingCalculator 
            :available-apps="gadaiApps"
            theme="light"
            module-name="Pusat Gadai"
            :initial-selected-apps="['gadai_mgmt', 'appraisal']"
        />
      </div>
    </section>

    <!-- Why Us Section (Existing) -->
    <section id="tentang" class="py-24 bg-white relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6">
           <div class="grid lg:grid-cols-2 gap-16 items-center">
               <div class="order-2 lg:order-1 relative">
                   <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2rem] -rotate-3 opacity-10"></div>
                   <div class="relative bg-slate-900 rounded-[2rem] p-8 lg:p-12 text-white overflow-hidden shadow-2xl">
                       <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                       <div class="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                       
                       <h3 class="text-2xl font-bold mb-8 relative z-10">Keunggulan Kami</h3>
                       <div class="space-y-6 relative z-10">
                           <div v-for="(benefit, index) in benefits" :key="index" class="flex items-start gap-4">
                               <div class="mt-1 min-w-[24px] text-[#F4C430]">
                                   <UIcon :name="benefit.icon" class="w-6 h-6" />
                               </div>
                               <div>
                                   <h4 class="font-bold text-lg mb-1">{{ benefit.title }}</h4>
                                   <p class="text-slate-300 text-sm leading-relaxed">{{ benefit.desc }}</p>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
               <div class="order-1 lg:order-2">
                   <h2 class="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Mengapa Memilih <span class="text-[#1f3c88]">Pusat Gadai</span>?</h2>
                   <p class="text-slate-600 text-lg leading-relaxed mb-8">
                       Kami memahami kebutuhan Anda akan dana cepat dengan tetap mengutamakan keamanan barang jaminan dan legalitas transaksi. Ribuan nasabah telah mempercayakan barang berharganya kepada kami.
                   </p>
                   <button class="px-8 py-3 rounded-full bg-[#1f3c88] text-white font-semibold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20">
                       Hubungi Kami
                   </button>
               </div>
           </div>
        </div>
    </section>

    <!-- Footer (Catchy) -->
    <footer class="relative bg-[#050b1a] text-white pt-20">
      <!-- Decor line -->
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-[#F4C430] to-blue-600"></div>

      <div class="max-w-7xl mx-auto px-6 py-16">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 relative z-10">
          <!-- Brand -->
          <div>
            <div class="flex items-center gap-3 mb-6">
                <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-[#1f3c88] to-[#2f6edb] text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-900/40">
                    {{ branding.logoText }}
                </div>
                <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">{{ branding.name }}</span>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed mb-6">
                {{ footer.address }}
            </p>
            <div class="flex gap-4">
                <a v-for="social in footer.socials" :key="social.icon" :href="social.link" class="group w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-[#F4C430] hover:text-[#0a1a3f] hover:scale-110 transition-all duration-300">
                    <UIcon :name="social.icon" class="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </a>
            </div>
          </div>

          <!-- Links -->
          <div>
              <h4 class="font-bold text-lg mb-6 text-white border-l-4 border-[#F4C430] pl-3">Tautan Cepat</h4>
              <ul class="space-y-3">
                  <li v-for="nav in navigation" :key="nav.label">
                      <NuxtLink :to="nav.link" class="flex items-center gap-2 text-gray-400 hover:text-[#F4C430] transition-colors text-sm group">
                          <span class="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-[#F4C430] transition-colors"></span>
                          {{ nav.label }}
                      </NuxtLink>
                  </li>
              </ul>
          </div>

          <!-- Legal -->
          <div>
              <h4 class="font-bold text-lg mb-6 text-white border-l-4 border-[#F4C430] pl-3">Legal & Bantuan</h4>
              <ul class="space-y-3">
                  <li v-for="link in footer.links" :key="link.label">
                      <NuxtLink :to="link.url" class="text-gray-400 hover:text-[#F4C430] transition-colors text-sm">{{ link.label }}</NuxtLink>
                  </li>
              </ul>
          </div>

          <!-- Contact -->
          <div>
               <h4 class="font-bold text-lg mb-6 text-white border-l-4 border-[#F4C430] pl-3">Hubungi Kami</h4>
               <div class="space-y-4">
                   <div v-for="phone in footer.phones" :key="phone" class="flex items-center gap-3 text-gray-400 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                       <UIcon name="i-heroicons-phone" class="w-5 h-5 text-[#F4C430]" />
                       <span class="text-sm font-medium">{{ phone }}</span>
                   </div>
               </div>
               
               <div class="mt-8 relative overflow-hidden group">
                   <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-20 group-hover:opacity-30 transition-opacity rounded-xl"></div>
                   <div class="relative p-4 rounded-xl border border-white/10 flex items-center gap-3 backdrop-blur-sm">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_OJK.png" alt="OJK" class="h-10 bg-white rounded p-1" />
                       <div class="text-xs text-gray-300">
                           Berizin dan diawasi oleh <br/> <strong class="text-white text-sm">Otoritas Jasa Keuangan</strong>
                       </div>
                   </div>
               </div>
          </div>
        </div>

        <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 relative z-10">
          <p>© 2025 {{ branding.name }}. All rights reserved.</p>
          <div class="flex gap-6">
             <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
             <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
        
        <!-- Background Glow in Footer -->
        <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#1f3c88] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>
      </div>
    </footer>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'pusatgadai',
});

const { branding, navigation, hero, services, benefits, footer } = usePusatGadaiContent();

import PricingCalculator from '~/components/PricingCalculator.vue'

const gadaiApps = [
  { id: 'gadai_mgmt', name: 'Gadai Management', price: 50000, icon: '🏷️' },
  { id: 'appraisal', name: 'Appraisal AI', price: 60000, icon: '💎' },
  { id: 'auction', name: 'Auction System', price: 40000, icon: '🔨' },
  { id: 'reporting', name: 'Financial Reporting', price: 30000, icon: '📈' },
]
</script>

<style scoped>
.perspective-1000 {
    perspective: 1000px;
}
.bg-300% {
    background-size: 300% 300%;
}
@keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
}
@keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
@keyframes float-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}
@keyframes float-reverse {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(15px); }
}
@keyframes bounce-subtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}
@keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-blob {
    animation: blob 7s infinite;
}
.animation-delay-2000 {
    animation-delay: 2s;
}
.animation-delay-4000 {
    animation-delay: 4s;
}
.animate-gradient {
    animation: gradient 3s ease infinite;
}
.animate-float-slow {
    animation: float-slow 6s ease-in-out infinite;
}
.animate-float-reverse {
    animation: float-reverse 7s ease-in-out infinite;
}
.animate-bounce-subtle {
    animation: bounce-subtle 4s ease-in-out infinite;
}
.animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out forwards;
}
.animation-delay-150 { animation-delay: 150ms; }
.animation-delay-300 { animation-delay: 300ms; }
.animation-delay-450 { animation-delay: 450ms; }
.animation-delay-600 { animation-delay: 600ms; }
</style>
