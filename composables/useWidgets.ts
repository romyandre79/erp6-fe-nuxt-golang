// /composables/useWidgets.ts
import { ref } from 'vue';
import { useApi } from '~/composables/useApi';

export interface WidgetItem {
  widgetid: string;
  widgetname?: string;
  widgettitle?: string;
  widgetversion?: string;
  dashgroup?: number;
  description?: string;
  modulename?: string;
  position: number;
  widgetform: string;
}

export function useWidgets() {
  const Api = useApi();
  const isLoading = ref(false);

  // Fetch widget list
  const fetchWidgets = async (modulename: string) => {
    try {
      isLoading.value = true;
      const dataForm = new FormData();
      dataForm.append('flowname', 'getwidgetbymodule');
      dataForm.append('menu', 'admin');
      dataForm.append('search', 'true');
      dataForm.append('modulename', modulename);
      const res = await Api.post('admin/execute-flow', dataForm);
      if (res.code === 200) return res;
    } catch (e) {
      console.error('Error fetching widgets', e);
    } finally {
      isLoading.value = false;
    }
  };

  const getWidgetForm = async (slug: string) => {
    try {
      isLoading.value = true;
      const dataForm = new FormData();
      dataForm.append('flowname', 'getwidgetname');
      dataForm.append('menu', 'admin');
      dataForm.append('search', 'true');
      dataForm.append('widgetname', slug);
      const res = await Api.post('admin/execute-flow', dataForm);
      if (res.code == 200) {
        return res;
      } else {
        throw new Error(res.message || $t('INVALID_CREDENTIAL'));
      }
    } catch (err) {
      console.error(err);
      throw new Error($t('INVALID_CREDENTIAL'));
    } finally {
      isLoading.value = false;
    }
  };

  return { isLoading, fetchWidgets, getWidgetForm };
}
