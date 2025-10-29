import { useUserStore } from '~/store/user'

export const useApi = () => {
  const config = useRuntimeConfig()
  const userStore = useUserStore()
  userStore.loadAuth()
  const token = userStore.token


  const getHeaders = (body?: any) => {
    const headers: Record<string, string> = {}

    if (token) headers.Authorization = `Bearer ${token}`

    // kalau bukan FormData, baru set JSON header
    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    return headers
  }
  

  const get = (url: string) => 
    $fetch(url, { baseURL: config.public.apiBase, headers: getHeaders() })

  const post = (url: string, body: any) =>
    $fetch(url, 
      { 
        method: 'POST', 
        baseURL: config.public.apiBase, 
        headers: getHeaders(body), 
        body: body instanceof FormData ? body : JSON.stringify(body)
      }
  )

  const put = (url: string, body: any) =>
    $fetch(url, 
      { 
        method: 'PUT', 
        baseURL: config.public.apiBase, 
        headers: getHeaders(body), 
        body: body instanceof FormData ? body : JSON.stringify(body), 
      }
  )

  const del = (url: string) =>
    $fetch(url, { method: 'DELETE', baseURL: config.public.apiBase, headers: getHeaders() })

  return { get, post, put, del }
}
