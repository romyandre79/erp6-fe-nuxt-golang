// stores/workflow.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWorkflowStore = defineStore('workflow', () => {
  const workflow = ref<any>(null)
  const categories = ref<any[]>([])
  const components = ref<any[]>([])
  const componentDetails = ref<any[]>([])
  const componentProperties = ref<Record<string, any>>([])
  const selectedNode = ref<any>(null)
  const parameters = ref<any[]>([])
  const loading = ref(false)

  // assume you have a global api helper exposed e.g. useApi() or $api in NuxtApp
  const api = useApi()

  async function loadWorkflow(id: string) {
    loading.value = true
    try {
      // 1. get workflow instance (backend returns nested structure)
      const dataForm = new FormData()
      dataForm.append('flow', 'getworkflow')
      dataForm.append('menu', 'admin')
      dataForm.append('search', 'true')
      dataForm.append('workflowid', id)
      dataForm.append('wfname', id)

      const res = await api.post('/admin/execute-flow', dataForm)
      // backend response shape: { data: { data: { flow: "..." , workflowid: , wfname: ... } } }
      const wfObj = res?.data?.data ?? {}
      console.log(wfObj)

       // try various locations
      const flowString = wfObj?.flow 

      if (flowString && typeof flowString === 'string') {
        try {
          wfObj.flow = JSON.parse(flowString)
        } catch (e) {
          console.error('Failed parsing flow string', e)
          wfObj.flow = null
        }
      }

      workflow.value = wfObj

      // 2. load categories
      const f2 = new FormData()
      f2.append('flow', 'searchcombocomponentcategory')
      f2.append('menu', 'admin')
      f2.append('search', 'true')
      const r2 = await api.post('/admin/execute-flow', f2)
      categories.value = r2.data?.data ?? []

      // 3. load components
      const f3 = new FormData()
      f3.append('flow', 'searchcombocomponent')
      f3.append('menu', 'admin')
      f3.append('search', 'true')
      const r3 = await api.post('/admin/execute-flow', f3)
      components.value = r3.data?.data ?? []

      // 4. parameters
      const f4 = new FormData()
      f4.append('flow', 'searchwfparameter')
      f4.append('menu', 'admin')
      f4.append('search', 'true')
      f4.append('workflowid', id)
      const r4 = await api.post('/admin/execute-flow', f4)
      parameters.value = r4.data?.data ?? []

      // 5. component propertie
      const f5 = new FormData()
    f5.append('flow', 'searchwfdetailbywfname')
    f5.append('menu', 'admin')
    f5.append('search', 'true')
    f5.append('workflowid', workflow.value?.workflowid ?? '')
    const r5 = await api.post('/admin/execute-flow', f5)
      componentDetails.value = r5.data?.data ?? []

      console.log('details ',componentDetails.value)

    } finally {
      loading.value = false
    }
  }

  function findComponentByName(name: string) {
    return components.value.find(
      (c) => c.code === name || c.componentname === name || c.name === name
    )
  }

  async function loadComponentProperties(name: string) {
    // backend may return an array - try find by component name
    const items = componentDetails.value ?? []
    const found = items.filter((x: any) => x.componentname === name) ?? []
    // normalize format to property map expected by PropertyForm
    componentProperties.value = found
    return componentProperties.value
  }

  async function saveFlow(flow: any) {
    loading.value = true
    try {
      const df = new FormData()
      df.append('flow', 'saveflow')
      df.append('menu', 'admin')
      df.append('search', 'false')
      df.append('workflowid', workflow.value?.workflowid ?? '')
      df.append('workflow', JSON.stringify(flow))
      const res = await api.post('/admin/execute-flow', df)
      // update local copy
      workflow.value = { ...(workflow.value || {}), flow }
      return res
    } 
    finally {
      loading.value = false
    }
  }

  function setSelectedNode(node: any) {
    selectedNode.value = node
  }

  function updateSelectedNodeData(data: any) {
    if (!selectedNode.value) return
    const editor = (window as any).editor
    if (!editor) return
    const home = editor.drawflow?.drawflow?.Home?.data
    if (!home) return
    const nodeKey = Object.keys(home).find(
      (k) => Number(home[k].id) === Number(selectedNode.value.id)
    )
    if (!nodeKey) return
    home[nodeKey].data = { ...(home[nodeKey].data || {}), ...data }
    editor.drawflow.drawflow.Home.data = home
    saveFlow(editor.export())
  }

  return {
    workflow,
    categories,
    components,
    componentProperties,
    selectedNode,
    parameters,
    loading,
    loadWorkflow,
    findComponentByName,
    loadComponentProperties,
    saveFlow,
    setSelectedNode,
    updateSelectedNodeData
  }
})
