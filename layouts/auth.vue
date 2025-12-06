<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/store/user';
import NavbarAdmin from '~/components/NavbarAdmin.vue';
import { useI18n } from 'vue-i18n';
import { useThemeStore } from '~/store/theme';
import { useNotificationStore } from '~/store/notification';
import { useAuth } from '~/composables/useAuth';

const themeStore = useThemeStore();
const notificationStore = useNotificationStore();
const { t } = useI18n();
const userStore = useUserStore();
const { me } = useAuth();
const config = useRuntimeConfig();

// Sidebar collapse state
const isCollapsed = ref(false);
// Track menu expand/collapse per parent
const expanded = ref<Record<number, boolean>>({});
const menus = ref<any[]>([]);

// Icon mapping for menu items
const menuIcons: Record<string, string> = {
  dashboard: 'fa-solid fa-gauge-high',
  user: 'fa-solid fa-users',
  users: 'fa-solid fa-users',
  role: 'fa-solid fa-user-shield',
  roles: 'fa-solid fa-user-shield',
  permission: 'fa-solid fa-key',
  permissions: 'fa-solid fa-key',
  menu: 'fa-solid fa-bars',
  menus: 'fa-solid fa-bars',
  setting: 'fa-solid fa-cog',
  settings: 'fa-solid fa-cog',
  report: 'fa-solid fa-chart-line',
  reports: 'fa-solid fa-chart-line',
  workflow: 'fa-solid fa-diagram-project',
  article: 'fa-solid fa-newspaper',
  articles: 'fa-solid fa-newspaper',
  theme: 'fa-solid fa-palette',
  themes: 'fa-solid fa-palette',
  master: 'fa-solid fa-database',
  transaction: 'fa-solid fa-exchange-alt',
  form: 'fa-solid fa-window-maximize',
  forms: 'fa-solid fa-window-maximize',
  widget: 'fa-solid fa-puzzle-piece',
  widgets: 'fa-solid fa-puzzle-piece',
  dbobject: 'fa-solid fa-server',
  admin: 'fa-solid fa-shield-halved',
  default: 'fa-solid fa-folder',
};

const getMenuIcon = (menuName: string) => {
  const name = menuName?.toLowerCase() || '';
  return menuIcons[name] || menuIcons.default;
};

onMounted(async () => {
  themeStore.applyCurrentTheme();
  
  // Connect Notifications
  await notificationStore.connect();
  await notificationStore.fetchUnread();

  try {
    const res: any = await me();
    if (res?.code === 200 && res.data?.menus) {
      menus.value = res.data.menus;
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
      <div class="flex min-h-screen transition-colors duration-300" style="background: var(--content-background, #f8fafc);">
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
              <div class="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style="background: var(--sidebar-logo-background, linear-gradient(135deg, #6366f1, #9333ea));">
                <i class="fa-solid fa-cube text-sm" style="color: var(--sidebar-logo-color, #fff);"></i>
              </div>
              <h2 class="text-base font-bold tracking-tight truncate" style="color: var(--sidebar-title-color);">
                {{ config.public.appName }}
              </h2>
            </div>
            <div v-else class="w-full flex justify-center">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style="background: var(--sidebar-logo-background, linear-gradient(135deg, #6366f1, #9333ea));">
                <i class="fa-solid fa-cube text-sm" style="color: var(--sidebar-logo-color, #fff);"></i>
              </div>
            </div>
          </div>
          
          <!-- Collapse Toggle Button - on sidebar edge, in front of main panel -->
          <button 
            @click="toggleSidebar"
            class="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 collapse-btn"
            style="background: var(--sidebar-collapse-background); color: var(--sidebar-collapse-color); z-index: 100;"
          >
            <i :class="[isCollapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left', 'text-xs']"></i>
          </button>

          <!-- MENU LIST -->
          <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
            <div v-for="parent in parentMenus" :key="parent.menuaccessid" class="mb-1">
              <!-- Parent Menu Item -->
              <button
                @click="getChildren(parent.menuaccessid).length ? toggleExpand(parent.menuaccessid) : null"
                class="menu-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
                :class="expanded[parent.menuaccessid] ? 'active' : ''"
                :title="isCollapsed ? t(parent.description.toUpperCase()) : ''"
              >
                <!-- Icon -->
                <div class="menu-icon w-6 flex items-center justify-center transition-all duration-200 shrink-0">
                  <i :class="getMenuIcon(parent.menuname)" class="text-base"></i>
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
                    class="submenu-item flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200"
                  >
                    <i :class="getMenuIcon(child.menuname)" class="text-[11px] opacity-70 w-4"></i>
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
                'flex items-center gap-3 p-2 rounded-xl transition-all duration-200 cursor-pointer profile-item',
                isCollapsed ? 'justify-center' : ''
              ]"
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
    </UApp>
  </ClientOnly>
</template>

<style>
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
