<template>
  <div class="campaign-page">
    <!-- Hero Section -->
    <section class="relative pt-32 pb-24 overflow-hidden bg-white">
      <!-- Background Elements -->
      <div class="absolute inset-0 z-0">
        <div class="absolute -top-20 -right-20 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl opacity-50"></div>
        <div class="absolute top-40 -left-20 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-block mb-6 px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold border border-slate-200">
          🚀 Unified Marketing Platform
        </div>
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-900">
          Connect with Customers on<br />
          <span class="bg-gradient-to-r from-blue-600 via-indigo-600 to-green-500 bg-clip-text text-transparent">Email & WhatsApp</span>
        </h1>
        <p class="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
          One platform to rule all your campaigns. Send high-converting emails and instant WhatsApp messages to engage your audience anytime, anywhere.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <button class="px-8 py-4 rounded-full bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all transform hover:-translate-y-1">
            Start Free Trial
          </button>
          <button class="px-8 py-4 rounded-full bg-white text-slate-700 font-semibold border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
            See How It Works
          </button>
        </div>
        
        <!-- Dashboard Preview/Mockup -->
        <div class="mt-20 relative mx-auto max-w-5xl">
            <div class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
            <div class="rounded-xl bg-slate-900 p-2 shadow-2xl border border-slate-800">
                <div class="rounded-lg bg-slate-800 h-64 md:h-96 flex items-center justify-center">
                    <span class="text-slate-600 text-lg">Dashboard Mockup Area</span>
                </div>
            </div>
        </div>
      </div>
    </section>

    <!-- Unified Experience Section (Why Choose Us) -->
    <section class="py-24 bg-slate-50">
       <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-slate-900 mb-4">Why use separate tools?</h2>
            <p class="text-slate-500 text-lg">Manage all your customer communication channels from a single, powerful dashboard.</p>
         </div>
         
         <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
                <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">📧</div>
                <h3 class="text-xl font-bold text-slate-900 mb-3">Email Marketing</h3>
                <p class="text-slate-500">Create beautiful newsletters and automated drip campaigns with our drag-and-drop editor.</p>
            </div>
             <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
                <div class="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">💬</div>
                <h3 class="text-xl font-bold text-slate-900 mb-3">WhatsApp Business</h3>
                <p class="text-slate-500">Send broadcast messages, transaction alerts, and build chatbots with the Official WhatsApp API.</p>
            </div>
             <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
                <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">🔗</div>
                <h3 class="text-xl font-bold text-slate-900 mb-3">Unified CRM</h3>
                <p class="text-slate-500">Keep all customer data and interaction history in one place, segments specifically for each channel.</p>
            </div>
         </div>
       </div>
    </section>

    <!-- Email Marketing Deep Dive -->
    <section id="email-marketing" class="py-24 bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row items-center gap-16">
          <div class="lg:w-1/2">
            <span class="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Email Marketing</span>
            <h2 class="text-4xl font-extrabold text-slate-900 mb-6">Beautiful emails, higher open rates.</h2>
            <p class="text-lg text-slate-600 mb-8 leading-relaxed">
              Don't let your emails land in spam. Our infrastructure ensures maximum deliverability. Use our templates to design professional emails in minutes.
            </p>
            
            <ul class="space-y-4 mb-8">
              <li class="flex items-start gap-3">
                <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">✓</span>
                <span class="text-slate-700">Drag-and-drop visual builder</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">✓</span>
                <span class="text-slate-700">A/B Testing for subject lines and content</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">✓</span>
                <span class="text-slate-700">Detailed analytics and heatmaps</span>
              </li>
            </ul>
            
            <button class="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2 group">
              Explore Email Features <span class="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
           <div class="lg:w-1/2 relative">
             <div class="absolute -inset-4 bg-blue-200/30 rounded-full blur-3xl"></div>
             <div class="relative bg-slate-50 rounded-2xl border border-slate-200 shadow-2xl p-6 rotate-2 hover:rotate-0 transition-transform duration-500">
                <!-- Abstract UI representation -->
                <div class="space-y-4">
                    <div class="h-8 bg-white rounded w-3/4 shadow-sm"></div>
                    <div class="h-40 bg-white rounded shadow-sm"></div>
                    <div class="flex gap-4">
                        <div class="h-20 bg-blue-50 rounded flex-1"></div>
                        <div class="h-20 bg-blue-50 rounded flex-1"></div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WhatsApp Marketing Deep Dive -->
    <section id="whatsapp-marketing" class="py-24 bg-slate-900 text-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row-reverse items-center gap-16">
          <div class="lg:w-1/2">
             <span class="text-green-400 font-bold tracking-wider uppercase text-sm mb-2 block">WhatsApp Marketing</span>
            <h2 class="text-4xl font-extrabold mb-6">Reach them where they chat.</h2>
            <p class="text-lg text-slate-400 mb-8 leading-relaxed">
              Emails can be ignored, but WhatsApp messages are read. Achieve up to 98% open rates with our direct WhatsApp Business API integration.
            </p>
            
            <ul class="space-y-4 mb-8">
              <li class="flex items-start gap-3">
                <span class="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm">✓</span>
                <span class="text-slate-300">Official WhatsApp Business API</span>
              </li>
              <li class="flex items-start gap-3">
                 <span class="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm">✓</span>
                <span class="text-slate-300">Automated chatbots and quick replies</span>
              </li>
              <li class="flex items-start gap-3">
                 <span class="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm">✓</span>
                <span class="text-slate-300">Bulk broadcast sending with personalization</span>
              </li>
            </ul>
             <button class="text-green-400 font-semibold hover:text-green-300 flex items-center gap-2 group">
              Explore WhatsApp Features <span class="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
           <div class="lg:w-1/2 relative">
             <div class="absolute -inset-4 bg-green-500/20 rounded-full blur-3xl"></div>
             <div class="relative bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl p-4 -rotate-2 hover:rotate-0 transition-transform duration-500 max-w-sm mx-auto">
                <!-- Phone Frame mockup -->
                <div class="bg-slate-900 rounded-2xl h-[500px] p-4 flex flex-col">
                    <div class="w-1/3 h-6 bg-slate-800 mx-auto rounded-full mb-6"></div>
                    <div class="space-y-4 flex-1">
                        <div class="bg-slate-800 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                            <div class="h-2 w-full bg-slate-700 rounded mb-2"></div>
                             <div class="h-2 w-2/3 bg-slate-700 rounded"></div>
                        </div>
                        <div class="bg-green-600 p-3 rounded-lg rounded-tr-none max-w-[80%] ml-auto">
                            <div class="h-2 w-full bg-green-700 rounded mb-2"></div>
                             <div class="h-2 w-1/2 bg-green-700 rounded"></div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
          <p class="text-slate-500">Upgrade as your audience grows.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <!-- Starter -->
          <div class="p-8 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 transition-colors relative overflow-hidden group">
            <h3 class="text-lg font-semibold text-slate-900 mb-2">Starter</h3>
            <div class="text-4xl font-bold text-slate-900 mb-6">$29<span class="text-lg text-slate-500 font-normal">/mo</span></div>
            <p class="text-slate-500 mb-6 text-sm">Perfect for small businesses sending their first campaigns.</p>
            <ul class="space-y-3 mb-8">
                <li class="text-sm text-slate-600 flex gap-2"><span class="text-green-500">✓</span> 5,000 Emails/mo</li>
                <li class="text-sm text-slate-600 flex gap-2"><span class="text-green-500">✓</span> 1,000 WA messages</li>
                <li class="text-sm text-slate-600 flex gap-2"><span class="text-green-500">✓</span> Basic Templates</li>
            </ul>
             <button class="w-full py-3 rounded-xl bg-slate-100 text-slate-900 font-semibold hover:bg-slate-200 transition-colors">Start Free</button>
          </div>

           <!-- Pro -->
          <div class="p-8 bg-slate-900 text-white rounded-2xl shadow-xl transform scale-105 relative z-10">
            <div class="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
            <h3 class="text-lg font-semibold mb-2">Pro Business</h3>
            <div class="text-4xl font-bold mb-6">$79<span class="text-lg text-slate-400 font-normal">/mo</span></div>
             <p class="text-slate-400 mb-6 text-sm">For growing teams that need automation and analysis.</p>
            <ul class="space-y-3 mb-8">
                <li class="text-sm text-slate-300 flex gap-2"><span class="text-blue-400">✓</span> 50,000 Emails/mo</li>
                <li class="text-sm text-slate-300 flex gap-2"><span class="text-blue-400">✓</span> 10,000 WA messages</li>
                <li class="text-sm text-slate-300 flex gap-2"><span class="text-blue-400">✓</span> Advanced Automation</li>
                <li class="text-sm text-slate-300 flex gap-2"><span class="text-blue-400">✓</span> Priority Support</li>
            </ul>
             <button class="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">Get Started</button>
          </div>

           <!-- Enterprise -->
          <div class="p-8 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 transition-colors">
            <h3 class="text-lg font-semibold text-slate-900 mb-2">Enterprise</h3>
            <div class="text-4xl font-bold text-slate-900 mb-6">Custom</div>
             <p class="text-slate-500 mb-6 text-sm">Tailored solutions for large scale operations.</p>
            <ul class="space-y-3 mb-8">
                <li class="text-sm text-slate-600 flex gap-2"><span class="text-green-500">✓</span> Unlimited Sending</li>
                <li class="text-sm text-slate-600 flex gap-2"><span class="text-green-500">✓</span> Dedicated Account Manager</li>
                <li class="text-sm text-slate-600 flex gap-2"><span class="text-green-500">✓</span> Custom Integrations</li>
            </ul>
             <button class="w-full py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold hover:bg-slate-50 transition-colors">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-center text-white">
        <div class="max-w-4xl mx-auto px-4">
            <h2 class="text-4xl font-bold mb-6">Ready to skyrocket your engagement?</h2>
            <p class="text-blue-100 text-xl mb-10">Join 10,000+ businesses using our platform today.</p>
            <button class="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-blue-50 transition-colors">
                Start Your Free Trial
            </button>
        </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'campaign'
})
</script>

<style scoped>
/* Any specific page scoped styles */
</style>
