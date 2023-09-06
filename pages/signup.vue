<template>
  <div>
    <form class="grid grid-cols-2 gap-6 bg-slate-900 p-10 max-w-4xl mx-auto mt-2 rounded" @submit.prevent="handleSubmit">
      <h2 class="col-span-2 text-4xl text-center font-semibold pb-5 underline decoration-emerald-500 underline-offset-4">
        Signup form</h2>
      <div class="flex flex-col-reverse gap-1 relative">
        <small class="text-red-500 absolute -bottom-5 right-0" v-if="mutationData?.fields?.includes('name')">
          {{ mutationData?.msg }}
        </small>
        <input type="text" id="name" v-model="name"
          class="p-2 text-lg outline-none border-none rounded ring-1 ring-slate-50 bg-slate-950 text-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-400 peer  transition-all ease-in">
        <label for="name" :class="mutationData?.success && 'text-red-500'"
          class="peer-focus-visible:text-emerald-400 text-xl">Name</label>
      </div>
      <div class="flex flex-col-reverse gap-1 relative">
        <small class="text-red-500 absolute -bottom-5 right-0" v-if="mutationData?.fields?.includes('email')">
          {{ mutationData?.msg }}
        </small>
        <input type="email" id="email" v-model="email"
          class="p-2 text-lg outline-none border-none rounded ring-1 ring-slate-50 bg-slate-950 text-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-400 peer  transition-all ease-in">
        <label for="email" class="peer-focus-visible:text-emerald-400 text-xl transition-all ease-in">Email</label>
      </div>
      <div class="flex flex-col-reverse gap-1 relative col-span-2">
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
          class="p-2 text-lg outline-none border-none rounded ring-1 ring-slate-50 bg-slate-950 text-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-400 peer transition-all ease-in">
        <label for="password" class="peer-focus-visible:text-emerald-400 text-xl transition-all ease-in">Password</label>
      </div>
      <div class="flex flex-col-reverse gap-1 col-span-2 relative">
        <small class="text-red-500 absolute -bottom-5 right-0" v-if="mutationData?.fields?.includes('confirmPassword')">
          {{ mutationData?.msg }}
        </small>
        <input type="password" id="confirm-password" v-model="confirmPassword"
          class="p-2 text-lg outline-none border-none rounded ring-1 ring-slate-50 bg-slate-950 text-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-400 peer  transition-all ease-in">
        <label for="confirm-password" class="peer-focus-visible:text-emerald-400 text-xl transition-all ease-in">Confirm
          password</label>
      </div>
      <div class="flex gap-2 select-none">
        <input type="checkbox" id="loginDirectly" class="hidden" v-model="loginDirectly" />
        <label for="loginDirectly" class="flex gap-2 select-none">
          <div :class="loginDirectly ? 'bg-emerald-700 ring-black/20' : 'bg-slate-400/30 ring-slate-900/5'"
            class="ml-auto pointer-events-auto h-6 w-10 rounded-full p-1 ring-1 ring-inset transition duration-200 ease-in-out">
            <div :class="loginDirectly && 'translate-x-4'"
              class="h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-slate-700/10 transition duration-200 ease-in-out">
            </div>
          </div>
          <span>Login directly?</span>
        </label>
      </div>
      <button
        class="text-xl outline-none border-none bg-sky-600 p-2 rounded transition-all ease-in hover:bg-sky-700 font-medium active:scale-95 focus-visible:ring-2 focus-visible:ring-sky-600 ring-offset-2 ring-offset-slate-900 col-span-2 row-start-6">
        Submit
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { log } from 'util';
import { ICurrentUser } from '../layouts/default.vue';

type INewUser = {
  name: string
  email: string
  password: string
  confirmPassword: string
  loginDirectly: boolean
}

export type IMutationData = {
  success: boolean
  msg: string
  fields?: string[]
}


const showPassword = ref(false)

function toggleShowPassword() {
  showPassword.value = !showPassword.value
}

useHead({
  title: "Signup"
})

const queryClient = useQueryClient()

const name = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const loginDirectly = ref(true)
const config = useRuntimeConfig()

const { data } = useQuery<ICurrentUser>({
  queryKey: ['currentUser'],
  queryFn: () => $fetch(`${config.public.SERVER_URL}/auth/current`, { credentials: "include" })
})


const { mutateAsync, data: mutationData } = useMutation({
  mutationFn: (newUserData: INewUser): Promise<IMutationData> => $fetch(`${config.public.SERVER_URL}/auth/signup`, { method: "POST", body: newUserData, credentials: "include" }),
})


async function handleSubmit() {
  await mutateAsync({
    name: name.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    loginDirectly: loginDirectly.value
  })

  if (mutationData.value?.success) {
    queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    if (loginDirectly.value) {
      navigateTo("/")
    } else {
      navigateTo("/login")
    }
  }
}

if (data.value?.name) {
  navigateTo("/")
}
</script>

<style scoped>
</style>
