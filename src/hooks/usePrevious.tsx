// Useful in a context where you need the old value
// of a track() update.

import { useStore, useTask$ } from "@qwik.dev/core";

export function usePrevious<STATE extends object>(value: STATE): STATE {
  const actualValue = useStore<STATE>({ ...value });
  const previousValue = useStore<STATE>({ ...value });

  useTask$(({ track }) => {
    const newValue = track(value);
    Object.assign(previousValue, actualValue);
    Object.assign(actualValue, newValue);
  });

  return previousValue;
}
