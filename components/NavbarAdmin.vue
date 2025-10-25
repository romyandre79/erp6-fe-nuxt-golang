<template>
  <div class="navbar bg-base-100 shadow-md px-4">
    <div class="flex-1">
      <span class="font-bold text-lg">{{$t('DASHBOARD')}}</span>
    </div>
    <div class="flex-none gap-4">
      <ThemeToggle />
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img src="https://i.pravatar.cc/100" />
          </div>
        </label>
        <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
          <li><a>Profile</a></li>
          <li><a href="#" @click.prevent="handleLogout">Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import ThemeToggle from './ThemeToggle.vue'
const { logout } = useAuth()
const handleLogout = async () => {
  await logout()
}
</script>