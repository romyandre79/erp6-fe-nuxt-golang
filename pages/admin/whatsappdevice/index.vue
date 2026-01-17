<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'

definePageMeta({
  layout: 'auth',
  middleware: ['auth']
})

const devices = ref([])
const sessions = ref([])
const logs = ref([])
const isLoading = ref(false)
const activeTab = ref('devices')
const qrText = ref('')
const qrCode = ref('') // Now a simple ref
const showModal = ref(false)
const config = useRuntimeConfig()
const apiBase = config.public.apiBase || 'http://localhost:8888'

const fetchDevices = async () => {
  isLoading.value = true
  try {
    const { data, error } = await useFetch(`${apiBase}/api/whatsapp/devices`)
    if (data.value) {
      devices.value = data.value
    }
    
    // Fetch Sessions separately
    const { data: sessionData } = await useFetch(`${apiBase}/api/whatsapp/sessions`)
    if (sessionData.value) {
      sessions.value = sessionData.value
    }

    // Fetch Logs
    const { data: logData } = await useFetch(`${apiBase}/api/whatsapp/logs`)
    if (logData.value) {
      logs.value = logData.value
    }
  } catch (e) {
    console.error('Failed to fetch data', e)
  } finally {
    isLoading.value = false
  }
}

const openAddDeviceModal = async () => {
  console.log('Opening modal...')
  qrText.value = 'Loading...'
  qrCode.value = '' // Reset previous QR
  showModal.value = true
  
  try {
    console.log('Fetching QR...')
    const { data, error } = await useFetch(`${apiBase}/api/whatsapp/qr`)
    if (error.value) {
      console.error('Error fetching QR:', error.value)
      qrText.value = 'Error loading QR'
      return
    }
    
    if (data.value && data.value.qr) {
      console.log('QR Value received:', data.value.qr)
      qrText.value = data.value.qr
      // Generate QR Manually
      try {
        qrCode.value = await QRCode.toDataURL(data.value.qr)
        console.log('QR Image generated successfully')
      } catch (qrErr) {
        console.error('Failed to generate QR image:', qrErr)
        qrText.value = 'Failed to generate QR image'
      }
    } else {
      console.warn('No QR in response:', data.value)
      qrText.value = 'Failed to load QR'
    }
  } catch (e) {
    console.error('Exception fetching QR:', e)
    qrText.value = 'Error loading QR'
  }
}

const closeModal = () => {
  showModal.value = false
  qrText.value = ''
  qrCode.value = ''
  fetchDevices() // Refresh list on close
}

const disconnectDevice = async (phone: string) => {
  if (!confirm(`Are you sure you want to disconnect ${phone}?`)) return

  try {
    await useFetch(`${apiBase}/api/whatsapp/device/${phone}`, {
      method: 'DELETE'
    })
    fetchDevices()
  } catch (e) {
    alert('Failed to disconnect')
  }
}

onMounted(() => {
  fetchDevices()
})

const items = [
  {
    label: 'Devices',
    icon: 'i-heroicons-device-phone-mobile',
    slot: 'devices'
  },
  {
    label: 'Sessions',
    icon: 'i-heroicons-briefcase',
    slot: 'sessions'
  },
  {
    label: 'Logs',
    icon: 'i-heroicons-document',
    slot: 'logs'
  }
]
</script>

<template>
  <div class="min-h-screen bg-base-200 p-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1>WhatsApp Devices</h1>
          <p class="text-base-content/70">Manage your connected WhatsApp accounts</p>
        </div>
        <button @click="openAddDeviceModal" class="btn btn-primary">
          <Icon name="heroicons:plus-circle" class="w-5 h-5 mr-2" />
          Add Device
        </button>
      </div>

      <!-- TABS NAVIGATION -->
      <UTabs :items="items">
        <template #devices>
          <div v-if="isLoading && devices.length === 0" class="flex justify-center p-12">
          <span class="loading loading-spinner loading-lg"></span>
        </div>

        <div v-else-if="devices.length === 0" class="card bg-base-100 shadow-xl">
          <div class="card-body text-center py-12">
            <Icon name="heroicons:device-phone-mobile" class="w-16 h-16 mx-auto text-base-content/30" />
            <h3 class="mt-4 text-lg font-semibold">No devices connected</h3>
            <p class="mb-6">Link a WhatsApp account to get started</p>
            <button @click="openAddDeviceModal" class="btn btn-primary btn-outline mx-auto">
              Connect First Device
            </button>
          </div>
        </div>

        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <UCard v-for="device in devices" :key="device.phonenumber" class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <div class="flex items-start justify-between">
                <div class="avatar placeholder">
                  <div class="bg-neutral text-neutral-content rounded-full w-12 h-12">
                    <Icon name="logos:whatsapp-icon" class="w-8 h-8" />
                  </div>
                </div>
                <div class="badge" :class="device.Status === 'Connected' ? 'badge-success' : 'badge-error'">
                  {{ device.status }}
                </div>
              </div>
              
              <h2 class="card-title mt-4">
                Nickname / Phone: {{ device.nickname || device.phonenumber }}
              </h2>
              <p class="mt-2">
                Last active: {{ new Date(device.lastactive).toLocaleString() }}
              </p>

              <div class="card-actions justify-end mt-6">
                <button @click="disconnectDevice(device.phonenumber)" class="btn btn-error btn-sm btn-outline">
                  Disconnect
                </button>
              </div>
            </div>
          </UCard>
        </div>
        </template>

        <template #sessions>
<div class="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table class="table w-full">
            <thead>
              <tr>
                <th>JID</th>
                <th>Registration ID</th>
                <th>Platform</th>
                <th>ADV</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="session in sessions" :key="session.jid">
                <td class="font-mono text-sm">{{ session.jid }}</td>
                <td>{{ session.registration_id }}</td>
                <td>{{ session.platform || 'Unknown' }}</td>
                <td>
                  <span v-if="session.has_adv" class="badge badge-success badge-sm">Yes</span>
                  <span v-else class="badge badge-ghost badge-sm">No</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </template>

        <template #logs>
        <div class="flex justify-between items-center mb-4">
           <h3 class="font-bold">Message History</h3>
           <button @click="fetchDevices" class="btn btn-sm btn-ghost">
             <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-1" /> Refresh
           </button>
        </div>
        <div class="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table class="table w-full">
            <thead>
              <tr>
                <th>Time</th>
                <th>Direction</th>
                <th>From</th>
                <th>To</th>
                <th>Message</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in logs" :key="log.id">
                <td class="text-xs">{{ new Date(log.created_at).toLocaleString() }}</td>
                <td>
                  <span class="badge badge-sm" :class="log.direction === 'incoming' ? 'badge-info' : 'badge-warning'">
                    {{ log.direction }}
                  </span>
                </td>
                <td class="text-xs font-mono">{{ log.sender }}</td>
                <td class="text-xs font-mono">{{ log.recipient }}</td>
                <td class="max-w-xs" :title="log.content">
                  <div v-if="log.type === 'image'">
                    <a v-if="log.content.startsWith('/uploads')" :href="apiBase + log.content" target="_blank">
                      <img :src="apiBase + log.content" class="w-24 h-24 object-cover rounded shadow-sm hover:opacity-80 transition-opacity" alt="Image" />
                    </a>
                    <span v-else class="italic text-base-content/50">{{ log.content }}</span>
                    <div v-if="log.caption" class="text-xs mt-1 text-base-content/70 italic">{{ log.caption }}</div>
                  </div>
                   <div v-else-if="log.type === 'document'">
                    <a v-if="log.content.startsWith('/uploads')" :href="apiBase + log.content" target="_blank" class="flex items-center gap-2 p-2 bg-base-200 rounded hover:bg-base-300">
                      <Icon name="heroicons:document-text" class="w-5 h-5" />
                      <span class="text-xs truncate max-w-[150px]">View Document</span>
                    </a>
                    <span v-else>{{ log.content }}</span>
                    <div v-if="log.caption" class="text-xs mt-1 text-base-content/70 italic">{{ log.caption }}</div>
                  </div>
                  <div v-else>
                    {{ log.content }}
                  </div>
                </td>
                <td>{{ log.status }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="logs.length === 0" class="p-8 text-center text-base-content/50">
            No logs found
          </div>
        </div>
        </template>
      </UTabs>
    </div>

    <!-- QR Modal -->
    <UModal v-if="showModal" v-model="showModal">
      <div class="p-6 text-center">
        <h3 class="font-bold text-lg mb-4">Scan QR Code</h3>
        
        <div v-if="qrText === 'Loading...'" class="py-8">
           <span class="loading loading-spinner loading-lg"></span>
        </div>
        <div v-else-if="qrText && qrText.startsWith('2@') || qrText.startsWith('1@')" class="flex justify-center my-4">
           <!-- Manual QR check: startsWith 1@ or 2@ are typical WA QR beginnings -->
          <img :src="qrCode" alt="WA QR Code" class="border p-2 rounded-lg shadow-sm" />
          <div class="hidden">{{ qrCode }}</div> 
        </div>
        <div v-else-if="qrCode" class="flex justify-center my-4">
           <img :src="qrCode" alt="WA QR Code" class="border p-2 rounded-lg shadow-sm" />
        </div>
         <div v-else class="text-error py-4">
          {{ qrText }}
        </div>

        <p class="text-sm mt-4 text-base-content/70">
          Open WhatsApp on your phone > Menu > Linked Devices > Link a Device
        </p>

        <div class="mt-6 flex justify-center">
          <button class="btn" @click="closeModal">Close</button>
        </div>
      </div>
    </UModal>
  </div>
</template>
