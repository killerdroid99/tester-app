<template>
  <form @submit.prevent="handleSubmit" class="grid gap-3 bg-slate-900 p-10 max-w-2xl mx-auto mt-6">
    <div class="flex flex-col-reverse gap-2 relative">
      <small class="text-red-500 absolute -bottom-5 right-0"
        v-if="mutationData?.fields?.includes('email') && !mutationData?.success">
        {{ mutationData?.msg }}
      </small>
      <input type="email" id="email" v-model="email"
        class="p-2 text-lg outline-none border-none rounded ring-1 ring-slate-50 bg-slate-950 text-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-400 peer">
      <label for="email" class="peer-focus-visible:text-emerald-400 text-xl">Enter your email</label>
    </div>
    <button :disabled="disableBtn"
      class="text-xl outline-none border-none bg-sky-600 p-2 rounded transition-all ease-in hover:bg-sky-700 font-medium active:scale-95 focus-visible:ring-2 focus-visible:ring-sky-600 ring-offset-2 ring-offset-slate-900 mt-5">
      Get link
    </button>
  </form>

  <div v-if="mutationData?.success" class="mx-auto bg-emerald-600/80 w-fit p-5 rounded mt-5">
    {{ mutationData?.msg }}
  </div>
</template>

<script setup lang="ts">
const email = ref("")
const disableBtn = ref(false)

const { mutateAsync, data: mutationData } = useMutation({
  mutationFn: (email: string): Promise<any> => $fetch("http://localhost:8080/auth/forgot-password", { method: "POST", body: { email } }),
})

async function handleSubmit() {
  await mutateAsync(email.value)
  disableBtn.value = true
}
</script>

<style scoped>
</style>
