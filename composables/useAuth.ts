// composables/useAuth.ts
import { useUserStore } from '~/store/user'

export const useAuth = () => {
  const userStore = useUserStore()
  const { post, get } = useApi()
  const router = useRouter()

  const login = async (payload: { username: string; password: string }) => {
    try {
      const res = await post('/auth/login', payload)
      if (res.code == 200) {
        userStore.setAuth(res.data?.token, res.data.user)
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

  return { login, logout, isAuthenticated }
}
