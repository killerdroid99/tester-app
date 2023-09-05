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
      <div class="grid gap-2 grid-cols-2">
        <button
          class="text-xl outline-none border-none bg-emerald-600 p-2 rounded transition-transform ease-in hover:bg-emerald-700 font-medium active:scale-95">
          Update
        </button>
        <NuxtLink :to="'/post/' + route.params.postId"
          class="text-xl outline-none border-none bg-rose-600 p-2 rounded transition-transform ease-in hover:bg-rose-700 font-medium active:scale-95 text-center">
          Cancel and go back
        </NuxtLink>
      </div>
    </form>

  </div>
</template>

<script setup lang="ts">
import { ICurrentUser } from '../../layouts/default.vue';
import { IPostData } from '../post/[postId].vue';

type IPost = {
  title: string,
  content: string
}

const route = useRoute()

const { isLoading: isPostLoading, data: postData } = useQuery<IPostData>({
  queryKey: ['postById', route.params.postId],
  queryFn: () => $fetch(`http://localhost:8080/api/post/${route.params.postId}`, { credentials: "include" })
})

if (!isPostLoading) {
  useHead({
    title: `Edit post | ${route.params.postId}`
  })
}

const title = ref(postData.value?.title)
const content = ref(postData.value?.content)

const { isLoading, isError, data, error } = useQuery<ICurrentUser>({
  queryKey: ['currentUser'],
  queryFn: () => $fetch("http://localhost:8080/auth/current", { credentials: "include" })
})

const queryClient = useQueryClient()

const { mutateAsync } = useMutation({
  mutationFn: (postData: IPost) => $fetch(`http://localhost:8080/api/post/${route.params.postId}`, { method: "PATCH", body: postData, credentials: "include" }),
  onSuccess: () => {
    // Invalidate and refetch
    navigateTo("/")
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  },
})

async function handleSubmit() {
  if (title.value && content.value) {
    await mutateAsync({ title: title.value, content: content.value })
  }
  navigateTo('/post/' + route.params.postId)
}
</script>

<style scoped>
</style>
