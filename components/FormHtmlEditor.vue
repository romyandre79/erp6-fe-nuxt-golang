<template>
  <div :class="['flex flex-col mb-3', componentClass]">
    <!-- Label -->
    <label v-if="label" class="text-sm mb-1 font-medium text-gray-400">
      {{ label }}
    </label>

    <!-- Editor Container -->
    <div class="border rounded-lg overflow-hidden" :class="errorClass">
      <!-- Toolbar -->
      <div v-if="editor" class="bg-gray-50 dark:bg-gray-800 border-b p-2 flex flex-wrap gap-1">
        <!-- Text Formatting -->
        <button
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'bg-gray-200 dark:bg-gray-700': editor.isActive('bold') }"
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          type="button"
          title="Bold"
        >
          <UIcon name="i-heroicons-bold" class="w-4 h-4" />
        </button>
        <button
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'bg-gray-200 dark:bg-gray-700': editor.isActive('italic') }"
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          type="button"
          title="Italic"
        >
          <UIcon name="i-heroicons-italic" class="w-4 h-4" />
        </button>
        <button
          @click="editor.chain().focus().toggleUnderline().run()"
          :class="{ 'bg-gray-200 dark:bg-gray-700': editor.isActive('underline') }"
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          type="button"
          title="Underline"
        >
          <UIcon name="i-heroicons-underline" class="w-4 h-4" />
        </button>
        <button
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'bg-gray-200 dark:bg-gray-700': editor.isActive('strike') }"
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          type="button"
          title="Strikethrough"
        >
          <UIcon name="i-heroicons-strikethrough" class="w-4 h-4" />
        </button>

        <div class="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <!-- Headings -->
        <button
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'bg-gray-200 dark:bg-gray-700': editor.isActive('heading', { level: 1 }) }"
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          type="button"
          title="Heading 1"
        >
          H1
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'bg-gray-200 dark:bg-gray-700': editor.isActive('heading', { level: 2 }) }"
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          type="button"
          title="Heading 2"
        >
          H2
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'bg-gray-200 dark:bg-gray-700': editor.isActive('heading', { level: 3 }) }"
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          type="button"
          title="Heading 3"
        >
          H3
        </button>

        <div class="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <!-- Lists -->
        <button
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'bg-gray-200 dark:bg-gray-700': editor.isActive('bulletList') }"
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          type="button"
          title="Bullet List"
        >
          <UIcon name="i-heroicons-list-bullet" class="w-4 h-4" />
        </button>
        <button
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'bg-gray-200 dark:bg-gray-700': editor.isActive('orderedList') }"
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          type="button"
          title="Ordered List"
        >
          <UIcon name="i-heroicons-numbered-list" class="w-4 h-4" />
        </button>

        <div class="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <!-- Alignment -->
        <button
          @click="editor.chain().focus().setTextAlign('left').run()"
          :class="{ 'bg-gray-200 dark:bg-gray-700': editor.isActive({ textAlign: 'left' }) }"
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          type="button"
          title="Align Left"
        >
          <UIcon name="i-heroicons-bars-3-bottom-left" class="w-4 h-4" />
        </button>
        <button
          @click="editor.chain().focus().setTextAlign('center').run()"
          :class="{ 'bg-gray-200 dark:bg-gray-700': editor.isActive({ textAlign: 'center' }) }"
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          type="button"
          title="Align Center"
        >
          <UIcon name="i-heroicons-bars-3" class="w-4 h-4" />
        </button>
        <button
          @click="editor.chain().focus().setTextAlign('right').run()"
          :class="{ 'bg-gray-200 dark:bg-gray-700': editor.isActive({ textAlign: 'right' }) }"
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          type="button"
          title="Align Right"
        >
          <UIcon name="i-heroicons-bars-3-bottom-right" class="w-4 h-4" />
        </button>

        <div class="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <!-- Link -->
        <button
          @click="setLink"
          :class="{ 'bg-gray-200 dark:bg-gray-700': editor.isActive('link') }"
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          type="button"
          title="Add Link"
        >
          <UIcon name="i-heroicons-link" class="w-4 h-4" />
        </button>

        <div class="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <!-- Media -->
        <button
          @click="addImage"
          :class="{ 'bg-gray-200 dark:bg-gray-700': editor.isActive('image') }"
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          type="button"
          title="Add Image"
        >
          <UIcon name="i-heroicons-photo" class="w-4 h-4" />
        </button>
        <button
          @click="addVideo"
          :class="{ 'bg-gray-200 dark:bg-gray-700': editor.isActive('youtube') }"
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          type="button"
          title="Add Video (YouTube)"
        >
          <UIcon name="i-heroicons-video-camera" class="w-4 h-4" />
        </button>

        <UPopover :popper="{ placement: 'bottom-start' }">
          <button
            class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            type="button"
            title="Add Emoji"
          >
            <UIcon name="i-heroicons-face-smile" class="w-4 h-4" />
          </button>

          <template #panel>
            <div class="p-2 w-64 grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
              <button
                v-for="emoji in emojis"
                :key="emoji"
                @click="editor.chain().focus().insertContent(emoji).run()"
                class="hover:bg-gray-100 dark:hover:bg-gray-800 rounded p-1 text-lg leading-none"
                type="button"
              >
                {{ emoji }}
              </button>
            </div>
          </template>
        </UPopover>

        <div class="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <!-- Clear Formatting -->
        <button
          @click="editor.chain().focus().clearNodes().unsetAllMarks().run()"
          class="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          type="button"
          title="Clear Formatting"
        >
          <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
        </button>
      </div>

      <!-- Editor Content -->
      <EditorContent 
        :editor="editor" 
        class="prose dark:prose-invert max-w-none p-3 min-h-[200px] focus:outline-none [&_.is-editor-empty]:before:content-[attr(data-placeholder)] [&_.is-editor-empty]:before:text-gray-400 [&_.is-editor-empty]:before:float-left [&_.is-editor-empty]:before:pointer-events-none"
      />
    </div>

    <!-- Error Message -->
    <span v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Enter HTML content...'
  },
  componentClass: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const errorClass = computed(() => {
  return props.error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
})

// Common emojis
const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
  '👆', '👇', '✋', '👋', '👏', '🙌', '👐', '🤲', '🤝', '🙏',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
  '🔥', '✨', '🌟', '💫', '💥', '💢', '💦', '💧', '💤', '👋'
]

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    Image,
    Youtube.configure({
      controls: false,
      nocookie: true,
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph', 'image'],
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-blue-600 hover:underline',
      },
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[200px]',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.getHTML() !== newValue) {
    editor.value.commands.setContent(newValue, false)
  }
})

const setLink = () => {
  const previousUrl = editor.value?.getAttributes('link').href
  const url = window.prompt('Enter URL:', previousUrl)

  if (url === null) {
    return
  }

  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

const addImage = () => {
  const url = window.prompt('Enter image URL:')

  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run()
  }
}

const addVideo = () => {
  const url = window.prompt('Enter YouTube URL:')

  if (url) {
    editor.value?.chain().focus().setYoutubeVideo({ src: url }).run()
  }
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
:deep(.ProseMirror) {
  min-height: 200px;
  outline: none;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

:deep(.ProseMirror:focus) {
  outline: none;
}
</style>
