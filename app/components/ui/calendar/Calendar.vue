<script lang="ts" setup>
import type { CalendarRootEmits, CalendarRootProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "../../../../lib/utils";
import { CalendarRoot, useForwardPropsEmits } from "radix-vue";
import { computed } from "vue";
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNextButton,
  CalendarPrevButton,
} from ".";

const props = defineProps<
  CalendarRootProps & {
    class?: HTMLAttributes["class"];
    locale?: string;
    weekdayFormat?: "short" | "long" | "narrow";
  }
>();

const emits = defineEmits<CalendarRootEmits>();

const delegatedProps = computed(() => {
  const { class: _, locale: __, weekdayFormat: ___, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);

// Configuração de localização
const calendarLocale = computed(() => props.locale || "pt-BR");
const weekdayFormat = computed(() => props.weekdayFormat || "short");

// Gerar nomes dos dias da semana em português
const getWeekDays = (locale: string, format: "short" | "long" | "narrow") => {
  // Criar array com os nomes dos dias da semana em português
  const weekdays = {
    short: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    long: [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ],
    narrow: ["D", "S", "T", "Q", "Q", "S", "S"],
  };

  return weekdays[format] || weekdays.short;
};

// Gerar dias da semana formatados
const weekDays = computed(() => getWeekDays(calendarLocale.value, weekdayFormat.value));
</script>

<template>
  <CalendarRoot
    v-slot="{ grid }"
    :class="cn('p-3', props.class)"
    :locale="calendarLocale"
    v-bind="forwarded"
  >
    <CalendarHeader>
      <CalendarPrevButton />
      <CalendarHeading />
      <CalendarNextButton />
    </CalendarHeader>

    <div class="mt-4 flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <CalendarGrid v-for="month in grid" :key="month.value.toString()">
        <CalendarGridHead>
          <CalendarGridRow>
            <CalendarHeadCell v-for="(day, index) in weekDays" :key="index">
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            class="mt-2 w-full"
          >
            <CalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
            >
              <CalendarCellTrigger :day="weekDate" :month="month.value" />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>
