<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">{{ t('settings_title') }}</h1>

    <div class="bg-card rounded-lg p-6 shadow-sm mb-6">
      <h2 id="theme-settings-heading" class="text-xl font-semibold mb-4">{{ t('theme_section_title') }}</h2>
      <div class="space-y-4">
        <div>
          <h3 id="general-themes-label" class="text-sm font-medium mb-3">{{ t('general_themes_label') }}</h3>
          <div class="w-full max-w-xs">
            <Select v-model="themeStore.theme" @update:model-value="themeStore.setTheme">
              <SelectTrigger class="w-full" :aria-labelledby="general-themes-label">
                <SelectValue :placeholder="t('select_theme_placeholder')" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{{ t('general_themes_group_label') }}</SelectLabel>
                  <SelectItem value="dark">
                    <Icon name="lucide:moon" class="mr-2" aria-hidden="true" />
                    {{ t('theme_dark') }}
                  </SelectItem>
                  <SelectItem value="light">
                    <Icon name="lucide:sun" class="mr-2" aria-hidden="true" />
                    {{ t('theme_light') }}
                  </SelectItem>
                  <SelectItem value="high-contrast">
                    <Icon name="lucide:zap" class="mr-2" aria-hidden="true" />
                    {{ t('theme_high_contrast') }}
                  </SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>{{ t('colorblind_themes_group_label') }}</SelectLabel>
                  <SelectItem value="colorblind"> <!-- This key might need adjustment if it's too generic -->
                    <Icon name="lucide:eye" class="mr-2" aria-hidden="true" />
                    {{ t('theme_colorblind_general') }}
                  </SelectItem>
                  <SelectItem value="protanopia">
                    <Icon name="lucide:eye" class="mr-2" aria-hidden="true" />
                    {{ t('theme_protanopia') }}
                  </SelectItem>
                  <SelectItem value="deuteranopia">
                    <Icon name="lucide:eye" class="mr-2" aria-hidden="true" />
                    {{ t('theme_deuteranopia') }}
                  </SelectItem>
                  <SelectItem value="tritanopia">
                    <Icon name="lucide:eye" class="mr-2" aria-hidden="true" />
                    {{ t('theme_tritanopia') }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <p class="text-xs text-muted-foreground mt-2">
            {{ t('colorblind_themes_description') }}
          </p>
        </div>
      </div>
    </div>

    <div class="bg-card rounded-lg p-6 shadow-sm mb-6">
      <h2 id="font-settings-heading" class="text-xl font-semibold mb-4">{{ t('font_section_title') }}</h2>
      <div class="space-y-6">
        <div>
          <h3 id="font-family-label" class="text-sm font-medium mb-3">{{ t('font_family_label') }}</h3>
          <div class="w-full max-w-xs">
            <Select
              v-model="fontStore.fontFamily"
              @update:model-value="fontStore.setFontFamily"
            >
              <SelectTrigger class="w-full" :aria-labelledby="font-family-label">
                <SelectValue :placeholder="t('select_font_family_placeholder')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">
                  <Icon name="lucide:type" class="mr-2" aria-hidden="true" />
                  {{ t('font_default') }}
                </SelectItem>
                <SelectItem value="open-dyslexic">
                  <Icon name="lucide:book-open" class="mr-2" aria-hidden="true" />
                  {{ t('font_open_dyslexic') }}
                </SelectItem>
                <SelectItem value="arial">
                  <Icon name="lucide:type" class="mr-2" aria-hidden="true" />
                  {{ t('font_arial') }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <h3 id="font-size-label" class="text-sm font-medium mb-3">{{ t('font_size_label') }}</h3>
          <div class="w-full max-w-xs">
            <Select
              v-model="fontStore.fontSize"
              @update:model-value="fontStore.setFontSize"
            >
              <SelectTrigger class="w-full" :aria-labelledby="font-size-label">
                <SelectValue :placeholder="t('select_font_size_placeholder')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">
                  <Icon name="lucide:text" class="mr-2" aria-hidden="true" />
                  {{ t('font_size_small') }}
                </SelectItem>
                <SelectItem value="medium">
                  <Icon name="lucide:text" class="mr-2" aria-hidden="true" />
                  {{ t('font_size_medium') }}
                </SelectItem>
                <SelectItem value="large">
                  <Icon name="lucide:text" class="mr-2" aria-hidden="true" />
                  {{ t('font_size_large') }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'; // Assuming path
import { useFontStore } from '@/stores/font';   // Assuming path
import { useI18n } from '#imports';

const { t } = useI18n();
const themeStore = useThemeStore();
const fontStore = useFontStore();

// It seems like Select, SelectTrigger etc. are auto-imported by shadcn-nuxt or similar.
// If not, they would need to be imported explicitly.
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectSeparator,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
</script>
