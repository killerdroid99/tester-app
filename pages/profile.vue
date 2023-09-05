<template>
  <div class="grid gap-5">
    <div ref="profilePic"
      class="bg-slate-800 w-96 h-96 relative overflow-hidden grid place-items-center rounded-xl select-none mx-auto"
      :class="isOverDropZone ? 'ring-2 ring-emerald-500' : ''">
      <div>
        <img v-if="img && img.length > 0" :src="img" class="aspect-auto w-52 bg-cover">
        <span v-if="!img" class="font-bold">Drop image here or <span
            class="text-indigo-500 hover:underline cursor-pointer underline-offset-2" @click="open()">choose
            file</span></span>
        <div v-if="img && img.length > 0" class="flex gap-2 absolute bottom-4">
          <button @click="deselect"
            class=" outline-none border-none px-3 py-1 rounded transition-all ease-in bg-indigo-500 hover:bg-indigo-700 font-medium active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-600 ring-offset-2 ring-offset-slate-900">
            Deselect
          </button>
          <button @click="imageUpload"
            class="outline-none border-none px-3 py-1 rounded transition-all ease-in bg-emerald-500 hover:bg-emerald-700 font-medium active:scale-95 focus-visible:ring-2 focus-visible:ring-emerald-600 ring-offset-2 ring-offset-slate-900">
            Upload
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col-reverse gap-2">
      <input type="text" id="name" v-model="name"
        class="p-2 text-lg outline-none border-none rounded ring-1 ring-slate-50 bg-slate-950 text-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-400 peer">
      <label for="name" class="peer-focus-visible:text-emerald-400 text-xl">Edit Name</label>
    </div>

    <button type="button"
      class="text-xl outline-none border-none bg-inherit p-2 rounded transition-transform ease-in hover:bg-inherit font-medium text-red-600 active:scale-95 ring-red-600 ring-offset-1 ring-offset-slate-950 focus-visible:ring-2 outline-2 outline-red-600">
      Change password
    </button>


  </div>
</template>

<script setup lang="ts">
import { ICurrentUser } from 'layouts/default.vue';

const name = ref()
const profilePic = ref<HTMLDivElement>()
const img = ref<string>()
const imgFile = ref<File>()
const queryClient = useQueryClient()

const { open, onChange } = useFileDialog()

onChange((files) => {
  if (files) {
    img.value = URL.createObjectURL(files[0])
    imgFile.value = files[0]
  }
})

function onDrop(files: File[] | null) {
  if (files) {
    img.value = URL.createObjectURL(files[0])
    imgFile.value = files[0]
  }
}

function deselect() {
  img.value = ''
  imgFile.value = undefined
}

const { data } = useQuery<ICurrentUser>({
  queryKey: ['currentUser'],
  queryFn: () => $fetch("http://localhost:8080/auth/current", { credentials: "include" })
})

const { mutateAsync, data: mutationData } = useMutation({
  mutationFn: (data: FormData) => $fetch("http://localhost:8080/auth/profile/picture", { method: "PUT", body: data, credentials: "include" }),
})

async function imageUpload() {
  if (img.value !== '') {
    const formData = new FormData();
    formData.append('image', imgFile.value as File, imgFile.value?.name)

    await mutateAsync(formData)
    queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    window.location.reload()
  }
}

const { isOverDropZone } = useDropZone(profilePic, onDrop)

useHead({
  title: `Profile | ${data.value?.name}`
})
</script>

<style scoped>
</style>
