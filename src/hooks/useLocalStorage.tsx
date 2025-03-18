import { $, useOnWindow, useSignal, useTask$ } from "@builder.io/qwik";
import { isBrowser } from "@builder.io/qwik/build";

export const useLocalStorage = <STATE extends object>(
  key: string,
  state: STATE
) => {
  const event = useSignal<boolean>(false)

  useTask$(({ track }) => {
    const newValue = track(state);
    if (isBrowser && !event.value) {
      localStorage.setItem(key, JSON.stringify(newValue));
      event.value = false;
    }
  });

  useOnWindow(
    "storage",
    $((e: StorageEvent) => {
      if (e.key == key) {
        event.value = true;
        const obj = JSON.parse(String(e.newValue));
        Object.assign(state, obj);
      }
    })
  );
};
