<template>
  <div>
    <form class="grid gap-8" @submit.prevent="handleSubmit">
      <div class="flex flex-col-reverse gap-2">
        <input type="text" id="title" v-model="title"
          class="p-2 text-lg outline-none border-none rounded ring-1 ring-slate-50 bg-slate-950 text-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-400 peer">
        <label for="title" class="peer-focus-visible:text-emerald-400 text-xl">Title</label>
      </div>
      <div class="flex flex-col-reverse gap-2">
        <textarea id="body" cols="30" rows="10" v-model="content"
          class="p-2 text-lg outline-none border-none rounded ring-1 ring-slate-50 bg-slate-950 text-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-400 peer"></textarea>
        <label for="body" class="peer-focus-visible:text-emerald-400 text-xl">Body</label>
      </div>
      <button
        class="text-xl outline-none border-none bg-sky-600 p-2 rounded transition-transform ease-in hover:bg-sky-700 font-medium active:scale-95 ring-sky-600 ring-offset-2 ring-offset-slate-950 focus-visible:ring-2">
        Add post
      </button>
    </form>

  </div>
</template>

<script setup lang="ts">
import { ICurrentUser } from '../layouts/default.vue';

type IPost = {
  title: string,
  content: string
}


useHead({
  title: "Add post"
})

const title = ref("")
const content = ref("")
const config = useRuntimeConfig()

const queryClient = useQueryClient()

const { mutateAsync } = useMutation({
  mutationFn: (postData: IPost) => $fetch(`${config.public.SERVER_URL}/api/posts`, { method: "POST", body: postData, credentials: "include" }),
  onSuccess: () => {
    // Invalidate and refetch
    navigateTo("/")
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  },
})

async function handleSubmit() {
  await mutateAsync({ title: title.value, content: content.value })
  navigateTo("/")
}
</script>

<style scoped>
</style>
