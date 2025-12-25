<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <h1 class="text-2xl font-bold mb-4">System Information</h1>

    <!-- Tabs -->
    <div class="flex space-x-4 border-b border-gray-300 dark:border-gray-700 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['px-4 py-2 border-b-2 transition-colors', activeTab === tab.id ? 'border-primary text-primary font-semibold' : 'border-transparent hover:border-gray-400']"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="error" class="bg-red-100 text-red-700 p-4 rounded mb-4">
      Error fetching stats: {{ error }}
    </div>
    
    <!-- Debug: Show raw stats if empty -->
    <pre v-if="!error && !stats.host" class="text-xs bg-gray-100 p-2 rounded">
      No Data Received. Raw Stats: {{ stats }}
    </pre>

    <!-- Dashboard Tab -->
    <div v-if="activeTab === 'dashboard' && stats.host" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">

      <!-- Host Info -->
      <div class="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-3 border-b pb-2">Host Info</h2>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <span class="font-medium text-gray-500">Hostname:</span> <span>{{ stats.host?.hostname }}</span>
          <span class="font-medium text-gray-500">OS:</span> <span>{{ stats.host?.os }} {{ stats.host?.platform }}</span>
          <span class="font-medium text-gray-500">Architecture:</span> <span>{{ stats.host?.kernelArch }}</span>
          <span class="font-medium text-gray-500">Uptime:</span> <span>{{ formatUptime(stats.host?.uptime) }}</span>
          <span class="font-medium text-gray-500">Processes:</span> <span>{{ stats.host?.procs }}</span>
        </div>
      </div>

      <!-- CPU -->
      <div class="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-3 border-b pb-2">CPU <small class="text-xs font-normal text-gray-500">{{ stats.cpu?.model }}</small></h2>
        <div class="mb-4">
           <div class="flex justify-between mb-1 text-sm font-medium"><span>Total Load</span> <span>{{ avgCpu.toFixed(1) }}%</span></div>
           <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-500" :style="{ width: `${avgCpu}%` }"></div>
          </div>
        </div>
        <div class="grid grid-cols-4 gap-2 text-xs">
          <div v-for="(core, idx) in stats.cpu?.percent" :key="idx" class="text-center">
            <div class="h-16 bg-gray-100 dark:bg-gray-800 rounded relative flex items-end justify-center overflow-hidden">
                <div class="w-full bg-blue-500 transition-all duration-500" :style="{ height: `${core}%` }"></div>
            </div>
            <span class="mt-1 block">Core {{ idx + 1 }}</span>
          </div>
        </div>
      </div>

      <!-- Memory -->
      <div class="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-3 border-b pb-2">Memory</h2>
        <div class="flex items-center justify-center mb-4">
           <div class="relative w-32 h-32 rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center">
              <!-- Simple donut visual hack or use a library, sticking to basic for now, maybe conic-gradient -->
              <div class="absolute inset-0 rounded-full border-8 border-green-500" :style="{ clipPath: `polygon(0 0, 100% 0, 100% ${stats.memory?.usedPercent}%, 0 ${stats.memory?.usedPercent}%)` }"></div> <!-- This is a rough approx, usually needs SVG -->
              <!-- Better: use conic gradient style -->
               <div class="absolute inset-0 rounded-full" :style="{ background: `conic-gradient(#10B981 ${stats.memory?.usedPercent * 3.6}deg, transparent 0)` }"></div>
                <!-- Inner circle to make it a donut -->
               <div class="absolute inset-2 bg-white dark:bg-gray-900 rounded-full flex flex-col items-center justify-center text-sm">
                  <span class="font-bold text-lg">{{ stats.memory?.usedPercent?.toFixed(1) }}%</span>
                  <span class="text-xs text-gray-500">Used</span>
               </div>
           </div>
        </div>
        <div class="text-sm grid grid-cols-2 gap-2">
           <span class="font-medium text-gray-500">Total:</span> <span>{{ formatBytes(stats.memory?.total) }}</span>
           <span class="font-medium text-gray-500">Used:</span> <span>{{ formatBytes(stats.memory?.used) }}</span>
           <span class="font-medium text-gray-500">Free:</span> <span>{{ formatBytes(stats.memory?.free) }}</span>
        </div>
      </div>

      <!-- Disk -->
      <div class="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-3 border-b pb-2">Disk ({{ stats.disk?.path }})</h2>
        <div class="mb-2">
           <div class="flex justify-between mb-1 text-sm font-medium"><span>Used</span> <span>{{ stats.disk?.usedPercent.toFixed(1) }}%</span></div>
           <div class="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
            <div class="bg-orange-500 h-4 rounded-full transition-all duration-500" :style="{ width: `${stats.disk?.usedPercent}%` }"></div>
          </div>
        </div>
        <div class="text-sm flex justify-between mt-2">
           <span>Total: {{ formatBytes(stats.disk?.total) }}</span>
           <span>Free: {{ formatBytes(stats.disk?.free) }}</span>
        </div>
      </div>
    </div>

    <!-- Processes Tab -->
    <div v-if="activeTab === 'processes'" class="animate-fade-in">
        <div class="flex justify-between mb-4">
            <input v-model="procSearch" type="text" placeholder="Search process..." class="border p-2 rounded w-64 dark:bg-gray-800 dark:border-gray-700" />
            <button @click="fetchProcesses" class="btn bg-blue-600 text-white hover:bg-blue-700">Refresh</button>
        </div>
        <div class="overflow-x-auto bg-white dark:bg-gray-900 rounded shadow">
            <table class="w-full text-left text-sm">
                <thead class="bg-gray-100 dark:bg-gray-800 uppercase text-xs">
                    <tr>
                        <th class="p-3 cursor-pointer" @click="sortProc('pid')">PID</th>
                        <th class="p-3 cursor-pointer" @click="sortProc('name')">Name</th>
                        <th class="p-3">User</th>
                        <th class="p-3 cursor-pointer" @click="sortProc('cpu')">CPU%</th>
                        <th class="p-3 cursor-pointer" @click="sortProc('mem')">Mem%</th>
                        <th class="p-3">Status</th>
                        <th class="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in filteredProcs" :key="p.pid" class="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td class="p-3 font-mono">{{ p.pid }}</td>
                        <td class="p-3 font-medium">{{ p.name }}</td>
                        <td class="p-3">{{ p.user }}</td>
                        <td class="p-3">{{ p.cpu.toFixed(1) }}%</td>
                        <td class="p-3">{{ p.mem.toFixed(1) }}%</td>
                        <td class="p-3 text-xs">
                           <span :class="{'text-green-500': p.status==='R', 'text-yellow-500': p.status==='S', 'text-red-500': p.status==='Z'}">{{ p.status }}</span>
                        </td>
                        <td class="p-3">
                            <button @click="killProc(p.pid)" class="text-red-600 hover:text-red-800 text-xs border border-red-200 px-2 py-1 rounded">Kill</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useApi } from '#imports';

definePageMeta({
  layout: 'auth',
});

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'processes', label: 'Running Processes' },
];
const activeTab = ref('dashboard');
const Api = useApi();

// Stats Data
const stats = ref<any>({});
const error = ref<string>('');
let statsInterval: any = null;

// Process Data
const processes = ref<any[]>([]);
const procSearch = ref('');
const procSortOrder = ref({ col: 'cpu', desc: true });

async function fetchStats() {
    if (activeTab.value !== 'dashboard') return;
    try {
        const res = await Api.get('/api/admin/sysinfo/stats');
        console.log('Stats response:', res);
        stats.value = res;
        error.value = '';
    } catch (e: any) { 
        console.error('Stats error:', e); 
        error.value = `${e.message || 'Unknown Error'} - Check console for details`;
    }
}

const avgCpu = computed(() => {
    if (!stats.value.cpu?.percent) return 0;
    const total = stats.value.cpu.percent.reduce((a:number, b:number) => a+b, 0);
    return total / stats.value.cpu.percent.length;
});

// Process Logic
async function fetchProcesses() {
    try {
        const res = await Api.get('/api/admin/sysinfo/processes');
        if (Array.isArray(res)) processes.value = res;
    } catch (e) { console.error(e); }
}

async function killProc(pid: number) {
    if (!confirm(`Are you sure you want to kill process ${pid}?`)) return;
    try {
        await Api.post(`/api/admin/sysinfo/processes/${pid}/kill`);
        fetchProcesses();
    } catch(e: any) { alert('Failed to kill: ' + e.message); }
}

const filteredProcs = computed(() => {
    let ps = processes.value.filter(p => !procSearch.value || p.name.toLowerCase().includes(procSearch.value.toLowerCase()) || String(p.pid).includes(procSearch.value));
    
    const col = procSortOrder.value.col;
    const desc = procSortOrder.value.desc ? -1 : 1;
    
    ps.sort((a,b) => {
        if (a[col] > b[col]) return 1 * desc;
        if (a[col] < b[col]) return -1 * desc;
        return 0;
    });
    return ps;
});

function sortProc(col: string) {
    if (procSortOrder.value.col === col) {
        procSortOrder.value.desc = !procSortOrder.value.desc;
    } else {
        procSortOrder.value.col = col;
        procSortOrder.value.desc = true;
    }
}

// Formatters
function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatUptime(seconds: number) {
    if (!seconds) return '0s';
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    return `${d}d ${h}h ${m}m`;
}

// Lifecycle
onMounted(() => {
    fetchStats();
    statsInterval = setInterval(fetchStats, 3000); // Poll stats every 3s
});

onUnmounted(() => {
    if (statsInterval) clearInterval(statsInterval);
});

// Watch tab change to fetch processes if needed
import { watch } from 'vue';
watch(activeTab, (newTab) => {
    if (newTab === 'processes') fetchProcesses();
    if (newTab === 'dashboard') fetchStats();
});

</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
