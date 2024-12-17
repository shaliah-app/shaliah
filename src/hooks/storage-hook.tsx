/* eslint-disable qwik/use-method-usage */
import { $, useOnWindow, useTask$ } from "@builder.io/qwik";
import { isBrowser } from "@builder.io/qwik/build";

/**
 * Tracks updates on a store/signal,
 * then stores on `localStorage`.
 *
 * @param key `localStorage` key
 * @param state
 */
function Track$<STATE extends object>(key: string, state: STATE): void {
  useTask$(({ track }) => {
    const newValue = track(state);
    if (isBrowser) localStorage.setItem(key, JSON.stringify(newValue));
  });
}

/**
 * Synchronizes a store/signal with its equivalent in
 * `localStorage`, on every storage update.
 *
 * @param key `localStorage` key
 * @param state
 */
function Sync$<STATE extends object>(key: string, state: STATE) {
  useOnWindow(
    "storage",
    $((e: StorageEvent) => {
      if (e.key == key) {
        const obj = JSON.parse(String(e.newValue));
        Object.assign(state, obj);
      }
    })
  );
}

export const useStorage = {
  Track$,
  Sync$,
};
