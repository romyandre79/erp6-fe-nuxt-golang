// composables/useAuth.ts
import { useUserStore } from '~/store/user'

export const useAuth = () => {
  const userStore = useUserStore()
  const { post, get } = useApi()
  const router = useRouter()

  const login = async (payload: { username: string; password: string}) => {
    try {
      const res = await post('/auth/login', payload)
      if (res.code == 200) {
        userStore.setAuth(res.data?.token, res.data.user)
        navigateTo('/admin/dashboard')
      } else {
        throw new Error(res.message || $t('INVALID_CREDENTIAL'))
      }
    } catch (err) {
        console.error(err)
        throw new Error($t('INVALID_CREDENTIAL'))
    } 
  }

  const me = async () => {
    try {
      const res = await get('/auth/me')
      if (res.code == 200) {
        return res
      } else {
        throw new Error(res.message || $t('INVALID_CREDENTIAL'))
      }
    } catch (err) {
        console.error(err)
        throw new Error($t('INVALID_CREDENTIAL'))
    }
  }

  const getMenuForm = async (slug: string) => {
    try {
      const res = await get('admin/getmenu?menuname='+slug)
      if (res.code == 200) {
        return res
      } else {
        throw new Error(res.message || $t('INVALID_CREDENTIAL'))
      }
    } catch (err) {
        console.error(err)
        throw new Error($t('INVALID_CREDENTIAL'))
    }
  }

  const logout = async () => {
    userStore.logout()
    await router.push('/login')
  }

  const isAuthenticated = computed(() => !!userStore.token)

  return { login, logout, me, getMenuForm, isAuthenticated }
}
