<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'

definePageMeta({
  layout: 'auth'
})

const devices = ref([])
const isLoading = ref(false)
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
  } catch (e) {
    console.error('Failed to fetch devices', e)
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

// Watcher removed as manual generation is used



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
</script>

<template>
  <div class="min-h-screen bg-base-200 p-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold">WhatsApp Devices</h1>
          <p class="text-base-content/70">Manage your connected WhatsApp accounts</p>
        </div>
        <button @click="openAddDeviceModal" class="btn btn-primary">
          <Icon name="heroicons:plus-circle" class="w-5 h-5 mr-2" />
          Add Device
        </button>
      </div>

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
        <div v-for="device in devices" :key="device.phonenumber" class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex items-start justify-between">
              <div class="avatar placeholder">
                <div class="bg-neutral text-neutral-content rounded-full w-12 h-12">
                  <Icon name="logos:whatsapp-icon" class="w-8 h-8" />
                </div>
              </div>
              <div class="badge" :class="device.Status === 'Connected' ? 'badge-success' : 'badge-error'">
                {{ device.Status }}
              </div>
            </div>
            
            <h2 class="card-title mt-4">
              {{ device.Nickname || device.Phonenumber }}
            </h2>
            <p class="text-sm font-mono opacity-70">{{ device.Phonenumber }}</p>
            <p class="text-xs text-base-content/50 mt-2">
              Last active: {{ new Date(device.Lastactive).toLocaleString() }}
            </p>

            <div class="card-actions justify-end mt-6">
              <button @click="disconnectDevice(device.Phonenumber)" class="btn btn-error btn-sm btn-outline">
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- QR Modal -->
    <UModal v-model="showModal">
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
