<template>
  <div class="flex items-center justify-center">
    <!-- <button class="flex items-center justify-center rounded-full bg-primary p-2 text-primary-foreground">
      <Icon name="lucide:user" size="20" />
    </button> -->

    <Dialog>
      <DialogTrigger as-child>
        <Button>
          <Icon name="lucide:user" size="20" />
          {{ t('profile') }}
        </Button>
      </DialogTrigger>
      <DialogContent class="max-h-[90%] max-w-[90%] sm:max-h-none sm:max-w-[450px]">
        <!-- <div> -->
        <DialogHeader>
          <DialogTitle>{{ t('profile') }}</DialogTitle>
          <DialogDescription>
            {{ t('profile_description') }} <br />
            <span class="text-red-500">
              {{ t('profile_warning') }}
            </span>
          </DialogDescription>
        </DialogHeader>
        <!--
        <ScrollArea class="prose max-h-[450px]">
          <pre
            :aria-label="t('report')"
            :aria-description="t('report_description')"
            class="h-60 max-h-[50%] sm:h-auto sm:max-h-none"
            v-html="report"
          />
        </ScrollArea> -->

        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline">{{ t('cancel') }}</Button>
          </DialogClose>
          <Button class="mb-3 mt-3 sm:m-0">
            <!-- <Icon v-if="loading" name="lucide:loading" class="animate-spin" /> -->
            {{ t('save_changes') }}
          </Button>
          <!-- {report !== null && (
              <Button onClick={handleDownloadPdf}>
                <DownloadIcon />
                {{ t('download_report') }}
              </Button>
            )} -->
        </DialogFooter>
        <!-- </div> -->

        <!-- <div v-if="!hasPremiumPlan">
          <DialogHeader>
              <DialogTitle>{{ t('ai_report') }}</DialogTitle>
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
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '#imports'

const { t } = useI18n()
// import { User } from 'lucide-vue-next';
</script>
