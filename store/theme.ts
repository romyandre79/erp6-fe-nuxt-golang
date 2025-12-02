import { defineStore } from 'pinia';
import { ref, watch, onMounted } from 'vue';
import { useCookie } from '#app';
import { useUserStore, useApi } from '#imports';

export const useThemeStore = defineStore('theme', () => {
  const Api = useApi();

  const themeCookie = useCookie<string>('theme', { default: () => '' });
  const theme = ref(themeCookie.value);
  const themeData = ref(null);
  const themeList = ref<any[]>([]);
  const userStore = useUserStore();

  // Load theme list dari API

  async function loadThemes () {
    const dataForm = new FormData();

    const res = await Api.post('auth/load-theme', dataForm) as any;
    themeList.value = res.data?.data || [];
  };

  const loadSingleThemes = async (themename: string) => {
    const dataForm = new FormData();
    dataForm.append('flowname', 'getthemebyname');
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');
    dataForm.append('themename', themename);

    const res = await Api.post('admin/execute-flow', dataForm) as any;
    themeData.value = res.data?.data || [];
  };

  const saveActiveTheme = async (newData: any) => {
    const dataForm = new FormData();
    dataForm.append('flowname', 'modiftheme');
    dataForm.append('themedata', newData);
    dataForm.append('themeid', themeData.value.themeid);
    dataForm.append('themename', themeData.value.themename);
    dataForm.append('createdby', themeData.value.createdby);
    dataForm.append('description', themeData.value.description);
    dataForm.append('recordstatus', themeData.value.recordstatus);
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'false');

    await Api.post('admin/execute-flow', dataForm);
  };

  const applyCurrentTheme = async () => {
    applyTheme(themeCookie.value);
  };

  // Apply theme
  const applyTheme = async (key: string) => {
    await loadThemes();
    const found = themeList.value.find((t) => t.themeid === Number(key));
    if (!found) return;

    // themedata harus berupa objek key-value
    const themeData = typeof found.themedata === 'string' ? JSON.parse(found.themedata) : found.themedata;

    // Set semua var yang ada di themedata
    for (const [name, val] of Object.entries(themeData)) {
      if (val !== null && val !== undefined && val !== '') {
        document.documentElement.style.setProperty(`--${name}`, String(val));
      }
    }

    theme.value = key;
    themeCookie.value = key;
    document.documentElement.setAttribute('data-theme', key);
  };

  // initialize
  onMounted(async () => {
    await userStore.loadAuth();
    if (userStore.token) {
      themeCookie.value = userStore.user?.themeid;
      await loadThemes();

      // cek cookie apakah theme valid
      if (themeCookie.value) {
        applyTheme(themeCookie.value); // skip update agar tidak trigger watch
      }
    } else {
      navigateTo('/login');
    }
  });

  // jika theme berubah → apply theme
  watch(theme, (val, old) => {
    if (val !== old) applyTheme(val);
  });

  return {
    theme,
    themeCookie,
    themeData,
    themeList,
    applyTheme,
    applyCurrentTheme,
    loadThemes,
    loadSingleThemes,
    saveActiveTheme,
  };
});
