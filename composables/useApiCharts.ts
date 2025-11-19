import { ref, watchEffect, watch, computed } from 'vue';
import { useFetch, useState } from '#app';

export function useApiChart(apiUrl: string, params = {}, refreshMs = 0) {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const Api = useApi();

  // cache key (pathname + params)
  const cacheKey = computed(() => apiUrl + JSON.stringify(params));

  // shared cache state (Nuxt useState = global)
  const cache = useState(`chart-cache-${cacheKey.value}`, () => null);

  const load = async () => {
    loading.value = true;
    error.value = null;

    // return cache if exists
    if (cache.value) {
      data.value = cache.value;
      loading.value = false;
      return;
    }

    const res = await Api.get(apiUrl);

    if (res.code != 200) {
      error.value = res.detail;
    } else {
      data.value = res.data.data;
      cache.value = res.data.data; // save cache
    }

    loading.value = false;
  };

  // first load & reload when params change
  watchEffect(load);

  // refresh interval
  if (refreshMs > 0) {
    setInterval(() => {
      cache.value = null; // clear cache
      load();
    }, refreshMs);
  }

  return { data, loading, error, reload: load };
}
