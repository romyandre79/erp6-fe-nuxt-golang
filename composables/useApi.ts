import { useUserStore } from '~/store/user'

export const useApi = () => {
  const config = useRuntimeConfig()
  const userStore = useUserStore()

  const getHeaders = () => {
    const token = userStore.token
    return {
      Authorization: token ? `Bearer ${token}` : undefined,
    }
  }

  const get = (url: string) => 
    $fetch(url, { baseURL: config.public.apiBase, headers: getHeaders() })

  const post = (url: string, body: any) =>
    $fetch(url, { method: 'POST', baseURL: config.public.apiBase, headers: getHeaders(), body })

  const put = (url: string, body: any) =>
    $fetch(url, { method: 'PUT', baseURL: config.public.apiBase, headers: getHeaders(), body })

  const del = (url: string) =>
    $fetch(url, { method: 'DELETE', baseURL: config.public.apiBase, headers: getHeaders() })

  return { get, post, put, del }
}
