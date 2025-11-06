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

  const donlotFile = async (body: any, fileName: any) => {
    try {
      const res = await fetch(config.public.apiBase+'/admin/execute-flow', {
        method: 'POST',
        body: body,
        headers: getHeaders(body),
      })
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)

      // ambil nama file dari header
      const cd = res.headers.get('Content-Disposition')

      // buat elemen <a> untuk trigger download
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      } catch (err) {
      console.error('Error saat download file:', err)
    }
  }

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

  return { get, post, put, del, donlotFile }
}
