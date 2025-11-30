import { useUserStore } from '../store/user';
import { navigateTo, defineNuxtRouteMiddleware } from '#app';

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();
  userStore.loadAuth();

  // Kalau belum login dan bukan di halaman login → redirect
  if (!userStore.token && to.path !== '/login') {
    return navigateTo('/');
  }

  // Kalau sudah login dan coba ke /login → arahkan ke halaman utama
  if (userStore.token && to.path === '/login') {
    return navigateTo('/');
  }
});
