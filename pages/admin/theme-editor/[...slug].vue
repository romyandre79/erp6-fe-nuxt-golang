<template>
  <div class="flex h-full">
    <!-- LEFT: CATEGORY LIST -->
    <aside class="w-120 border-r p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
      <h1 class="font-bold text-lg mb-2">Theme Builder - {{ route.params.slug[0] || '' }}</h1>

      <!-- Theme select & actions -->
      <div class="space-y-2">
        <div class="flex gap-2 mt-2">
          <button class="py-2 px-3 bg-primary-600 text-white rounded" @click="applyTheme">Save</button>
          <button class="px-3 py-2 border rounded" @click="resetToDefault">Reset</button>
        </div>

        <!-- <div class="flex gap-2 mt-2">
          <button class="flex-1 px-3 py-2 border rounded" @click="downloadJSON">Export</button>
          <label class="flex-1 px-3 py-2 border rounded text-center cursor-pointer">
            Import
            <input type="file" accept="application/json" ref="fileInput" class="hidden" @change="importJSON" />
          </label>
        </div> -->
      </div>

      <!-- Category list -->
      <div>
        <h3 class="mt-4 font-semibold">Categories</h3>
        <ul class="mt-2 space-y-1">
          <li
            v-for="cat in categories"
            :key="cat.key"
            @click="selectCategory(cat.key)"
            :class="[
              'cursor-pointer px-3 py-2 rounded',
              selectedCategory === cat.key ? 'bg-primary-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-800',
            ]"
          >
            {{ cat.label }}
          </li>
        </ul>
      </div>
      <div>
        <h3 class="font-semibold mb-3">Properties <span class="text-sm text-gray-500">(edit values below)</span></h3>

        <div v-if="currentProps.length === 0" class="text-sm text-gray-500">Select a category to edit.</div>

        <div
          v-for="prop in currentProps"
          :key="prop.key"
          class="border rounded p-3 mb-3 flex items-center justify-between gap-4"
        >
          <div class="min-w-0">
            <div class="font-medium truncate">{{ prop.label }}</div>
            <div class="text-xs text-gray-500 truncate">{{ prop.key }}</div>
          </div>

          <div class="flex items-center gap-3">
            <input
              v-if="prop.type === 'color'"
              type="color"
              v-model="themeState[prop.key]"
              @input="onChange(prop.key, $event.target.value)"
              class="w-10 h-10 p-0 border rounded"
            />
            <input
              v-else-if="prop.type === 'number'"
              type="number"
              v-model="themeState[prop.key]"
              @input="onChange(prop.key, $event.target.value)"
              class="border px-2 py-1 rounded w-28"
            />
            <input
              v-else
              type="text"
              v-model="themeState[prop.key]"
              @input="onChange(prop.key, $event.target.value)"
              class="border px-2 py-1 rounded w-44"
            />
          </div>
        </div>

        <!-- add custom property -->
        <div class="mt-4 border-t pt-4">
          <h4 class="font-semibold mb-2">Add custom property</h4>
          <div class="flex gap-2">
            <input v-model="newKey" placeholder="property-key" class="border px-2 py-1 rounded w-48" />
            <input v-model="newValue" placeholder="value" class="border px-2 py-1 rounded w-32" />
            <button class="px-3 py-1 bg-green-600 text-white rounded" @click="addCustom">Add</button>
          </div>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">CSS Output</label>
        <textarea readonly class="w-full h-40 font-mono text-xs p-2 border rounded" :value="cssText"></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">JSON</label>
        <textarea readonly class="w-full h-40 font-mono text-xs p-2 border rounded" :value="jsonText"></textarea>
      </div>
    </aside>

    <!-- RIGHT: PROPERTY EDITOR + PREVIEW -->
    <section class="flex-1 p-6 overflow-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- PROPERTY EDITOR -->

        <!-- LIVE PREVIEW -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h1 class="font-bold text-lg">Live Preview</h1>
          </div>

            <h1 :style="h1Style">Header H1</h1>
            <h2 :style="h2Style">Header H2</h2>
            <p :style="pStyle">
              Paragraph
            </p>

            <div class="mt-4 flex gap-2">
              <button class="px-3 py-1 rounded" :style="btnPrimaryStyle">Primary</button>
              <button class="px-3 py-1 rounded" :style="btnSecondaryStyle">Secondary</button>
            </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useThemeStore } from '~/store/theme';

// integrate with Pinia theme store
const store = useThemeStore();
const route = useRoute();

// simplified category list (you can extend or generate dynamically)
const categories = [
  {
    key: 'button',
    label: 'Button',
    props: [
      {
        key: 'button-radius',
        label: 'Button Radius',
        type: 'text',
      },
      {
        key: 'button-border-color',
        label: 'Button Border Color',
        type: 'color',
      },
      {
        key: 'button-padding',
        label: 'Button Padding',
        type: 'text',
      },
      {
        key: 'button-primary-color',
        label: 'Primary Text Color',
        type: 'color',
      },
      {
        key: 'button-primary-background',
        label: 'Primary Background',
        type: 'color',
      },
      {
        key: 'button-primary-hover-background',
        label: 'Primary Hover Background',
        type: 'color',
      },
      {
        key: 'button-primary-hover-color',
        label: 'Primary Hover Text Color',
        type: 'color',
      },
      {
        key: 'button-secondary-color',
        label: 'Secondary Text Color',
        type: 'color',
      },
      {
        key: 'button-secondary-background',
        label: 'Secondary Background',
        type: 'color',
      },
      {
        key: 'button-secondary-hover-background',
        label: 'Secondary Hover Background',
        type: 'color',
      },
      {
        key: 'button-secondary-hover-color',
        label: 'Secondary Hover Text Color',
        type: 'color',
      },
    ],
  },
  {
    key: 'common',
    label: 'Common',
    props: [
      {
        key: 'body-background',
        label: 'Body Background Color',
        type: 'color',
      },
      {
        key: 'body-color',
        label: 'Body Text Color',
        type: 'color',
      },
      {
        key: 'border-color',
        label: 'Common Border Color',
        type: 'color',
      },
      {
        key: 'border-radius',
        label: 'Common Border Radius',
        type: 'color',
      },
      {
        key: 'font-size',
        label: 'Common Font Size',
        type: 'text',
      },
    ],
  },
  {
    key: 'heading',
    label: 'Heading',
    props: [
      {
        key: 'h1-color',
        label: 'H1 Font Color',
        type: 'color',
      },
      {
        key: 'h1-font-size',
        label: 'H1 Font Size',
        type: 'text',
      },
      {
        key: 'h1-padding-top',
        label: 'H1 Padding Top',
        type: 'text',
      },
      {
        key: 'h1-padding-bottom',
        label: 'H1 Padding Bottom',
        type: 'text',
      },
      {
        key: 'h2-color',
        label: 'H2 Font Color',
        type: 'color',
      },
      {
        key: 'h2-font-size',
        label: 'H2 Font Size',
        type: 'text',
      },
      {
        key: 'h2-padding-top',
        label: 'H2 Padding Top',
        type: 'text',
      },
      {
        key: 'h2-padding-bottom',
        label: 'H2 Padding Bottom',
        type: 'text',
      },
      {
        key: 'p-color',
        label: 'Paragraph Font Color',
        type: 'color',
      },
      {
        key: 'p-font-size',
        label: 'Paragraph Font Size',
        type: 'text',
      },
      {
        key: 'p-padding-top',
        label: 'P Padding Top',
        type: 'text',
      },
      {
        key: 'p-padding-bottom',
        label: 'P Padding Bottom',
        type: 'text',
      },
    ],
  },
  {
    key: 'table',
    label: 'Table',
    props: [
      {
        key: 'table-color',
        label: 'Table Font Color',
        type: 'color',
      },
      {
        key: 'table-background-color',
        label: 'Table Background Color',
        type: 'color',
      },
    ],
  },
];

// state
const themeList = ref(null);
const selectedThemeKey = ref('');
const selectedCategory = ref(null);
const themeState = reactive({});

const fileInput = ref(null);
const newKey = ref('');
const newValue = ref('');

// load themes from store / api
onMounted(async () => {
  await store.loadSingleThemes();
  themeList.value = store.themeData;
  console.log(store.themeData)
  if (themeList.value) {
    selectedThemeKey.value = themeList.value.themename;
    loadThemeToState(selectedThemeKey.value);
  } else {
    // if no themes from API, initialize defaults
    initDefaults();
  }
});

function initDefaults() {
  // set defaults from categories
  categories.forEach((cat) => {
    cat.props.forEach((p) => {
      if (!(p.key in themeState)) {
        themeState[p.key] = p.type === 'color' ? '#cccccc' : p.type === 'number' ? 0 : '';
      }
    });
  });
}

async function loadThemeToState() {
  const data = themeList.value.themedata ? JSON.parse(themeList.value.themedata) : {};

  initDefaults();
  Object.keys(data).forEach((k) => {
    themeState[k] = data[k];
  });

  // apply css variables
  applyAllVars();
}

function applyAllVars() {
  for (const [k, v] of Object.entries(themeState)) {
    document.documentElement.style.setProperty(`--${k}`, String(v));
  }
}

function selectCategory(key) {
  selectedCategory.value = key;
}

const currentProps = computed(() => {
  const cat = categories.find((c) => c.key === selectedCategory.value);
  if (!cat) return [];
  return cat.props;
});

function onChange(key, val) {
  themeState[key] = val;
  document.documentElement.style.setProperty(`--${key}`, String(val));
}

function addCustom() {
  if (!newKey.value) return;
  themeState[newKey.value] = newValue.value;
  newKey.value = '';
  newValue.value = '';
  applyAllVars();
}

function downloadJSON() {
  const blob = new Blob([JSON.stringify(themeState, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${selectedThemeKey.value || 'theme'}.json`;
  a.click();
  a.remove();
}

async function importJSON(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const text = await file.text();
  try {
    const json = JSON.parse(text);
    Object.keys(json).forEach((k) => {
      themeState[k] = json[k];
    });
    applyAllVars();
    alert('Imported');
  } catch (err) {
    alert('Invalid JSON');
  }
  e.target.value = '';
}

function openImport() {
  fileInput.value?.click();
}

function resetToDefault() {
  // reload original themedata from store or defaults
  loadThemeToState(selectedThemeKey.value);
}

// apply theme + sync to Pinia store + persist themedata
async function applyTheme() {
  store.saveActiveTheme(JSON.stringify(themeState));
  // apply and (optionally) persist selection as current theme
  applyAllVars();
  // save cookie via store
  store.applyTheme(selectedThemeKey.value);
  alert('Theme applied');
}

const cssText = computed(() => {
  let out = `:root {
`;
  for (const [k, v] of Object.entries(themeState))
    out += `  --${k}: ${v};
`;
  out += `}
`;
  return out;
});

const jsonText = computed(() => {
  return JSON.stringify(themeState);
});

// preview styles
const h1Style = computed(() => ({
  color: `var(--h1-color, #fff)`,
  fontSize: `var(--h1-font-size, 6)`,
  paddingTop: `var(--h1-padding-top, 6)`,
  paddingBottom: `var(--h1-padding-bottom, 6)`,
}));

const h2Style = computed(() => ({
  color: `var(--h2-color, #fff)`,
  fontSize: `var(--h2-font-size, 6)`,
  paddingTop: `var(--h2-padding-top, 6)`,
  paddingBottom: `var(--h2-padding-bottom, 6)`,
}));

const pStyle = computed(() => ({
  color: `var(--p-color, #fff)`,
  fontSize: `var(--p-font-size, 6)`,
  paddingTop: `var(--p-padding-top, 6)`,
  paddingBottom: `var(--p-padding-bottom, 6)`,
}));

const btnPrimaryStyle = computed(() => ({
  background: `var(--button-primary-background, #4f46e5)`,
  color: `var(--button-primary-color, #fff)`,
  borderRadius: `var(--button-radius)`,
  padding: `var(--button-padding)`,
}));

const btnSecondaryStyle = computed(() => ({
  background: `var(--button-secondary-background, #64748b)`,
  color: `var(--button-secondary-color, #fff)`,
  borderRadius: `${themeState['button-radius'] || 6}px`,
}));

// expose for template input file
const fileInputRef = ref(null);
</script>

<style scoped></style>
