import { isServer, useContext, useTask$ } from "@qwik.dev/core";
import { usePrevious } from "./usePrevious";
import { diff } from "~/services/JsonDiffService";
import { SharedStateQueueContextId } from "~/contexts/SharedStateQueueContext";
import { createSessionService } from "~/services/SessionService";
import { server$ } from "@qwik.dev/router";

/**
 * Synchronizes a local state object with session data by pushing diffs into a shared state queue.
 *
 * This hook uses the shared state queue context to collect state update deltas,
 * which are later uploaded to the server. It also initializes local state with
 * persisted session data.
 *
 * @example
 * // Example: A simple counter component that synchronizes its state.
 * import { component$, useStore } from "@qwik.dev/core";
 * import { useSharedState } from "~/hooks/useSharedState";
 *
 * export const Counter = component$(() => {
 *   // Local state for the counter.
 *   const state = useStore({ count: 0 });
 *
 *   // Synchronize 'state' with the session using the key "counter".
 *   useSharedState("counter", state);
 *
 *   return (
 *     <div>
 *       <p>Count: {state.count}</p>
 *       <button onClick$={() => state.count++}>Increment</button>
 *     </div>
 *   );
 * });
 */
export const useSharedState = <STATE extends object>(
  key: string,
  state: STATE
) => {
  const queue = useContext(SharedStateQueueContextId);

  const previousValue = usePrevious(state);

  useTask$(async () => {
    const sync = server$(async function () {
      const sessionService = await createSessionService(this.cookie);
      const sessionData = await sessionService?.getSession(key);
      Object.assign(state, sessionData);
    });
    await sync();
  });

  useTask$(async ({ track }) => {
    const newValue = track(state) as STATE;

    if (isServer) return;

    const changes = await diff(previousValue, newValue);

    queue.push([key, changes]);
  });
};
