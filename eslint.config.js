import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import vueParser from 'vue-eslint-parser';

// Safe vue config (v10)
const vueFlat = vue?.configs?.['flat/vue3-essential'] ?? {};
const tsRecommendedRules = tsPlugin?.configs?.recommended?.rules ?? {};

// Prettier recommended rules
const prettierRules = {
  ...prettierPlugin.configs.recommended.rules,
};

export default [
  {
    ignores: ['node_modules/**', '.nuxt/**', 'dist/**'],
  },

  // JS recommended rules
  js.configs.recommended,

  // Vue rules
  ...(Array.isArray(vueFlat) ? vueFlat : [vueFlat]),

  // vue rules
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser, // untuk <script lang="ts">
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
      globals: {
        useToast: 'readonly', // ESLint akan menganggap useToast global
        FormData: 'readonly',
        console: 'readonly',
        $t: 'readonly',
        h: 'readonly',
        ref: 'readonly',
        reactive: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        nextTick: 'readonly',
        shallowReactive: 'readonly',
        onMounted: 'readonly',
        navigateTo: 'readonly',
        window: 'readonly',
        document: 'readonly',
        Document: 'readonly',
        alert: 'readonly',
        toRaw: 'readonly',
        Event: 'readonly',
        HTMLTextAreaElement: 'readonly',
        HTMLInputElement: 'readonly',
        File: 'readonly',
        useRoute: 'readonly',
      },
    },
    plugins: { vue },
    rules: {
      ...vueFlat.rules,
    },
  },

  // TypeScript rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: { ...tsRecommendedRules },
  },

  // Prettier integration (flat config safe)
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      ...prettierRules,
      'prettier/prettier': 'error',
    },
  },
];
