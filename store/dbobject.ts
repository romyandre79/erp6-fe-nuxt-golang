// stores/workflow.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '../composables/useApi';

export interface Dbobject {
  dbobjectid: string;
  objectname?: string;
  dbobjecttypeid?: string;
  objectcontent?: string;
  objectversion?: string;
  ispublished?: number;
  comment?: string;
}

export interface Dbobjecttype {
  dbobjecttypeid: string;
  objecttypename?: string;
}

export const useDbobjectStore = defineStore('dbobject', () => {
  const dbobjects = ref<Dbobject[]>([]);
  const dbobject = ref<Dbobject>({
    dbobjectid: '',
    objectname: '',
    dbobjecttypeid: '',
    objectcontent: '',
    objectversion: '',
    ispublished: 0,
    comment: '',
  });
  const loading = ref(false);

  // assume you have a global api helper exposed e.g. useApi() or $api in NuxtApp
  const api = useApi();

  async function fetchAll() {
    loading.value = true;
    try {
      let dataForm = new FormData();
      dataForm.append('flowname', 'searchcombodbobjecttype');
      dataForm.append('menu', 'admin');
      dataForm.append('search', 'true');

      let res = await api.post('/admin/execute-flow', dataForm);
      dbobjects.value = res?.data?.data ?? {};

      dataForm = new FormData();
      dataForm.append('flowname', 'searchdbobject');
      dataForm.append('menu', 'admin');
      dataForm.append('search', 'true');

      res = await api.post('/admin/execute-flow', dataForm);
      dbobjects.value = res?.data?.data ?? {};

    } finally {
      loading.value = false;
    }
  }

  async function fetch(id: any) {
    loading.value = true;
    try {
      const dataForm = new FormData();
      dataForm.append('flowname', 'getdbobject');
      dataForm.append('menu', 'admin');
      dataForm.append('search', 'true');
      dataForm.append('dbobjectid', id);

      const res = await api.post('/admin/execute-flow', dataForm);
      dbobject.value = res?.data?.data ?? {};

    } finally {
      loading.value = false;
    }
  }

  async function saveTable(dbobject: Dbobject) {
    try {
      const dataForm = new FormData();
      dataForm.append('flowname', 'modifdbobject');
      dataForm.append('menu', 'admin');
      dataForm.append('search', 'true');
      dataForm.append('dbobjectid', dbobject.dbobjectid);
      dataForm.append('objectname', dbobject.objectname);
      dataForm.append('dbobjecttypeid', dbobject.dbobjecttypeid);
      dataForm.append('objectcontent', dbobject.objectcontent);
      dataForm.append('ispublished', dbobject.ispublished);
      dataForm.append('comment', dbobject.comment);

      await api.post('/admin/execute-flow', dataForm);

    } finally {
      loading.value = false;
    }
  }

  async function purgeTable(id: string) {
    try {
      const dataForm = new FormData();
      dataForm.append('flowname', 'purgedbobject');
      dataForm.append('menu', 'admin');
      dataForm.append('search', 'true');
      dataForm.append('dbobjectid', id);

      await api.post('/admin/execute-flow', dataForm);

    } finally {
      loading.value = false;
    }
  }

  return {
    fetchAll,
    fetch,
    saveTable,
    purgeTable,
    dbobject,
    dbobjects,
    loading,
  };
});
