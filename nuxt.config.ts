// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: {
		public: {
			SERVER_URL: process.env.SERVER_URL,
		},
	},
	devtools: { enabled: true },
	modules: [
		"@nuxtjs/tailwindcss",
		"@hebilicious/vue-query-nuxt",
		"@vueuse/nuxt",
	],
	tailwindcss: {
		exposeConfig: true,
		cssPath: "~/assets/css/tailwind.css",
	},
	routeRules: {
		"/": { prerender: true },
		"/post/**": { isr: true },
	},
});
