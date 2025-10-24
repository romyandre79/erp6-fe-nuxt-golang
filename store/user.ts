import { defineStore } from 'pinia'

interface User {
  userid: number
  username: string
  realname: string
  email: string
  languageid?: number
  themeid?: number
  menus?:any
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
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigateTo('/login')
    }
  }
})
