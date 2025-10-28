import { defineStore } from "pinia";

export type Theme = "dark" | "light" | "colorblind" | "protanopia" | "deuteranopia" | "tritanopia" | "high-contrast";

export const useThemeStore = defineStore("theme", () => {
  const isValidTheme = (value: string | null): value is Theme => {
    return value === "dark" || value === "light" || value === "colorblind"
      || value === "protanopia" || value === "deuteranopia" || value === "tritanopia"
      || value === "high-contrast";
  };

  const getSavedTheme = (): Theme => {
    if (import.meta.server) return "dark";

    const themeCookie = useCookie<string>("theme");
    const saved = themeCookie.value;
    return isValidTheme(saved) ? saved : "dark";
  };

  const theme = ref<Theme>(getSavedTheme());

  const applyTheme = (newTheme: Theme) => {
    if (import.meta.server) return;

    document.documentElement.classList.remove("dark", "light", "colorblind", "protanopia", "deuteranopia", "tritanopia", "high-contrast");

    document.documentElement.classList.add(newTheme);

    const themeCookie = useCookie<string>("theme", {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    themeCookie.value = newTheme;
  };

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    applyTheme(newTheme);
  };

  // Inicializar tema apenas no cliente
  if (import.meta.client) {
    onMounted(() => {
      // Reaplicar o tema salvo após a montagem
      const savedTheme = getSavedTheme();
      theme.value = savedTheme;
      applyTheme(savedTheme);
    });
  }

  watch(theme, (newTheme) => {
    applyTheme(newTheme);
  });

  return {
    theme,
    setTheme,
  };
});
