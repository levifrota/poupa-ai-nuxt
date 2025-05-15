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
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.VITE_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.VITE_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.VITE_FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
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
    "nuxt-vuefire"
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
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  vuefire: {
    auth: { enabled: true, sessionCookie: true },
    config: {
      apiKey: process.env.VITE_FIREBASE_API_KEY,
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VITE_FIREBASE_APP_ID,
      measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
    },
  },
  pwa: {},
});