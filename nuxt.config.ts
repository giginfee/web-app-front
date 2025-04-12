import Aura from "@primevue/themes/aura";

export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@primevue/nuxt-module",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxtjs/apollo",
  ],
  runtimeConfig: {
    public: {
      isGraphql: process.env.IS_GRAPHQL === "true",
      apiUrl: process.env.API_URL,
    },
  },

  apollo: {
    tokenStorage: "cookie",
    clients: {
      default: {
        tokenName: "token",
        httpEndpoint: process.env.API_URL
          ? process.env.API_URL + "/graphql"
          : "http://localhost:4000/graphql",
        defaultOptions: {
          watchQuery: {
            fetchPolicy: "no-cache",
          },
          query: {
            fetchPolicy: "no-cache",
          },
        },
      },
    },
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: ".my-app-dark",
        },
      },
    },
  },
  typescript: {
    typeCheck: true,
  },
  css: ["~/assets/css/global.css", "primeicons/primeicons.css"],
});
