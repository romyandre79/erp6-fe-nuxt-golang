<template>
  <div class="admin-layout min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50">
    <!-- Navbar -->
    <header
      class="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 transition-all duration-300"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center gap-2 cursor-pointer" @click="navigateTo('/koperasi')">
            <div
              class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                />
              </svg>
            </div>
            <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-600">
              Koperasi Digital
            </span>
          </div>

          <!-- Desktop Menu -->
          <nav class="hidden md:flex gap-8">
            <a href="#home" class="text-slate-600 hover:text-blue-600 font-medium transition-colors">Beranda</a>
            <a href="#features" class="text-slate-600 hover:text-blue-600 font-medium transition-colors">Fitur</a>
            <a href="#solutions" class="text-slate-600 hover:text-blue-600 font-medium transition-colors">Solusi</a>
            <a href="#clients" class="text-slate-600 hover:text-blue-600 font-medium transition-colors">Klien</a>
          </nav>

          <!-- CTA Buttons -->
          <div class="hidden md:flex items-center gap-4">
            <button class="text-slate-600 hover:text-blue-600 font-medium transition-colors">Masuk</button>
            <button
              class="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
            >
              Hubungi Kami
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden flex items-center">
            <button
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="text-slate-600 hover:text-blue-600 focus:outline-none"
            >
              <svg
                v-if="!isMobileMenuOpen"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-8 h-8"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-8 h-8"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Menu -->
    <div
      v-show="isMobileMenuOpen"
      class="md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-sm pt-20 px-6 transition-all duration-300"
    >
      <nav class="flex flex-col gap-6 text-lg font-medium text-slate-700">
        <a href="#home" @click="isMobileMenuOpen = false" class="hover:text-blue-600">Beranda</a>
        <a href="#features" @click="isMobileMenuOpen = false" class="hover:text-blue-600">Fitur</a>
        <a href="#solutions" @click="isMobileMenuOpen = false" class="hover:text-blue-600">Solusi</a>
        <a href="#clients" @click="isMobileMenuOpen = false" class="hover:text-blue-600">Klien</a>
        <hr class="border-slate-100" />
        <button class="text-left hover:text-blue-600">Masuk</button>
        <button class="w-full py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20">
          Hubungi Kami
        </button>
      </nav>
    </div>

    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-300 py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <!-- Company Info -->
          <div class="col-span-1 md:col-span-1">
            <div class="flex items-center gap-2 mb-6">
              <div
                class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                  />
                </svg>
              </div>
              <span class="text-xl font-bold text-white"> Koperasi Digital </span>
            </div>
            <p class="text-sm leading-relaxed mb-6">
              Jl. Ringin Raya No.10 Ngringin, Condong Catur, Depok, Sleman, Daerah Istimewa Yogyakarta.
            </p>
            <div class="flex gap-4">
              <!-- Social Icons -->
              <a
                href="#"
                class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors text-white"
              >
                <span class="sr-only">Facebook</span>
                <!-- Simple Generic Icon -->
                <svg class="h-5 w-5" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  />
                </svg>
              </a>
              <a
                href="#"
                class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors text-white"
              >
                <span class="sr-only">Instagram</span>
                <svg class="h-5 w-5" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fill-rule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.489 2h.234zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          <!-- Links -->
          <div>
            <h3 class="text-white font-semibold mb-6">Perusahaan</h3>
            <ul class="space-y-4 text-sm">
              <li><a href="#" class="hover:text-blue-400 transition-colors">Tentang Kami</a></li>
              <li><a href="#" class="hover:text-blue-400 transition-colors">Karir</a></li>
              <li><a href="#" class="hover:text-blue-400 transition-colors">Berita</a></li>
              <li><a href="#" class="hover:text-blue-400 transition-colors">Kontak</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-6">Layanan</h3>
            <ul class="space-y-4 text-sm">
              <li><a href="#" class="hover:text-blue-400 transition-colors">Software Koperasi</a></li>
              <li><a href="#" class="hover:text-blue-400 transition-colors">Mobile App</a></li>
              <li><a href="#" class="hover:text-blue-400 transition-colors">Unit Usaha</a></li>
              <li><a href="#" class="hover:text-blue-400 transition-colors">Integrasi API</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-6">Hubungi Kami</h3>
            <ul class="space-y-4 text-sm">
              <li class="flex items-start gap-3">
                <span class="text-blue-500 mt-1">
                  <svg class="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </span>
                +62 822-8759-3400
              </li>
              <li class="flex items-start gap-3">
                <span class="text-blue-500 mt-1">
                  <svg class="w-4 h-4" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                management@sasuka.online
              </li>
            </ul>
          </div>
        </div>
        <div class="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          © 2024 Digital Cooperative Network – Indonesia. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const isMobileMenuOpen = ref(false);
</script>

<style>
@import '@/assets/css/main.css';

/* Scoped styles overrides */
</style>
