import { useI18n } from 'vue-i18n';

export const useArticle = () => {
  const { get } = useApi();
  const { t } = useI18n();
  const config = useRuntimeConfig();

  const loading = ref(false);
  const error = ref<string | null>(null);

  const getAllArticle = async () => {
    try {
      loading.value = true;
      error.value = '';
      const res = await get('/blog/post?companyid=' + config.public.companyId);
      if (res.code == 200) {
        return res;
      } else {
        error.value = $t('INVALID_DATA_RETRIEVED');
      }
    } catch (err) {
      error.value = t('INVALID_DATA_RETRIEVED');
    } finally {
      loading.value = false;
    }
  };

  const getArticle = async (slug: string) => {
    try {
      loading.value = true;
      error.value = '';
      const res = await get('/blog/post/slug?slug=' + slug);
      if (res.code == 200) {
        return res.data;
      } else {
        error.value = $t('INVALID_DATA_RETRIEVED');
      }
    } catch (err) {
      error.value = t('INVALID_DATA_RETRIEVED');
    } finally {
      loading.value = false;
    }
  };

  return { getAllArticle, getArticle, loading, error };
};
