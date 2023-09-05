<template>
  <div
    class="fixed z-20 top-32 inset-2 md:inset-12 md:top-32 lg:inset-32 lg:max-w-2xl mx-auto md:p-8 bg-slate-950/90 backdrop-blur-lg rounded h-fit max-h-[36rem] overflow-auto ring-2 ring-slate-700/40 scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-slate-500"
    ref="target">
    <div class="absolute top-1 right-1 text-rose-500 cursor-pointer z-20" @click="emits('close')">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6">
        <path fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
          clip-rule="evenodd" />
      </svg>
    </div>
    <form v-if="userData?.name" @submit.prevent="addComment">
      <div class="flex flex-col-reverse gap-1 bg-slate-800/30 p-3 rounded-lg">
        <textarea id="body" cols="30" rows="3" v-model="text" placeholder="Add a comment..."
          class="p-2 outline-none border-none rounded ring-1 ring-slate-500/50 bg-slate-950 text-slate-50 focus-visible:ring-emerald-400 peer resize-none"></textarea>
        <label for="body" class="peer-focus-visible:text-emerald-400 text-sm">Body</label>
      </div>
      <button
        class="outline-none border-none px-3 py-1 mt-2 rounded transition-all bg-sky-600 ease-in hover:bg-sky-700 font-medium active:scale-95 focus-visible:ring-2 focus-visible:ring-sky-600 ring-offset-2 ring-offset-slate-900 float-right">
        Add comment
      </button>
    </form>

    <div :class="userData?.name && 'mt-16 relative'">
      <p v-if="isLoading" class="animate-pulse">Loading comments...</p>
      <h4 class="text-lg text-center font-semibold sticky -top-8 z-10 bg-transparent backdrop-blur-sm p-1 rounded-b-xl">
        Comments • {{
          data?.length }}</h4>
      <TransitionGroup name="comments" tag="ul">
        <div class="mt-3 grid gap-3 h-auto" v-for="comment in data" :key="comment.id">
          <Comment :user-data="userData!" :comment="comment!" :post-id="$props.postId" />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ICurrentUser } from '../layouts/default.vue';

export type IComment = { id: string, text: string, postId: string, commenterId: string, createdAt: string, updatedAt: string, commenter: { name: string, profileImage?: string } }

const props = defineProps<{
  postId: string,

}>()

const emits = defineEmits(['close'])
const queryClient = useQueryClient()
const text = ref("")
const target = ref<HTMLDivElement>()

onClickOutside(target, (event) => emits("close"))

onKeyStroke("Escape", (e) => {
  e.preventDefault()
  emits("close")
})

const { data, isLoading } = useQuery<IComment[]>({
  queryKey: ['comment', props.postId],
  queryFn: () => $fetch(`http://localhost:8080/api/post/comments/${props.postId}`, { credentials: "include" })
})

const { mutateAsync } = useMutation({
  mutationFn: (commentData: { text: string }) => $fetch(`http://localhost:8080/api/post/comment/${props.postId}`, { method: "POST", credentials: "include", body: commentData }),
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['comment', props.postId] })
  },
})

const { data: userData } = useQuery<ICurrentUser>({
  queryKey: ['currentUser'],
  queryFn: () => $fetch("http://localhost:8080/auth/current", { credentials: "include" })
})

async function addComment() {
  await mutateAsync({ text: text.value })
  text.value = ""
}
</script>

<style scoped>
.comments-enter-active,
.comments-leave-active {
  transition: all 0.5s ease;
}

.comments-enter-from,
.comments-leave-to {
  scale: 0.4;
}
</style>
