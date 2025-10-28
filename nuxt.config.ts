// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineNuxtConfig({

  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "shadcn-nuxt",
    "@vite-pwa/nuxt",
    "@pinia/nuxt",
    "nuxt-vuefire",
  ],

  ssr: false,
  components: [
    {
      path: "@/components",
      pathPrefix: false,
      global: true,
    },
  ],
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  app: {
    head: {
      title: "Poupa.ai",
      htmlAttrs: {
        lang: "pt-br",
      },
      meta: [{ name: "description", content: "Poupa.ai" }],
      link: [{ rel: "icon", type: "image/x-icon", href: "/icon.png" }],
      charset: "utf-16",
      viewport: "width=device-width, initial-scale=1, maximum-scale=2",
    },
  },
  css: ["@/assets/css/tailwind.css", "@/assets/css/fonts.css", "@/assets/css/icons.css"],

  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => ["iconify-icon"].includes(tag),
    },
  },
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

  alias: {
    "@": fileURLToPath(new URL("./app", import.meta.url)),
    "~": fileURLToPath(new URL("./", import.meta.url)),
  },

  experimental: {
    // Adicionar configurações experimentais do Nuxt 4
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },
  compatibilityDate: "2024-11-01",

  nitro: {
    publicAssets: [
      {
        baseUrl: "/",
        dir: "public",
      },
    ],
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "isomorphic-dompurify",
        "firebase/auth",
        "firebase/firestore",
        "firebase/app",
        "reka-ui",
      ],
    },
    ssr: {
      noExternal: [
        "isomorphic-dompurify",
        "firebase",
        "reka-ui",
      ],
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./app", import.meta.url)),
        "~": fileURLToPath(new URL("./", import.meta.url)),
        "isomorphic-dompurify": "isomorphic-dompurify",
      },
    },
    server: {
      hmr: {
        timeout: 60000,
        overlay: true, // Mudar para true
        clientPort: 3000, // Adicionar porta específica
      },
      watch: {
        usePolling: true, // Mudar para true
        interval: 1000,
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  pwa: {
    useCredentials: true,
    registerType: "autoUpdate",
    includeAssets: ["icon.png", "icons/*.png"],
    manifest: {
      name: "Poupa.ai",
      short_name: "Poupa.ai",
      description: "Seu assistente financeiro pessoal",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
      scope: "/",
      start_url: "/",
      lang: "pt-BR",
      orientation: "portrait-primary",
      icons: [
        {
          src: "icons/icon144.png",
          sizes: "144x144",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "icons/icon192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "icons/icon192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "icons/icon512_maskable.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "icons/icon512_rounded.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
      navigateFallbackDenylist: [/^\/api\//],
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\./i,
          handler: "NetworkFirst",
          options: {
            cacheName: "api-cache",
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24,
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: false,
      type: "module",
      suppressWarnings: true,
    },
  },

  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
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
});
