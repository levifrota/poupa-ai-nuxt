// @ts-check
import { createConfigForNuxt } from "@nuxt/eslint-config/flat";

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: {
      semi: true,
      quotes: "double",
    },
  },
}).override("nuxt/vue/rules", {
  rules: {
    "vue/multi-word-component-names": "off",
    "vue/no-v-html": "off",
  },
});
