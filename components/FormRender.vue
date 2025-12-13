<script setup lang="ts">
import { UModal, UButton, TablePagination, FormSelect, FormSelectGroup, FormWizard, DetailTableInline } from '#components';
import { useToast, useApi, useI18n, toRaw, onMounted } from '#imports';
import { navigateTo } from '#app';
import {
  ref,
  reactive,
  computed,
  nextTick,
  shallowReactive,
  watch,
  h,
  resolveComponent,
  watchEffect,
  defineComponent,
} from 'vue';
import CardWrapper from './CardWrapper.vue';
import ChartWrapper from './ChartWrapper.vue';
import { useFormValidation } from '../composables/useFormValidation';

const props = defineProps({
  title: { type: String, default: '' },
  menuName: { type: String, default: '' },
  schema: { type: [Object, String], required: true },
  formType: { type: String, default: 'form' },
});

const modalTitle = ref('');
const modalDescription = ref('');
const modalRefs = shallowReactive<Record<string, any>>({});
const tableRef = ref();
const Api = useApi();

const toast = useToast();
let selectedRows = ref<any[]>([]);

const emit = defineEmits([]);

// 🧩 Parse schema
const parsedSchema = computed(() => (typeof props.schema === 'string' ? JSON.parse(props.schema) : props.schema));

function findNode(node: any, type: any): any {
  let result = [];

  if (Array.isArray(node)) {
    for (const n of node) result.push(...findNode(n, type));
    return result;
  }

  if (!node || typeof node !== 'object') return [];

  // jika object ini adalah table → push
  if (node.type === type) result.push(node);

  // scan children
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      result.push(...findNode(child, type));
    }
  }

  return result;
}

const tables = computed(() => findNode(parsedSchema.value, 'table'));
const modals = computed(() => findNode(parsedSchema.value, 'modal'));

// 🔥 Ketika selectedRows berubah
watch(
  () => selectedRows.value,
  (newVal) => {
    if (!newVal || newVal.length === 0) return;
    // 🔄 Loop semua tabel di schema
    tables.value.forEach((tbl: any) => {
      if (tbl.key !== 'table0') {
        // update relation key untuk table child
        tbl.selectionKeyData = newVal[0][tbl.relationkey] + '';
      }
    });
  },
  { deep: true },
);

// 🧩 Rebuild modalRefs setiap kali modals berubah
watch(
  modals,
  async (newVal) => {
    await nextTick();
    for (const key of Object.keys(modalRefs)) delete modalRefs[key];
    newVal?.forEach((m) => {
      // buat modal ref
      modalRefs[m.key] = ref(false);
    });
  },
  { immediate: true },
);

const detailTab = computed(() => {
  if (!modals.value) return [];

  // Skip modal pertama (index 0)
  return modals.value.slice(1).map((m) => ({
    ...m,
  }));
});

const detailRows = ref({});

watch(
  detailTab,
  (tabs) => {
    tabs.forEach((t) => {
      if (!detailRows.value[t.key]) {
        // Jika API memberi value
        if (t.value && Array.isArray(t.value)) {
          detailRows.value[t.key] = [...t.value];
        } else {
          detailRows.value[t.key] = [{}]; // minimal 1 row
        }
      }
    });
  },
  { immediate: true },
);

// 🧩 Modal actions
function open(key: string) {
  if (modalRefs[key]) {
    modalRefs[key].value = true;
    modalTitle.value = 'New Data';
    modalDescription.value = '';
    const primary = getPrimary();
    tableRef.value.setData(primary, 0);
  } else {
    console.warn('❌ Modal not found:', key);
  }
}

async function copy() {
  const onCopy = getAction('onCopy') 
  if (onCopy == '') return 
  try {
  const dataForm = new FormData();
  dataForm.append('flowname', onCopy);
  dataForm.append('menu', 'admin');
  dataForm.append('search', 'true');
  dataForm.append('id', selectedRows.value[0][getPrimary()]);
  const res = await Api.post('api/admin/execute-flow', dataForm);
  toast.add({ title: 'Success', description: 'Data copied successfully', color: 'success' });
  } catch (err) {
    toast.add({ title: 'Error', description: 'Please select one row', color: 'error' });
  }
}

function getPrimary() {
  let node: any;
  parsedSchema.value.forEach((element) => {
    if (element.type == 'master') {
      node = element;
    }
  });
  return node.props.primary || null;
}

async function edit(key: string) {
  // Check if this is a detail modal by looking for the modal in the schema
  const modal = modals.value.find((m: any) => m.props.key === key);
  
  // Determine if this is a detail modal by checking if the key contains "detail"
  const isDetailModal = modal && key.toLowerCase().includes('detail');
  
  console.log('edit debug:', { key, isDetailModal, modalFound: !!modal });
  
  if (isDetailModal) {
    // Handle detail modal edit
    // Get the detail table that this modal is associated with
    // Find which table's selected row we should use
    const detailTableKey = key.replace('modal', 'table').replace('form', ''); // e.g., modaldetailform -> table
    
    // Get onGetDetail flows
    let actionNode: any;
    parsedSchema.value.forEach((element: any) => {
      if (element.type == 'action') {
        actionNode = element;
      }
    });
    const detailFlows = actionNode?.props?.onGetDetail || []; // Fixed: use onGetDetail instead of ongetdetail
    
    // Find the index of this detail modal to get the correct flow
    // Filter modals that are actually detail modals (contain 'detail' in key)
    const detailModals = modals.value.filter((m: any) => m.props.key.toLowerCase().includes('detail'));
    const modalIndex = detailModals.findIndex((m: any) => m.props.key === key);
    const flow = detailFlows[modalIndex];
    
    if (flow && selectedRows.value.length > 0) {
      modalTitle.value = 'Edit Data';
      modalDescription.value = '';
      modalRefs[key].value = true;
      
      const dataForm = new FormData();
      dataForm.append('flowname', flow);
      dataForm.append('menu', 'admin');
      dataForm.append('search', 'true');
      
      // Append all selected row data as search parameters
      const selectedRow = selectedRows.value[0];
      for (const rowKey in selectedRow) {
        if (selectedRow[rowKey] !== null && selectedRow[rowKey] !== undefined && typeof selectedRow[rowKey] !== 'object') {
          dataForm.append(rowKey, selectedRow[rowKey]);
        }
      }
      
      try {
        const res = await Api.post('api/admin/execute-flow', dataForm);
        if (res.code == 200) {
          const record = res.data.data;
          for (const key in record) {
            formData.value[key] = record[key];
          }
        } else if (res.code == 401 && res.error == 'INVALID_TOKEN') {
          navigateTo('/login');
        }
      } catch (err) {
        console.error('Gagal ambil data:', err);
      }
    }
  } else {
    // Handle master modal edit (existing logic)
    const flow = getAction('get');
    if (flow && selectedRows.value.length > 0) {
      const primary = getPrimary();
      modalTitle.value = 'Edit Data';
      modalDescription.value = '';
      modalRefs[key].value = true;
      const dataForm = new FormData();
      dataForm.append('flowname', flow);
      dataForm.append('menu', 'admin');
      dataForm.append('search', 'true');
      dataForm.append(primary, selectedRows.value[0][primary]);
      try {
        const res = await Api.post('api/admin/execute-flow', dataForm);
        if (res.code == 200) {
          const record = res.data.data;
          for (const key in record) {
            formData.value[key] = record[key];
          }
          
          // 🔥 Load detail table data if exists
          // Check for any array fields that might be detail tables
          for (const key in record) {
            if (Array.isArray(record[key]) && record[key].length > 0) {
              formData.value[key] = [...record[key]];
            }
          }
          
          tableRef.value.setData(primary, selectedRows.value[0][primary]);
        } else if (res.code == 401 && res.error == 'INVALID_TOKEN') {
          navigateTo('/login');
        }
      } catch (err) {
        console.error('Gagal ambil data:', err);
      }
    }
  }
}

async function runFlow(flow: string) {
  const dataForm = new FormData();
  dataForm.append('flowname', flow);
  dataForm.append('menu', 'admin');
  dataForm.append('search', 'true');
  try {
    const res = await Api.post('api/admin/execute-flow', dataForm);
    if (res.code == 200) {
      const record = res.data.data;
    } else if (res.code == 401 && res.error == 'INVALID_TOKEN') {
      navigateTo('/login');
    }
  } catch (err) {
    console.error('Gagal ambil data:', err);
  }
}

function close(key: string) {
  try {
    const primary = getPrimary();
    if (selectedRows.value && selectedRows.value.length > 0 && selectedRows.value[0][primary]) {
      tableRef.value.setData(primary, selectedRows.value[0][primary]);
    }
    tableRef.value.setDataIsDetail(false);
  } catch (e) {
    console.error('Error closing modal:', e);
  } finally {
    if (modalRefs[key]) {
      modalRefs[key].value = false;
    }
  }
  //window.location.reload(true); // TODO: next only refresh grid
}

async function deleteData(table: any) {
  const flow = getAction('purge');
  console.log('del table ', tableRef.value[table]);
  if (flow && selectedRows.value.length > 0) {
    const primary = getPrimary();
    for (let index = 0; index < selectedRows.value.length; index++) {
      let dataForm = new FormData();
      dataForm.append('flowname', flow);
      dataForm.append('menu', 'admin');
      dataForm.append('search', 'true');
      dataForm.append(primary, selectedRows.value[index][primary]);
      try {
        const res = await Api.post('api/admin/execute-flow', dataForm);
        if (res?.code == 200) {
          tableRef.value.refreshTable();
        } else if (res?.code == 401 && res?.error == 'INVALID_TOKEN') {
          navigateTo('/login');
        }
      } catch (err) {
        console.error('Gagal hapus data:', err);
      }
    }
  }
}

async function downForm(mode: any) {
  let flow = '';
  if (mode == 'pdf') {
    flow = getAction('pdf');
  } else if (mode == 'xlsx' || mode == 'xls') {
    flow = getAction('xls');
  }
  if (flow) {
    let dataForm = new FormData();
    const primary = getPrimary();
    dataForm.append('flowname', flow);
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');
    for (let index = 0; index < selectedRows?.length; index++) {
      dataForm.append(primary + '[' + index + ']', selectedRows[index][primary]);
    }
    await Api.donlotFile('/api/admin/execute-flow', dataForm, props.menuName + '.' + mode);
  }
}

async function downTemplate() {
  let dataForm = new FormData();

  dataForm.append('menu', props.menuName);
  await Api.donlotFile('/api/admin/down-template', dataForm, props.menuName + '.xlsx');
}

function navigate(key: any) {
  if (key.includes('form-designer') && selectedRows.value.length === 0) {
    toast.add({ title: 'Error', description: 'Please select one row', color: 'error' });
    return;
  } else if (key.includes('widget-designer') && selectedRows.value.length === 0) {
    toast.add({ title: 'Error', description: 'Please select one row', color: 'error' });
    return;
  } else if (key.includes('workflow-designer') && selectedRows.value.length === 0) {
    toast.add({ title: 'Error', description: 'Please select one row', color: 'error' });
    return;
  } else if (key.includes('theme-editor') && selectedRows.value.length === 0) {
    toast.add({ title: 'Error', description: 'Please select one row', color: 'error' });
    return;
  } else if (key.includes('db-designer') && selectedRows.value.length === 0) {
    toast.add({ title: 'Error', description: 'Please select one row', color: 'error' });
    return;
  } else if (key.includes('form-designer') && selectedRows.value.length > 0) {
    navigateTo(key + '/' + selectedRows.value[0]['menuname']);
  } else if (key.includes('widget-designer') && selectedRows.value.length > 0) {
    navigateTo(key + '/' + selectedRows.value[0]['widgetname']);
  } else if (key.includes('workflow-designer') && selectedRows.value.length > 0) {
    navigateTo(key + '/' + selectedRows.value[0]['wfname']);
  } else if (key.includes('theme-editor') && selectedRows.value.length > 0) {
    navigateTo(key + '/' + selectedRows.value[0]['themename']);
  } else if (key.includes('db-designer') && selectedRows.value.length > 0) {
    navigateTo(key + '/' + selectedRows.value[0]['objectname']);
  } else {
    navigateTo(key);
  }
}

const uploadProgress = ref(0);
const selectedFile = ref<File | null>(null);
const isUploading = ref(false);

// 🔹 Trigger input file
const fileInput = ref<HTMLInputElement | null>(null);
function upload() {
  triggerFileSelect();
}

function triggerFileSelect() {
  fileInput.value?.click();
}

async function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files?.[0];
  if (!file) return;

  // ✅ Validasi MIME type (opsional)
  const validTypes = [
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  ];

  if (!validTypes.includes(file.type)) {
    toast.add({ title: 'Error', description: 'Hanya file Excel yang diizinkan (.xls / .xlsx)', color: 'red' });
    target.value = ''; // reset input
    return;
  }

  selectedFile.value = file;

  const flow = getAction('upload');
  if (!flow) {
    toast.add({ title: 'Error', description: 'Upload flow not defined.' });
    return;
  }

  const form = new FormData();
  form.append('flowname', flow);
  form.append('menu', 'admin');
  form.append('search', 'false');
  form.append('file-modules', file);

  try {
    isUploading.value = true;
    uploadProgress.value = 0;

    const res = await Api.post('api/admin/execute-flow', form);

    if (res.code === 200) {
      toast.add({
        title: 'Upload Success',
        description: res.message || 'File uploaded successfully.',
      });
      uploadProgress.value = 0;
      selectedFile.value = null;
      tableRef.value?.refreshTable?.();
    } else {
      toast.add({
        title: 'Upload Failed',
        description: res.message || 'Unknown error.',
      });
    }
  } catch (err) {
    console.error('Upload error:', err);
    toast.add({ title: 'Error', description: 'Failed to upload file.' });
  } finally {
    isUploading.value = false;
    target.value = '';
  }
}

let formData = ref<Record<string, any>>({});
const validationErrors = reactive<Record<string, string>>({});
const { validateField } = useFormValidation();

function renderComponent(component: any) {
  switch ((component.type || '').toLowerCase()) {
    case 'callother':
      return renderCallOther(component); // <— buatkan function khusus
    case 'title':
      return h(
        'h1',
        {
          class: component.props.class,
        },
        $t(component.props.text),
      );
    case 'subtitle':
      return h(
        'h2',
        {
          class: component.props.class,
        },
        $t(component.props.text),
      );
    case 'label': {
      const text = component.props?.text || '';

      return h(
        'label',
        {
          class: `block mb-1 font-medium ${component.props?.class ?? ''}`,
          for: component.props?.for ?? null,
        },
        $t(text.toUpperCase()) + required,
      );
    }

    case 'longtext': {
      if (!(component.props.key in formData.value)) formData.value[component.props.key] = '';
      const modelInputArea = computed({
        get: () => formData.value[component.props.key],
        set: (val) => {
          formData.value[component.props.key] = val;
          //validateField(component, val)
        },
      });
      return h('div', { class: [component.props.class, 'flex flex-col mb-3'] }, [
        component.type != 'hidden'
          ? component.props.text
            ? h('label', { class: 'mb-1 font-medium' }, $t(component.props.text.toUpperCase()))
            : null
          : '',
        h('textarea', {
          type: component.type,
          class:
            'border rounded px-3 py-2 focus:ring focus:ring-blue-200 outline-none ' +
            (validationErrors[component.props.key] ? 'border-red-500' : 'border-gray-300') +
            ' ' +
            (component.type === 'number' ? 'text-right' : ''),
          placeholder: $t(component.props.place?.toUpperCase()) || '',
          maxlength: component.length,
          onInput: (e: Event) => (e.target as HTMLTextAreaElement).value,
          value: modelInputArea.value,
        }),
        validationErrors[component.props.key]
          ? h('span', { class: 'text-red-500 mt-1' }, validationErrors[component.props.key])
          : null,
      ]);
    }
    case 'image':
      const modelInputArea = computed({
        get: () => formData.value[component.props.key] || component.props.src,
        set: (val) => {
          formData.value[component.props.key] = val;
          //validateField(component, val)
        },
      });
      return h('div', { class: [component.props.class, 'flex flex-col mb-3'] }, [
        // ============================
        // MODE INPUT (ada label + input)
        // ============================
        component.props.isinput
          ? [
              // Label
              component.type != 'hidden' && component.props.text
                ? h(
                    'label',
                    { class: 'text-sm mb-1 font-medium text-gray-400' },
                    $t(component.props.text.toUpperCase()),
                  )
                : null,

              // Input file
              h('input', {
                type: 'file',
                accept: 'image/*',
                class:
                  'border rounded px-3 py-2 focus:ring focus:ring-blue-200 outline-none ' +
                  (validationErrors[component.props.key] ? 'border-red-500' : 'border-gray-300'),

                onChange: (e: any) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onload = () => {
                    modelInputArea.value = reader.result; // base64 image
                  };
                  reader.readAsDataURL(file);
                },
              }),

              // Preview image jika ada
              modelInputArea.value
                ? h('img', {
                    src: modelInputArea.value,
                    class: 'mt-2 w-32 h-auto rounded border',
                  })
                : null,

              // Error message
              validationErrors[component.props.key]
                ? h('span', { class: 'text-xs text-red-500 mt-1' }, validationErrors[component.props.key])
                : null,
            ]
          : // ============================
            // MODE VIEW (gambar saja)
            // ============================
            modelInputArea.value
            ? h('img', {
                src: modelInputArea.value,
                class: 'w-32 h-auto rounded border',
              })
            : null,
      ]);

    case 'text':
    case 'hidden':
    case 'password':
    case 'number': {
      if (!(component.props.key in formData.value)) formData.value[component.props.key] = '';
      const modelInput = computed({
        get: () => formData.value[component.props.key],
        set: (val) => {
          formData.value[component.props.key] = val;
        },
      });
      return h('div', { class: [component.props.class, 'flex flex-col mb-3'] }, [
        component.type != 'hidden'
          ? component.props.text
            ? h('label', { class: 'text-sm mb-1 font-medium text-gray-400' }, $t(component.props.text.toUpperCase()))
            : null
          : '',
        h('input', {
          type: component.type,
          class:
            'border rounded px-3 py-2 focus:ring focus:ring-blue-200 outline-none' +
            (validationErrors[component.props.key] ? 'border-red-500' : 'border-gray-300') +
            ' ' +
            (component.type === 'number' ? 'text-right' : ''),
          placeholder: component.props.place ? $t(component.props.place?.toUpperCase()) : '',
          maxlength: component.length,
          value: modelInput.value,
          onInput: (e: any) => (modelInput.value = e.target.value),
        }),
        validationErrors[component.props.key]
          ? h('span', { class: 'text-xs text-red-500 mt-1' }, validationErrors[component.props.key])
          : null,
      ]);
    }
    case 'select':
      if (!(component.props.key in formData.value)) formData.value[component.props.key] = '';
      return h(FormSelect, {
        class: component.props.class,
        component: component.props,
        formData,
        validationErrors,
        validateField,
      });


    case 'selectgroup':
      return renderSelectGroup(component)

    case 'bool':
    case 'boolean': {
      if (!(component.props.key in formData.value)) formData.value[component.props.key] = false;
      const modelCheckbox = computed({
        get: () => formData.value[component.props.key],
        set: (val) => {
          formData.value[component.props.key] = val;
          validateField(component.props, val);
        },
      });
      return h('div', { class: [component.props.class, 'flex items-center mb-3 space-x-2'] }, [
        h('input', {
          type: 'checkbox',
          checked: modelCheckbox.value,
          onChange: (e: any) => (modelCheckbox.value = e.target.checked),
          class: 'w-4 h-4 rounded focus:ring-blue-500 focus:ring-2',
        }),
        h('label', { class: 'cursor-pointer' }, $t(component.props.text.toUpperCase()) || ''),
      ]);
    }

    case 'button':
      return h(UButton, {
        class: [component.props.class, 'rounded px-4 py-2 mr-2 transition mb-3'],
        icon: component.props.icon || '',
        onClick: async () => {
          const eventName = component.props.onClick.toLowerCase();
          if (eventName === 'oncreate') {
            if (validateAllFields()) await CreateHandler();
            else toast.add({ title: 'Error', description: 'Error Validation', color: 'error' });
          } else if (eventName === 'onupdate') {
            if (validateAllFields()) await UpdateHandler();
            else toast.add({ title: 'Error', description: 'Error Validation', color: 'error' });
          } else if (eventName === 'ondelete') {
            await DeleteHandler();
          } else if (eventName.startsWith('open')) {
            const key = eventName.replace('open:', '');
            open(key);
            return;
          } else if (eventName.startsWith('copy')) {
            copy();
            return;
          } else if (eventName.startsWith('edit')) {
            const key = eventName.replace('edit:', '');
            edit(key);
            return;
          } else if (eventName.startsWith('navigate')) {
            const key = eventName.replace('navigate:', '');
            navigate(key);
            return;
          } else if (eventName.startsWith('downform')) {
            const key = eventName.replace('downform:', '');
            downForm(key);
            return;
          } else if (eventName.startsWith('deletedata')) {
            const key = eventName.replace('deletedata:', '');
            deleteData(key);
            return;
          } else if (eventName.startsWith('upload')) {
            upload();
            return;
          } else if (eventName === 'downtemplate') {
            await downTemplate();
          } else {
            emit(eventName, { ...formData });
          }
        },
        label: component.props.text,
      });
    
    
    
    case 'action':
      break;
  }
}

function renderTabs(component) {
  const items = component.children.map((tab, i) => ({
    label: tab.props.text,
    index: i,
    raw: tab, // <-- SIMPAN TAB ASLI
  }));

  const UTabs = resolveComponent('UTabs');

  return h(
    UTabs,
    {
      items,
    },
    {
      content: ({ item }) => {
        const realTab = item.raw; // <-- JSON TAB ASLI
        if (!realTab?.children) return h('div', 'No content');

        return h(
          'div',
          realTab.children.map((child: any) => {
            if (child.type != 'callother') {
              return renderContainer(child);
            } else {
              return renderCallOther(child);
            }
          }),
        );
      },
    },
  );
}

const tableUsed = ref([String]);

function renderCallOther(component) {
  const key = component.props.otherkey;
  const type = component.props.othertype;

  if (type === 'table') {
    const tableObj = tables.value.find((t) => t.props.key === key);
    
    if (!tableObj) {
      return h('div', `Table ${key} not found`);
    }

    // 🆕 Clone object to avoid mutating the original schema
    const clonedTable = {
      ...tableObj,
      props: {
        ...tableObj.props,
        isdetail: false,
        isexpand: false,
      }
    };

    tableUsed.value.push(key);

    return renderTable(clonedTable);
  }

  return h('div', `Unknown other type: ${type}`);
}

function renderWizard(container: any) {
  if (!container) return null;

  return h(
    FormWizard,
    {
      steps: container,
      saveKey: 'wizard-h',
    },
    {
      default: ({ step, schema, state }) => {
        return h(
          'div',
          schema.map((field) => {
            return h('div', { class: 'mb-3' }, [
              h('label', field.label),
              h('input', {
                class: 'border p-2 w-full',
                value: state[field.key],
                onInput: (e) => (state[field.key] = e.target.value),
              }),
            ]);
          }),
        );
      },
    },
  );
}

function renderCard(container: any) {
  if (!container) return null;
  return h(CardWrapper, { container, renderChild: renderContainer });
}

function renderChart(container: any) {
  if (!container) return null;
  return h(ChartWrapper, { container, renderChild: renderContainer, formData: formData.value });
}

function renderDetailTable(container: any) {
  const tableKey = container.props.key;
    
    if (!(tableKey in formData.value)) {
      formData.value[tableKey] = [];
    }

    // Extract columns from component children
    let columns: any[] = [];
    if (container.children) {
      container.children.forEach((child: any) => {
        if (child.type === 'columns' && child.children) {
          columns = child.children.map((col: any) => ({
            ...col.props,
            type: col.type,
            text: col.props?.text,
            label: col.props?.label,
            key: col.props?.key,
          }));
        }
      });
    }

    return h(DetailTableInline, {
      columns,
      tableKey,
      formData: formData.value,
      modelValue: formData.value[tableKey] || [],
      'onUpdate:modelValue': (val: any) => {
        formData.value[tableKey] = val;
      },
      class: container.props.class || 'mb-4',
    });
}

function renderSelectGroup(component: any) {
  if (!(component.props.key in formData.value)) formData.value[component.props.key] = [];
console.log('comp ',component)
      return h(FormSelectGroup, {
        class: component.props.class,
        component: component.props,
        formData,
        validationErrors,
        validateField,
      });
}

function renderContainer(container: any) {
  if (!container) return null;
console.log('comp ',container)
  // 🔥 Special handling for detailtable - render it as a component, not a container
  // 🔥 Special handling for detailtable - render it as a component, not a container
  if ((container.type || '').toLowerCase() === 'detailtable') {
    return renderDetailTable(container)
  } else 
  if ((container.type || '').toLowerCase() === 'selectgroup') {
    return renderSelectGroup(container)
  }

  let children = Array.isArray(container) ? container : container.children || [];
  return h(
    'div',
    {
      class: container.props?.class || '',
    },
    children.map((component: any) => {
      switch ((component.type || '').toLowerCase()) {
        case 'table':
          return renderTable(component);
        case 'tabs':
          return renderTabs(component);

        case 'wizard':
          return renderWizard(component);

        case 'card':
          return renderCard(component);

        case 'chart':
          return renderChart(component);

        case 'detailtable': {
      // Initialize formData for this table if not exists
      const tableKey = component.props.key;
      console.log('🔍 Rendering detailtable:', { tableKey, component });
      
      if (!(tableKey in formData.value)) {
        formData.value[tableKey] = [];
      }

      // Extract columns from component children
      let columns: any[] = [];
      if (component.children) {
        component.children.forEach((child: any) => {
          if (child.type === 'columns' && child.children) {
            columns = child.children.map((col: any) => ({
              ...col.props,
              type: col.type,
              text: col.props?.text,
              label: col.props?.label,
              key: col.props?.key,
            }));
          }
        });
      }

      console.log('🔍 Detailtable columns:', columns);

      return h(DetailTableInline, {
        columns,
        tableKey,
        formData: formData.value,
        modelValue: formData.value[tableKey],
        'onUpdate:modelValue': (val: any) => {
          formData.value[tableKey] = val;
        },
        class: component.props.class || 'mb-4',
      });
    }

        case 'master':
        case 'buttons':
        case 'tables':
        case 'columns':
        case 'search':
        case 'widget':
        case 'form':
        case 'cards':
        case 'charts':
        case 'modals':
        case 'row':
        case 'col':
          return renderContainer(component);
        case 'action':
          break;

        default:
          return renderComponent(component);
      }
    }),
  );
}

/* 🧩 Validasi semua field */
function validateAllFields() {
  let valid = true;
  if (!parsedSchema.value.components) return true;

  parsedSchema.value.components.forEach((comp: any) => {
    if (['text', 'password', 'number', 'email'].includes(comp.type)) {
      const value = formData.value[comp.key];
      const result = validateField(comp, value);
      if (!result) valid = false; // ✅ perbaikan: dibalik
    }
  });
  return valid;
}

function renderTable(component: any) {
  if (!component) return null;
  const key = component.props.key || component.props.text || `table0`;
  if (component.props.isdetail != true) {
    let columns: any;
    let searchs: any;

    function getData() {
      for (const element of component.children) {
        if (element.type === 'columns') {
          columns = element;
        } else if (element.type === 'search') {
          searchs = element;
        }
      }
    }

    getData();

    return h('div', { key: key, class: component.props.class || '' }, [
      h(TablePagination, {
        ref: tableRef,
        columns:
          columns?.children.map((col: any, i: number) => ({
            label: col.props.text || `Column ${i + 1}`,
            key: col.props.key || `col${i + 1}`,
            type: col.type || 'text',
          })) ?? [],
        searchColumn:
          searchs?.children.map((col: any, i: number) => ({
            key: col.props.key || `col${i + 1}`,
            type: col.type || 'text',
            place: col.props.place || 'search ...',
          })) ?? [],
        method: 'POST',
        endPoint: component.props.source,
        simpleSearch: false,
        class: component.props.class || 'mb-4',
        rowKey: component.props.primary,
        enableSearch: true,
        tables: tables.value,
        modals: modals.value,
        isSelectAll: component.props.isselectall || true,
        isExpand: component.props.isexpand || false,
        enableCheck: component.props.enablecheck || true,
        onSelectionChange: (selRows: any) => {
          selectedRows.value = selRows;
        },
      }),
    ]);
  }
  return null;
}

function getAction(action: string) {
  let node: any;
  parsedSchema.value.forEach((element) => {
    if (element.type == 'action') {
      node = element;
    }
  });
  const formatted = 'on' + action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();
  return node.props[formatted] || null;
}

const ReadHandler = async () => {
  const flow = getAction('read');
  if (flow) {
    const dataForm = new FormData();
    dataForm.append('flowname', flow);
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');

    const res = await Api.post('api/admin/execute-flow', dataForm);
    formData.value = {};
    if (res?.data?.data) {
      const firstRow = res?.data?.data;
      for (const key in firstRow) formData.value[key] = firstRow[key];
    }
  }
};

const CreateHandler = async () => {
  const flow = getAction('create');
  if (flow) {
    const payload = { ...toRaw(formData.value) };
    const dataForm = new FormData();
    dataForm.append('flowname', flow);
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');

    for (const key in payload) {
      const val = payload[key];
      if (val !== undefined && val !== null) {
        if (typeof val === 'object') dataForm.append(key, JSON.stringify(val));
        else dataForm.append(key, val);
      }
    }

    const res = await Api.post('api/admin/execute-flow', dataForm);
    if (res.code == 200) {
      toast.add({
        title: $t('TITLE UPDATE'),
        description: $t(res.message.replaceAll('_', ' ')),
      });
      ReadHandler();
    }
  } else {
    toast.add({ title: 'Error', description: 'Invalid Flow ' + flow, color: 'error' });
  }
};

const UpdateHandler = async () => {
  const flow = getAction('update');
  if (flow) {
    const payload = { ...toRaw(formData.value) };
    const dataForm = new FormData();
    dataForm.append('flowname', flow);
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');

    for (const key in payload) {
      const val = payload[key];
      if (val !== undefined && val !== null) {
        if (typeof val === 'object') dataForm.append(key, JSON.stringify(val));
        else dataForm.append(key, val);
      }
    }

    const res = await Api.post('api/admin/execute-flow', dataForm);
    if (res.code == 200) {
      toast.add({
        title: $t('TITLE UPDATE'),
        description: $t(res.message.replaceAll('_', ' ')),
      });
    }
  } else {
    toast.add({ title: 'Error', description: 'Invalid Flow ' + flow, color: 'error' });
  }
};

const DeleteHandler = async () => {
  const flow = getAction('purge');
  if (flow) {
    const payload = { ...toRaw(formData.value) };
    const dataForm = new FormData();
    dataForm.append('flowname', flow);
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');

    for (const key in payload) {
      const val = payload[key];
      if (val !== undefined && val !== null) {
        if (typeof val === 'object') dataForm.append(key, JSON.stringify(val));
        else dataForm.append(key, val);
      }
    }

    const res = await Api.post('api/admin/execute-flow', dataForm);
    if (res.code == 200) {
      toast.add({
        title: $t('TITLE DELETE'),
        description: $t(res.message.replaceAll('_', ' ')),
      });
      //ReadHandler()
    }
  } else {
    toast.add({ title: 'Error', description: 'Invalid Flow ' + flow, color: 'error' });
  }
};

onMounted(() => {
  ReadHandler();
});

async function saveData(key: any) {
  try {
    let flow = '';

    // Check if this is a detail modal
    const modal = modals.value.find((m: any) => m.props.key === key);
    // Determine if this is a detail modal by checking if the key contains "detail"
    const isDetailModal = modal && key.toLowerCase().includes('detail');

    console.log('saveData debug:', { key, isDetailModal, modalFound: !!modal });

    if (isDetailModal) {
      // Handle detail modal save
      let actionNode: any;
      parsedSchema.value.forEach((element: any) => {
        if (element.type == 'action') {
          actionNode = element;
        }
      });

      // Find the index of this detail modal
      // Filter modals that are actually detail modals (contain 'detail' in key)
      const detailModals = modals.value.filter((m: any) => m.props.key.toLowerCase().includes('detail'));
      const modalIndex = detailModals.findIndex((m: any) => m.props.key === key);
      
      console.log('saveData detail debug:', { modalIndex, detailModalsCount: detailModals.length });

      if (modalTitle.value == 'New Data') {
        const createFlows = actionNode?.props?.onCreateDetail || [];
        flow = createFlows[modalIndex];
      } else {
        const updateFlows = actionNode?.props?.onUpdateDetail || [];
        flow = updateFlows[modalIndex];
      }
    } else {
      // Handle master modal save (existing logic)
      if (modalTitle.value == 'New Data') {
        flow = getAction('create');
      } else {
        flow = getAction('update');
      }
    }

    // Helper to find all input keys in a modal
    function getModalFields(nodes: any[]): string[] {
      let fields: string[] = [];
      nodes.forEach((node) => {
        if (node.props?.key) {
          fields.push(node.props.key);
        }
        if (node.children) {
          fields = fields.concat(getModalFields(node.children));
        }
      });
      return fields;
    }

    const dataForm = new FormData();
    dataForm.append('flowname', flow);
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');
    
    const payload = { ...toRaw(formData.value) };
    
    // If detail modal, filter payload to only include modal fields + master ID
    if (isDetailModal && modal) {
      const modalFields = getModalFields(modal.children || []);
      const primary = getPrimary(); // Master ID key
      
      // Add Master ID if it exists
      if (primary && payload[primary]) {
        dataForm.append(primary, payload[primary]);
      }
      
      // Add only fields present in the modal
      for (const key of modalFields) {
        const val = payload[key];
        if (val !== undefined && val !== null) {
          if (typeof val === 'object') {
            dataForm.append(key, JSON.stringify(val));
          } else if (typeof val === 'boolean') {
            dataForm.append(key, val ? '1' : '0');
          } else {
            dataForm.append(key, val);
          }
        }
      }
    } else {
      // Master modal or other: send everything (existing logic)
      for (const key in payload) {
        const val = payload[key];
        if (val !== undefined && val !== null) {
          if (typeof val === 'object') {
            dataForm.append(key, JSON.stringify(val));
          } else if (typeof val === 'boolean') {
            dataForm.append(key, val ? '1' : '0');
          } else {
            dataForm.append(key, val);
          }
        }
      }
    }

    const res = await Api.post('api/admin/execute-flow', dataForm);
    if (res.code == 200) {
      toast.add({
        title: $t('TITLE UPDATE'),
        description: $t(res.message.replaceAll('_', ' ')),
      });
      tableRef.value.refreshTable();
      modalRefs[key].value = false;
    } else if (res.code == 401 && res.error == 'INVALID_TOKEN') {
      navigateTo('/login');
    }
  } catch (err) {
    console.error('Gagal simpan data:', err);
  }
}

function initModalRefs(schema: any) {
  schema.forEach((node) => {
    if (node.type === 'modals') {
      node.children.forEach((modal) => {
        const key = modal.props.key;
        if (key && !modalRefs[key]) {
          modalRefs[key] = ref(false);
        }
      });
    }
    if (node.children?.length) initModalRefs(node.children);
  });
}

watchEffect(() => {
  if (parsedSchema.value?.length) {
    initModalRefs(parsedSchema.value);
  }
});
</script>

<template>
  <component :is="renderContainer(value)" v-for="(value, index) in parsedSchema"></component>

  <div v-if="isUploading" class="mt-2 w-full bg-gray-200 h-2 rounded overflow-hidden">
    <div class="bg-green-500 h-2" :style="{ width: uploadProgress + '%' }"></div>
  </div>

  <div v-for="(value, index) in modals" :key="value.props.key">
    <UModal
    :ui="{
    wrapper: 'items-center',
    content: 'sm:max-w-none lg:max-w-none',
    // Optionally remove padding if needed
    // base: 'relative text-left rtl:text-right overflow-hidden shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6', 
  }"
      v-if="modalRefs?.[value.props.key]"
      v-model:open="modalRefs[value.props.key]"
      :title="modalTitle"
      :dismissible="false"
      :description="modalDescription"
      :scrollable="false"
    >
      <template #body>
        <component :is="renderContainer(value.children)" />
      </template>
      <template #footer>
        <div class="flex gap-2">
          <UButton class="btnSecondary" :label="$t('CLOSE')" @click="close(value.props.key)" />
          <UButton class="btnPrimary" :label="$t('SAVE')" @click="saveData(value.props.key)" />
        </div>
      </template>
    </UModal>
  </div>

  <!-- 🔹 Hidden file input -->
  <input type="file" ref="fileInput" class="hidden" @change="handleFileChange" accept=".xls,.xlsx" />
</template>

<style></style>
