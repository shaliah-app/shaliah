/**
 * Waits until a retrieved value satisfies a given condition or until the timeout is reached.
 *
 * @template T The type of value being retrieved.
 * @param getValue - A function that returns the value to be checked.
 * @param condition - A function that tests whether the value is acceptable.
 * @param timeout - Optional. The maximum time (in milliseconds) to wait. Defaults to 300ms.
 * @returns A promise that resolves with the value when the condition is met, or with the latest value when the timeout is reached.
 */
export const waitForValue = <T>(
  getValue: () => T,
  condition: (value: T) => boolean,
  timeout: number = 300
): Promise<T> => {
  return new Promise((resolve) => {
    // Check immediately if the condition is met.
    const initialValue = getValue();
    if (condition(initialValue)) {
      resolve(initialValue);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // Poll for the value every 50ms.
    intervalId = setInterval(() => {
      const value = getValue();
      if (condition(value)) {
        cleanup();
        resolve(value);
      }
    }, 50);

    // Fallback: resolve with the current value after the timeout.
    timeoutId = setTimeout(() => {
      cleanup();
      resolve(getValue());
    }, timeout);
  });
};
