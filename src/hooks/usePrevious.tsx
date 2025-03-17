import { useSignal, useTask$, type Signal } from "@builder.io/qwik";

export function usePrevious<T>(value: T): Signal<T | undefined> {
  const previousValue = useSignal<T | undefined>(undefined);

  useTask$(({ track }) => {
    track(() => value);
    previousValue.value = value;
  });
  
  return previousValue;
}

