<script setup lang="ts">
// import { ref } from "vue";
import DOMPurify from "isomorphic-dompurify";
// import { Button } from "@/components/ui/button";
import { marked } from "marked";
import generateAiReport from "@/app/_actions/generate-ai-report";

const loading = ref(false);
const report = ref<string | null>(null);

async function handleGenerateReportClick() {
  loading.value = true;
  try {
    const aiReport = await generateAiReport({ month: "2" });

    report.value = DOMPurify.sanitize(marked.parse(aiReport));
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button aria-label="Abrir diálogo de relatório de IA">
        Relatório IA
        <Icon name="lucide:bot" class="mr-2" />
      </Button>
    </DialogTrigger>
    <DialogContent class="max-h-[90%] max-w-[90%] sm:max-h-none sm:max-w-[450px]">
      <!-- <div> -->
      <DialogHeader>
        <DialogTitle>Relatório IA</DialogTitle>
        <DialogDescription>
          Use inteligência artificial para gerar um relatório com informações sobre suas
          finanças. <br >
          <span className="text-red-500">
            Atenção: A ferramenta pode não ser precisa e pode gerar erros. Use as
            informações com cuidado.
          </span>
        </DialogDescription>
      </DialogHeader>

      <ScrollArea class="prose max-h-[450px]">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <pre
          aria-label="Relatório gerado por IA"
          aria-description="report"
          class="h-60 max-h-[50%] sm:h-auto sm:max-h-none"
          v-html="report"
        />
      </ScrollArea>

      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline">Cancelar</Button>
        </DialogClose>
        <Button
          :disabled="loading"
          class="mb-3 mt-3 sm:m-0"
          @click="handleGenerateReportClick"
          aria-label="Gerar novo relatório de IA"
        >
          <Icon v-if="loading" name="lucide:loading" class="animate-spin" />
          Gerar Relatório
        </Button>
        <!-- {report !== null && (
              <Button onClick={handleDownloadPdf}>
                <DownloadIcon />
                Baixar relatório
              </Button>
            )} -->
      </DialogFooter>
      <!-- </div> -->

      <!-- <div v-if="!hasPremiumPlan">
          <DialogHeader>
              <DialogTitle>Relatório IA</DialogTitle>
              <DialogDescription>
                Você precisa de um plano premium para gerar relatórios com IA.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose as-child>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button as-child>
                <NuxtLink to="/subscription">Assinar plano Premium</NuxtLink>
              </Button>
            </DialogFooter>
        </div> -->
    </DialogContent>
  </Dialog>
</template>
