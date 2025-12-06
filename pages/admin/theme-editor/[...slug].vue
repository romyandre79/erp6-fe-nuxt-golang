<template>
  <div class="flex h-full">
    <!-- LEFT: CATEGORY LIST -->
    <!-- LEFT: SIDEBAR -->
    <div class="flex-none bg-white border-r z-10">
      <Sidebar
        :themeState="themeState"
        :cssText="cssText"
        :jsonText="jsonText"
        @save="applyTheme"
        @reset="resetToDefault"
        @update="onChange"
        @add-custom="addCustom"
      />
    </div>

    <!-- RIGHT: PROPERTY EDITOR + PREVIEW -->
    <section class="flex-1 p-6 overflow-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- PROPERTY EDITOR -->

        <!-- LIVE PREVIEW -->
        <div :style="bodyStyle">
          <div class="flex items-center justify-between mb-3">
            <h1 class="font-bold text-lg">Live Preview</h1>
          </div>

          <h1 :style="h1Style">Header H1</h1>
          <h2 :style="h2Style">Header H2</h2>
          <p :style="pStyle">Paragraph</p>

          <div class="mt-4 flex gap-2">
            <button class="px-3 py-1 rounded" :style="buttonStyle">Button</button>
          </div>

          <div class="mt-4 flex gap-2">
            <table :style="tableStyle">
              <thead :style="tableHeadStyle">
                <tr>
                  <th :style="tableHeadStyle" class="px-4 py-3">Column 1</th>
                  <th :style="tableHeadStyle" class="px-4 py-3">Column 2</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, index) in 6"
                  :key="row.id"
                  :style="index % 2 === 0 ? tableRowStyle.even : tableRowStyle.odd"
                >
                  <td class="px-4 py-3">Data Kolom 1</td>
                  <td class="px-4 py-3">Data Kolom 2</td>
                </tr>
              </tbody>
              <tfoot>
                <tr :style="tableFooterStyle">
                  <td class="text-right font-bold">Total</td>
                  <td class="text-right">1500</td>
                </tr>
                <tr :style="tablePaginationStyle" class="items-center">
                  <td class="text-right font-bold" colspan="2">Page 1 / 1</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div class="mt-4">
            <a :style="linkStyle">Link</a>
          </div>
          <div class="mt-4">
            <label :style="labelStyle">Label</label>
          </div>
          <div class="mt-4 max-w-full">
            <input type="text" :style="inputStyle" class="border" placeholder="place" />
          </div>
          <div class="mt-4">
            <textarea :style="inputStyle" class="border" placeholder="place" />
          </div>
          <div class="mt-4">
            <select :style="inputStyle" class="border" placeholder="place">
              <option>Pilihan 1</option>
              <option>Pilihan 2</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useThemeStore } from '~/store/theme';
import Sidebar from '~/components/theme/ThemeSidebar.vue';
import { useToast, useRoute } from '#imports';

definePageMeta({
  middleware: ['auth'],
  layout: 'auth'
});

// integrate with Pinia theme store
const store = useThemeStore();
const toast = useToast();
const route = useRoute();

// simplified category list (you can extend or generate dynamically)
const optionBorderStyle = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'double', label: 'double' },
  { value: 'hidden', label: 'hidden' },
  { value: 'none', label: 'none' },
];
const optionBorder = [
  { label: 'Border', value: 'border' },
  { label: 'None', value: '' },
];
const optionRounded = [
  { label: 'Rounded', value: 'Rounded' },
  { label: 'None', value: '' },
];
const categories = [
  {
    key: 'sidebar',
    label: 'Sidebar',
    props: [
      {
        key: 'sidebar-background',
        label: 'Sidebar Background',
        type: 'color',
      },
      {
        key: 'sidebar-border-color',
        label: 'Sidebar Border Color',
        type: 'color',
      },
      {
        key: 'sidebar-title-color',
        label: 'Sidebar Title Color',
        type: 'color',
      },
      {
        key: 'sidebar-menu-color',
        label: 'Menu Text Color',
        type: 'color',
      },
      {
        key: 'sidebar-menu-hover-background',
        label: 'Menu Hover Background',
        type: 'color',
      },
      {
        key: 'sidebar-menu-hover-color',
        label: 'Menu Hover Color',
        type: 'color',
      },
      {
        key: 'sidebar-menu-active-background',
        label: 'Menu Active Background',
        type: 'color',
      },
      {
        key: 'sidebar-menu-active-color',
        label: 'Menu Active Color',
        type: 'color',
      },
      {
        key: 'sidebar-submenu-border-color',
        label: 'Submenu Border Color',
        type: 'color',
      },
      {
        key: 'sidebar-collapse-background',
        label: 'Collapse Button Background',
        type: 'color',
      },
      {
        key: 'sidebar-collapse-color',
        label: 'Collapse Button Color',
        type: 'color',
      },
      {
        key: 'sidebar-profile-icon-color',
        label: 'Profile Icon Color',
        type: 'color',
      },
      {
        key: 'sidebar-profile-name-color',
        label: 'Profile Name Color',
        type: 'color',
      },
      {
        key: 'sidebar-profile-email-color',
        label: 'Profile Email Color',
        type: 'color',
      },
    ],
  },
  {
    key: 'layout',
    label: 'Layout',
    props: [
      {
        key: 'content-background',
        label: 'Content Background',
        type: 'color',
      },
      {
        key: 'primary-color',
        label: 'Primary Accent Color',
        type: 'color',
      },
      {
        key: 'primary-hover-color',
        label: 'Primary Hover Color',
        type: 'color',
      },
      {
        key: 'primary-light',
        label: 'Primary Light Color',
        type: 'color',
      },
      {
        key: 'navbar-icon-color',
        label: 'Navbar Icon Color',
        type: 'color',
      },
      {
        key: 'navbar-icon-hover-color',
        label: 'Navbar Icon Hover Color',
        type: 'color',
      },
    ],
  },
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
        key: 'button-color',
        label: 'Common Button Text Color',
        type: 'color',
      },
      {
        key: 'button-background',
        label: 'Common Button Background',
        type: 'color',
      },
      {
        key: 'button-hover-color',
        label: 'Common Button Hover Text Color',
        type: 'color',
      },
      {
        key: 'button-hover-background',
        label: 'Common Button Hover Background',
        type: 'color',
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
        type: 'text',
      },
      {
        key: 'border',
        label: 'Common Border',
        type: 'select',
        options: optionBorder,
      },
      {
        key: 'font-size',
        label: 'Common Font Size',
        type: 'text',
      },
      {
        key: 'font-family',
        label: 'Common Font Family',
        type: 'text',
      },
    ],
  },
  {
    key: 'nav',
    label: 'Nav',
    props: [
      {
        key: 'nav-background',
        label: 'Nav Background',
        type: 'color',
      },
      {
        key: 'nav-color',
        label: 'Nav Color',
        type: 'color',
      },
    ],
  },
  {
    key: 'navbar-admin',
    label: 'Navbar Admin',
    props: [
      {
        key: 'navbar-admin-background',
        label: 'Navbar Admin Background',
        type: 'color',
      },
      {
        key: 'navbar-admin-color',
        label: 'Navbar Admin Color',
        type: 'color',
      },
    ],
  },
  {
    key: 'link',
    label: 'Link',
    props: [
      {
        key: 'a-background',
        label: 'Link Background',
        type: 'color',
      },
      {
        key: 'a-color',
        label: 'Link Color',
        type: 'color',
      },
      {
        key: 'a-hover-background',
        label: 'Link Hover Background',
        type: 'color',
      },
      {
        key: 'a-hover-color',
        label: 'Link Hover Color',
        type: 'color',
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
        label: 'Paragraph Padding Top',
        type: 'text',
      },
      {
        key: 'p-padding-bottom',
        label: 'Paragraph Padding Bottom',
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
        key: 'table-border-size',
        label: 'Table Border Size',
        type: 'text',
      },
      {
        key: 'table-border-style',
        label: 'Table Border Style',
        type: 'select',
        options: optionBorderStyle,
      },
      {
        key: 'table-border-color',
        label: 'Table Border Color',
        type: 'color',
      },
      {
        key: 'table-background',
        label: 'Table Background Color',
        type: 'color',
      },
      {
        key: 'table-head-color',
        label: 'Table Head Color',
        type: 'color',
      },
      {
        key: 'table-head-background',
        label: 'Table Head Background Color',
        type: 'color',
      },
      {
        key: 'table-row-even-color',
        label: 'Table Row Even Color',
        type: 'color',
      },
      {
        key: 'table-row-even-background',
        label: 'Table Row Even Background Color',
        type: 'color',
      },
      {
        key: 'table-row-odd-color',
        label: 'Table Row Odd Color',
        type: 'color',
      },
      {
        key: 'table-row-odd-background',
        label: 'Table Row odd Background Color',
        type: 'color',
      },
      {
        key: 'table-footer-color',
        label: 'Table Footer Color',
        type: 'color',
      },
      {
        key: 'table-footer-background',
        label: 'Table Footer Background Color',
        type: 'color',
      },
      {
        key: 'table-pagination-color',
        label: 'Table Pagination Color',
        type: 'color',
      },
      {
        key: 'table-pagination-background',
        label: 'Table Pagination Background Color',
        type: 'color',
      },
    ],
  },
  {
    key: 'input',
    label: 'Input',
    props: [
      {
        key: 'label-color',
        label: 'Label Font Color',
        type: 'color',
      },
      {
        key: 'label-background',
        label: 'Label Background Color',
        type: 'color',
      },
      {
        key: 'input-color',
        label: 'Input Font Color',
        type: 'color',
      },
      {
        key: 'input-background',
        label: 'Input Background Color',
        type: 'color',
      },
      {
        key: 'input-border-size',
        label: 'Input Border Size',
        type: 'text',
      },
      {
        key: 'input-border-style',
        label: 'Input Border Style',
        type: 'select',
        options: optionBorderStyle,
      },
      {
        key: 'input-focus-border-color',
        label: 'Input Focus Border Color',
        type: 'color',
      },
      {
        key: 'input-rounded',
        label: 'Input Rounded',
        type: 'select',
        options: optionRounded,
      },
    ],
  },
  {
    key: 'panel',
    label: 'Panel',
    props: [
      {
        key: 'panel-background',
        label: 'Panel Background',
        type: 'color',
      },
      {
        key: 'panel-color',
        label: 'Panel Color',
        type: 'color',
      },
      {
        key: 'panel-header-background',
        label: 'Panel Header Background',
        type: 'color',
      },
      {
        key: 'panel-header-color',
        label: 'Panel Header Color',
        type: 'color',
      },
      {
        key: 'panel-shadow',
        label: 'Panel Shadow',
        type: 'color',
      },
    ],
  },
  {
    key: 'tab',
    label: 'Tab',
    props: [
      {
        key: 'tab-color',
        label: 'Tab Color',
        type: 'color',
      },
      {
        key: 'tab-active-background',
        label: 'Tab Active Background',
        type: 'color',
      },
      {
        key: 'tab-active-color',
        label: 'Tab Active Header Color',
        type: 'color',
      },
      {
        key: 'tab-border-color',
        label: 'Tab Border Color',
        type: 'color',
      },
    ],
  },
  {
    key: 'accordion',
    label: 'Accordion',
    props: [
      {
        key: 'accordion-header-background',
        label: 'Accordion Header Background',
        type: 'color',
      },
      {
        key: 'accordion-header-active-background',
        label: 'Accordion Header Active Background',
        type: 'color',
      },
      {
        key: 'accordion-header-color',
        label: 'Accordion Header Color',
        type: 'color',
      },
    ],
  },
  {
    key: 'slider',
    label: 'Slider',
    props: [
      {
        key: 'slider-track-background',
        label: 'Slider Track Background',
        type: 'color',
      },
      {
        key: 'slider-thumb-background',
        label: 'Slider Thumb Background',
        type: 'color',
      },
      {
        key: 'slider-thumb-border-color',
        label: 'Slider Thumb Border Color',
        type: 'color',
      },
    ],
  },
  {
    key: 'progress',
    label: 'Progress',
    props: [
      {
        key: 'progress-background',
        label: 'Progress Background',
        type: 'color',
      },
      {
        key: 'progress-bar-background',
        label: 'Progress Bar Background',
        type: 'color',
      },
      {
        key: 'progress-bar-color',
        label: 'Progress Bar Color',
        type: 'color',
      },
    ],
  },
  {
    key: 'calendar',
    label: 'Calendar',
    props: [
      {
        key: 'calendar-background',
        label: 'Calendar Background',
        type: 'color',
      },
      {
        key: 'calendar-header-background',
        label: 'Calendar Header Background',
        type: 'color',
      },
      {
        key: 'calendar-header-color',
        label: 'Calendar Header Color',
        type: 'color',
      },
      {
        key: 'calendar-day-color',
        label: 'Calendar Day Color',
        type: 'color',
      },
      {
        key: 'calendar-day-hover-background',
        label: 'Calendar Day Hover Background',
        type: 'color',
      },
      {
        key: 'calendar-today-background',
        label: 'Calendar Today Background',
        type: 'color',
      },
      {
        key: 'calendar-today-color',
        label: 'Calendar Today Color',
        type: 'color',
      },
      {
        key: 'calendar-today-color',
        label: 'Calendar Today Color',
        type: 'color',
      },
    ],
  },
  {
    key: 'dialog',
    label: 'Dialog',
    props: [
      {
        key: 'dialog-background',
        label: 'Dialog Background',
        type: 'color',
      },
      {
        key: 'dialog-color',
        label: 'Dialog Color',
        type: 'color',
      },
      {
        key: 'dialog-header-background',
        label: 'Dialog Header Background',
        type: 'color',
      },
      {
        key: 'dialog-header-color',
        label: 'Dialog Header Color',
        type: 'color',
      },
      {
        key: 'dialog-border-color',
        label: 'Dialog Border Color',
        type: 'color',
      },
      {
        key: 'dialog-shadow',
        label: 'Dialog Shadow',
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

const newKey = ref('');
const newValue = ref('');

// load themes from store / api
onMounted(async () => {
  await store.loadSingleThemes(route.params.slug);
  themeList.value = store.themeData;
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
}

function resetToDefault() {
  // reload original themedata from store or defaults
  loadThemeToState(selectedThemeKey.value);
}

// apply theme + sync to Pinia store + persist themedata
async function applyTheme() {
  store.saveActiveTheme(JSON.stringify(themeState));
  // apply and (optionally) persist selection as current theme
  toast.add({ title: 'Success', description: 'Theme saved', color: 'success' });
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
const bodyStyle = computed(() => ({
  color: `var(--body-color, #fff)`,
  background: `var(--body-background, #fff)`,
  fontSize: `var(--font-size, 6)`,
  fontFamily: `var(--font-family, 6)`,
  border: `var(--border, 6)`,
}));

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

const buttonStyle = computed(() => ({
  button: {
    background: `var(--button-background, #4f46e5)`,
    color: `var(--button-color, #fff)`,
    borderRadius: `var(--button-radius)`,
    borderColor: `var(--button-border-color)`,
    padding: `var(--button-padding)`,
    border: `var(--border)`,
  },
  hover: {
    background: `var(--button-hover-background, #4f46e5)`,
    color: `var(--button-hover-color, #fff)`,
  },
}));

const tableStyle = computed(() => ({
  background: `var(--table-background, #64748b)`,
  color: `var(--table-color, #fff)`,
  borderWidth: `var(--table-border-size, 1px)`,
  borderRadius: `var(--border-radius, 1px)`,
  borderStyle: `var(--table-border-style)`,
  borderColor: `var(--table-border-color)`,
  boxShadow: `var(--panel-shadow, 6)`,
}));

const tableHeadStyle = computed(() => ({
  background: `var(--table-head-background, #64748b)`,
  color: `var(--table-head-color, #fff)`,
}));

const tableRowStyle = computed(() => ({
  odd: {
    background: `var(--table-row-odd-background, #f9fafb)`,
    color: `var(--table-row-odd-color, #111827)`,
  },
  even: {
    background: `var(--table-row-even-background, #ffffff)`,
    color: `var(--table-row-even-color, #111827)`,
  },
}));

const tableFooterStyle = computed(() => ({
  background: `var(--table-footer-background, #f9fafb)`,
  color: `var(--table-footer-color, #111827)`,
}));

const tablePaginationStyle = computed(() => ({
  background: `var(--table-pagination-background, #f9fafb)`,
  color: `var(--table-pagination-color, #111827)`,
}));

const labelStyle = computed(() => ({
  background: `var(--label-background, #f9fafb)`,
  color: `var(--label-color, #111827)`,
}));

const linkStyle = computed(() => ({
  a: {
    background: `var(--a-background, #f9fafb)`,
    color: `var(--a-color, #111827)`,
  },
  hover: {
    background: `var(--a-hover-background, #f9fafb)`,
    color: `var(--a-hover-color, #111827)`,
  },
}));

const inputStyle = computed(() => ({
  input: {
    background: `var(--input-background, #f9fafb)`,
    color: `var(--input-color, #111827)`,
    borderStyle: `var(--input-border-style)`,
    borderSize: `var(--input-border-size)`,
    borderFocusColor: `var(--input-focus-border-color)`,
    borderRadius: `var(--border-radius)`,
    border: `var(--border, 6)`,
  },
}));
</script>
