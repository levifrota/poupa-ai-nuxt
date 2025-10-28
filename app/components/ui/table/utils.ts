import type { Updater } from "@tanstack/vue-table";
import type { Ref } from "vue";

export function valueUpdater<TValue, T extends Updater<TValue>>(updaterOrValue: T, ref: Ref<TValue>) {
  ref.value
    = typeof updaterOrValue === "function"
      ? updaterOrValue(ref.value)
      : updaterOrValue;
}
