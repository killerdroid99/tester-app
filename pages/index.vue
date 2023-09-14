<template>
  <div v-if="isLoading" class="animate-pulse">Loading posts...</div>
  <div class="grid gap-8" v-if="!isLoading">
    <NuxtLink :to="'/post/' + post.id" :title="post.title"
      class="bg-slate-800 p-4 transition-all ease-out hover:bg-slate-900 hover:rounded-md grid gap-2" v-for="post in data"
      :key="post.id">
      <h2 class="text-2xl font-semibold flex items-center gap-2">
        <p v-if="post.title.length > 50">
          {{ post.title.slice(0, 20) }}...
        </p>
        <p v-else>
          {{ post.title }}
        </p>
        <span class="text-base font-normal text-slate-200"> ~ by
          {{
            post.author.name
          }}</span>
      </h2>
      <time class="text-slate-300">{{ useDateFormat(post.createdAt, 'DD-MM-YY (ddd)').value }}</time>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Test_er | Home"
})

type post = {
  id: string,
  title: string,
  createdAt: string,
  updated: boolean,
  author: {
    name: string
  }
}

const config = useRuntimeConfig()

const { isLoading, data } = useQuery<post[]>({
  queryKey: ['posts'],
  queryFn: () => $fetch(`${config.public.SERVER_URL}/api/posts`, { credentials: "include" })
})

</script>

<style scoped>
</style>
