<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/store/user';
import NavbarAdmin from '~/components/NavbarAdmin.vue';
import { useI18n } from 'vue-i18n';
import { useThemeStore } from '~/store/theme';
import { useNotificationStore } from '~/store/notification';
import { useAuth } from '~/composables/useAuth';
import { useDevice } from '~/composables/useDevice';
import AiAssistant from '~/components/AiAssistant.vue';

const themeStore = useThemeStore();
const notificationStore = useNotificationStore();
const { t } = useI18n();
const userStore = useUserStore();
const { me } = useAuth();
const config = useRuntimeConfig();
import { useAppStore } from '~/store/app';

const appStore = useAppStore();
const { isMobile, isTablet } = useDevice();

const reloadPage = () => {
  window.location.reload();
};

// Sidebar collapse state - auto-collapse on mobile
const isCollapsed = ref(false);
// Track menu expand/collapse per parent
const expanded = ref<Record<number, boolean>>({});
const menus = ref<any[]>([]);

const route = useRoute();

// Auto expand active menu
const expandActiveMenu = () => {
  const decodedPath = decodeURIComponent(route.path);
  
  // Only process if in admin section
  if (!decodedPath.startsWith('/admin/')) return;

  // Filter for child menus only
  const childMenus = allMenus.value.filter(m => m.parentid !== 0 && m.menuname);
  
  // Find all matches where the current path starts with the menu link
  const matches = childMenus.filter(m => {
    // Construct expected link: /admin/menuname
    // Handle potential spaces in menuname
    const menuLink = `/admin/${m.menuname.toLowerCase()}`;
    return decodedPath.toLowerCase().startsWith(menuLink);
  });

  if (matches.length === 0) {
    // No match found - do NOT collapse or change state
    return; 
  }

  // If multiple matches (e.g. /admin/user vs /admin/users), pick the longest one
  // This ensures specific routes are matched over prefixes
  matches.sort((a, b) => b.menuname.length - a.menuname.length);
  
  const bestMatch = matches[0];

  if (bestMatch && bestMatch.parentid) {
    // Collapse others? No, usually we just want to ensure THIS one is open.
    // But if we want 'accordion' style, we might close others. 
    // For now, let's just ensure the active one is open as requested.
    expanded.value[bestMatch.parentid] = true;
  }
};

// Watch for route changes
watch(() => route.path, () => {
  expandActiveMenu();
});

onMounted(async () => {
  themeStore.applyCurrentTheme();
  
  // Auto-collapse sidebar on mobile
  if (isMobile.value) {
    isCollapsed.value = true;
  }
  
  // Connect Notifications
  await notificationStore.connect();
  await notificationStore.fetchUnread();

  try {
    const res: any = await me();
    if (res?.code === 200 && res.data?.menus) {
      menus.value = res.data.menus;
      expandActiveMenu();
    } else {
      console.error('Invalid response from /auth/me', res);
    }
  } catch (err) {
    console.error('Error loading user info:', err);
  }
});

// Sort all menus
const allMenus = computed(() =>
  Array.isArray(menus.value) ? [...menus.value].sort((a, b) => (a.sortorder ?? 0) - (b.sortorder ?? 0)) : [],
);

// Parent menus
const parentMenus = computed(() => allMenus.value.filter((m) => !m.parentid || m.parentid === 0));

// Get submenu
const getChildren = (parentId: number) =>
  allMenus.value.filter((m) => m.parentid === parentId).sort((a, b) => (a.sortorder ?? 0) - (b.sortorder ?? 0));

// Helper to check if icon is a Nuxt Icon (starts with i-)
const isNuxtIcon = (name: string) => name?.startsWith('i-');

// Sidebar toggle
const toggleSidebar = () => (isCollapsed.value = !isCollapsed.value);

// Expand submenu toggle
const toggleExpand = (id: number) => {
  expanded.value[id] = !expanded.value[id];
};
</script>

<template>
  <ClientOnly>
    <UApp>
      <div class="admin-layout flex min-h-screen transition-colors duration-300" style="background: var(--content-background, #f8fafc);">

        <!-- MODERN SIDEBAR -->
        <aside 
          :class="[
            'relative flex flex-col transition-all duration-300 ease-out overflow-visible sidebar-theme',
            isCollapsed ? 'w-[72px]' : 'w-64'
          ]"
          style="background: var(--sidebar-background); border-right: 1px solid var(--sidebar-border-color);"
        >
          <!-- SIDEBAR HEADER -->
          <div class="flex items-center h-16 px-4" style="border-bottom: 1px solid var(--sidebar-border-color);">
            <div v-if="!isCollapsed" class="flex items-center gap-3 flex-1">
              <div class="w-9 h-9 flex items-center justify-center shadow-lg" style="border-radius: var(--sidebar-radius); background: var(--sidebar-logo-background, linear-gradient(135deg, #6366f1, #9333ea));">
                <i class="fa-solid fa-cube text-sm" style="color: var(--sidebar-logo-color, #fff);"></i>
              </div>
              <h2 class="text-base font-bold tracking-tight truncate" style="color: var(--sidebar-title-color);">
                {{ config.public.appName }}
              </h2>
            </div>
            <div v-else class="w-full flex justify-center">
              <div class="w-9 h-9 flex items-center justify-center shadow-lg" style="border-radius: var(--sidebar-radius); background: var(--sidebar-logo-background, linear-gradient(135deg, #6366f1, #9333ea));">
                <i class="fa-solid fa-cube text-sm" style="color: var(--sidebar-logo-color, #fff);"></i>
              </div>
            </div>
          </div>
          
          <!-- Collapse Toggle Button - on sidebar edge, in front of main panel -->
          <button 
            @click="toggleSidebar"
            class="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center shadow-lg transition-all duration-200 collapse-btn"
            style="border-radius: var(--sidebar-collapse-radius); background: var(--sidebar-collapse-background); color: var(--sidebar-collapse-color); z-index: 50;"
          >
            <i :class="[isCollapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left', 'text-xs']"></i>
          </button>

          <!-- MENU LIST -->
          <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
            <div v-for="parent in parentMenus" :key="parent.menuaccessid" class="mb-1">
              <!-- Parent Menu Item -->
              <button
                @click="getChildren(parent.menuaccessid).length ? toggleExpand(parent.menuaccessid) : null"
                class="menu-item w-full flex items-center gap-3 px-3 py-2.5 transition-all duration-200 group"
                :style="{ borderRadius: 'var(--sidebar-menu-radius)' }"
                :class="expanded[parent.menuaccessid] ? 'active' : ''"
                :title="isCollapsed ? t(parent.description.toUpperCase()) : ''"
              >
                <!-- Icon -->
                <div class="menu-icon w-6 flex items-center justify-center transition-all duration-200 shrink-0">
                  <UIcon v-if="isNuxtIcon(parent.menuicon)" :name="parent.menuicon" class="text-base" />
                  <i v-else :class="parent.menuicon" class="text-base"></i>
                </div>
                
                <!-- Label -->
                <span 
                  v-if="!isCollapsed" 
                  class="menu-label flex-1 text-left text-sm font-medium capitalize truncate"
                >
                  {{ t(parent.description.toUpperCase()) }}
                </span>
                
                <!-- Chevron -->
                <div 
                  v-if="getChildren(parent.menuaccessid).length && !isCollapsed"
                  class="w-6 h-6 flex items-center justify-center rounded-lg"
                >
                  <i
                    :class="[
                      'text-[10px] transition-transform duration-200',
                      expanded[parent.menuaccessid] ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down',
                    ]"
                    style="color: var(--sidebar-menu-color);"
                  ></i>
                </div>
              </button>

              <!-- SUBMENUS -->
              <transition name="slide-fade">
                <div 
                  v-show="expanded[parent.menuaccessid]" 
                  v-if="!isCollapsed" 
                  class="mt-1 ml-6 pl-3 space-y-0.5"
                  style="border-left: 2px solid var(--sidebar-submenu-border-color);"
                >
                  <NuxtLink
                    v-for="child in getChildren(parent.menuaccessid)"
                    :key="child.menuaccessid"
                    :to="`/admin/${child.menuname.toLowerCase()}`"
                    class="submenu-item flex items-center gap-2.5 px-3 py-2 transition-all duration-200"
                    :style="{ borderRadius: 'var(--sidebar-menu-radius)' }"
                  >
                    <UIcon v-if="isNuxtIcon(child.menuicon)" :name="child.menuicon" class="text-[11px] opacity-70 w-4" />
                    <i v-else :class="child.menuicon" class="text-[11px] opacity-70 w-4"></i>
                    <span class="text-sm truncate">
                      {{ t(child.description.toUpperCase()) }}
                    </span>
                  </NuxtLink>
                </div>
              </transition>
            </div>
          </nav>

          <!-- FOOTER PROFILE -->
          <div class="p-3" style="border-top: 1px solid var(--sidebar-border-color);">
            <div 
              :class="[
                'flex items-center gap-3 p-2 transition-all duration-200 cursor-pointer profile-item',
                isCollapsed ? 'justify-center' : ''
              ]"
              style="border-radius: var(--sidebar-radius);"
            >
              <!-- Avatar -->
              <div class="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm shrink-0" style="color: var(--sidebar-profile-icon-color);">
                <i class="fa-solid fa-user-circle text-2xl"></i>
              </div>
              
              <div v-if="!isCollapsed" class="flex-1 min-w-0">
                <p class="text-sm font-semibold truncate" style="color: var(--sidebar-profile-name-color);">
                  {{ userStore.user?.realname }}
                </p>
                <p class="text-xs truncate" style="color: var(--sidebar-profile-email-color);">
                  {{ userStore.user?.email }}
                </p>
              </div>
            </div>
          </div>
        </aside>

        <!-- MAIN CONTENT -->
        <main class="flex-1 flex flex-col min-h-screen overflow-hidden">
          <!-- Top Navbar -->
          <NavbarAdmin class="sticky top-0 z-40 backdrop-blur-xl navbar-theme">
            <template #right>
              <ThemeToggle />
            </template>
          </NavbarAdmin>

          <!-- Page Content -->
          <div class="flex-1 overflow-auto">
            <NuxtPage />
          </div>
        </main>
      </div>
      <AiAssistant />

      
      <!-- Connection Error Overlay -->
      <div v-if="appStore.connectionError" class="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/75 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 border border-gray-100 dark:border-gray-700">
          <div class="flex flex-col items-center justify-center gap-4 text-center">
            <div class="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <UIcon name="i-heroicons-exclamation-triangle-20-solid" class="w-8 h-8" />
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Connection Error
            </h3>
            
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ appStore.errorMessage }}. Please check your internet connection or try again later.
            </p>

            <UButton
              color="error"
              variant="solid"
              label="Retry Connection"
              icon="i-heroicons-arrow-path"
              class="mt-2"
              @click="reloadPage"
            />
          </div>
        </div>
      </div>
    </UApp>
  </ClientOnly>
</template>

<style>
@import '@/assets/css/main.css';



/* Submenu animation */
.slide-fade-enter-active {
  transition: all 0.25s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Menu Items using CSS Variables */
.menu-item {
  color: var(--sidebar-menu-color);
}
.menu-item:hover {
  background: var(--sidebar-menu-hover-background);
}
.menu-item:hover .menu-icon,
.menu-item:hover .menu-label {
  color: var(--sidebar-menu-hover-color);
}
.menu-item.active {
  background: var(--sidebar-menu-active-background);
}
.menu-item.active .menu-icon,
.menu-item.active .menu-label {
  color: var(--sidebar-menu-active-color);
}
.menu-icon {
  color: var(--sidebar-menu-color);
}
.menu-label {
  color: var(--sidebar-menu-color);
}

/* Submenu Items */
.submenu-item {
  color: var(--sidebar-menu-color);
}
.submenu-item:hover {
  background: var(--sidebar-menu-hover-background);
  color: var(--sidebar-menu-hover-color);
}
.submenu-item.router-link-active {
  background: var(--sidebar-menu-active-background);
  color: var(--sidebar-menu-active-color);
  font-weight: 500;
}

/* Collapse Button Hover */
.collapse-btn:hover {
  background: var(--sidebar-collapse-hover-background, var(--primary-hover-color));
}

/* Profile Item */
.profile-item:hover {
  background: var(--sidebar-menu-hover-background);
}

/* Navbar Theme */
.navbar-theme {
  background: var(--navbar-admin-background);
  border-bottom: 1px solid var(--navbar-admin-border-color);
  color: var(--navbar-admin-color);
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.4);
}
</style>
