import { server$ } from "@qwik.dev/router";
import { patch } from "~/services/JsonDiffService";
import { createSessionService } from "~/services/SessionService";
import type { SharedStateUpdate } from "~/types/SharedStateUpdate";

export const storeUpdates = server$(async function (
  updates: SharedStateUpdate[]
) {
  const sessionService = await createSessionService(this.cookie);

  const session = await sessionService!.getSession();

  for (const update of updates) {
    if (update[1]) {
      const key = update[0];
      const originalValue = session[key] ?? {};
      const patchedValue = await patch(originalValue, update[1]);
      session[key] = patchedValue;
    }
  }

  await sessionService?.updateSession(session);
});
