<template>
  <header class="flex items-center justify-between px-6 py-3 transition-colors duration-300">
    <!-- LEFT: Breadcrumb or empty -->
    <div class="flex items-center gap-3">
      <!-- Can add breadcrumbs here if needed -->
    </div>

    <!-- RIGHT: Actions -->
    <div class="flex items-center gap-3">
      <!-- Notification Bell -->
      <NotificationBell />
      
      <!-- Theme Toggle -->
      <ThemeToggle />

      <!-- Divider -->
      <div class="h-8 w-px bg-slate-200 dark:bg-gray-700 mx-1"></div>

      <!-- USER DROPDOWN -->
      <div ref="userMenu" class="relative">
        <!-- Trigger -->
        <button
          @click.stop="toggleDropdown"
          class="profile-trigger flex items-center gap-3 cursor-pointer rounded-xl px-3 py-2 transition-all duration-200 group"
        >
          <!-- Avatar -->
          <div class="w-9 h-9 flex items-center justify-center" style="color: var(--sidebar-profile-icon-color, #6366f1);">
            <i class="fa-solid fa-user-circle text-2xl"></i>
          </div>
          
          <!-- Name & Email -->
          <div class="hidden sm:block text-left">
            <p class="text-sm font-semibold leading-tight" style="color: var(--navbar-admin-color, #1f2937);">
              {{ userName }}
            </p>
            <p class="text-xs" style="color: var(--sidebar-profile-email-color, #6b7280);">{{ userEmail }}</p>
          </div>
          
          <!-- Chevron -->
          <i
            class="fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ml-1"
            :class="{ 'rotate-180': isOpen }"
            style="color: var(--navbar-icon-color, #9ca3af);"
          ></i>
        </button>

        <!-- Dropdown -->
        <transition name="dropdown">
          <div
            v-if="isOpen"
            class="absolute right-0 mt-3 w-90 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden z-50 border border-slate-200/80 dark:border-gray-800"
          >
            <!-- User Info Header -->
            <div class="px-4 py-4 border-b border-slate-200 dark:border-gray-800">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <i class="fa-solid fa-user-circle text-3xl"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-800 dark:text-white truncate">
                    {{ userName }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {{ userEmail }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Menu Items -->
            <div class="py-2">
              <button
                @click.prevent="handleProfile"
                class="flex items-center gap-3 w-full px-4 py-2.5 text-left transition-all duration-200 hover:bg-slate-50 dark:hover:bg-gray-800 group"
              >
                <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-gray-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 flex items-center justify-center transition-colors">
                  <i class="fa-regular fa-user text-gray-500 group-hover:text-indigo-500 text-sm transition-colors"></i>
                </div>
                <span class="text-sm text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">{{ $t('PROFILE') }}</span>
              </button>
              
              <div class="mx-3 my-1 h-px bg-slate-100 dark:bg-gray-800"></div>
              
              <button
                @click.prevent="handleLogout"
                class="flex items-center gap-3 w-full px-4 py-2.5 text-left transition-all duration-200 hover:bg-rose-50 dark:hover:bg-rose-900/20 group"
              >
                <div class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-gray-800 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/40 flex items-center justify-center transition-colors">
                  <i class="fa-solid fa-right-from-bracket text-gray-500 group-hover:text-rose-500 text-sm transition-colors"></i>
                </div>
                <span class="text-sm text-gray-700 dark:text-gray-200 group-hover:text-rose-600 dark:group-hover:text-rose-400">{{ $t('LOGOUT') }}</span>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import ThemeToggle from '~/components/ThemeToggle.vue';
import NotificationBell from '~/components/NotificationBell.vue';
import { useUserStore } from '~/store/user';
import { useAuth } from '~/composables/useAuth';
import { useThemeStore } from '~/store/theme';

const { logout } = useAuth();
const userStore = useUserStore();
const themeStore = useThemeStore();

userStore.loadAuth();

const userPhoto = userStore.user?.photo;
const userName = userStore.user?.realname;
const userEmail = userStore.user?.email;
const theme = computed(() => themeStore.theme);

const isOpen = ref(false);
const userMenu = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const handleClickOutside = (event: MouseEvent) => {
  if (userMenu.value && !userMenu.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

const handleLogout = async () => {
  isOpen.value = false;
  await logout();
};

const handleProfile = () => {
  isOpen.value = false;
  navigateTo('/admin/profile');
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease-out;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.profile-trigger:hover {
  background: var(--sidebar-menu-hover-background, #f1f5f9);
}
</style>
