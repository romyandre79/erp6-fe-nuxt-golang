<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '~/store/user'
import NavbarAdmin from '~/components/NavbarAdmin.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()
const { me } = useAuth()
const config = useRuntimeConfig()

// Sidebar collapse
const isCollapsed = ref(false)
// Track menu expand per parent
const expanded = ref<Record<number, boolean>>({})
const menus = ref<any[]>([]) // ✅ pastikan default-nya array

onMounted(async () => {
  try {
    const res = await me()
    if (res?.code === 200 && res.data?.menus) {
      menus.value = res.data.menus
    } else {
      console.error('Invalid response from /auth/me', res)
    }
  } catch (err) {
    console.error('Error loading user info:', err)
  }
})

// Semua menu dari user
const allMenus = computed(() =>
  Array.isArray(menus.value)
    ? [...menus.value].sort((a, b) => (a.sortorder ?? 0) - (b.sortorder ?? 0))
    : []
)


// Pisahkan parent dan child
const parentMenus = computed(() =>
  allMenus.value.filter(m => !m.parentid || m.parentid === 0)
)

const getChildren = (parentId: number) =>
  allMenus.value
    .filter(m => m.parentid === parentId)
    .sort((a, b) => (a.sortorder ?? 0) - (b.sortorder ?? 0))

// Toggle sidebar width
const toggleSidebar = () => (isCollapsed.value = !isCollapsed.value)

// Toggle submenu expand/collapse
const toggleExpand = (id: number) => {
  expanded.value[id] = !expanded.value[id]
}
</script>

<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- SIDEBAR -->
    <aside
      :class="[
        'bg-gray-900 text-white flex flex-col transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64'
      ]"
    >
      <!-- HEADER -->
      <div class="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 v-if="!isCollapsed" class="text-xl font-bold truncate">
          {{ config.public.appName }}
        </h2>
        <button
          @click="toggleSidebar"
          class="text-gray-400 hover:text-white"
        >
          <Icon
            :name="isCollapsed ? 'lucide:chevron-right' : 'lucide:chevron-left'"
            size="20"
          />
        </button>
      </div>

      <!-- MENU LIST -->
      <nav class="flex-1 overflow-y-auto mt-4 space-y-1 px-2">
        <!-- Parent Menus -->
        <div
          v-for="parent in parentMenus"
          :key="parent.menuaccessid"
          class="mb-1"
        >
          <!-- Parent -->
          <button
            @click="getChildren(parent.menuaccessid).length ? toggleExpand(parent.menuaccessid) : null"
            class="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            <div class="flex items-center gap-2">
              <Icon name="lucide:folder" size="18" class="text-gray-400" />
              <span v-if="!isCollapsed" class="capitalize truncate">
                {{ t(parent.description.replace(/\s+/g, "_").toUpperCase()) }}
              </span>
            </div>
            <Icon
              v-if="!isCollapsed && getChildren(parent.menuaccessid).length"
              :name="expanded[parent.menuaccessid] ? 'lucide:chevron-down' : 'lucide:chevron-right'"
              size="16"
            />
          </button>

          <!-- Submenus -->
          <transition name="fade">
            <div
              v-show="expanded[parent.menuaccessid]"
              v-if="!isCollapsed"
              class="ml-6 mt-1 space-y-1"
            >
              <NuxtLink
                v-for="child in getChildren(parent.menuaccessid)"
                :key="child.menuaccessid"
                :to="`/admin/${child.menuname.toLowerCase()}`"
                class="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 transition-colors"
                active-class="bg-gray-800"
              >
                <Icon name="lucide:circle" size="14" class="text-gray-400" />
                <span class="text-sm truncate">{{ t(child.description.replace(/\s+/g, "_").toUpperCase()) }}</span>
              </NuxtLink>
            </div>
          </transition>
        </div>
      </nav>

      <!-- FOOTER (PROFILE) -->
      <div class="p-3 mt-auto border-t border-gray-700 flex items-center gap-2">
        <Icon name="lucide:user" class="text-gray-400" />
        <div v-if="!isCollapsed">
          <p class="text-sm font-semibold">{{ userStore.user?.realname }}</p>
          <p class="text-xs text-gray-400">{{ userStore.user?.email }}</p>
        </div>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="flex-1 flex flex-col">
      <NavbarAdmin />
      <div class="p-4">
        <NuxtPage />
      </div>
    </main>
  </div>
</template>

<style scoped>
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
