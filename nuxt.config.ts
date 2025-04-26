// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/app/assets/css/tailwind.css"],
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.NUXT_FIREBASE_API_KEY,
    },
  },

  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "shadcn-nuxt",
    "@vite-pwa/nuxt",
    "@pinia/nuxt",
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./app/_components/ui"
     */
    componentDir: "./app/_components/ui",
  },

  pwa: {},
});
