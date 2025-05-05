import { $, useOnWindow, useSignal, useTask$ } from "@qwik.dev/core";
import { isBrowser } from "@qwik.dev/core/build";
import { LocalStorageService } from "~/services/LocalStorageService";
import { NullPointerError } from "~/types/Errors";

export const useLocalStorage = <STATE extends object>(
  key: string,
  state: STATE
) => {
  const { save } = LocalStorageService<STATE>(key);

  const cast = $((value: string | null): STATE => {
    if (value === null)
      throw new NullPointerError(
        `No value found in localStorage for key "${key}"`
      );
    const parsed = JSON.parse(value);
    if (typeof parsed === "object" && parsed !== null)
      return parsed as STATE;
    throw new SyntaxError(`Parsed value for key "${key}" is not an object`);
  })

  const updateSource = useSignal<"local" | "external">("local");

  useTask$(async ({ track }) => {
    const newValue = track(() => state);
    if (isBrowser && updateSource.value === "local") await save(newValue);
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
