import { $, useOnWindow, useSignal, useTask$ } from "@qwik.dev/core";
import { isBrowser } from "@qwik.dev/core/build";
import { StateStorageService } from "~/client/services/StateStorageService";

export const useLocalStorage = <STATE extends object>(
  key: string,
  state: STATE
) => {
  const { set, cast } = StateStorageService<STATE>(key);

  const updateSource = useSignal<"local" | "external">("local");

  useTask$(async ({ track }) => {
    const newValue = track(state);
    if (isBrowser && updateSource.value === "local") await set(newValue);
    updateSource.value = "local";
  });

  useOnWindow(
    "storage",
    $(async (e: StorageEvent) => {
      if (e.key !== key) return;
      const newState = await cast(e.newValue);
      updateSource.value = "external";
      Object.assign(state, newState);
    })
  );
};
