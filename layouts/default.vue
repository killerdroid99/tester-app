<template>
  <header
    class="flex flex-col gap-3 md:flex-row md:justify-between p-3 lg:py-8 lg:px-[18dvw] items-center sticky top-0 backdrop-blur-sm z-10">
    <NuxtLoadingIndicator color="green" :height="3" class="z-30" />
    <NuxtLink to="/">
      <h2 class="text-3xl font-bold"><span class="text-emerald-500">Test</span>_er</h2>
    </NuxtLink>

    <nav class="flex items-center gap-6 lg:text-lg select-none text-base">
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
</style>
