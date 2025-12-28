<template>
  <div class="remindax-page">
    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl shadow-2xl animate-pulse-slow"></div>
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-red-400/20 rounded-full blur-3xl shadow-2xl animate-pulse-slow" style="animation-delay: 2s;"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          <span class="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Never Miss a</span><br />
          <span class="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Deadline Again</span>
        </h1>
        <p class="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
          The intelligent reminder and scheduling system for modern teams. Automate your follow-ups across WhatsApp, Email, and more.
        </p>
        <div class="flex justify-center gap-4">
          <button class="px-8 py-4 rounded-full bg-orange-600 text-white font-semibold shadow-lg shadow-orange-600/30 hover:bg-orange-700 hover:shadow-orange-600/40 transition-all transform hover:-translate-y-1">
            Get Started Free
          </button>
          <button class="px-8 py-4 rounded-full bg-white text-slate-700 font-semibold border border-slate-200 shadow-sm hover:bg-slate-50 transition-all">
            Live Demo
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-24 bg-white relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900 mb-4">Why Remindax?</h2>
          <p class="text-slate-500">Built to ensure your business runs like clockwork.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            title="Multi-Channel" 
            description="Send notifications via WhatsApp, Email, Telegram, and Slack simultaneously."
            icon="📢"
            color="bg-orange-50 text-orange-600"
          />
          <FeatureCard 
            title="Smart Scheduling" 
            description="AI-powered scheduling that finds the best time for your reminders."
            icon="🧠"
            color="bg-red-50 text-red-600"
          />
          <FeatureCard 
            title="Recurring Workflows" 
            description="Set up complex recurring patterns for daily, weekly, or custom intervals."
            icon="🔁"
            color="bg-amber-50 text-amber-600"
          />
          <FeatureCard 
            title="Team Collaboration" 
            description="Share calendars and reminders with your entire organization."
            icon="👥"
            color="bg-blue-50 text-blue-600"
          />
          <FeatureCard 
            title="Analytics Dashboard" 
            description="Track delivery rates, open rates, and engagement of your notifications."
            icon="📊"
            color="bg-purple-50 text-purple-600"
          />
          <FeatureCard 
            title="API First" 
            description="Integrate with any system using our robust REST API."
            icon="🔌"
            color="bg-green-50 text-green-600"
          />
        </div>
      </div>
    </section>

    <!-- Modules/Integrations Section -->
    <section id="modules" class="py-24 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900 mb-4">Supported Integrations</h2>
          <p class="text-slate-500">Connect with the tools you use every day.</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ModuleCard title="WhatsApp" icon="💬" />
          <ModuleCard title="Telegram" icon="✈️" />
          <ModuleCard title="Gmail" icon="📧" />
          <ModuleCard title="Slack" icon="🗨️" />
          <ModuleCard title="Outlook" icon="📅" />
          <ModuleCard title="Zoom" icon="🎥" />
          <ModuleCard title="Google Calendar" icon="🗓️" />
          <ModuleCard title="To-Do Lists" icon="✅" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { h } from 'vue'

definePageMeta({
  layout: 'remindax'
})


const FeatureCard = (props) => {
  return h('div', { class: 'group p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1' }, [
    h('div', { class: `w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 ${props.color} group-hover:scale-110 transition-transform` }, props.icon),
    h('h3', { class: 'text-xl font-bold text-slate-900 mb-2' }, props.title),
    h('p', { class: 'text-slate-500 leading-relaxed' }, props.description)
  ])
}

const ModuleCard = (props) => {
  return h('div', { class: 'flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all cursor-pointer group' }, [
    h('div', { class: 'text-4xl mb-4 group-hover:scale-110 transition-transform duration-300' }, props.icon),
    h('h3', { class: 'font-semibold text-slate-700 group-hover:text-orange-600 transition-colors' }, props.title)
  ])
}
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.15;
    transform: scale(1.1);
  }
}
</style>
