<template>
  <div class="w-full max-w-2xl mx-auto p-6 border rounded-lg shadow bg-white">
    <!-- PROGRESS BAR -->
    <div class="w-full bg-gray-200 h-2 rounded mb-6">
      <div class="h-2 bg-blue-600 rounded transition-all" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <!-- STEP INDICATOR -->
    <div class="flex justify-between mb-6">
      <div v-for="(step, i) in steps" :key="i" class="text-center flex-1">
        <div
          class="w-10 h-10 mx-auto flex items-center justify-center rounded-full border font-bold transition"
          :class="i === currentStep ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-400 text-gray-500'"
        >
          {{ i + 1 }}
        </div>
        <p class="text-xs mt-1">{{ step.title }}</p>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="mb-6">
      <slot :step="currentStep" />
    </div>

    <!-- ERROR -->
    <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>

    <!-- NAVIGATION BUTTONS -->
    <div class="flex justify-between">
      <button class="px-4 py-2 bg-gray-300 rounded" :disabled="currentStep === 0" @click="prev">Back</button>

      <button v-if="currentStep < steps.length - 1" class="px-4 py-2 bg-blue-600 text-white rounded" @click="next">
        Next
      </button>

      <button v-else class="px-4 py-2 bg-green-600 text-white rounded" @click="finish">Finish</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  steps: { type: Array, required: true },
  validateStep: { type: Function, default: () => true },
});

const emit = defineEmits(['finish', 'changeStep']);

const currentStep = ref(0);
const error = ref(null);

/* -------------------
   NAVIGATION
------------------- */
async function next() {
  error.value = null;
  const isValid = await props.validateStep(currentStep.value);
  if (!isValid) {
    error.value = 'Please complete all required fields.';
    return;
  }
  currentStep.value++;
  emit('changeStep', currentStep.value);
}

function prev() {
  error.value = null;
  currentStep.value--;
  emit('changeStep', currentStep.value);
}

async function finish() {
  error.value = null;
  const isValid = await props.validateStep(currentStep.value);
  if (!isValid) {
    error.value = 'Please complete all required fields.';
    return;
  }
  emit('finish');
}

/* -------------------
   PROGRESS
------------------- */
const progressPercent = computed(() => {
  if (props.steps.length <= 1) return 100;
  return (currentStep.value / (props.steps.length - 1)) * 100;
});
</script>
