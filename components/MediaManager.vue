<template>
  <div class="p-4 shadow-md">
    <!-- 🧭 Toolbar -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2 cursor-pointer">
        <button @click="navigateUp" class="px-2 py-1 bg-gray-200">⬆</button>
        <span class="text-sm italic">Path: {{ currentPath || '/' }}</span>
      </div>
      <div class="space-x-2">
        <input type="file" ref="fileInput" class="hidden" @change="handleUpload" />
        <button class="btn" @click="() => fileInput.click()">📤 Upload</button>
        <button class="btn" @click="promptCreateFolder">📁 New Folder</button>
        <button class="btn" @click="loadMedia(currentPath)">🔄 Refresh</button>
      </div>
    </div>

    <!-- 📂 File list -->
    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else class="grid grid-cols-6 gap-4">
      <div
        v-for="item in files"
        :key="item.path"
        @dblclick="item.type === 'folder' ? openFolder(item.path) : previewFile(item)"
        class="flex flex-col items-center p-2 hover:bg-gray-100 cursor-pointer"
      >
        <div class="text-5xl">
          <span v-if="item.type == 'folder'">📁</span>
          <span v-else-if="item.type?.startsWith('image')">🖼️</span>
          <span v-else>📄</span>
        </div>
        <span class="text-xs text-center truncate w-full mt-1">{{ item.name }}</span>
        <div class="flex space-x-1 mt-1 text-xs text-gray-500">
          <button @click.stop="rename(item)">✏️</button>
          <button @click.stop="deleteFile(item)">🗑️</button>
        </div>
      </div>
    </div>

    <!-- 📄 Preview Modal -->
    <div
      v-if="preview"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      @click.self="preview = null"
    >
      <div class="p-4 rounded-lg w-3/4 h-3/4 overflow-auto relative">
        <button @click="preview = null" class="absolute top-2 right-2 text-xl">✖</button>
        <h3 class="font-semibold mb-2">{{ preview.name }}</h3>
        <div v-if="isImage(preview.ext)">
          <img :src="preview.content" class="max-w-full max-h-[70vh] mx-auto" />
        </div>
        <pre v-else class="text-sm whitespace-pre-wrap">{{ preview.content }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useApi } from '#imports';
import { useMediaManager } from '~/composables/useMediaManager';

const { files, currentPath, loading, loadMedia, uploadFile, deleteFile, renameFile, createFolder } = useMediaManager();
const fileInput = ref<HTMLInputElement | null>(null);
const preview = ref<any>(null);
const Api = useApi();

onMounted(() => loadMedia());

function openFolder(path: string) {
  loadMedia(path);
}

function navigateUp() {
  if (!currentPath.value) return;
  const up = currentPath.value.split('/').slice(0, -1).join('/');
  loadMedia(up);
}

function handleUpload(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) uploadFile(file);
  if (fileInput.value) fileInput.value.value = '';
}

async function rename(item: any) {
  const newName = prompt('Rename to:', item.name);
  if (newName && newName !== item.name) {
    await renameFile(item.path, newName);
  }
}

async function promptCreateFolder() {
  const name = prompt('Folder name:');
  if (name) await createFolder(name);
}

async function previewFile(item: any) {
  const res = await Api.get(`/media/preview?path=${encodeURIComponent(item.path)}`);
  preview.value = res;
}

function isImage(ext: string) {
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
}
</script>
