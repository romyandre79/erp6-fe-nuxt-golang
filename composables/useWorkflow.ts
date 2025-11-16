export function useWorkflow() {
  const workflow = ref<any>(null)
  const categories = ref<any[]>([])
  const components = ref<any[]>([])
  const componentProperties = ref<Record<string, any>>({})
  const selectedNode = ref<any>(null)
  const parameters = ref<any[]>([])
  const loading = ref(false)

  const api = useApi()

  // ===========================================
  // GENERIC HELPER – supaya reduce duplication
  // ===========================================
  async function execFlow(action: string, extra?: Record<string, any>) {
    const form = new FormData()
    form.append('flow', action)
    form.append('menu', 'admin')
    form.append('search', 'true')

    if (extra) {
      for (const k in extra) form.append(k, String(extra[k]))
    }

    const res = await api.post(`/admin/execute-flow`, form)
    return res.data?.data ?? []
  }

  // ===========================================
  // LOAD WORKFLOW
  // ===========================================
  async function loadWorkflow(id: string) {
    loading.value = true
    try {
      // 1. workflow
      const wfList = await execFlow('getworkflow', {
        workflowid: id,
        wfname: id
      })

      const wf = Array.isArray(wfList) ? wfList[0] : wfList || {}

      // pastikan JSON ter-parse
      if (typeof wf.flow === 'string') {
        try {
          wf.flow = JSON.parse(wf.flow)
        } catch (e) {
          console.error("FAILED PARSING WF JSON:", e)
        }
      }

      workflow.value = wf

      // 2. categories
      categories.value = await execFlow('searchcombocomponentcategory')

      // 3. components registry
      components.value = await execFlow('searchcombocomponent')

      // 4. parameters
      parameters.value = await execFlow('searchwfparameter', {
        workflowid: id
      })
    } finally {
      loading.value = false
    }
  }

  // ===========================================
  // FIND COMPONENT BY NAME
  // ===========================================
  function findComponentByName(name: string) {
    return components.value.find(
      c => c.code === name || c.componentname === name || c.name === name
    )
  }

  // ===========================================
  // LOAD PROPERTIES OF SPECIFIC NODE
  // ===========================================
  async function loadComponentProperties(name: string) {
    const w = workflow.value
    if (!w) return

    const list = await execFlow('searchwfdetailbywfname', {
      workflowid: w.workflowid,
      wfname: w.wfname
    })

    componentProperties.value = list.find((x: any) => x.componentname === name) || {}
  }

  function setSelectedNode(node: any) {
    selectedNode.value = node
  }

  // ===========================================
  // SAVE FLOW
  // ===========================================
  async function saveFlow(flow: any) {
    try {
      await execFlow('saveworkflow', {
        workflowid: workflow.value?.workflowid,
        wfjson: JSON.stringify(flow)
      })
    } catch (err) {
      console.error("ERROR SAVING WORKFLOW:", err)
    }
  }

  // ===========================================
  // UPDATE SELECTED NODE DATA + SAVE
  // ===========================================
  function updateSelectedNodeData(data: any) {
    if (!selectedNode.value) return

    const editor = (window as any).editor
    if (!editor || !editor.drawflow?.drawflow?.Home?.data) return

    const home = editor.drawflow.drawflow.Home.data

    const nodeKey = Object.keys(home).find(
      k => Number(home[k].id) === Number(selectedNode.value.id)
    )
    if (!nodeKey) return

    home[nodeKey].data = {
      ...home[nodeKey].data,
      ...data
    }

    // Simpan kembali ke editor
    editor.drawflow.drawflow.Home.data = home

    // Simpan ke DB
    saveFlow(editor.export())
  }

  return {
    workflow,
    categories,
    components,
    parameters,
    componentProperties,
    selectedNode,
    loading,

    loadWorkflow,
    findComponentByName,
    loadComponentProperties,
    setSelectedNode,
    saveFlow,
    updateSelectedNodeData
  }
}
