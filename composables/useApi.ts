import { useUserStore } from '~/store/user';

export const useApi = () => {
  const config = useRuntimeConfig();
  const userStore = useUserStore();
  userStore.loadAuth();
  const token = userStore.token;

  const getHeaders = (body?: any) => {
    const headers: Record<string, string> = {};

    if (token) headers.Authorization = `Bearer ${token}`;

    // kalau bukan FormData, baru set JSON header
    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  };

  const get = async (url: string) => await $fetch(url, { baseURL: config.public.apiBase, headers: getHeaders() });

  const post = async (url: string, body: any) =>
    await $fetch(url, {
      method: 'POST',
      baseURL: config.public.apiBase,
      headers: getHeaders(body),
      body: body instanceof FormData ? body : JSON.stringify(body),
    });

  const donlotFile = async (urlFile: string, body: any, fileName: string) => {
    try {
      const response = await fetch(`${config.public.apiBase}${urlFile}`, {
        method: 'POST',
        headers: getHeaders(body),
        body: body instanceof FormData ? body : JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer]);
      const url = URL.createObjectURL(blob);

      const contentDisposition = response.headers.get('Content-Disposition');
      const suggestedName = contentDisposition?.split('filename=')[1]?.replace(/["']/g, '') || fileName;

      const a = document.createElement('a');
      a.href = url;
      a.download = suggestedName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error saat download file:', err);
    }
  };

  const put = async (url: string, body: any) =>
    await $fetch(url, {
      method: 'PUT',
      baseURL: config.public.apiBase,
      headers: getHeaders(body),
      body: body instanceof FormData ? body : JSON.stringify(body),
    });

  const del = async (url: string) =>
    await $fetch(url, { method: 'DELETE', baseURL: config.public.apiBase, headers: getHeaders() });

  return { get, post, put, del, donlotFile };
};
