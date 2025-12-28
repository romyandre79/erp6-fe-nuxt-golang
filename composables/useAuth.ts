// composables/useAuth.ts
import { user } from '#build/ui';
import { useUserStore } from '~/store/user';

export const useAuth = () => {
  const userStore = useUserStore();
  const { post, get } = useApi();
  const router = useRouter();

  const login = async (payload: { username: string; password: string }) => {
    try {
      const res = await post('/api/auth/login', payload);
      if (res.code == 200) {
        userStore.setAuth(res.data?.token, res.data.user);
        navigateTo('/admin/dashboard');
      } else {
        throw new Error(res.message || $t('INVALID CREDENTIAL'));
      }
    } catch (err) {
      console.error(err);
      throw new Error($t('INVALID CREDENTIAL'));
    }
  };

  const me = async () => {
    try {
      const res = await get('/api/auth/me');
      if (res.code == 200) {
        return res;
      } else {
        this.logout();
        throw new Error(res.message || $t('INVALID CREDENTIAL'));
      }
    } catch (err) {
      console.error(err);
      this.logout();
      throw new Error($t('INVALID CREDENTIAL'));
    }
  };

  const updateUserTheme = async (themeid: any) => {
    try {
      const dataForm = new FormData();
      dataForm.append('flowname', 'modifusertheme');
      dataForm.append('menu', 'admin');
      dataForm.append('search', 'true');
      dataForm.append('themeid', themeid);
      dataForm.append('useraccessid', userStore.user?.userid);
      dataForm.append('languageid', userStore.user?.languageid);
      const res = await post('api/admin/execute-flow', dataForm);
      if (res.code == 200) {
        userStore.setAuth(userStore.token, {
          ...userStore.user,
          themeid: themeid,
        });
        return res;
      } else {
        throw new Error(res.message || $t('INVALID CREDENTIAL'));
      }
    } catch (err) {
      console.error(err);
      this.logout();
      throw new Error($t('INVALID CREDENTIAL'));
    }
  };

  const updateUserLanguage = async (languageid: any) => {
    try {
      const dataForm = new FormData();
      dataForm.append('flowname', 'modifusertheme');
      dataForm.append('menu', 'admin');
      dataForm.append('search', 'true');
      dataForm.append('themeid', userStore.user?.themeid);
      dataForm.append('useraccessid', userStore.user?.userid);
      dataForm.append('languageid', languageid);
      const res = await post('api/admin/execute-flow', dataForm);
      if (res.code == 200) {
        return res;
      } else {
        throw new Error(res.message || $t('INVALID CREDENTIAL'));
      }
    } catch (err) {
      console.error(err);
      this.logout();
      throw new Error($t('INVALID CREDENTIAL'));
    }
  };

  const getMenuForm = async (slug: string | string[], isDesign: boolean = false) => {
    try {
      const distinctSlug = Array.isArray(slug) ? slug[0] : slug;
      // Call endpoint directly to leverage Locking Logic
      const res: any = await get(`api/admin/getmenu?menuname=${distinctSlug}&design=${isDesign}`);

      if (res.code == 200) {
        // Adapt response structure if needed.
        // Backend returns: { code: 200, data: { menuaccessid: ..., menuform: ... } }
        // The previous workflow result might have been wrapped differently?
        // Wait, workflow result: res.data.data.menuaccessid.
        // API result: res.data.menuaccessid.
        // I need to ensure the return shape matches what components expect, OR components need adjustment.
        // The components access: res.data.data.menuaccessid
        // So I should wrap existing API result in another data object OR update components.
        // Update components is risky. Better keep "res.data.data" shape for compatibility.
        // Backend returns: { code: 200, message: "...", data: { ... } } via SuccessResponse.
        // useApi "get" returns the JSON?
        // If useApi returns the parsed JSON, then res.data is the menu object.
        // The workflow result was likely: res.data = { data: { menuaccessid: ... } } because workflow output node.

        // Let's create a compatible response
        return {
          code: 200,
          data: {
            data: res.data, // Nest it to match old workflow structure: res.data.data
          },
          message: res.message,
        };
      } else {
        // Pass through error
        return res;
      }
    } catch (err: any) {
      // Handle locked schema error (423) gracefully
      if (err.response && (err.response.status === 423 || err.response._data?.code === 423)) {
        return err.response._data;
      }
      console.error(err);
      throw new Error($t('INVALID CREDENTIAL'));
    }
  };

  const logout = async () => {
    userStore.logout();
    await router.push('/login');
  };

  const isAuthenticated = computed(() => !!userStore.token);

  return { login, logout, updateUserTheme, updateUserLanguage, me, getMenuForm, isAuthenticated };
};
