<!-- eslint-disable vue/html-self-closing -->
<script setup lang="ts">
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";
import generateAiReport from "@/app/_actions/generate-ai-report/index.js";
import jsPDF from "jspdf";

interface Props {
  startDate?: Date;
  endDate?: Date;
}

const props = defineProps<Props>();

const loading = ref(false);
const report = ref<string | null>(null);
const downloadingPdf = ref(false);

async function handleGenerateReportClick() {
  loading.value = true;
  try {
    const startDate = props.startDate;
    const endDate = props.endDate;

    if (!startDate || !endDate) {
      throw new Error("Datas não fornecidas");
    }

    const startDateISO = startDate.toISOString();
    const endDateISO = endDate.toISOString();

    const aiReport = await generateAiReport({
      startDate: startDateISO,
      endDate: endDateISO,
    });

    report.value = DOMPurify.sanitize(marked.parse(aiReport));
  } catch (error) {
    console.error("Erro completo:", error);
    report.value =
      error instanceof Error
        ? error.message
        : "Erro ao gerar relatório. Tente novamente.";
  } finally {
    loading.value = false;
  }
}

async function handleDownloadPdf() {
  if (!report.value) return;

  downloadingPdf.value = true;

  try {
    const doc = new jsPDF();

    // Configurações do documento
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 8; // Aumentar para 8
    const maxLineWidth = pageWidth - margin * 2;

    // Adicionar título
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    const title = "Relatório Financeiro IA - Poupa.ai";
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 30);

    // Adicionar período
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const startDate = props.startDate;
    const endDate = props.endDate;
    const period = `Período: ${startDate?.toLocaleDateString(
      "pt-BR"
    )} a ${endDate?.toLocaleDateString("pt-BR")}`;
    const periodWidth = doc.getTextWidth(period);
    const periodX = (pageWidth - periodWidth) / 2;
    doc.text(period, periodX, 45);

    // Adicionar data de geração
    const generationDate = `Gerado em: ${new Date().toLocaleDateString(
      "pt-BR"
    )} às ${new Date().toLocaleTimeString("pt-BR")}`;
    const generationDateWidth = doc.getTextWidth(generationDate);
    const generationDateX = (pageWidth - generationDateWidth) / 2;
    doc.text(generationDate, generationDateX, 55);

    // Linha separadora
    doc.setDrawColor(0, 0, 0);
    doc.line(margin, 65, pageWidth - margin, 65);

    // Processar o conteúdo do relatório
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = report.value;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";

    // Dividir o texto em parágrafos e linhas
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const paragraphs = textContent.split("\n").filter((p) => p.trim()); // Dividir por parágrafos
    const lines: string[] = [];

    // Processar cada parágrafo
    for (const paragraph of paragraphs) {
      if (paragraph.trim() === "") {
        lines.push(""); // Adicionar linha vazia para parágrafos vazios
        continue;
      }

      const words = paragraph.trim().split(" ");
      let currentLine = "";

      for (const word of words) {
        const testLine = currentLine + (currentLine ? " " : "") + word;
        const testWidth = doc.getTextWidth(testLine);

        if (testWidth > maxLineWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      // Adicionar espaço entre parágrafos
      lines.push("");
    }

    // Adicionar o texto ao PDF
    let yPosition = 80;
    const minBottomMargin = 30; // Margem mínima do rodapé

    for (const line of lines) {
      // Verificar se precisa de nova página
      if (yPosition + lineHeight > pageHeight - minBottomMargin) {
        doc.addPage();
        yPosition = 30; // Margem superior para páginas seguintes
      }

      // Se a linha não estiver vazia, adicionar ao PDF
      if (line.trim()) {
        doc.text(line, margin, yPosition);
      }

      yPosition += lineHeight;
    }

    // Adicionar rodapé
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      const footerText = `Página ${i} de ${totalPages} - Poupa.ai`;
      const footerWidth = doc.getTextWidth(footerText);
      const footerX = (pageWidth - footerWidth) / 2;
      doc.text(footerText, footerX, pageHeight - 10);
    }

    // Salvar o PDF
    const fileName = `relatorio-financeiro-${startDate?.toISOString().split("T")[0]}-${
      endDate?.toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    alert("Erro ao gerar PDF. Tente novamente.");
  } finally {
    downloadingPdf.value = false;
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
      <DialogHeader>
        <DialogTitle>Relatório IA</DialogTitle>
        <DialogDescription>
          Use inteligência artificial para gerar um relatório com informações sobre suas
          finanças. <br />
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
          class="h-60 max-h-[50%] sm:h-auto sm:max-h-none whitespace-pre-wrap break-words overflow-wrap-anywhere"
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
          aria-label="Gerar novo relatório de IA"
          @click="handleGenerateReportClick"
        >
          <Icon v-if="loading" name="lucide:loader-circle" class="animate-spin" />
          Gerar Relatório
        </Button>

        <Button
          v-if="report && !loading"
          :disabled="downloadingPdf"
          variant="secondary"
          aria-label="Baixar relatório em PDF"
          @click="handleDownloadPdf"
        >
          <Icon v-if="downloadingPdf" name="lucide:loader-circle" class="animate-spin" />
          <Icon v-else name="lucide:download" class="mr-2" />
          Baixar PDF
        </Button>
      </DialogFooter>
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
<style scoped>
pre {
  font-family: inherit;
}
</style>
