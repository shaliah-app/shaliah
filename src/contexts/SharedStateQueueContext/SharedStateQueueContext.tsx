import {
  component$,
  createContextId,
  isBrowser,
  Slot,
  useContextProvider,
  useStore,
  useTask$,
} from "@qwik.dev/core";
import { useDebouncer$ } from "~/hooks/useDebouncer";
import { storeUpdates } from "./storeUpdatesRpc";
import type { SharedStateUpdate } from "~/types/SharedStateUpdate";

export const SharedStateQueueContextId =
  createContextId<SharedStateUpdate[]>("shared-state-queue");

/**
 * @module SharedStateQueueContext
 *
 * @description
 * This context provides a shared queue for state update deltas. It is used to collect
 * modifications made throughout the application and upload them to the server once debounced.
 *
 * The context holds an array of [key, delta] pairs that represent incremental changes.
 * The provider uses a debounced task to trigger an upload of those updates using the `uploadUpdate` RPC.
 *
 * @example
 * import { component$, useContext } from "@qwik.dev/core";
 * import { SharedStateQueueContextId } from "~/contexts/SharedStateQueueContext";
 * import { useSharedState } from "~/hooks/useSharedState";
 *
 * export const MyComponent = component$(() => {
 *   // Local state to be synchronized with the shared state queue
 *   const localState = { count: 0 };
 *
 *   // This hook will sync 'localState' with the shared state under the key "myCount"
 *   useSharedState("myCount", localState);
 *
 *   return (
 *     <div>
 *       <p>Count: {localState.count}</p>
 *       <button onClick$={() => localState.count++}>Increment</button>
 *     </div>
 *   );
 * });
 */
export const SharedStateQueueContextProvider = component$(() => {
  const updatesQueue = useStore<SharedStateUpdate[]>([]);

  const debounceUpload = useDebouncer$(async () => {
    if (updatesQueue.length > 0) await storeUpdates(updatesQueue);
  }, 1500);

  useTask$(async ({ track }) => {
    track(updatesQueue);
    if (isBrowser) await debounceUpload();
  });

  useContextProvider(SharedStateQueueContextId, updatesQueue);
  return <Slot />;
});
