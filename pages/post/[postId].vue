<template>
  <div class="relative scroll-smooth">
    <Transition>
      <Comments :post-id="(route.params.postId as string)" v-if="showComments" @close="() => showComments = false" />
    </Transition>
    <dialog ref="dialog" class="p-0 rounded bg-slate-800 backdrop:bg-black/50 select-none" @click.stop="(e) => {
      if (e.target === dialog) {
        dialog.close()
      }
    }">
      <div class=" text-slate-200  max-w-md gap-y-4 gap-x-2 p-6">
        <p class="text-xl col-span-2 mb-4">Delete the post titled "<i class="text-fuchsia-400">{{ data?.title }}</i>"?
        </p>
        <small>Note: All associated comments and votes will also be cleared</small>
        <div class="flex w-full gap-5 mt-1">
          <button @click="handleDelete"
            class="outline-none border-none bg-emerald-600 py-1 px-2 rounded transition-all ease-in hover:bg-emerald-700 font-medium active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-600 ring-offset-2 ring-offset-slate-900 flex-1">Yes</button>
          <button @click="() => dialog?.close()"
            class="outline-none border-none bg-rose-600 py-1 px-2 rounded transition-all ease-in hover:bg-rose-700 font-medium active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-600 ring-offset-2 ring-offset-slate-900 flex-1">No</button>
        </div>
      </div>
    </dialog>
    <p v-if="isLoading" class="animate-pulse">Loading post...</p>
    <h1 class="text-5xl font-extrabold underline-offset-4 pb-5" v-if="!isLoading">
      {{ data?.title }}</h1> <span>Posted by {{ data?.author.name === userData?.name ? "You" : data?.author.name }} •
      <time class="text-slate-300 font-semibold">{{ useDateFormat(data?.createdAt, 'MMM D').value }}</time>

    </span>
    <div class="flex items-center gap-5">
      <div
        class="flex items-center gap-2 py-1 px-2 mt-4 rounded-full text-indigo-300 ring-indigo-300 ring-2 font-semibold justify-around w-fit">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
          <path fill-rule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clip-rule="evenodd" />
        </svg>
        <p>{{ votesData?.totalVotes }} {{ votesData && +votesData?.totalVotes === 1 ? 'vote' :
          'votes' }}</p>
      </div>
      <div
        class="flex items-center gap-2 py-1 px-2 mt-4 rounded-full text-sky-300 ring-sky-300 ring-2 font-semibold justify-around w-fit">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
          <path fill-rule="evenodd"
            d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 001.28.53l3.58-3.579a.78.78 0 01.527-.224 41.202 41.202 0 005.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zm0 7a1 1 0 100-2 1 1 0 000 2zM8 8a1 1 0 11-2 0 1 1 0 012 0zm5 1a1 1 0 100-2 1 1 0 000 2z"
            clip-rule="evenodd" />
        </svg>
        <p>{{ commentData?.length }} {{ commentData && commentData?.length === 1 ? 'comment' : 'comments' }}</p>
      </div>
    </div>
    <div class="flex w-fit mt-5 gap-3 text-sm md:gap-6 md:text-base" v-if="userData?.name === data?.author.name">
      <button class="text-rose-500 hover:underline underline-offset-2" @click="() => dialog?.showModal()">Delete
        post</button>
      <NuxtLink :to="'/edit/' + route.params.postId" class="text-amber-500 hover:underline underline-offset-2">Edit post
      </NuxtLink>
      <button v-if="userData?.name" @click="async () => {
        await votePostAsync()
        queryClient.invalidateQueries(['voteStatus', route.params.postId])
      }">
        <p class="text-yellow-500 hover:underline underline-offset-2 " v-if="voteStatus?.voted">Remove vote</p>
        <p class="text-teal-500 hover:underline underline-offset-2 " v-else-if="!voteStatus?.voted">Vote post</p>
      </button>
      <button class="text-fuchsia-500 hover:underline underline-offset-2" @click="() => showComments = true">View
        comments</button>
    </div>
    <div class="flex w-fit mt-5 gap-4" v-if="userData?.name !== data?.author.name">
      <button @click="handleVote" v-if="userData?.name">
        <p class="text-yellow-500 hover:underline underline-offset-2" v-if="voteStatus?.voted">Remove vote</p>
        <p class="text-teal-500 hover:underline underline-offset-2" v-else-if="!voteStatus?.voted">Vote post</p>
      </button>
      <button class="text-fuchsia-500 hover:underline underline-offset-2" @click="() => showComments = true">View
        comments
      </button>
    </div>
    <p class="pt-5 text-lg font-sans leading-8 tracking-wide">{{ data?.content }}</p>
  </div>
  <Transition name="toTop" tag="div">
    <div v-if="y > 0"
      class="flex items-center text-xl gap-2 bg-slate-900 ring-2 ring-emerald-500 w-fit p-2 md:p-3 rounded-full cursor-pointer hover:text-emerald-400 select-none fixed bottom-2 right-0 z-20"
      @click="scrollToTop">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
        <path fill="currentColor"
          d="m229.66 114.34l-96-96a8 8 0 0 0-11.32 0l-96 96A8 8 0 0 0 32 128h40v80a16 16 0 0 0 16 16h80a16 16 0 0 0 16-16v-80h40a8 8 0 0 0 5.66-13.66ZM176 112a8 8 0 0 0-8 8v88H88v-88a8 8 0 0 0-8-8H51.31L128 35.31L204.69 112Z" />
      </svg>
      <span class="hidden md:block">Back to top</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { IComment } from '../../components/Comments.vue';
import { ICurrentUser } from '../../layouts/default.vue';


export type IPostData = {
  id: string,
  title: string,
  content: string,
  createdAt: string,
  updatedAt: string,
  updated: boolean,
  authorId: string,
  author: {
    name: string
  }
}

const route = useRoute()
const queryClient = useQueryClient()
const config = useRuntimeConfig()


const { isLoading, data } = useQuery<IPostData>({
  queryKey: ['postById', route.params.postId],
  queryFn: () => $fetch(`${config.public.SERVER_URL}/api/post/${route.params.postId}`, { credentials: "include" })
})

const { data: votesData } = useQuery<{ totalVotes: string }>({
  queryKey: ['votes', route.params.postId],
  queryFn: () => $fetch(`${config.public.SERVER_URL}/api/post/votes/${route.params.postId}`, { credentials: "include" })
})

const { data: commentData } = useQuery<IComment[]>({
  queryKey: ['comment', route.params.postId],
  queryFn: () => $fetch(`${config.public.SERVER_URL}/api/post/comments/${route.params.postId}`, { credentials: "include" })
})

useHead({
  title: `Post | ${data.value?.title || ''}`
})

const { data: userData } = useQuery<ICurrentUser>({
  queryKey: ['currentUser'],
  queryFn: () => $fetch(`${config.public.SERVER_URL}/auth/current`, { credentials: "include" })
})

const { mutateAsync } = useMutation({
  mutationFn: () => $fetch(`${config.public.SERVER_URL}/api/post/${route.params.postId}`, { method: "DELETE", credentials: "include" }),
  onSuccess: () => {
    // Invalidate and refetch
    navigateTo("/")
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  },
})

const { mutateAsync: votePostAsync } = useMutation({
  mutationFn: () => $fetch(`${config.public.SERVER_URL}/api/post/vote/${route.params.postId}`, { method: "PUT", credentials: "include" }),
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['votes', route.params.postId] })
  },
})

const { data: voteStatus } = useQuery<{ voted: boolean }>({
  queryKey: ['voteStatus', route.params.postId],
  queryFn: () => $fetch(`${config.public.SERVER_URL}/api/post/vote/${route.params.postId}`, { method: "GET", credentials: "include" }),
})

const dialog = ref<HTMLDialogElement>()

async function handleDelete() {
  await mutateAsync()
  dialog.value?.close()
}

async function handleVote() {
  await votePostAsync()
  queryClient.invalidateQueries(['voteStatus', route.params.postId])
}

const showComments = ref(false)

const { y } = useWindowScroll()

function scrollToTop() {
  scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.15s ease;
}

.v-enter-from,
.v-leave-to {
  scale: 0.75;
  opacity: 0;
  rotate: x -90deg;
}

.toTop-enter-active,
.toTop-leave-active {
  transition: scale 0.2s ease;
}

.toTop-enter-from,
.toTop-leave-to {
  scale: 0;
  transition: all 200ms ease-in 0s
}
</style>
