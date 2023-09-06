<template>
  <div class="bg-slate-800/30 p-4 rounded-lg relative select-none flex gap-3" ref="target">
    <div v-if="comment.commenter.profileImage" class="">
      <img :src="comment.commenter.profileImage" class="w-7 h-7 rounded-full" />
    </div>
    <div v-else>
      <img src="/dummy.jpeg" class="w-8 h-8 rounded-full" />
    </div>
    <div class="flex-1">
      <span class="flex items-center gap-[0.3rem] text-slate-400">
        <h5 class=" font-bold">{{ comment.commenterId === userData?.id ? "You" : comment.commenter.name }} </h5>•<time
          class="text-xs">{{
            useDateFormat(comment.createdAt, 'MMM D').value }}</time>
        <span v-if="comment.createdAt !== comment.updatedAt" class="text-xs">(edited)</span>
      </span>
      <div class="flex absolute top-3 gap-3 right-3 text-sm" v-if="comment.commenterId === userData?.id">
        <p class="hover:underline cursor-pointer" :class="commentEditMode && 'text-amber-500'"
          @click="() => commentEditMode = !commentEditMode">
          Edit
        </p>
        <p class="hover:underline cursor-pointer" :class="commentDeleteMode && 'text-rose-500'"
          @click="() => commentDeleteMode = !commentDeleteMode">Delete</p>
      </div>
      <p class=" mt-1 select-text tracking-wide leading-snug" v-if="!commentEditMode">{{ comment.text }}</p>
      <form v-if="commentEditMode" class="mt-1" @submit.prevent="handleSubmit">
        <textarea id="body" v-model="text" ref="ta"
          class="p-2 outline-none border-none rounded ring-1 ring-slate-500/50 bg-slate-950 text-slate-50 focus-visible:ring-emerald-400 peer resize-none w-full tracking-wide leading-snug h-28"></textarea>
        <div class="grid gap-3 grid-flow-col float-right mt-3">
          <button
            class="outline-none border-none px-3 text-sm py-1 rounded transition-all bg-emerald-600 ease-in hover:bg-emerald-700 font-medium active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-600 ring-offset-2 ring-offset-slate-900">
            Save
          </button>
          <button type="button" @click="() => commentEditMode = !commentEditMode"
            class="outline-none border-none px-3 text-sm py-1 rounded transition-all bg-rose-600 ease-in hover:bg-rose-700 font-medium active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-600 ring-offset-2 ring-offset-slate-900">
            Cancel
          </button>
        </div>
      </form>
      <div class="absolute bg-slate-900/70 inset-0 grid place-items-center backdrop-blur-sm grid-flow-col px-10"
        v-if="commentDeleteMode">
        <div class="cursor-pointer hover:text-emerald-500" @click="() => commentDeleteMode = !commentDeleteMode">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-xl font-mono font-semibold">Delete this comment ?</p>
        <div class="cursor-pointer hover:text-red-500" @click="handleDelete">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ICurrentUser } from '../layouts/default.vue';
import { IComment } from './Comments.vue';

const { comment, userData, postId } = defineProps<{
  comment: IComment
  userData: ICurrentUser
  postId: string
}>()

const commentEditMode = ref(false)
const commentDeleteMode = ref(false)
const target = ref<HTMLDivElement>()
const queryClient = useQueryClient()

const text = ref("")
const ta = ref<HTMLTextAreaElement>()

const { focused } = useFocus(ta, { initialValue: true })
const config = useRuntimeConfig()

onMounted(() => text.value = comment.text)
onClickOutside(target, (event) => (commentDeleteMode.value = false))

const { mutateAsync: editAsync } = useMutation({
  mutationFn: (commentData: { text: string }) => $fetch(`${config.public.SERVER_URL}/api/post/comment/${comment.id}`, { method: "PATCH", credentials: "include", body: commentData }),
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['comment', postId] })
    commentEditMode.value = false
  },
})

const { mutateAsync: deleteAsync } = useMutation({
  mutationFn: () => $fetch(`${config.public.SERVER_URL}/api/post/comment/${comment.id}`, { method: "DELETE", credentials: "include" }),
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['comment', postId] })
    commentEditMode.value = false
  },
})

async function handleSubmit() {
  if (text.value) {
    await editAsync({
      text: text.value
    })
  }
}

async function handleDelete() {
  await deleteAsync()
}
</script>

<style scoped>
</style>

