<script setup lang="ts">
import { ref } from 'vue'
import { useNotificationStore } from '~/store/notification'

const store = useNotificationStore()
const loading = ref(false)
const showModal = ref(false)

const form = ref({
  receiverid: 0,
  title: '',
  message: '',
  docno: ''
})

const props = defineProps<{
    users?: any[] // Pass users list or fetch inside
}>()

// If users not passed, might need to fetch. For now assume passed or we use a simple input for ID
// In real app, use a Select with user search.

const send = async () => {
  if (!form.value.receiverid || !form.value.message) return
  
  loading.value = true
  try {
    await store.sendMessage(form.value.receiverid, form.value.title || 'Message', form.value.message, form.value.docno)
    showModal.value = false
    form.value = { receiverid: 0, title: '', message: '', docno: '' }
    // Toast success
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <button @click="showModal = true" class="btn btn-primary btn-sm gap-2">
      <i class="fa fa-envelope"></i>
      Send Message
    </button>

    <UModal v-model="showModal">
      <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <h3 class="text-lg font-bold mb-4">Send Message</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Receiver ID</label>
            <input v-model.number="form.receiverid" type="number" class="input input-bordered w-full" placeholder="User ID" />
          </div>

          <div>
             <label class="block text-sm font-medium mb-1">Title</label>
             <input v-model="form.title" type="text" class="input input-bordered w-full" placeholder="Subject" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Message</label>
            <textarea v-model="form.message" class="textarea textarea-bordered w-full" rows="3" placeholder="Type your message..."></textarea>
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button @click="showModal = false" class="btn btn-ghost">Cancel</button>
            <button @click="send" :disabled="loading" class="btn btn-primary">
              {{ loading ? 'Sending...' : 'Send' }}
            </button>
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>
