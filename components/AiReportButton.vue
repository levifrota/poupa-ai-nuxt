<script setup lang="ts">
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import generateAiReport from "@/app/_actions/generate-ai-report";
import { useI18n } from '#imports'; // Added

const { t } = useI18n(); // Added

const loading = ref(false);
const report = ref<string | null>(null);

async function handleGenerateReportClick() {
  loading.value = true;
  try {
    // TODO: Month should be dynamic, not hardcoded
    const aiReport = await generateAiReport({ month: "2" });
    report.value = DOMPurify.sanitize(marked.parse(aiReport));
  } catch (error) {
    console.error(error);
    // Consider adding a user-facing error message here, also internationalized
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button>
        {{ t('ai_report_button') }}
        <Icon name="lucide:bot" class="ml-2" /> <!-- Changed mr-2 to ml-2 for potentially better spacing -->
      </Button>
    </DialogTrigger>
    <DialogContent class="max-h-[90%] max-w-[90%] sm:max-h-none sm:max-w-[450px]">
      <DialogHeader>
        <DialogTitle>{{ t('ai_report_title') }}</DialogTitle>
        <DialogDescription>
          {{ t('ai_report_description') }} <br />
          <span class="text-red-500">
            {{ t('ai_report_warning') }}
          </span>
        </DialogDescription>
      </DialogHeader>

      <ScrollArea class="prose max-h-[450px]">
        <pre
          :aria-label="t('report_aria_label')"
          :aria-describedby="report ? 'report-content-desc' : undefined"
          class="h-60 max-h-[50%] sm:h-auto sm:max-h-none whitespace-pre-wrap"
          v-html="report"
        />
        <!-- For screen readers, if v-html content is not automatically read, provide a textual alternative or summary -->
        <span v-if="report" :id="'report-content-desc'" class="sr-only">{{ t('report_content_sr_description') }}</span>
      </ScrollArea>

      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline">{{ t('cancel') }}</Button>
        </DialogClose>
        <Button
          :disabled="loading"
          class="mb-3 mt-3 sm:m-0"
          @click="handleGenerateReportClick"
          :aria-label="loading ? t('generating_report_aria_label') : t('generate_report_button')"
        >
          <Icon v-if="loading" name="lucide:loader-2" class="animate-spin mr-2" /> <!-- Changed lucide:loading to lucide:loader-2 -->
          {{ loading ? t('generating_report_button_text') : t('generate_report_button') }}
        </Button>
        <!-- {report !== null && (
              <Button onClick={handleDownloadPdf}>
                <DownloadIcon />
                {{ t('download_report') }}
              </Button>
            )} -->
      </DialogFooter>

      <!-- <div v-if="!hasPremiumPlan">
          <DialogHeader>
              <DialogTitle>{{ t('ai_report_title') }}</DialogTitle>
              <DialogDescription>
                {{ t('premium_report_description') }}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose as-child>
                <Button variant="ghost">{{ t('cancel') }}</Button>
              </DialogClose>
              <Button as-child>
                <NuxtLink to="/subscription">{{ t('subscribe_premium') }}</NuxtLink>
              </Button>
            </DialogFooter>
        </div> -->
    </DialogContent>
  </Dialog>
</template>
