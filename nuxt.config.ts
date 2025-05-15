// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    head: {
      title: "Poupa.ai",
      htmlAttrs: {
        lang: "pt-br",
      },
      meta: [{ name: "description", content: "Nuxt 3 App" }],
      link: [{ rel: "icon", type: "image/x-icon", href: "/icon.png" }],
      charset: 'utf-16',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    },
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
      global: true,
    },
  ],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/app/assets/css/tailwind.css", "~/app/assets/css/fonts.css"],
  // runtimeConfig: {
  //   public: {
  //     firebaseApiKey: process.env.NUXT_FIREBASE_API_KEY,
  //   },
  // },

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
    optimizeDeps: {
      include: [
        "isomorphic-dompurify"
      ],
    },
    ssr: {
      noExternal: [
        "isomorphic-dompurify"
      ],
    },
    resolve: {
      alias: {
        'isomorphic-dompurify': 'isomorphic-dompurify'
      }
    }
  },

  typescript: {
    strict: true,
    tsConfig: {
      compilerOptions: {
        moduleResolution: 'nodenext',
        esModuleInterop: true,
        skipLibCheck: true
      }
    }
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },

  pwa: {},
});
