import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export type Theme = 'dark' | 'light' | 'colorblind';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(
    (typeof window !== 'undefined' && localStorage.getItem('theme') as Theme) || 'dark'
  );

  const applyTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return;
    
    document.documentElement.classList.remove('dark', 'light', 'colorblind');
    
    document.documentElement.classList.add(newTheme);
    
    localStorage.setItem('theme', newTheme);
  };

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    applyTheme(newTheme);
  };

  if (typeof window !== 'undefined') {
    applyTheme(theme.value);
  }

  watch(theme, (newTheme) => {
    applyTheme(newTheme);
  });

  return {
    theme,
    setTheme
  };
});