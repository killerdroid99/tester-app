<template>
  <form class="grid gap-8 bg-slate-900 p-10 max-w-2xl mx-auto mt-6 rounded" @submit.prevent="handleSubmit">
    <div class="flex flex-col-reverse gap-1 relative">
      <small class="text-red-500 absolute -bottom-5 right-0" v-if="mutationData?.fields?.includes('email')">
        {{ mutationData?.msg }}
      </small>
      <input type="email" id="email" v-model="email"
        class="p-2 text-lg outline-none border-none rounded ring-1 ring-slate-50 bg-slate-950 text-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-400 peer">
      <label for="email" class="peer-focus-visible:text-emerald-400 text-xl">Email</label>
    </div>
    <div class="flex flex-col-reverse gap-1 relative">
      <span class="absolute -bottom-7 right-0">
        <NuxtLink to="/forgot-password" class="text-indigo-400 hover:underline underline-offset-2">
          Forgot password?
        </NuxtLink>
      </span>
      <small class="text-red-500 absolute -bottom-5 right-0" v-if="mutationData?.fields?.includes('password')">
        {{ mutationData?.msg }}
      </small>
      <div class="absolute right-2 bottom-[10px]  cursor-pointer rounded-full hover:bg-slate-700/60 w-fit p-px"
        :title="showPassword ? 'hide password' : 'show password'" @click="toggleShowPassword">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-6 h-6" v-if="!showPassword">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-6 h-6" v-if="showPassword">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      </div>
      <input :type="!showPassword ? 'password' : 'text'" id="password" v-model="password"
        class="p-2 text-lg outline-none border-none rounded ring-1 ring-slate-50 bg-slate-950 text-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-400 peer">
      <label for="password" class="peer-focus-visible:text-emerald-400 text-xl">Password</label>
    </div>
    <button
      class="text-xl outline-none border-none bg-sky-600 p-2 rounded transition-all ease-in hover:bg-sky-700 font-medium active:scale-95 focus-visible:ring-2 focus-visible:ring-sky-600 ring-offset-2 ring-offset-slate-900 mt-2">
      Submit
    </button>
  </form>
</template>

<script setup lang="ts">
import { ICurrentUser } from '../layouts/default.vue';
import { IMutationData } from './signup.vue';

type IUser = {
  email: string,
  password: string
}

const email = ref("")
const password = ref("")

const showPassword = ref(false)
const queryClient = useQueryClient()
const config = useRuntimeConfig()

function toggleShowPassword() {
  showPassword.value = !showPassword.value
}

useHead({
  title: "Login"
})

const { mutateAsync, data: mutationData } = useMutation({
  mutationFn: (userData: IUser): Promise<IMutationData> => $fetch(`${config.public.SERVER_URL}/auth/login`, { method: "POST", body: userData, credentials: "include" }),
})

async function handleSubmit() {
  await mutateAsync({ email: email.value, password: password.value })

  if (mutationData.value?.success) {
    navigateTo("/")
    queryClient.invalidateQueries({ queryKey: ['currentUser'] })
  }
}

const { data } = useQuery<ICurrentUser>({
  queryKey: ['currentUser'],
  queryFn: () => $fetch(`${config.public.SERVER_URL}/auth/current`, { credentials: "include" })
})


// definePageMeta({
//   middleware: function (to: string, from: string) {
//     if (data.value?.name) {
//       return navigateTo("/")
//     }
//   }
// })
</script>

<style scoped>
</style>
