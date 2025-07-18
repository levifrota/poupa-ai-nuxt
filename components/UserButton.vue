<template>
  <div class="flex items-center justify-center">
    <!-- <button class="flex items-center justify-center rounded-full bg-primary p-2 text-primary-foreground">
      <Icon name="lucide:user" size="20" />
    </button> -->

    <Dialog>
      <DialogTrigger as-child>
        <Button>
          <Icon name="lucide:user" size="20" />
          Perfil
        </Button>
      </DialogTrigger>
      <DialogContent class="max-h-[90%] max-w-[90%] sm:max-h-none sm:max-w-[450px]">
        <!-- <div> -->
        <DialogHeader>
          <DialogTitle>Perfil</DialogTitle>
          <DialogDescription>
            Use inteligência artificial para gerar um relatório com informações sobre suas
            finanças. <br >
            <span className="text-red-500">
              Atenção: A ferramenta pode não ser precisa e pode gerar erros. Use as
              informações com cuidado.
            </span>
          </DialogDescription>
        </DialogHeader>
        <!-- 
        <ScrollArea class="prose max-h-[450px]">
          <pre
            aria-label="Relatório"
            aria-description="report"
            class="h-60 max-h-[50%] sm:h-auto sm:max-h-none"
            v-html="report"
          />
        </ScrollArea> -->

        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button class="mb-3 mt-3 sm:m-0">
            <!-- <Icon v-if="loading" name="lucide:loading" class="animate-spin" /> -->
            Salvar
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
  </div>
</template>

<script setup lang="ts">
// import { User } from 'lucide-vue-next';
</script>
