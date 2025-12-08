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
        navigateTo('/api/admin/dashboard');
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

  const getMenuForm = async (slug: string) => {
    try {
      const dataForm = new FormData();
      dataForm.append('flowname', 'getmenubyname');
      dataForm.append('menu', 'admin');
      dataForm.append('search', 'true');
      dataForm.append('menuname', slug);
      const res = await post('api/admin/execute-flow', dataForm);
      if (res.code == 200) {
        return res;
      } else {
        throw new Error(res.message || $t('INVALID CREDENTIAL'));
      }
    } catch (err) {
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
