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
  const widgets = ref<WidgetItem[]>([])
  const isLoading = ref(false)

  // Fetch widget list
  const fetchWidgets = async (modulename: string) => {
    try {
      isLoading.value = true
      const res = await Api.get('/admin/getwidget?module='+modulename)
      if (res.code === 200) widgets.value = res.data
    } catch (e) {
      console.error('Error fetching widgets', e)
    } finally {
      isLoading.value = false
    }
  }

  // Parse komponen dari widgetform
  const getWidgetComponents = (widgetName: string) => {
    try {
      const form = widgets.value.find(s => s.widgetname === widgetName)
      if (!form) return []
      const parsed = JSON.parse(form.widgetform)
      return parsed.components || []
    } catch (error) {
      console.error(error)
      return []
    }
  }

  // Render elemen HTML sederhana
  const renderWidget = (comp: any, t: (key: string) => string) => {
    let html = ''
    const compPlace = comp.place ? t(comp.place.replace(/\s+/g, '_').toUpperCase()) : ''
    const compText = comp.text ? t(comp.text.replace(/\s+/g, '_').toUpperCase()) : ''

    switch (comp.type) {
      case 'label':
        html += `<label class="font-medium text-gray-700 dark:text-gray-200">${compText}</label>`
        break

      case 'text':
      case 'number':
      case 'password':
        html += `
          <label class="font-medium text-gray-700 dark:text-gray-200">${compText}</label>
          <input type="${comp.type}" placeholder="${compPlace}" name="${comp.key ?? ''}"
            class="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100" />
        `
        break

      case 'button':
        html += `
          <button onclick="${comp.click ?? ''}"
            class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            ${compText}
          </button>
        `
        break
    }

    return html
  }

  return { widgets, isLoading, fetchWidgets, getWidgetComponents, renderWidget }
}
