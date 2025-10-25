import { defineStore } from 'pinia'

interface User {
  userid: number
  username: string
  realname: string
  email: string
  languageid?: number
  themeid?: number
  menus?: any
}

interface AuthState {
  token: string | null
  user: User | null
}

export const useUserStore = defineStore('user', {
  state: (): AuthState => ({
    token: null,
    user: null
  }),

  actions: {
    setAuth(token: string, user: User) {
      this.token = token
      this.user = user

      // Simpan cookie (harus string)
      const tokenCookie = useCookie('token', { path: '/', maxAge: 60 * 60 * 24 * 7 })
      const userCookie = useCookie('user', { path: '/', maxAge: 60 * 60 * 24 * 7 })

      tokenCookie.value = token
      userCookie.value = JSON.stringify(user)  // ✅ penting
    },

    loadAuth() {
      const tokenCookie = useCookie<string | null>('token')
      const userCookie = useCookie<string | null>('user')

      // Ambil token
      this.token = tokenCookie.value ?? null

      // Parse user jika valid string JSON
      try {
        if (userCookie.value && typeof userCookie.value === 'string') {
          this.user = JSON.parse(decodeURIComponent(userCookie.value))
        } else {
          this.user = null
        }
      } catch (err) {
        console.error('❌ Gagal parse cookie user:', err)
        this.user = null
      }
    },


    logout() {
      const tokenCookie = useCookie('token')
      const userCookie = useCookie('user')

      tokenCookie.value = null
      userCookie.value = null

      this.token = null
      this.user = null

      navigateTo('/login')
    }
  }
})
