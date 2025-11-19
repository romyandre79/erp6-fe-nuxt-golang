import { ref } from 'vue';

export function useMediaManager() {
  const files = ref<any[]>([]);
  const currentPath = ref('');
  const loading = ref(false);
  const Api = useApi();

  const baseUrl = '/media';

  async function loadMedia(path = '') {
    loading.value = true;
    try {
      const res = await Api.get(`${baseUrl}?path=${encodeURIComponent(path)}`);
      files.value = Array.isArray(res) ? res : [];
      currentPath.value = path;
    } catch (err) {
      console.error('Failed to load media', err);
    } finally {
      loading.value = false;
    }
  }

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', currentPath.value);
    await Api.post(`${baseUrl}/upload`, formData);
    await loadMedia(currentPath.value);
  }

  async function deleteFile(item: any) {
    if (!confirm(`Delete "${item.name}"?`)) return;
    await Api.del(`${baseUrl}/delete?path=${encodeURIComponent(item.path)}`);
    await loadMedia(currentPath.value);
  }

  async function renameFile(oldPath: string, newName: string) {
    await Api.post(`${baseUrl}/rename`, JSON.stringify({ oldPath, newName }));
    await loadMedia(currentPath.value);
  }

  async function createFolder(folderName: string) {
    await Api.post(`${baseUrl}/folder`, { path: currentPath.value, folder: folderName });
    await loadMedia(currentPath.value);
  }

  return {
    files,
    currentPath,
    loading,
    loadMedia,
    uploadFile,
    deleteFile,
    renameFile,
    createFolder,
  };
}
