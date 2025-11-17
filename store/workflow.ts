// stores/workflow.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWorkflowStore = defineStore('workflow', () => {
  const workflow = ref<any>(null)
  const categories = ref<any[]>([])
  const components = ref<any[]>([])
  const componentDetails = ref<any[]>([])
  const componentDefaultDetails = ref<any[]>([])
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
      dataForm.append('flowname', 'getworkflow')
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
      f2.append('flowname', 'searchcombocomponentcategory')
      f2.append('menu', 'admin')
      f2.append('search', 'true')
      const r2 = await api.post('/admin/execute-flow', f2)
      categories.value = r2.data?.data ?? []

      // 3. load components
      const f3 = new FormData()
      f3.append('flowname', 'searchcombocomponent')
      f3.append('menu', 'admin')
      f3.append('search', 'true')
      const r3 = await api.post('/admin/execute-flow', f3)
      components.value = r3.data?.data ?? []

      // 4. parameters
      const f4 = new FormData()
      f4.append('flowname', 'searchwfparameter')
      f4.append('menu', 'admin')
      f4.append('search', 'true')
      f4.append('wfname', id)
      const r4 = await api.post('/admin/execute-flow', f4)
      parameters.value = r4.data?.data ?? []

      // 5. component propertie
      const f5 = new FormData()
      f5.append('flowname', 'searchcomponentdetails')
      f5.append('menu', 'admin')
      f5.append('search', 'true')
      const r5 = await api.post('/admin/execute-flow', f5)
      componentDefaultDetails.value = r5.data?.data ?? []

      const f6 = new FormData()
      f6.append('flowname', 'searchwfdetailbywfname')
      f6.append('menu', 'admin')
      f6.append('search', 'true')
      f6.append('wfname', id)
      const r6 = await api.post('/admin/execute-flow', f6)
      componentDetails.value = r6.data?.data ?? []

    } finally {
      loading.value = false
    }
  }

  function findComponentByName(name: string) {
    return components.value.find(
      (c) => c.code === name || c.componentname === name || c.name === name
    )
  }

  async function loadComponentProperties(name: string, nodeId: number) {
    console.log('node id',nodeId)
  const defaults = componentDefaultDetails.value.filter(
    x => x.componentname === name
  )
  console.log('default ',defaults)

  const saved = componentDetails.value.filter(
    x =>
      x.componentname === name && Number(x.nodeid) === Number(nodeId)
  )
  console.log('saved ',saved)

  // map saved by componentdetailid OR propertykey
  const savedMap = new Map()
  saved.forEach(x => {
    savedMap.set(x.componentdetailid || x.inputname, x)
  })

  // merge defaults + saved values
  const merged = defaults.map(d => {
    const key = d.componentdetailid || d.inputname
    const savedItem = savedMap.get(key)

    return {
      ...d,
      componentvalue: savedItem?.componentvalue ?? "" // merge value
    }
  })

  componentProperties.value = merged
  return merged
}


  function findDetailMeta(componentName: string, key: string) {
    // cari dari default component details
    return componentDefaultDetails.value.find(
      x => x.componentname === componentName && x.inputname === key
    ) || null
  }

  function findSavedDetailId(componentName: string, key: string, nodeId: number) {
  return componentDetails.value.find(
    x =>
      x.componentname === componentName &&
      x.propertykey === key &&
      Number(x.nodeid) === Number(nodeId)
  )?.workflowdetailid ?? ''
}


async function saveFlowDetails(flow: any) {
  const home = flow?.drawflow?.Home?.data ?? {}

  for (const node of Object.values<any>(home)) {

    const componentName = node?.name
    const props = node?.data ?? {}

    for (const key of Object.keys(props)) {

      const meta = findDetailMeta(componentName, key)
      if (!meta) {
        console.warn("Meta not found:", componentName, key)
        continue
      }

      // cari workflowdetailid lama
      const oldDetailId = findSavedDetailId(componentName, key, node.id)

      const df = new FormData()
      df.append('flowname', 'modifworkflowdetail')
      df.append('menu', 'admin')
      df.append('search', 'false')
      df.append('workflowid', workflow.value?.workflowid ?? '')

      // 🟦 ID penting
      df.append('componentid', meta.componentid)
      df.append('componentdetailid', meta.componentdetailid)
      df.append('workflowdetailid', oldDetailId || '') // kosong jika insert baru

      // properties
      df.append('componentvalue', props[key])
      df.append('nodeid', node.id)

      await api.post('/admin/execute-flow', df)
    }
  }
}




  async function saveFlow(flow: any) {
    loading.value = true
    try {
      const df = new FormData()
      df.append('flowname', 'saveflow')
      df.append('menu', 'admin')
      df.append('search', 'false')
      df.append('workflowid', workflow.value?.workflowid ?? '')
      df.append('flow', JSON.stringify(flow))
      const res = await api.post('/admin/execute-flow', df)
      // update local copy
      await saveFlowDetails(flow)

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
