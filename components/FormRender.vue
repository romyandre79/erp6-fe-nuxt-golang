<script setup lang="ts">
import { UModal, UButton, TablePagination, FormSelect, FormWizard } from '#components';
import { useToast, useApi, useI18n, toRaw, onMounted } from '#imports';
import { navigateTo } from '#app';
import { ref, reactive, computed, nextTick, shallowReactive, watch, h, resolveComponent, watchEffect } from 'vue';

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
      const res = await Api.post('admin/execute-flow', dataForm);
      if (res.code == 200) {
        const record = res.data.data;
        for (const key in record) {
          formData.value[key] = record[key];
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

function close(key: string) {
  const primary = getPrimary();
  tableRef.value.setData(primary, selectedRows.value[0][primary]);
  tableRef.value.setDataIsDetail(false);
  modalRefs[key].value = false;
  //window.location.reload(true); // TODO: next only refresh grid
}

async function deleteData(table: any) {
  const flow = getAction('purge');
  console.log('del table ', tableRef.value[table]);
  if (flow && selectedRows.value.length > 0) {
    let dataForm = new FormData();
    for (let index = 0; index < selectedRows.value.length; index++) {
      dataForm.append('flowname', flow);
      dataForm.append('menu', 'admin');
      dataForm.append('search', 'true');
      dataForm.append(parsedSchema.value.primary, selectedRows.value[index][parsedSchema.value.primary]);
      try {
        const res = await Api.post('admin/execute-flow', dataForm);
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
    dataForm.append('flowname', flow);
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');
    for (let index = 0; index < selectedRows?.length; index++) {
      dataForm.append(parsedSchema.value.primary + '[' + index + ']', selectedRows[index][parsedSchema.value.primary]);
    }
    await Api.donlotFile('/admin/execute-flow', dataForm, props.menuName + '.' + mode);
  }
}

async function downTemplate() {
  let dataForm = new FormData();

  dataForm.append('menu', props.menuName);
  await Api.donlotFile('/admin/down-template', dataForm, props.menuName + '.xlsx');
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

    const res = await Api.post('admin/execute-flow', form);

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

function renderComponent(component: any) {
  switch (component.type) {
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
    case 'label':
      return h('div', { class: 'mb-2' }, $t(component.props.text.toUpperCase()));

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
    tableObj.props.isdetail = false;
    tableObj.props.isexpand = false;
    tableUsed.value.push(key);

    if (!tableObj) {
      return h('div', `Table ${key} not found`);
    }

    return renderTable(tableObj);
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

function renderContainer(container: any) {
  if (!container) return null;

  let children = Array.isArray(container) ? container : container.children || [];
          console.log('comp type',container)
  return h(
    'div',
    {
      class: container.props?.class || '',
    },
    children.map((component: any) => {
      switch (component.type) {
        case 'table':
          return renderTable(component);
        case 'tabs':
          return renderTabs(component);

        case 'wizard':
          return renderWizard(component);
        case 'master':
        case 'buttons':
        case 'tables':
        case 'columns':
        case 'search':
        case 'widget':
        case 'form':
        case 'modals':
          return renderContainer(component);
        case 'action':
          break;

        default:
          return renderComponent(component);
      }
    }),
  );
}

function validateField(component: any, value: any) {
  if (!component.validated || !Array.isArray(component.validated)) return true;
  let message = '';

  for (const rule of component.validated) {
    const [ruleName, ruleValue] = rule.split(':');

    switch (ruleName.toLowerCase()) {
      case 'empty':
        if (value === null || value === undefined || value === '')
          message = $t(`INVALID_ENTRY_EMPTY`, { entry: component.props.ext || component.props.key });
        break;

      case 'number':
        if (value !== '' && isNaN(Number(value)))
          message = $t(`INVALID_ENTRY_NUMBER`, { entry: component.props.text || component.props.key });
        break;

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase()))
          message = $t(`INVALID_ENTRY_EMAIL`, { entry: component.props.text || component.props.key });
        break;

      // 🧩 min / max
      case 'min':
        if (value !== undefined && value !== null && value !== '') {
          if (!isNaN(Number(value))) {
            if (Number(value) < Number(ruleValue))
              message = $t(`INVALID_ENTRY_MIN`, {
                entry: component.props.text || component.props.key,
                value: ruleValue,
              });
          } else if (String(value).length < Number(ruleValue))
            message = $t(`INVALID_ENTRY_MIN_CHAR`, {
              entry: component.props.text || component.props.key,
              value: ruleValue,
            });
        }
        break;

      case 'max':
        if (value !== undefined && value !== null && value !== '') {
          if (!isNaN(Number(value))) {
            if (Number(value) > Number(ruleValue))
              message = $t(`INVALID_ENTRY_MAX`, {
                entry: component.props.text || component.props.key,
                value: ruleValue,
              });
          } else if (String(value).length < Number(ruleValue))
            message = $t(`INVALID_ENTRY_MAX_CHAR`, {
              entry: component.props.text || component.props.key,
              value: ruleValue,
            });
        }
        break;

      // 🧩 regex
      case 'regex':
        try {
          const pattern = new RegExp(ruleValue);
          if (!pattern.test(String(value || '')))
            message = $t(`INVALID_ENTRY_FORMAT`, { entry: component.props.text || component.props.key });
        } catch {
          console.warn('Invalid regex:', ruleValue);
        }
        break;

      // 🧩 match:<field> → nilai harus sama dengan field lain
      case 'match': {
        const otherField = ruleValue;
        const otherValue = formData.value[otherField];
        if (value !== otherValue)
          message = $t(`INVALID_ENTRY_MATCH`, {
            entry: component.props.text || component.props.key,
            field: otherField,
          });
        break;
      }
    }

    if (message != '') break;
  }

  validationErrors[component.props.key] = message;
  return !message;
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

    return h('div', { key: key, class: component.props.class || "" }, [
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

    const res = await Api.post('admin/execute-flow', dataForm);
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

    const res = await Api.post('admin/execute-flow', dataForm);
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

    const res = await Api.post('admin/execute-flow', dataForm);
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

    const res = await Api.post('admin/execute-flow', dataForm);
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

    if (modalTitle.value == 'New Data') {
      flow = getAction('create');
    } else {
      flow = getAction('update');
    }
    const dataForm = new FormData();
    dataForm.append('flowname', flow);
    dataForm.append('menu', 'admin');
    dataForm.append('search', 'true');
    const payload = { ...toRaw(formData.value) };
    for (const key in payload) {
      const val = payload[key];
      if (val !== undefined && val !== null) {
        if (typeof val === 'object') {
          dataForm.append(key, JSON.stringify(val));
        } else if (typeof val === 'boolean') {
          // 🟢 ubah boolean ke 1 / 0 agar MySQL bisa terima
          dataForm.append(key, val ? 1 : 0);
        } else {
          dataForm.append(key, val);
        }
      }
    }
    const res = await Api.post('admin/execute-flow', dataForm);
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
      fullscreen
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
