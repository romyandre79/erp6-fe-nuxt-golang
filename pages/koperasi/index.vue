<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-white pt-20 pb-32 overflow-hidden" id="home">
      <div class="absolute inset-0 bg-slate-50"></div>
      <div class="absolute inset-y-0 right-0 w-1/2 bg-blue-50/50 rounded-l-[5rem] hidden lg:block"></div>
      
      <div class="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          <div class="lg:col-span-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 text-blue-700 text-sm font-medium mb-6 ring-1 ring-blue-600/10">
              <span class="flex h-2 w-2 rounded-full bg-blue-600"></span>
              Solusi Digitalisasi Koperasi #1 di Indonesia
            </div>
            <h1 class="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Aplikasi Koperasi <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Terlengkap</span> dengan Integrasi Unit Usaha
            </h1>
            <p class="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Transformasi digital koperasi Anda dengan dashboard profesional, aplikasi anggota mobile (Android & iOS), dan integrasi unit usaha yang saling terhubung. Melayani koperasi di seluruh Indonesia dari Sabang sampai Merauke.
            </p>
            <div class="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <a href="https://idxcoop.apptrial.my.id" target="_blank" class="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-1 text-center">
                Lihat Demo
              </a>
              <a href="https://api.whatsapp.com/send/?phone=%2B6282287593400&text&app_absent=0" target="_blank" class="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600 font-bold shadow-sm transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                <span>Hubungi Sales</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </a>
            </div>
            <div class="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 font-medium">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-500" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Terintegrasi
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-500" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Aman (2FA)
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-green-500" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Support 24/7
              </div>
            </div>
          </div>
          
          <!-- Hero Visual / Dashboard Preview -->
          <div class="lg:col-span-6 mt-16 lg:mt-0 relative">
            <div class="relative rounded-2xl bg-white shadow-2xl shadow-blue-900/10 border border-slate-200/60 p-2 transform rotate-1 hover:rotate-0 transition-all duration-500">
              <div class="rounded-xl overflow-hidden bg-slate-100 aspect-[4/3] relative group">
                <!-- Abstract UI Representation -->
                <div class="absolute inset-0 bg-white p-6">
                    <div class="h-full flex flex-col gap-4">
                        <div class="flex justify-between items-center pb-4 border-b border-slate-100">
                             <div class="w-32 h-6 bg-slate-100 rounded-md animate-pulse"></div>
                             <div class="flex gap-2">
                                <div class="w-8 h-8 rounded-full bg-slate-100"></div>
                                <div class="w-8 h-8 rounded-full bg-blue-50"></div>
                             </div>
                        </div>
                        <div class="grid grid-cols-3 gap-4">
                            <div class="h-24 rounded-lg bg-blue-50 border border-blue-100 p-4">
                                <div class="w-8 h-8 rounded-md bg-blue-200 mb-2"></div>
                                <div class="w-16 h-3 bg-blue-200/50 rounded mb-1"></div>
                                <div class="w-10 h-3 bg-blue-200/50 rounded"></div>
                            </div>
                            <div class="h-24 rounded-lg bg-teal-50 border border-teal-100 p-4">
                                 <div class="w-8 h-8 rounded-md bg-teal-200 mb-2"></div>
                                 <div class="w-16 h-3 bg-teal-200/50 rounded mb-1"></div>
                            </div>
                            <div class="h-24 rounded-lg bg-purple-50 border border-purple-100 p-4">
                                 <div class="w-8 h-8 rounded-md bg-purple-200 mb-2"></div>
                                 <div class="w-16 h-3 bg-purple-200/50 rounded mb-1"></div>
                            </div>
                        </div>
                        <div class="flex-1 bg-slate-50 rounded-lg border border-slate-100 mt-2 p-4">
                             <div class="flex justify-between mb-4">
                                 <div class="w-24 h-4 bg-slate-200 rounded"></div>
                                 <div class="w-16 h-4 bg-slate-200 rounded"></div>
                             </div>
                             <div class="space-y-3">
                                 <div class="h-8 w-full bg-white rounded border border-slate-100"></div>
                                 <div class="h-8 w-full bg-white rounded border border-slate-100"></div>
                                 <div class="h-8 w-full bg-white rounded border border-slate-100"></div>
                             </div>
                        </div>
                    </div>
                </div>
                
                <!-- Floating Elements -->
                <div class="absolute -right-8 top-12 bg-white p-4 rounded-xl shadow-xl border border-slate-100 max-w-xs animate-bounce" style="animation-duration: 3s">
                   <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                         <svg class="w-6 h-6" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      </div>
                      <div>
                         <div class="text-sm font-bold text-slate-800">Pinjaman Disetujui</div>
                         <div class="text-xs text-slate-500">Baru saja</div>
                      </div>
                   </div>
                </div>

                 <div class="absolute -left-6 bottom-16 bg-white p-4 rounded-xl shadow-xl border border-slate-100 max-w-xs animate-bounce" style="animation-duration: 4s; animation-delay: 1s;">
                   <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                         <svg class="w-6 h-6" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      </div>
                      <div>
                         <div class="text-sm font-bold text-slate-800">Setoran Masuk</div>
                         <div class="text-xs text-slate-500">Rp 5.000.000</div>
                      </div>
                   </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section id="features" class="py-24 bg-white">
       <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-16">
             <h2 class="text-3xl font-bold text-slate-900 mb-4">Software Koperasi All In One</h2>
             <p class="text-slate-600 text-lg">Platform terintegrasi yang mencakup segala aspek operasional koperasi modern, dari manajemen anggota hingga laporan keuangan.</p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             <!-- Feature 1 -->
             <div class="bg-slate-50 rounded-2xl p-8 hover:bg-blue-50 transition-colors group border border-slate-100">
                <div class="w-14 h-14 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                   <svg class="w-7 h-7" width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                </div>
                <h3 class="text-xl font-bold text-slate-900 mb-3">Dashboard Koperasi Pro</h3>
                <p class="text-slate-600 leading-relaxed">Pengelolaan profil, aset, laporan keuangan, SHU, serta data simpanan dan pinjaman anggota secara realtime.</p>
             </div>

             <!-- Feature 2 -->
             <div class="bg-slate-50 rounded-2xl p-8 hover:bg-blue-50 transition-colors group border border-slate-100">
                <div class="w-14 h-14 rounded-xl bg-teal-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform">
                   <svg class="w-7 h-7" width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                </div>
                <h3 class="text-xl font-bold text-slate-900 mb-3">Aplikasi Mobile Anggota</h3>
                <p class="text-slate-600 leading-relaxed">Top up saldo, pembayaran tagihan (PLN, PDAM), transfer saldo, dan marketplace internal untuk anggota.</p>
             </div>

             <!-- Feature 3 -->
             <div class="bg-slate-50 rounded-2xl p-8 hover:bg-blue-50 transition-colors group border border-slate-100">
                <div class="w-14 h-14 rounded-xl bg-indigo-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                   <svg class="w-7 h-7" width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <h3 class="text-xl font-bold text-slate-900 mb-3">Keamanan Terjamin</h3>
                <p class="text-slate-600 leading-relaxed">Dilengkapi 2FA, Imunify360, Cloudflare Protection, dan backup harian otomatis untuk melindungi data anda.</p>
             </div>

             <!-- Feature 4 -->
             <div class="bg-slate-50 rounded-2xl p-8 hover:bg-blue-50 transition-colors group border border-slate-100">
                <div class="w-14 h-14 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                   <svg class="w-7 h-7" width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <h3 class="text-xl font-bold text-slate-900 mb-3">Unit Usaha Terintegrasi</h3>
                <p class="text-slate-600 leading-relaxed">Kelola berbagai unit usaha koperasi dalam satu sistem yang saling terhubung untuk efisiensi maksimal.</p>
             </div>

             <!-- Feature 5 -->
             <div class="bg-slate-50 rounded-2xl p-8 hover:bg-blue-50 transition-colors group border border-slate-100">
                <div class="w-14 h-14 rounded-xl bg-pink-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform">
                   <svg class="w-7 h-7" width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                </div>
                <h3 class="text-xl font-bold text-slate-900 mb-3">Dukungan Teknis 24/7</h3>
                <p class="text-slate-600 leading-relaxed">Layanan support online, akses pelatihan, dan tutorial lengkap untuk memastikan kelancaran operasional.</p>
             </div>

             <!-- Feature 6 -->
             <div class="bg-slate-50 rounded-2xl p-8 hover:bg-blue-50 transition-colors group border border-slate-100">
                <div class="w-14 h-14 rounded-xl bg-cyan-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                   <svg class="w-7 h-7" width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>
                </div>
                <h3 class="text-xl font-bold text-slate-900 mb-3">Realtime Reporting</h3>
                <p class="text-slate-600 leading-relaxed">Laporan keuangan dan transaksi yang dapat diakses kapan saja sesuai Standar Akuntansi Entitas Privat.</p>
             </div>
          </div>
       </div>
    </section>

    <!-- Stats / CTA -->
    <section class="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] hover:opacity-20 transition-opacity"></div>
        <div class="container mx-auto px-4 relative z-10">
           <div class="grid md:grid-cols-2 gap-12 items-center">
              <div>
                 <h2 class="text-3xl md:text-4xl font-bold mb-6">Siap mendigitalisasi koperasi Anda?</h2>
                 <p class="text-slate-300 text-lg mb-8">Bergabunglah dengan ratusan koperasi modern di seluruh Indonesia. Tingkatkan kepercayaan anggota dengan transparansi dan kemudahan layanan.</p>
                 <a href="https://api.whatsapp.com/send/?phone=%2B6282287593400&text&app_absent=0" class="inline-block px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition-colors">
                    Hubungi Kami Sekarang
                 </a>
              </div>
              <div class="grid grid-cols-2 gap-6">
                 <div class="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center">
                    <div class="text-4xl font-bold text-blue-400 mb-2">24/7</div>
                    <div class="text-slate-400 text-sm uppercase tracking-wider">Server Uptime</div>
                 </div>
                 <div class="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center">
                    <div class="text-4xl font-bold text-teal-400 mb-2">100+</div>
                    <div class="text-slate-400 text-sm uppercase tracking-wider">Koperasi Mitra</div>
                 </div>
                  <div class="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center">
                    <div class="text-4xl font-bold text-purple-400 mb-2">10k+</div>
                    <div class="text-slate-400 text-sm uppercase tracking-wider">Pengguna Aktif</div>
                 </div>
                 <div class="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 text-center">
                    <div class="text-4xl font-bold text-orange-400 mb-2">Secure</div>
                    <div class="text-slate-400 text-sm uppercase tracking-wider">Data Protection</div>
                 </div>
              </div>
           </div>
        </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'koperasi'
})

</script>
