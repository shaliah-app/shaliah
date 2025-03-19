// Currently not used.
// Useful in a context where you need the old value
// of a track() update.

import { useSignal, useTask$, type Signal } from "@qwik.dev/core";

export function usePrevious<T>(value: T): Signal<T | undefined> {
  const previousValue = useSignal<T | undefined>(undefined);

  useTask$(({ track }) => {
    track(() => value);
    previousValue.value = value;
  });
  
  return previousValue;
}

