<template>
  <header
    class="flex flex-col gap-3 md:flex-row md:justify-between p-3 lg:py-8 lg:px-[18dvw] items-center sticky top-0 backdrop-blur-sm z-10">
    <NuxtLoadingIndicator color="green" :height="3" class="z-30" />
    <NuxtLink to="/">
      <h2 class="text-3xl font-bold"><span class="text-emerald-500">Test</span>_er</h2>
    </NuxtLink>

    <!-- menu btn -->
    <div class="absolute right-4 top-4 cursor-pointer hover:bg-slate-700/60 rounded-full md:hidden block"
      @click="() => isSidebar = true" v-if="!isSidebar">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
        <path fill="currentColor"
          d="M224 128a8 8 0 0 1-8 8H40a8 8 0 0 1 0-16h176a8 8 0 0 1 8 8ZM40 72h176a8 8 0 0 0 0-16H40a8 8 0 0 0 0 16Zm176 112H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16Z" />
      </svg>
    </div>
    <!-- x btn -->
    <div class="absolute right-4 top-4 cursor-pointer hover:bg-slate-700/60 rounded-full md:hidden block"
      @click="() => isSidebar = false" v-else>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
        <path fill="currentColor"
          d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z" />
      </svg>
    </div>

    <nav class="items-center gap-6 lg:text-lg select-none text-base hidden md:flex">
      <CustomLink to="/">Home</CustomLink>
      <CustomLink to="/about">About</CustomLink>
      <CustomLink to="/login" v-if="!data?.name">Login</CustomLink>
      <CustomLink to="/signup" v-if="!data?.name">Signup</CustomLink>
      <CustomLink to="/add-post" v-if="data?.name">Add post</CustomLink>
      <CustomLink to="/profile" title="view profile" class="font-bold text-2xl inline-flex items-center gap-3"
        v-if="data?.name">
        <div v-if="data?.profileImage" class="">
          <img :src="data.profileImage" class="w-8 h-8 rounded-full" />
        </div>
        <div v-else class="">
          <img src="/dummy.jpeg" class="w-8 h-8 rounded-full" />
        </div>
        {{ data?.name }}
      </CustomLink>
      <button v-if="data?.name" @click="handleLogout" :disabled="isLogoutLoading"
        :class="isLogoutLoading ? 'animate-pulse bg-gray-600' : 'bg-rose-600'"
        class="outline-none border-none px-3 py-1 rounded transition-all ease-in hover:bg-rose-700 font-medium active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-600 ring-offset-2 ring-offset-slate-900">
        {{ isLogoutLoading ? 'Logging out...' : 'Logout' }}
      </button>
    </nav>
  </header>

  <!-- sidebar for mobiles -->
  <Transition name="sidebar" tag="div">
    <div v-if="isSidebar"
      class="fixed h-screen bg-slate-900/80 backdrop-blur-xl z-20 inset-0 w-2/3 flex flex-col justify-between"
      ref="sidebar">
      <div class="flex flex-col text-lg gap-2 p-8">
        <CustomLink @click="() => isSidebar = false" class="p-4 hover:bg-gray-600/30 rounded flex items-center gap-4"
          to="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
            <path fill="currentColor"
              d="M240 208h-16v-92.45a16 16 0 0 0-5.17-11.78l-80-75.48a1.14 1.14 0 0 1-.11-.11a16 16 0 0 0-21.53 0l-.11.11l-79.91 75.48A16 16 0 0 0 32 115.55V208H16a8 8 0 0 0 0 16h224a8 8 0 0 0 0-16ZM48 115.55l.11-.1L128 40l79.9 75.43l.11.1V208H160v-48a16 16 0 0 0-16-16h-32a16 16 0 0 0-16 16v48H48ZM144 208h-32v-48h32Z" />
          </svg>
          Home
        </CustomLink>
        <CustomLink @click="() => isSidebar = false" class="p-4 hover:bg-gray-600/30 rounded flex items-center gap-4"
          to="/about">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
            <path fill="currentColor"
              d="M225.9 102.8c-3.8-3.9-7.7-8-9.2-11.5s-1.4-8.7-1.5-14c-.1-9.7-.3-20.8-8-28.5s-18.8-7.9-28.5-8c-5.3-.1-10.7-.2-14-1.5s-7.6-5.4-11.5-9.2C146.3 23.5 138.4 16 128 16s-18.3 7.5-25.2 14.1c-3.9 3.8-8 7.7-11.5 9.2s-8.7 1.4-14 1.5c-9.7.1-20.8.3-28.5 8s-7.9 18.8-8 28.5c-.1 5.3-.2 10.7-1.5 14s-5.4 7.6-9.2 11.5C23.5 109.7 16 117.6 16 128s7.5 18.3 14.1 25.2c3.8 3.9 7.7 8 9.2 11.5s1.4 8.7 1.5 14c.1 9.7.3 20.8 8 28.5s18.8 7.9 28.5 8c5.3.1 10.7.2 14 1.5s7.6 5.4 11.5 9.2c6.9 6.6 14.8 14.1 25.2 14.1s18.3-7.5 25.2-14.1c3.9-3.8 8-7.7 11.5-9.2s8.7-1.4 14-1.5c9.7-.1 20.8-.3 28.5-8s7.9-18.8 8-28.5c.1-5.3.2-10.7 1.5-14s5.4-7.6 9.2-11.5c6.6-6.9 14.1-14.8 14.1-25.2s-7.5-18.3-14.1-25.2Zm-11.6 39.3c-4.8 5-9.7 10.2-12.4 16.5s-2.6 13.1-2.7 19.8s-.2 14.4-3.3 17.5s-10.4 3.2-17.5 3.3s-13.7.2-19.8 2.7s-11.5 7.6-16.5 12.4S132 224 128 224s-9.1-4.9-14.1-9.7s-10.2-9.7-16.5-12.4s-13.1-2.6-19.8-2.7s-14.4-.2-17.5-3.3s-3.2-10.4-3.3-17.5s-.2-13.7-2.7-19.8s-7.6-11.5-12.4-16.5S32 132 32 128s4.9-9.1 9.7-14.1s9.7-10.2 12.4-16.5s2.6-13.1 2.7-19.8s.2-14.4 3.3-17.5s10.4-3.2 17.5-3.3s13.7-.2 19.8-2.7s11.5-7.6 16.5-12.4S124 32 128 32s9.1 4.9 14.1 9.7s10.2 9.7 16.5 12.4s13.1 2.6 19.8 2.7s14.4.2 17.5 3.3s3.2 10.4 3.3 17.5s.2 13.7 2.7 19.8s7.6 11.5 12.4 16.5S224 124 224 128s-4.9 9.1-9.7 14.1ZM140 180a12 12 0 1 1-12-12a12 12 0 0 1 12 12Zm24-72a36 36 0 0 1-28 35.1v.9a8 8 0 0 1-16 0v-8a8 8 0 0 1 8-8a20 20 0 1 0-20-20a8 8 0 0 1-16 0a36 36 0 0 1 72 0Z" />
          </svg>
          About
        </CustomLink>
        <CustomLink @click="() => isSidebar = false" class="p-4 hover:bg-gray-600/30 rounded flex items-center gap-4"
          to="/login" v-if="!data?.name">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
            <path fill="currentColor"
              d="m141.66 133.66l-40 40a8 8 0 0 1-11.32-11.32L116.69 136H24a8 8 0 0 1 0-16h92.69L90.34 93.66a8 8 0 0 1 11.32-11.32l40 40a8 8 0 0 1 0 11.32ZM192 32h-56a8 8 0 0 0 0 16h56v160h-56a8 8 0 0 0 0 16h56a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16Z" />
          </svg>
          Login
        </CustomLink>
        <CustomLink @click="() => isSidebar = false" class="p-4 hover:bg-gray-600/30 rounded flex items-center gap-4"
          to="/signup" v-if="!data?.name">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
            <path fill="currentColor"
              d="M168 56a8 8 0 0 1 8-8h16V32a8 8 0 0 1 16 0v16h16a8 8 0 0 1 0 16h-16v16a8 8 0 0 1-16 0V64h-16a8 8 0 0 1-8-8Zm62.56 54.68a103.92 103.92 0 1 1-85.24-85.24a8 8 0 0 1-2.64 15.78A88.07 88.07 0 0 0 40 128a87.62 87.62 0 0 0 22.24 58.41a79.66 79.66 0 0 1 36.06-28.75a48 48 0 1 1 59.4 0a79.66 79.66 0 0 1 36.06 28.75A87.62 87.62 0 0 0 216 128a88.85 88.85 0 0 0-1.22-14.68a8 8 0 1 1 15.78-2.64ZM128 152a32 32 0 1 0-32-32a32 32 0 0 0 32 32Zm0 64a87.57 87.57 0 0 0 53.92-18.5a64 64 0 0 0-107.84 0A87.57 87.57 0 0 0 128 216Z" />
          </svg>
          Signup
        </CustomLink>
        <CustomLink @click="() => isSidebar = false" class="p-4 hover:bg-gray-600/30 rounded  flex items-center gap-4"
          to="/add-post" v-if="data?.name">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
            <path fill="currentColor"
              d="m227.32 73.37l-44.69-44.68a16 16 0 0 0-22.63 0L36.69 152A15.86 15.86 0 0 0 32 163.31V208a16 16 0 0 0 16 16h168a8 8 0 0 0 0-16H115.32l112-112a16 16 0 0 0 0-22.63ZM136 75.31L152.69 92L68 176.69L51.31 160ZM48 208v-28.69L76.69 208Zm48-3.31L79.32 188L164 103.31L180.69 120Zm96-96L147.32 64l24-24L216 84.69Z" />
          </svg>
          Add post
        </CustomLink>
      </div>
      <div class="flex items-center justify-between p-2 bg-gray-600/30 rounded-xl rounded-l-full mx-4 mb-4"
        v-if="data?.name">
        <CustomLink @click="() => isSidebar = false" to="/profile" title="view profile"
          class="font-bold inline-flex items-center gap-2">
          <div v-if="data?.profileImage">
            <img :src="data.profileImage" class="w-12 h-12 rounded-full" />
          </div>
          <div v-else>
            <img src="/dummy.jpeg" class="w-8 h-8 rounded-full" />
          </div>
          <div class="grid">
            <p class="text-lg">{{ data?.name }}</p>
            <p class="text-sm font-normal text-slate-400">{{ data.email }}</p>
          </div>
        </CustomLink>
        <button v-if="data?.name" @click="handleLogout" :disabled="isLogoutLoading"
          :class="isLogoutLoading ? 'animate-pulse bg-gray-600' : 'bg-rose-600'"
          class="outline-none border-none px-4 py-2 rounded transition-all ease-in hover:bg-rose-700 font-medium active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-600 ring-offset-2 ring-offset-slate-900">
          {{ isLogoutLoading ? 'Logging out...' : 'Logout' }}
        </button>
      </div>
    </div>
  </Transition>

  <main class=" p-3 lg:py-6 lg:px-[18dvw]">
    <slot />
  </main>
  <Footer />
</template>

<script setup lang="ts">
export type ICurrentUser = {
  id: string,
  name: string,
  email: string,
  password: string
  profileImage?: string
}

const queryClient = useQueryClient()
const config = useRuntimeConfig()

const isSidebar = ref(false)
const sidebar = ref<HTMLDivElement>()

onClickOutside(sidebar, () => {
  isSidebar.value = false
})


const { data } = useQuery<ICurrentUser>({
  queryKey: ['currentUser'],
  queryFn: () => $fetch(`${config.public.SERVER_URL}/auth/current`, { credentials: "include" })
})

const el = ref<HTMLElement>()


const { mutateAsync, isLoading: isLogoutLoading } = useMutation({
  mutationFn: () => $fetch(`${config.public.SERVER_URL}/auth/logout`, { method: "POST", credentials: "include" }),
})

async function handleLogout() {
  await mutateAsync()
  queryClient.invalidateQueries({ queryKey: ['currentUser'] })

}
</script>

<style>
body {
  @apply bg-slate-950 text-slate-50 scrollbar-thin scrollbar-thumb-slate-900 scrollbar-track-slate-500
}

.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.2s ease;
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
  transition: all 150ms ease-in 0s
}
</style>
