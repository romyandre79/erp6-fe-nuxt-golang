import { defineStore } from 'pinia';
import { ref, watch, onMounted } from 'vue';
import { useCookie } from '#app';
import { useApi } from '~/composables/useApi';

export const useThemeStore = defineStore('theme', () => {
  const Api = useApi();

  const themeCookie = useCookie<string>('theme', { default: () => '' });
  const theme = ref(themeCookie.value);
  const themeData = ref(null);
  const themeList = ref<any[]>([]);
  const userStore = useUserStore();

  // Load theme list dari API
  const loadThemes = async () => {
    const dataForm = new FormData();
    dataForm.append('flowname', 'searchcombotheme');
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');

    const res = await Api.post('admin/execute-flow', dataForm);
    themeList.value = res.data?.data || [];
  };

  const loadSingleThemes = async () => {
    const dataForm = new FormData();
    dataForm.append('flowname', 'gettheme');
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');
    dataForm.append('themeid', theme.value);

    const res = await Api.post('admin/execute-flow', dataForm);
    themeData.value = res.data?.data || [];
  };

  const saveActiveTheme = async (newData) => {
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

  // Apply theme
  const applyTheme = (key: string) => {
    const found = themeList.value.find((t) => t.themeid === key);
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
    userStore.loadAuth();
    themeCookie.value = userStore.user?.themeid
    await loadThemes();

    // cek cookie apakah theme valid
    if (themeCookie.value) {
      applyTheme(themeCookie.value); // skip update agar tidak trigger watch
    }
  });

  // jika theme berubah → apply theme
  watch(theme, (val, old) => {
    if (val !== old) applyTheme(val);
  });

  return {
    theme,
    themeData,
    themeList,
    applyTheme,
    loadThemes,
    loadSingleThemes,
    saveActiveTheme,
  };
});
