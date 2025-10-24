<template>
  <div class="container mx-auto px-4 py-10">
    <NuxtLink to="/" class="btn btn-outline mb-4">{{ t('BACK') }}</NuxtLink>

    <h1 class="text-4xl font-bold mb-4">{{ article?.title }}</h1>

    <img
      v-if="article?.postpic"
      :src="article.postpic"
      :alt="article.title"
      class="w-full h-96 object-cover mb-6"
    />

    <p class="text-sm text-gray-500 mb-6">
      By {{ article?.author?.realname }} | {{ article?.category }}
    </p>

    <div v-html="description"></div>

  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t, locale } = useI18n()
const { getArticle } = useArticle()

const route = useRoute()
const slug = route.params.slug as string
const article = await getArticle(slug)
const description = ref(article.description)

</script>
