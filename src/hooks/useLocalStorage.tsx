import { $, useOnWindow, useTask$ } from "@builder.io/qwik";
import { isBrowser } from "@builder.io/qwik/build";

export const useLocalStorage = <STATE extends object>(
  key: string,
  state: STATE
) => {
  useTask$(({ track }) => {
    const newValue = track(state);
    if (isBrowser) localStorage.setItem(key, JSON.stringify(newValue));
  });

  useOnWindow(
    "storage",
    $((e: StorageEvent) => {
      if (e.key == key) {
        const obj = JSON.parse(String(e.newValue));
        Object.assign(state, obj);
      }
    })
  );
};
