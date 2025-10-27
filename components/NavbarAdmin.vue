<template>
  <header
    class="flex items-center justify-between sticky top-0 z-1000 px-6 py-3 transition-colors duration-300 backdrop-blur-md"
    :class="[
      theme === 'dark'
        ? 'bg-gray-900/80 border-b border-gray-700 text-gray-100'
        : 'bg-white/80 border-b border-gray-200 text-gray-900'
    ]"
  >
    <!-- LEFT: Title -->
    <div class="flex items-center gap-3">
    </div>

    <!-- RIGHT: Theme + User -->
    <div class="flex items-center gap-4 relative">
      <ThemeToggle />

      <!-- USER DROPDOWN -->
      <div ref="userMenu" class="relative">
        <!-- Trigger -->
        <button
          @click.stop="toggleDropdown"
          class="flex items-center gap-2 cursor-pointer hover:bg-base-200 dark:hover:bg-gray-800 rounded-xl px-3 py-2 transition-all"
        >
          <img
            :src="userPhoto || '/default-avatar.png'"
            alt="user avatar"
            class="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-700 shadow-sm"
          />
          <div class="hidden sm:block text-left leading-tight">
            <p class="text-sm font-semibold text-base-content dark:text-gray-100">
              {{ userName }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ userEmail }}</p>
          </div>
          <i
            class="fa-solid fa-chevron-down text-xs ml-1 text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-180': isOpen }"
          ></i>
        </button>

        <!-- Dropdown -->
        <transition name="fade">
          <div
            v-if="isOpen"
            class="absolute right-0 mt-2 w-56 border rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-sm transition-all"
            :class="[
              theme === 'dark'
                ? 'bg-gray-900/90 border-gray-700'
                : 'bg-white/90 border-gray-200'
            ]"
          >
            <!-- User Info -->
            <div
              class="px-4 py-3 border-b"
              :class="theme === 'dark' ? 'border-gray-700 bg-gray-800/60' : 'border-gray-200 bg-gray-50/80'"
            >
              <p class="text-sm font-semibold text-base-content dark:text-gray-100">
                {{ userName }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ userEmail }}
              </p>
            </div>

            <!-- Menu -->
            <ul class="divide-y" :class="theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'">
              <li>
                <button
                  @click.prevent="handleProfile"
                  class="flex items-center gap-2 px-4 py-2.5 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <i class="fa-regular fa-user w-5 text-primary"></i>
                  <span>{{ $t('PROFILE') }}</span>
                </button>
              </li>
              <li>
                <button
                  @click.prevent="handleLogout"
                  class="flex items-center gap-2 px-4 py-2.5 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-500"
                >
                  <i class="fa-solid fa-right-from-bracket w-5"></i>
                  <span>{{ $t('LOGOUT') }}</span>
                </button>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import ThemeToggle from '~/components/ThemeToggle.vue'
import { useUserStore } from '~/store/user'
import { useAuth } from '~/composables/useAuth'
import { useThemeStore } from '~/store/theme'

const { logout } = useAuth()
const userStore = useUserStore()
const themeStore = useThemeStore()

userStore.loadAuth()

const userPhoto = userStore.user?.photo
const userName = userStore.user?.realname
const userEmail = userStore.user?.email
const theme = computed(() => themeStore.theme)

const isOpen = ref(false)
const userMenu = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleClickOutside = (event: MouseEvent) => {
  if (userMenu.value && !userMenu.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

const handleLogout = async () => {
  isOpen.value = false
  await logout()
}

const handleProfile = () => {
  isOpen.value = false
  navigateTo('/admin/profile')
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
