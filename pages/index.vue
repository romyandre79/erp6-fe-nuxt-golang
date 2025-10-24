<script setup lang="ts">
const { getAllArticle, loading, error } = useArticle()
const res = await getAllArticle()

</script>
<template>
   <div class="container mx-auto px-4 py-10">
    <h1 class="text-4xl font-bold text-center mb-8">{{ $t('ARTICLE') }}</h1>

    <div v-if="loading" class="text-center">{{ $t('LOADING') }}</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error.value }}</div>
    
    <div v-else class="grid md:grid-cols-3 gap-6">
      <div v-for="article in res?.data" :key="article.postid" class="card bg-base-100 shadow-xl">
        <figure>
          <img v-if="article.postpic" :src="article.postpic" :alt="article.title" class="w-full h-48 w-48 object-cover">
        </figure>
        <div class="card-body">
          <h2 :v-html="article.title" class="card-title">{{ article.title }}</h2>
          <p class="text-sm text-gray-500">By {{ article.author?.realname }} | {{ article.category }}</p>
          <div class="card-actions justify-end">
            <NuxtLink :to="`/articles/${article.slug}`" class="btn btn-primary btn-sm">{{ $t('READ_MORE') }}</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>