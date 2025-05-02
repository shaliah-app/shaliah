import type { QRL } from "@qwik.dev/core";
import { useSignal, $, implicit$FirstArg } from "@qwik.dev/core";

export const useDebouncerQrl = <A extends readonly unknown[], R>(
  fn: QRL<(...args: A) => R>,
  delay: number
): QRL<(...args: A) => void> => {
  const timeoutId = useSignal<number>();

  return $((...args: A): void => {
    clearTimeout(timeoutId.value);
    timeoutId.value = setTimeout((): void => {
      void fn(...args);
    }, delay) as unknown as number;
  });
};

export const useDebouncer$ = implicit$FirstArg(useDebouncerQrl);
