import { useUserStore } from '#imports';
import { useAppStore } from '~/store/app';

export const useApi = () => {
  const config = useRuntimeConfig();
  const userStore = useUserStore();
  userStore.loadAuth();
  const getHeaders = (body?: any) => {
    const headers: Record<string, string> = {};
    const token = userStore.token; // Get token dynamically

    if (token) headers.Authorization = `Bearer ${token}`;

    // kalau bukan FormData, baru set JSON header
    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  };

  const handleError = (error: any) => {
    const appStore = useAppStore();
    // Check for network error (status 0) or server errors (502, 503, 504)
    if (!error.response || [502, 503, 504].includes(error.response.status)) {
      appStore.setConnectionError(true, 'Unable to connect to the server');
    }
    throw error;
  };

  const get = async (url: string) => {
    const appStore = useAppStore();
    appStore.isLoading = true;
    try {
      return await $fetch(url, { baseURL: config.public.apiBase, headers: getHeaders() });
    } catch (error) {
      handleError(error);
    } finally {
      appStore.isLoading = false;
    }
  };

  const post = async (url: string, body: any, options: any = {}) => {
    const appStore = useAppStore();
    appStore.isLoading = true;
    try {
      return await $fetch(url, {
        method: 'POST',
        baseURL: config.public.apiBase,
        headers: getHeaders(body),
        body: body instanceof FormData ? body : JSON.stringify(body),
        ...options, // pass extra options like responseType
      });
    } catch (error) {
      handleError(error);
    } finally {
      appStore.isLoading = false;
    }
  };

  const donlotFile = async (urlFile: string, body: any, fileName: string, method: 'POST' | 'GET' = 'POST') => {
    try {
      const appStore = useAppStore();
      appStore.isLoading = true;

      const options: RequestInit = {
        method,
        headers: getHeaders(body),
      };

      if (method === 'POST') {
        options.body = body instanceof FormData ? body : JSON.stringify(body);
      }

      const response = await fetch(`${config.public.apiBase}${urlFile}`, options);

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
      // For fetch API, we need to inspect the error object differently or just treat catch as error
      const appStore = useAppStore();
      // Fetch throws TypeError on network failure
      if (err instanceof TypeError) {
        appStore.setConnectionError(true, 'Network error occurred during download');
      }
    } finally {
      const appStore = useAppStore();
      appStore.isLoading = false;
    }
  };

  const put = async (url: string, body: any) => {
    const appStore = useAppStore();
    appStore.isLoading = true;
    try {
      return await $fetch(url, {
        method: 'PUT',
        baseURL: config.public.apiBase,
        headers: getHeaders(body),
        body: body instanceof FormData ? body : JSON.stringify(body),
      });
    } catch (error) {
      handleError(error);
    } finally {
      appStore.isLoading = false;
    }
  };

  const del = async (url: string) => {
    const appStore = useAppStore();
    appStore.isLoading = true;
    try {
      return await $fetch(url, { method: 'DELETE', baseURL: config.public.apiBase, headers: getHeaders() });
    } catch (error) {
      handleError(error);
    } finally {
      appStore.isLoading = false;
    }
  };

  return { get, post, put, del, donlotFile };
};
