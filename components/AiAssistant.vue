<template>
  <div>
    <!-- Floating Button -->
    <!-- Floating Animated Character -->
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
        <div 
          @click="toggleOpen" 
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
          class="clippy-container pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-110"
          :class="{ 'clippy-active': isChatOpen }"
        >
            <!-- Unread Badge -->
            <span v-if="totalUnread > 0 && !isChatOpen" class="absolute -top-2 -right-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center animate-bounce shadow-md">
                {{ totalUnread > 99 ? '99+' : totalUnread }}
            </span>
            
            <!-- Dynamic Character Rendering -->

            <!-- CLIPPY -->
            <svg v-if="assistantCharacter === 'clippy'" class="clippy-svg w-24 h-24 drop-shadow-xl" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M 30 70 L 30 30 A 15 15 0 0 1 60 30 L 60 80 A 20 20 0 0 1 20 80 L 20 40" fill="none" stroke="#C0C0C0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="clippy-wire"/>
                <path d="M 30 70 L 65 70" fill="none" stroke="#C0C0C0" stroke-width="4" stroke-linecap="round" class="clippy-wire-base"/>
                <g class="clippy-eyes" transform="translate(0, 5)">
                    <g transform="translate(35, 35)"> <circle cx="0" cy="0" r="10" fill="white" stroke="#666" stroke-width="1"/> <circle cx="2" cy="-1" r="3" fill="black" class="clippy-pupil"/> <path d="M -8 -12 Q 0 -16 8 -12" fill="none" stroke="black" stroke-width="2" class="clippy-eyebrow"/> </g>
                    <g transform="translate(60, 35)"> <circle cx="0" cy="0" r="10" fill="white" stroke="#666" stroke-width="1"/> <circle cx="-2" cy="-1" r="3" fill="black" class="clippy-pupil"/> <path d="M -8 -12 Q 0 -16 8 -12" fill="none" stroke="black" stroke-width="2" class="clippy-eyebrow"/> </g>
                </g>

                <!-- Writing Animation Elements -->
                <transition name="fade">
                  <g v-if="isBusy" transform="translate(0, 10)">
                      <!-- Paper -->
                      <path d="M 55 95 L 85 95 L 85 65 L 55 65 Z" fill="white" stroke="#666" stroke-width="1" transform="rotate(-15 70 80)"/>
                      <line x1="60" y1="70" x2="80" y2="70" stroke="#ccc" stroke-width="1" transform="rotate(-15 70 80)"/>
                      <line x1="60" y1="75" x2="80" y2="75" stroke="#ccc" stroke-width="1" transform="rotate(-15 70 80)"/>
                      <line x1="60" y1="80" x2="80" y2="80" stroke="#ccc" stroke-width="1" transform="rotate(-15 70 80)"/>
                      
                      <!-- Hand/Pen -->
                      <g class="clippy-writing-hand">
                         <path d="M 75 75 L 85 55 L 90 58 L 80 78 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
                         <path d="M 75 75 L 73 78" stroke="#333" stroke-width="1" />
                      </g>
                  </g>
                </transition>

                <!-- Waving Animation (Hover) -->
                <transition name="fade">
                  <g v-if="isHovered && !isBusy" transform="translate(0, 5)">
                      <g class="clippy-wave-hand">
                         <!-- Hand/Arm -->
                        <path d="M 80 50 L 95 35 L 100 40 L 85 55 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
                        <circle cx="95" cy="35" r="5" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
                         <path d="M 80 50 Q 85 60 80 70" fill="none" stroke="#C0C0C0" stroke-width="4" stroke-linecap="round" />
                      </g>
                  </g>
                </transition>
            </svg>

            <!-- ROBOT -->
            <svg v-else-if="assistantCharacter === 'robot'" class="clippy-svg w-24 h-24 drop-shadow-xl" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <!-- Head -->
                <rect x="25" y="25" width="50" height="40" rx="8" ry="8" fill="#6366f1" stroke="#4338ca" stroke-width="2"/>
                <!-- Antennas -->
                <line x1="35" y1="25" x2="30" y2="15" stroke="#4338ca" stroke-width="2"/> <circle cx="30" cy="15" r="3" fill="#ef4444" class="animate-pulse"/>
                <line x1="65" y1="25" x2="70" y2="15" stroke="#4338ca" stroke-width="2"/> <circle cx="70" cy="15" r="3" fill="#ef4444" class="animate-pulse"/>
                <!-- Eyes -->
                <g class="clippy-eyes" transform="translate(0, 0)"> 
                     <g transform="translate(40, 45)"> <circle cx="0" cy="0" r="6" fill="#fff"/> <circle cx="0" cy="0" r="3" fill="#000" class="clippy-pupil"/> </g>
                     <g transform="translate(60, 45)"> <circle cx="0" cy="0" r="6" fill="#fff"/> <circle cx="0" cy="0" r="3" fill="#000" class="clippy-pupil"/> </g>
                </g>
                <!-- Mouth -->
                <rect x="40" y="55" width="20" height="4" rx="2" fill="white"/>
            </svg>

            <!-- CAT -->
            <svg v-else-if="assistantCharacter === 'cat'" class="clippy-svg w-24 h-24 drop-shadow-xl" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <!-- Head -->
                <circle cx="50" cy="50" r="30" fill="#fb923c" stroke="#c2410c" stroke-width="2"/>
                <!-- Ears -->
                <path d="M 25 35 L 20 15 L 45 30 Z" fill="#fb923c" stroke="#c2410c" stroke-width="2"/>
                <path d="M 75 35 L 80 15 L 55 30 Z" fill="#fb923c" stroke="#c2410c" stroke-width="2"/>
                <!-- Eyes -->
                <g class="clippy-eyes" transform="translate(0, 5)">
                    <g transform="translate(40, 45)"> <ellipse cx="0" cy="0" rx="6" ry="8" fill="white"/> <circle cx="0" cy="0" r="3" fill="black" class="clippy-pupil"/> </g>
                    <g transform="translate(60, 45)"> <ellipse cx="0" cy="0" rx="6" ry="8" fill="white"/> <circle cx="0" cy="0" r="3" fill="black" class="clippy-pupil"/> </g>
                </g>
                <!-- Nose/Mouth -->
                <path d="M 48 58 L 52 58 L 50 63 Z" fill="pink"/>
            </svg>

            <!-- DOG -->
<svg
  v-else-if="assistantCharacter === 'dog'"
  class="clippy-svg w-24 h-24 drop-shadow-xl"
  viewBox="0 0 100 100"
  xmlns="http://www.w3.org/2000/svg"
>
  <!-- Head -->
  <circle
    cx="50"
    cy="50"
    r="30"
    fill="#fbbf24"
    stroke="#b45309"
    stroke-width="2"
  />

  <!-- Ears (Floppy) -->
  <path
    d="M 25 40 C 10 50, 10 70, 25 75"
    fill="#fbbf24"
    stroke="#b45309"
    stroke-width="2"
  />
  <path
    d="M 75 40 C 90 50, 90 70, 75 75"
    fill="#fbbf24"
    stroke="#b45309"
    stroke-width="2"
  />

  <!-- Eyes -->
  <g class="clippy-eyes" transform="translate(0, 5)">
    <g transform="translate(40, 45)">
      <ellipse cx="0" cy="0" rx="6" ry="8" fill="white" />
      <circle cx="0" cy="0" r="3" fill="black" class="clippy-pupil" />
    </g>
    <g transform="translate(60, 45)">
      <ellipse cx="0" cy="0" rx="6" ry="8" fill="white" />
      <circle cx="0" cy="0" r="3" fill="black" class="clippy-pupil" />
    </g>
  </g>

  <!-- Snout -->
  <ellipse
    cx="50"
    cy="60"
    rx="12"
    ry="8"
    fill="#fde68a"
    stroke="#b45309"
    stroke-width="1.5"
  />

  <!-- Nose -->
  <circle cx="50" cy="58" r="3" fill="#1f2937" />

  <!-- Mouth -->
  <path
    d="M 50 61 C 48 64, 44 64, 42 62"
    stroke="#1f2937"
    stroke-width="1.5"
    fill="none"
  />
  <path
    d="M 50 61 C 52 64, 56 64, 58 62"
    stroke="#1f2937"
    stroke-width="1.5"
    fill="none"
  />
</svg>

<!-- PANDA -->
<svg
  v-else-if="assistantCharacter === 'panda'"
  class="clippy-svg w-24 h-24 drop-shadow-xl"
  viewBox="0 0 100 100"
  xmlns="http://www.w3.org/2000/svg"
>
  <!-- Head -->
  <circle cx="50" cy="50" r="30" fill="#ffffff" stroke="#111827" stroke-width="2"/>

  <!-- Ears -->
  <circle cx="30" cy="25" r="10" fill="#111827"/>
  <circle cx="70" cy="25" r="10" fill="#111827"/>

  <!-- Eye patches -->
  <ellipse cx="40" cy="48" rx="9" ry="12" fill="#111827"/>
  <ellipse cx="60" cy="48" rx="9" ry="12" fill="#111827"/>

  <!-- Eyes -->
  <circle cx="40" cy="50" r="4" fill="white"/>
  <circle cx="60" cy="50" r="4" fill="white"/>

  <!-- Nose -->
  <circle cx="50" cy="60" r="3" fill="#111827"/>
</svg>

<!-- FOX -->
<svg
  v-else-if="assistantCharacter === 'fox'"
  class="clippy-svg w-24 h-24 drop-shadow-xl"
  viewBox="0 0 100 100"
  xmlns="http://www.w3.org/2000/svg"
>
  <!-- Head -->
  <path d="M20 30 L50 15 L80 30 V65 L50 80 L20 65 Z"
        fill="#fb923c" stroke="#c2410c" stroke-width="2"/>

  <!-- Ears -->
  <path d="M30 30 L25 10 L45 25 Z" fill="#fb923c" stroke="#c2410c" stroke-width="2"/>
  <path d="M70 30 L75 10 L55 25 Z" fill="#fb923c" stroke="#c2410c" stroke-width="2"/>

  <!-- Eyes -->
  <circle cx="40" cy="45" r="4" fill="#111827"/>
  <circle cx="60" cy="45" r="4" fill="#111827"/>

  <!-- Snout -->
  <path d="M45 55 L55 55 L50 65 Z" fill="#fff7ed"/>
</svg>


             <!-- CUSTOM IMAGE -->
            <div v-else-if="assistantCharacter === 'custom'" class="w-24 h-24 relative drop-shadow-xl">
                 <img :src="assistantCustomImage || 'https://via.placeholder.com/100?text=?'" class="w-full h-full object-contain clippy-svg" />
            </div>

            <!-- Universal Writing Animation (for all characters) -->
            <transition name="fade">
              <svg v-if="isBusy" class="absolute bottom-0 right-0 w-16 h-16" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                  <!-- Paper -->
                  <path d="M 10 45 L 50 45 L 50 15 L 10 15 Z" fill="white" stroke="#666" stroke-width="1" transform="rotate(-10 30 30)"/>
                  <line x1="15" y1="22" x2="45" y2="22" stroke="#ccc" stroke-width="1" transform="rotate(-10 30 30)"/>
                  <line x1="15" y1="28" x2="45" y2="28" stroke="#ccc" stroke-width="1" transform="rotate(-10 30 30)"/>
                  <line x1="15" y1="34" x2="45" y2="34" stroke="#ccc" stroke-width="1" transform="rotate(-10 30 30)"/>
                  
                  <!-- Pen -->
                  <g class="clippy-writing-hand">
                     <path d="M 35 30 L 45 15 L 50 18 L 40 33 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
                     <path d="M 35 30 L 33 33" stroke="#333" stroke-width="1" />
                  </g>
              </svg>
            </transition>

            <!-- Universal Waving Animation (for all characters) -->
            <transition name="fade">
              <svg v-if="isHovered && !isBusy" class="absolute top-0 right-0 w-12 h-12" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <g class="clippy-wave-hand">
                     <!-- Hand -->
                    <path d="M 10 20 L 25 5 L 30 10 L 15 25 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
                    <circle cx="25" cy="5" r="4" fill="#facc15" stroke="#ca8a04" stroke-width="1"/>
                  </g>
              </svg>
            </transition>

            <!-- Speech Bubble Tail for open state -->
            <div v-if="isChatOpen" class="absolute -top-4 right-12 w-4 h-4 bg-white dark:bg-gray-800 rotate-45 border-l border-t border-gray-200 dark:border-gray-700"></div>
        </div>
    </div>

    <!-- Main Window -->
    <transition name="fade-slide">
      <div v-if="isChatOpen" class="fixed bottom-32 right-8 z-50 bg-white dark:bg-gray-800 shadow-2xl rounded-3xl w-80 sm:w-96 flex flex-col overflow-hidden border-2 border-gray-200 dark:border-gray-700 h-[600px] origin-bottom-right">
        
        <!-- Tabs Header -->
        <div class="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex">
            <button 
                @click="activeTab = 'ai'"
                class="flex-1 py-3 text-sm font-semibold flex justify-center items-center gap-2 transition-colors relative"
                :class="activeTab === 'ai' ? 'text-indigo-600 bg-white dark:bg-gray-800 border-t-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
            >
                AI Assistant
            </button>
            <button 
                @click="activeTab = 'people'"
                class="flex-1 py-3 text-sm font-semibold flex justify-center items-center gap-2 transition-colors relative"
                :class="activeTab === 'people' ? 'text-indigo-600 bg-white dark:bg-gray-800 border-t-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
            >
                People
            </button>
             <button 
                @click="activeTab = 'settings'"
                class="w-12 py-3 text-sm font-semibold flex justify-center items-center gap-2 transition-colors relative border-l border-gray-200 dark:border-gray-700"
                :class="activeTab === 'settings' ? 'text-indigo-600 bg-white dark:bg-gray-800 border-t-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
            >
                <i class="fa-solid fa-gear"></i>
            </button>
        </div>

        <!-- Content: AI Tab -->
        <div v-if="activeTab === 'ai'" class="flex-1 flex flex-col min-h-0">
             <!-- AI Header -->
            <div class="bg-indigo-600 p-3 text-white flex gap-2 items-center text-sm shadow-sm">
                 <i class="fa-solid fa-robot"></i>
                 <span>Ask me to create widgets or menus!</span>
            </div>
             <!-- Messages -->
             <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900" ref="aiMessagesContainer">
                <div v-for="(msg, idx) in aiMessages" :key="idx" :class="['flex', msg.sender === 'user' ? 'justify-end' : 'justify-start']">
                    <div :class="['max-w-[85%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap', msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-600']">
                    {{ msg.text }}
                    </div>
                </div>
             </div>
             <!-- Input -->
             <div class="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <form @submit.prevent="sendAiMessage" class="flex gap-2">
                    <input v-model="aiInput" type="text" placeholder="Type a command..." class="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <button type="submit" class="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700">
                        <i class="fa-solid fa-paper-plane px-1"></i>
                    </button>
                </form>
             </div>
        </div>
        
        <!-- Content: Settings Tab -->
        <div v-else-if="activeTab === 'settings'" class="flex-1 flex flex-col p-4 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
             <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-4">Choose your Assistant</h3>
             
             <div class="grid grid-cols-2 gap-4">
                 <!-- Clippy Item -->
                 <div @click="setCharacter('clippy')" :class="['cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all', assistantCharacter === 'clippy' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300']">
                     <div class="h-16 w-16 flex items-center justify-center">
                         <span class="text-4xl">📎</span>
                     </div>
                     <span class="text-sm font-medium">Clippy</span>
                 </div>
                 
                 <!-- Robot Item -->
                 <div @click="setCharacter('robot')" :class="['cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all', assistantCharacter === 'robot' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300']">
                     <div class="h-16 w-16 flex items-center justify-center">
                         <span class="text-4xl">🤖</span>
                     </div>
                     <span class="text-sm font-medium">Auto-Bot</span>
                 </div>

                 <!-- Cat Item -->
                 <div @click="setCharacter('cat')" :class="['cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all', assistantCharacter === 'cat' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300']">
                     <div class="h-16 w-16 flex items-center justify-center">
                         <span class="text-4xl">🐱</span>
                     </div>
                     <span class="text-sm font-medium">Kitty</span>
                 </div>

                 <!-- Office Item -->
                 <div @click="setCharacter('fox')" :class="['cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all', assistantCharacter === 'fox' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300']">
                     <div class="h-16 w-16 flex items-center justify-center">
                         <span class="text-4xl">🦊</span>
                     </div>
                     <span class="text-sm font-medium">Fox</span>
                 </div>

                 <!-- Office Item -->
                 <div @click="setCharacter('dog')" :class="['cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all', assistantCharacter === 'dog' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300']">
                     <div class="h-16 w-16 flex items-center justify-center">
                         <span class="text-4xl">🐶</span>
                     </div>
                     <span class="text-sm font-medium">Dog</span>
                 </div>

                 <!-- Teacher Item -->
                 <div @click="setCharacter('panda')" :class="['cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all', assistantCharacter === 'panda' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300']">
                     <div class="h-16 w-16 flex items-center justify-center">
                         <span class="text-4xl">🐼</span>
                     </div>
                     <span class="text-sm font-medium">Panda</span>
                 </div>

                  <!-- Custom Item -->
                 <div @click="setCharacter('custom')" :class="['cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all', assistantCharacter === 'custom' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300']">
                     <div class="h-16 w-16 flex items-center justify-center">
                         <span class="text-4xl">✨</span>
                     </div>
                     <span class="text-sm font-medium">Custom</span>
                 </div>
             </div>
             
             <!-- Custom Image Input -->
             <div v-if="assistantCharacter === 'custom'" class="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-fade-in">
                 <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Image URL</label>
                 <input 
                    type="text" 
                    :value="assistantCustomImage" 
                    @input="updateCustomImage"
                    placeholder="https://example.com/my-avatar.png"
                    class="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-none text-sm focus:ring-2 focus:ring-indigo-500"
                 />
                 <p class="text-xs text-gray-400 mt-2">Paste a URL to a PNG, JPG, or GIF.</p>
             </div>
        </div>

        <!-- Content: People Tab -->
        <div v-else class="flex-1 flex flex-col min-h-0">
            
            <!-- User List -->
            <div v-if="!selectedUser" class="flex-1 overflow-y-auto p-2 space-y-1">
                 <div v-if="loadingUsers" class="text-center p-4 text-gray-500">Loading users...</div>
                 <div v-else-if="users.length === 0" class="text-center p-4 text-gray-500">No users found.</div>
                 <div 
                    v-for="user in users" 
                    :key="user.useraccessid"
                    @click="selectUser(user)"
                    class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                 >
                    <div class="relative">
                        <img :src="getProfilePhoto(user)" @error="handleImageError" class="w-10 h-10 rounded-full object-cover border border-gray-200" />
                        <span v-if="user.isonline" class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-semibold text-gray-900 dark:text-white truncate">{{ user.realname }}</h4>
                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ user.email }}</p>
                    </div>
                     <div v-if="unreadCounts[user.useraccessid]" class="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {{ unreadCounts[user.useraccessid] }}
                     </div>
                    <i class="fa-solid fa-chevron-right text-gray-300"></i>
                 </div>
            </div>

            <!-- Chat Room -->
            <div v-else class="flex-1 flex flex-col min-h-0 bg-gray-50 dark:bg-gray-900">
                <!-- Chat Header -->
                <div class="bg-white dark:bg-gray-800 p-3 flex items-center gap-3 shadow-sm z-10">
                    <button @click="selectedUser = null" class="text-gray-500 hover:text-gray-700">
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <div class="flex items-center gap-2 flex-1">
                        <div class="relative">
                           <img :src="getProfilePhoto(selectedUser)" @error="handleImageError" class="w-8 h-8 rounded-full" />
                           <span v-if="selectedUser.isonline" class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                        </div>
                        <span class="font-semibold text-sm">{{ selectedUser.realname }}</span>
                    </div>
                    <button @click="startVideoCall" class="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center transition-colors" title="Video Call">
                        <i class="fa-solid fa-video"></i>
                    </button>
                </div>

                <!-- Chat Messages -->
                <div class="flex-1 overflow-y-auto p-4 space-y-3" ref="chatMessagesContainer">
                     <div v-for="(msg, idx) in chatHistory[selectedUser.useraccessid] || []" :key="idx" :class="['flex', msg.senderId === myUserId ? 'justify-end' : 'justify-start']">
                        <div :class="['max-w-[75%] rounded-xl px-4 py-2 text-sm relative', msg.senderId === myUserId ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700 rounded-tl-none']">
                            <!-- Attachment Render -->
                            <div v-if="msg.attachment" class="mb-2">
                                <img v-if="msg.attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i)" 
                                     :src="getAttachmentUrl(msg.attachment)"
                                     class="max-w-full rounded-lg max-h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                     @click="window.open(getAttachmentUrl(msg.attachment), '_blank')"
                                />
                                <a v-else 
                                   :href="getAttachmentUrl(msg.attachment)"
                                   target="_blank" 
                                   class="flex items-center gap-2 p-2 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs"
                                >
                                    <i class="fa-solid fa-paperclip"></i>
                                    <span class="truncate max-w-[150px]">{{ msg.attachment.split('/').pop() }}</span>
                                    <i class="fa-solid fa-download ml-auto"></i>
                                </a>
                            </div>
                            <p v-if="msg.text">{{ msg.text }}</p>
                            <p class="text-[10px] opacity-70 mt-1 text-right">{{ formatTime(msg.timestamp) }}</p>
                        </div>
                    </div>
                </div>

                <!-- Chat Input -->
                <div class="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 relative">
                    <!-- Emoji Picker -->
                    <div v-if="showEmojiPicker" class="absolute bottom-16 left-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-2 z-50 animate-fade-in w-64">
                         <div class="grid grid-cols-6 gap-1">
                             <button v-for="emoji in emojis" :key="emoji" @click="addEmoji(emoji)" class="text-xl p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">{{ emoji }}</button>
                         </div>
                    </div>

                    <!-- Attachment Preview -->
                    <div v-if="attachmentName" class="absolute bottom-16 left-4 right-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 flex items-center justify-between shadow-lg animate-slide-up border border-indigo-200 dark:border-indigo-900">
                        <div class="flex items-center gap-2 overflow-hidden">
                             <div class="w-8 h-8 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                 <i class="fa-solid fa-file"></i>
                             </div>
                             <span class="text-sm truncate font-medium text-gray-700 dark:text-gray-200">{{ attachmentName }}</span>
                        </div>
                        <button @click="removeAttachment" class="text-gray-500 hover:text-red-500 transition-colors p-1">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>

                    <form @submit.prevent="sendChatMessage" class="flex gap-2 items-center">
                        <input type="file" ref="fileInput" hidden @change="handleFileUpload" />
                        
                        <button type="button" @click="triggerFileUpload" class="p-2 text-gray-500 hover:text-indigo-600 transition-colors" title="Attach File">
                            <i class="fa-solid fa-paperclip"></i>
                        </button>

                        <div class="relative flex-1">
                             <input v-model="chatInput" type="text" placeholder="Message..." class="w-full px-4 py-2 pr-10 rounded-full bg-gray-100 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
                             <button type="button" @click="showEmojiPicker = !showEmojiPicker" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors">
                                 <i class="fa-regular fa-face-smile"></i>
                             </button>
                        </div>
                        
                        <button type="submit" class="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md transform active:scale-95 transition-all w-10 h-10 flex items-center justify-center">
                            <i class="fa-solid fa-paper-plane text-xs"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </transition>

     <!-- Video Call Overlay -->
     <div v-if="isInCall" class="fixed bottom-24 right-[400px] z-50 w-80 bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-800 flex flex-col">
        <div class="relative h-60 bg-gray-900">
             <video ref="remoteVideo" autoplay playsinline class="w-full h-full object-cover"></video>
             <div class="absolute bottom-4 right-4 w-24 h-32 bg-gray-800 rounded-lg overflow-hidden border border-gray-600 shadow-lg">
                 <video ref="localVideo" autoplay playsinline muted class="w-full h-full object-cover"></video>
             </div>
             <div class="absolute top-4 left-4 text-white text-xs bg-black/50 px-2 py-1 rounded">
                 {{ callStatus }}
             </div>
        </div>
        <div class="p-4 bg-gray-800 flex justify-center gap-4">
             <button @click="endCall" class="w-12 h-12 rounded-full bg-red-600 text-white hover:bg-red-700 flex items-center justify-center shadow-lg transform hover:scale-105 transition-all">
                 <i class="fa-solid fa-phone-slash text-xl"></i>
             </button>
        </div>
     </div>
     
     <!-- Incoming Call Modal -->
     <div v-if="incomingCall" class="fixed top-6 right-6 z-50 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl border-l-4 border-green-500 w-72 animate-bounce-in">
        <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                 <i class="fa-solid fa-video text-xl animate-pulse"></i>
            </div>
            <div>
                <h4 class="font-bold text-gray-900 dark:text-white">Incoming Call</h4>
                <p class="text-sm text-gray-500">{{ incomingCall.callerName }}</p>
            </div>
        </div>
        <div class="flex gap-2">
            <button @click="answerCall" class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium text-sm">Accept</button>
            <button @click="rejectCall" class="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded-lg font-medium text-sm">Decline</button>
        </div>
     </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '~/store/user';
import { useAuth } from '~/composables/useAuth';
import { useApi } from '~/composables/useApi';
import { useThemeStore } from '~/store/theme';
import { useAppStore } from '~/store/app';
import { useWorkflowStore } from '~/store/workflow';
import { useDbobjectStore } from '~/store/dbobject';
import { useReportStore } from '~/store/report';

const appStore = useAppStore();
const workflowStore = useWorkflowStore();
const dbobjectStore = useDbobjectStore();
const reportStore = useReportStore();
const { isChatOpen, isLoading: appIsLoading } = storeToRefs(appStore);
const { loading: workflowLoading } = storeToRefs(workflowStore);
const { loading: dbobjectLoading } = storeToRefs(dbobjectStore);
const { loading: reportLoading } = storeToRefs(reportStore);

// const isOpen = ref(false); // Removed local ref
const activeTab = ref<'ai' | 'people' | 'settings'>('ai');
const aiInput = ref('');
const aiMessages = ref<{text: string, sender: 'user'|'ai'}[]>([]);
const aiConversationState = ref(''); // Track conversation state
const users = ref<any[]>([]);
const loadingUsers = ref(false);
const selectedUser = ref<any>(null);
const chatInput = ref('');
const showEmojiPicker = ref(false);
const attachment = ref<string|null>(null);
const attachmentName = ref<string|null>(null);
const fileInput = ref<HTMLInputElement|null>(null);
const chatHistory = ref<Record<number, {text: string, senderId: number, timestamp: string, attachment?: string}[]>>({});
const unreadCounts = ref<Record<number, number>>({});
const isAiProcessing = ref(false);
const isBusy = computed(() => 
    isAiProcessing.value || 
    loadingUsers.value || 
    appIsLoading.value || 
    workflowLoading.value || 
    dbobjectLoading.value || 
    reportLoading.value
);



const isHovered = ref(false);

const emojis = ['😀','😂','🥰','😎','🤔','👍','👎','❤️','💔','🎉','🔥','👀','🚀','📎','✅','❌','⚠️','👋'];
const userStore = useUserStore();
const themeStore = useThemeStore();
const { assistantCharacter, assistantCustomImage } = storeToRefs(themeStore);

const myUserId = computed(() => userStore.user?.userid);
const totalUnread = computed(() => Object.values(unreadCounts.value).reduce((sum, count) => sum + count, 0));
const aiMessagesContainer = ref<HTMLElement|null>(null);
const chatMessagesContainer = ref<HTMLElement|null>(null);
const notificationStore = useNotificationStore(); // Access socket

const { get, post } = useApi();

const setCharacter = (char: string) => {
    themeStore.setAssistantCharacter(char);
    if (char === 'custom' && !assistantCustomImage.value) {
        // Option to prompt or just focus input
    }
};

const updateCustomImage = (e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    themeStore.setAssistantCustomImage(val);
};

// Video Call State
const isInCall = ref(false);
const localVideo = ref<HTMLVideoElement|null>(null);
const remoteVideo = ref<HTMLVideoElement|null>(null);
const peerConnection = ref<RTCPeerConnection|null>(null);
const localStream = ref<MediaStream|null>(null);
const callStatus = ref('Connecting...');
const incomingCall = ref<any>(null);

const { token: authStateToken } = storeToRefs(userStore);
// Or just use computed
const token = computed(() => userStore.token);
let socket: WebSocket | null = null; 

// --- General ---

const toggleOpen = () => {
    appStore.toggleChat();
    // isOpen.value = !isOpen.value;
    if (isChatOpen.value && activeTab.value === 'people' && users.value.length === 0) {
        fetchUsers();
    }
};

watch(isChatOpen, (val) => {
    if (val && activeTab.value === 'people' && users.value.length === 0) fetchUsers();
});

const scrollToBottom = async (container: HTMLElement|null) => {
    await nextTick();
    if (container) container.scrollTop = container.scrollHeight;
};

// --- AI Chat ---
const sendAiMessage = async () => {
    if(!aiInput.value.trim()) return;
    const text = aiInput.value;
    aiMessages.value.push({ text, sender: 'user' });
    aiInput.value = '';
    await scrollToBottom(aiMessagesContainer.value);

    // Call execute-flow API with AI command
    // Response will come via WebSocket, not from API response
    try {
        const formData = new FormData();
        formData.append('flowname', 'aicommand');
        formData.append('menu', 'admin');
        formData.append('search', 'false');
        formData.append('command', text);
        formData.append('user_id', String(myUserId.value || ''));
        formData.append('conversation_state', aiConversationState.value); // Send conversation state
        
        isAiProcessing.value = true;
        await post('/api/admin/execute-flow', formData);
        // Don't add response here - it will come via WebSocket
    } catch(e) {
        aiMessages.value.push({ text: "Error connecting to AI.", sender: 'ai' });
        isAiProcessing.value = false;
    }
};

// --- People / Users ---
const fetchUsers = async () => {
    loadingUsers.value = true;
    try {
        // Use execute-flow to get user list
        const formData = new FormData();
        formData.append('flowname', 'getuserlist');
        formData.append('menu', 'admin');
        formData.append('search', 'true');
        formData.append('action', 'getuserlist');
        formData.append('senderid', String(myUserId.value || ''));
        
        const { data }: any = await post('/api/admin/execute-flow', formData);
        users.value = data?.result || data?.data || data || [];
        // Init unread counts if needed
        users.value.forEach((u: any) => {
            if (!unreadCounts.value[u.useraccessid]) unreadCounts.value[u.useraccessid] = 0;
        });
    } catch(e) {
        console.error(e);
    } finally {
        loadingUsers.value = false;
    }
};

const selectUser = (user: any) => {
    selectedUser.value = user;
    if (user && unreadCounts.value[user.useraccessid]) {
        unreadCounts.value[user.useraccessid] = 0;
    }
    
    // Fetch History
    fetchChatHistory(user.useraccessid);

    nextTick(() => scrollToBottom(chatMessagesContainer.value));
};

const fetchChatHistory = async (targetId: number) => {
    try {
        // Use execute-flow to get chat history
        const formData = new FormData();
        formData.append('flowname', 'chat');
        formData.append('menu', 'admin');
        formData.append('search', 'true');
        formData.append('action', 'gethistory');
        formData.append('targetid', String(targetId));
        formData.append('senderid', String(myUserId.value || ''));
        
        const { data }: any = await post('/api/admin/execute-flow', formData);
        const history = data?.result || data?.data || data || [];
        if(history) {
             // Map backend definition: senderid -> senderId, created_at -> timestamp
             chatHistory.value[targetId] = history.map((d: any) => ({
                 text: d.message,
                 senderId: d.senderid,
                 timestamp: d.created_at
             }));
        }
    } catch(e) {
        console.error("Failed to load history", e);
    }
};

const getProfilePhoto = (user: any) => {
    const config = useRuntimeConfig();
    if (user && user.userphoto) {
        if (user.userphoto.startsWith('http')) return user.userphoto;
        const photo = user.userphoto.replace(/^\//, '');
        return `${config.public.apiBase}/useraccess/${photo}`;
    }
    return `${config.public.apiBase}/useraccess/admin.png`;
};

const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;
    const config = useRuntimeConfig();
    img.src = `${config.public.apiBase}/useraccess/admin.png`;
};

const initWebSocket = () => {
    // Prevent multiple connections
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) return;

    const config = useRuntimeConfig();
    
    if (!token.value) {
        console.error("[AiAssistant] No token for WS");
        return;
    }

    // Close existing if open/closing
    if (socket) {
        socket.close();
        socket = null;
    }

    // Robust URL transformation: http->ws, https->wss
    let wsBase = config.public.apiBase;
    if (wsBase.startsWith('https')) {
        wsBase = wsBase.replace('https', 'wss');
    } else {
        wsBase = wsBase.replace('http', 'ws');
    }
    
    const wsUrl = `${wsBase}/api/ws/notifications?token=${token.value}`;

    console.log("[AiAssistant] Connecting to Chat WS:", wsUrl);
    
    socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
        console.log("[AiAssistant] Chat WS Connected");
    };

    socket.onmessage = async (event) => {
        try {
            const payload = JSON.parse(event.data);
            handleWsMessage(payload);
        } catch (e) {
            console.error("[AiAssistant] WS Message Parse Error", e);
        }
    };

    socket.onclose = (e) => {
        console.log("[AiAssistant] Chat WS Closed", e.code, e.reason);
        socket = null;
        // Auto Reconnect after 3s
        setTimeout(() => {
            console.log("[AiAssistant] Attempting Reconnect...");
            initWebSocket();
        }, 3000);
    };

    socket.onerror = (e) => {
        console.error("[AiAssistant] Chat WS Error", e);
    };
};

onMounted(() => {
    // Watch token changes only after hydration
    watch(() => token.value, (newVal) => {
        if (newVal) {
            initWebSocket();
        } else {
            if(socket) socket.close();
            socket = null;
        }
    }, { immediate: true });
});


const handleWsMessage = async (payload: any) => {
    console.log("WS Msg:", payload);
    
    // AI Chat Message (from backend workflow)
    if (payload.type === 'chat' && payload.message) {
        // This is an AI response from the backend
        aiMessages.value.push({ 
            text: payload.message, 
            sender: 'ai' 
        });
        
        // Save conversation state for next message
        if (payload.conversation_state) {
            aiConversationState.value = payload.conversation_state;
        }

        isAiProcessing.value = false;
        
        // Auto-open AI tab if closed
        if (!isChatOpen.value) {
            appStore.toggleChat(); // Use action
            // isOpen.value = true;
            activeTab.value = 'ai';
        } else if (activeTab.value !== 'ai') {
            activeTab.value = 'ai';
        }
        
        await scrollToBottom(aiMessagesContainer.value);
        return;
    }
    
    // Person-to-Person Chat Message
    if (payload.type === 'chat' && payload.senderid) {
        const senderId = payload.senderid;
        
        // Ensure reactivity for new keys
        if (!chatHistory.value[senderId]) {
            chatHistory.value[senderId] = [];
        }
        
        chatHistory.value[senderId].push({
            text: payload.data.text,
            attachment: payload.data.attachment,
            senderId: senderId,
            timestamp: payload.data.timestamp || new Date().toISOString()
        });
        
        // If chat is OPEN with this user
        if (selectedUser.value && selectedUser.value.useraccessid === senderId && isChatOpen.value && activeTab.value === 'people') {
             await scrollToBottom(chatMessagesContainer.value);
        } else {
             // Increment Unread
             if (!unreadCounts.value[senderId]) unreadCounts.value[senderId] = 0;
             unreadCounts.value[senderId]++;
        }
    }
    
    // Status Update
    else if (payload.type === 'status_update') {
        const user = users.value.find(u => u.useraccessid === payload.user_id);
        if (user) {
            user.isonline = payload.isonline;
        }
    }

    // WebRTC Signals
    else if (payload.type === 'offer') {
        handleIncomingOffer(payload);
    } else if (payload.type === 'answer') {
        handleIncomingAnswer(payload);
    } else if (payload.type === 'candidate') {
        handleIncomingCandidate(payload);
    }
};

const triggerFileUpload = () => {
    fileInput.value?.click();
};

const handleFileUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    
    const file = input.files[0];
    const config = useRuntimeConfig();
    const maxSize = Number(config.public.chatMaxFileSize) || 10485760; // Default 10MB

    // Validate Size
    if (file.size > maxSize) {
        alert(`File too large. Max size is ${maxSize / 1024 / 1024}MB.`);
        input.value = '';
        return;
    }

    // Validate Type (Image, PDF, Doc, Excel)
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx', '.xls', '.xlsx'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
        alert("Invalid file type. Only Images, PDF, Word, and Excel are allowed.");
        input.value = '';
        return;
    }

    // Upload
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', 'chat_uploads'); // Upload to public/chat_uploads
        
        // Helper to upload using useApi or direct fetch? useApi wrapper doesn't support multipart easily if generic.
        // Let's use direct fetch with token
        const { data }: any = await post('/api/media/upload', formData);
        
        // Assuming response is { message: "Upload success" } but we need the path.
        // Wait, mediamgrcontroller.go UploadMedia returns { "message": "Upload success" } but NOT the path/filename?
        // Actually it saves with original filename. So path is path + filename.
        // We should construct it.
        
        attachment.value = `chat_uploads/${file.name}`;
        attachmentName.value = file.name;
        
    } catch (e) {
        console.error("Upload failed", e);
        alert("Upload failed.");
    } finally {
        input.value = '';
    }
};

const removeAttachment = () => {
    attachment.value = null;
    attachmentName.value = null;
};

const addEmoji = (emoji: string) => {
    chatInput.value += emoji;
    showEmojiPicker.value = false;
};

const sendChatMessage = () => {
    if ((!chatInput.value.trim() && !attachment.value) || !selectedUser.value) return;
    const text = chatInput.value;
    const att = attachment.value;
    const targetId = selectedUser.value.useraccessid;
    const timestamp = new Date().toISOString();

    console.log("Attempting to send chat to", targetId, "via socket state:", socket?.readyState);

    // Send via WS
    if (socket && socket.readyState === WebSocket.OPEN) {
        const payload = JSON.stringify({
            type: 'chat',
            targetid: targetId,
            data: { text, attachment: att, timestamp }
        });
        socket.send(payload);
        console.log("Sent payload:", payload);
    } else {
        console.error("Socket not open!");
    }

    // Update Local History
    if (!chatHistory.value[targetId]) chatHistory.value[targetId] = [];
    chatHistory.value[targetId].push({
        text,
        attachment: att,
        senderId: myUserId.value,
        timestamp
    });
    chatInput.value = '';
    attachment.value = null;
    attachmentName.value = null;
    scrollToBottom(chatMessagesContainer.value);
};

const formatTime = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getAttachmentUrl = (path: string) => {
    if (!path) return '';
    // If path is already full URL
    if (path.startsWith('http')) return path;
    
    // Remove leading slash if present to avoid double slash
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const config = useRuntimeConfig();
    return `${config.public.apiBase}/${cleanPath}`;
};

// --- WebRTC Video Call ---

const rtcConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

const startVideoCall = async () => {
    if (!selectedUser.value) return;
    isInCall.value = true;
    callStatus.value = "Calling " + selectedUser.value.realname + "...";
    
    await setupLocalStream();
    createPeerConnection(selectedUser.value.useraccessid);
    
    // Create Offer
    const offer = await peerConnection.value!.createOffer();
    await peerConnection.value!.setLocalDescription(offer);
    
    sendSignal('offer', offer);
};

const setupLocalStream = async () => {
    try {
        localStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideo.value) localVideo.value.srcObject = localStream.value;
    } catch (e) {
        console.error("Error accessing media devices", e);
        alert("Could not access camera/microphone.");
        isInCall.value = false;
    }
};

const createPeerConnection = (targetUserId: number) => {
    peerConnection.value = new RTCPeerConnection(rtcConfig);
    
    // Add local tracks
    if (localStream.value) {
        localStream.value.getTracks().forEach(track => {
            peerConnection.value!.addTrack(track, localStream.value!);
        });
    }
    
    // Handle remote stream
    peerConnection.value.ontrack = (event) => {
        if (remoteVideo.value) {
            remoteVideo.value.srcObject = event.streams[0];
        }
    };
    
    // Ice Candidates
    peerConnection.value.onicecandidate = (event) => {
        if (event.candidate) {
            // Need to pass targetUserId context. 
            // Since we are initiator, we know target. 
            // But for receiver, they need to know sender.
            // Simplified: we store activeCallTargetId if needed.
            sendSignal('candidate', event.candidate, targetUserId); // Pass target explicitly if possible, or use active scope
        }
    };
};

const sendSignal = (type: string, data: any, targetId?: number) => {
    const target = targetId || selectedUser.value?.useraccessid || incomingCall.value?.senderid;
    if (socket && target) {
        socket.send(JSON.stringify({
            type,
            targetid: target,
            data
        }));
    }
};

// Handle Incoming Signals
const handleIncomingOffer = async (payload: any) => {
    // Show Incoming Call Modal
    const callerId = payload.senderid;
    const callerName = users.value.find(u => u.useraccessid === callerId)?.realname || 'Unknown User';
    
    incomingCall.value = {
        senderid: callerId,
        callerName,
        offer: payload.data
    };
};

const answerCall = async () => {
    if (!incomingCall.value) return;
    const callerId = incomingCall.value.senderid;
    const offer = incomingCall.value.offer;
    incomingCall.value = null; // Hide modal
    
    isInCall.value = true;
    callStatus.value = "Connected";
    
    await setupLocalStream();
    createPeerConnection(callerId);
    
    await peerConnection.value!.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.value!.createAnswer();
    await peerConnection.value!.setLocalDescription(answer);
    
    sendSignal('answer', answer, callerId);
};

const rejectCall = () => {
    incomingCall.value = null;
    // Optionally send 'reject' signal
};

const handleIncomingAnswer = async (payload: any) => {
    if (peerConnection.value) {
        await peerConnection.value.setRemoteDescription(new RTCSessionDescription(payload.data));
        callStatus.value = "Connected";
    }
};

const handleIncomingCandidate = async (payload: any) => {
    if (peerConnection.value) {
        await peerConnection.value.addIceCandidate(new RTCIceCandidate(payload.data));
    }
};

const endCall = () => {
    if (peerConnection.value) peerConnection.value.close();
    peerConnection.value = null;
    
    if (localStream.value) {
        localStream.value.getTracks().forEach(t => t.stop());
        localStream.value = null;
    }
    
    isInCall.value = false;
    callStatus.value = '';
};

onMounted(() => {
    // Watcher handles init
});

</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.animate-bounce-in {
    animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.3); }
  50% { opacity: 1; transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

/* Clippy Animations */
@keyframes blink {
  0%, 90%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
}

@keyframes sway {
  0%, 100% { transform: rotate(-5deg) translateY(0); }
  50% { transform: rotate(5deg) translateY(-5px); }
}

@keyframes look-around {
  0%, 40%, 100% { transform: translate(0, 0); }
  50% { transform: translate(2px, -1px); }
  70% { transform: translate(-2px, 0); }
}

@keyframes eyebrows-raise {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.clippy-container:hover .clippy-svg {
    animation: sway 2s infinite ease-in-out;
}

.clippy-eyes {
    animation: blink 4s infinite;
    transform-origin: center;
}

.clippy-pupil {
    animation: look-around 4s infinite ease-in-out;
}

.clippy-container:hover .clippy-eyebrow {
    animation: eyebrows-raise 1s infinite alternate;
}

.clippy-container:hover {
    filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5));
}

.clippy-active .clippy-svg {
    transform: scale(1.1) rotate(-10deg);
}

@keyframes bounce-in {
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
.animate-bounce-in {
  animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes writing-scribble {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(2px, 2px) rotate(5deg); }
  50% { transform: translate(0, 4px) rotate(0deg); }
  75% { transform: translate(-2px, 2px) rotate(-5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

.clippy-writing-hand {
  animation: writing-scribble 0.5s infinite linear;
  transform-origin: 75px 75px;
}

@keyframes wave {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-20deg); }
  50% { transform: rotate(10deg); }
  75% { transform: rotate(-20deg); }
  100% { transform: rotate(0deg); }
}

.clippy-wave-hand {
  animation: wave 1s infinite ease-in-out;
  transform-origin: 80px 70px;
}
</style>
