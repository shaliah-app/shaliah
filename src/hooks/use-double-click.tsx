import type { QRL } from "@builder.io/qwik";
import { $, useSignal } from "@builder.io/qwik";

/**
 * Custom hook to handle both double-click and single-click events.
 * This is particularly useful for handling double-tap events on mobile devices,
 * which are currently not supported by Qwik's native onDblClick$ handler.
 * @see {@link https://github.com/QwikDev/qwik/issues/7197 GitHub issue tracking onDblClick$ mobile support}
 *
 * @param onDoubleClick - Handler function to be called when a double-click is detected
 * @param onSingleClick - Optional handler function to be called when a single-click is detected
 * @param threshold - Time in milliseconds to wait for a second click (default: 300ms)
 *
 * @returns A QRL function that can be directly used with onClick$
 *
 * @example
 * ```tsx
 * export const MyComponent = component$(() => {
 *   const onClick$ = useDoubleClick(
 *     $(() => console.log('Double clicked!')),
 *     $(() => console.log('Single clicked!'))
 *   );
 *
 *   return <button onClick$={onClick$}>Click me</button>;
 * });
 * ```
 */
export const useDoubleClick = (
  onDoubleClick: QRL<() => void>,
  onSingleClick?: QRL<() => void>,
  threshold = 300
) => {
  const lastClick = useSignal(0);

  return $(() => {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClick.value;

    if (timeDiff < threshold) {
      onDoubleClick();
      lastClick.value = 0;
    } else {
      lastClick.value = currentTime;

      if (onSingleClick) {
        setTimeout(() => {
          if (lastClick.value === currentTime) {
            onSingleClick();
          }
        }, threshold);
      }
    }
  });
};
