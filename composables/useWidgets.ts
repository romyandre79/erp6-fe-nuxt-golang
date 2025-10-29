// /composables/useWidgets.ts
import { ref } from 'vue'
import { useApi } from '~/composables/useApi'

export interface WidgetItem {
  widgetid: string
  widgetname?: string
  widgettitle?: string
  widgetversion?: string
  dashgroup?: number
  description?: string
  modulename?: string
  position: number
  widgetform: string
}

export function useWidgets() {
  const Api = useApi()
  const isLoading = ref(false)

  // Fetch widget list
  const fetchWidgets = async (modulename: string) => {
    try {
      isLoading.value = true
      const res = await Api.get('/admin/getwidget?module='+modulename)
      if (res.code === 200) return res
    } catch (e) {
      console.error('Error fetching widgets', e)
    } finally {
      isLoading.value = false
    }
  }


  return { isLoading, fetchWidgets}
}
