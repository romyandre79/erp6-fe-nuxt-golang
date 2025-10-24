export default defineNuxtRouteMiddleware((to) => {
  const getToken = () => {
    if (process.client) {
      return localStorage.getItem('token')
    }
    return null
  }

  let token = getToken();

  // Belum login → arahkan ke login, tapi jangan loop di login sendiri
  if (!token && to.path !== '/login') {
    return navigateTo('/login')
  }

})
