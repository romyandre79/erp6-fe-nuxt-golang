<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/store/user';
import NavbarAdmin from '~/components/NavbarAdmin.vue';
import { useI18n } from 'vue-i18n';
import { useThemeStore } from '~/store/theme';
import { useAuth } from '~/composables/useAuth';
import { useColorMode } from '@vueuse/core';

const themeStore = useThemeStore();
const { t } = useI18n();
const userStore = useUserStore();
const { me } = useAuth();
const config = useRuntimeConfig();

const mode = useColorMode();

// Sidebar collapse state
const isCollapsed = ref(false);
// Track menu expand/collapse per parent
const expanded = ref<Record<number, boolean>>({});
const menus = ref<any[]>([]);

onMounted(async () => {
  try {
    const res = await me();
    if (res?.code === 200 && res.data?.menus) {
      menus.value = res.data.menus;
    } else {
      console.error('Invalid response from /auth/me', res);
    }
  } catch (err) {
    console.error('Error loading user info:', err);
  }

  // Apply initial theme
  if (process.client) {
    document.documentElement.classList.toggle('dark', themeStore.theme === 'dark');
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
      <div class="bgSystem flex min-h-screen transition-colors duration-300">
        <!-- SIDEBAR -->
        <aside :class="['flex flex-col transition-all duration-300 border-r', isCollapsed ? 'w-20' : 'w-64']">
          <!-- HEADER -->
          <div class="flex items-center justify-between p-4 border-b">
            <h2 v-if="!isCollapsed" class="text-xl font-bold truncate">
              {{ config.public.appName }}
            </h2>
            <button @click="toggleSidebar" class="text-gray-400 hover:text-white dark:hover:text-gray-200">
              <i :class="isCollapsed ? 'fa fa-chevron-right' : 'fa fa-chevron-left'"></i>
            </button>
          </div>

          <!-- MENU LIST -->
          <nav class="flex-1 overflow-y-auto mt-4 space-y-1 px-2">
            <div v-for="parent in parentMenus" :key="parent.menuaccessid" class="mb-1">
              <button
                @click="getChildren(parent.menuaccessid).length ? toggleExpand(parent.menuaccessid) : null"
                class="w-full flex items-center justify-between p-2 rounded-md transition-colors"
                :class="themeStore.theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'"
              >
                <div class="flex items-center gap-2">
                  <span v-if="!isCollapsed" class="capitalize truncate">
                    {{ t(parent.description.toUpperCase()) }}
                  </span>
                </div>
                <i
                  v-if="getChildren(parent.menuaccessid).length && !isCollapsed"
                  :class="[
                    'text-xs transition-transform',
                    expanded[parent.menuaccessid] ? 'fa fa-chevron-up' : 'fa fa-chevron-down',
                  ]"
                ></i>
              </button>

              <!-- SUBMENUS -->
              <transition name="fade">
                <div v-show="expanded[parent.menuaccessid]" v-if="!isCollapsed" class="ml-6 mt-1 space-y-1">
                  <NuxtLink
                    v-for="child in getChildren(parent.menuaccessid)"
                    :key="child.menuaccessid"
                    :to="`/admin/${child.menuname.toLowerCase()}`"
                    class="flex items-center gap-2 p-2 rounded-md transition-colors"
                    :class="
                      themeStore.theme === 'dark'
                        ? 'hover:bg-gray-800 active:bg-gray-700'
                        : 'hover:bg-gray-200 active:bg-gray-300'
                    "
                    active-class="font-semibold"
                  >
                    <span class="text-sm truncate">
                      {{ t(child.description.toUpperCase()) }}
                    </span>
                  </NuxtLink>
                </div>
              </transition>
            </div>
          </nav>

          <!-- FOOTER PROFILE -->
          <div
            class="p-3 mt-auto border-t flex items-center gap-2"
            :class="mode === 'dark' ? 'border-gray-800' : 'border-gray-200'"
          >
            <div v-if="!isCollapsed">
              <p class="text-sm font-semibold">{{ userStore.user?.realname }}</p>
              <p class="text-xs opacity-70">{{ userStore.user?.email }}</p>
            </div>
          </div>
        </aside>

        <!-- MAIN CONTENT -->
        <main class="flex-1 flex flex-col">
          <NavbarAdmin
            class="sticky top-0 z-50 shadow-md border-b"
            :class="
              themeStore.theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-gray-100'
                : 'bg-white border-gray-200 text-gray-900'
            "
          >
            <template #right>
              <!-- THEME TOGGLE -->
              <button
                @click="themeStore.toggleTheme()"
                class="p-2 rounded-md transition-colors"
                :class="
                  themeStore.theme === 'dark' ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-200 text-gray-700'
                "
              >
                <i :class="themeStore.theme === 'dark' ? 'fa fa-sun' : 'fa fa-moon'"></i>
              </button>
            </template>
          </NavbarAdmin>

          <div
            class="py-6 flex-1 overflow-auto transition-colors duration-300"
            :class="themeStore.theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'"
          >
            <NuxtPage />
          </div>
        </main>
      </div>
    </UApp>
  </ClientOnly>
</template>

<style>

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
aside::-webkit-scrollbar {
  width: 6px;
}
aside::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
</style>
