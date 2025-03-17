import type { QRL, Signal } from "@builder.io/qwik";
import {
  $,
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useOnWindow,
  useSignal,
  useStore,
} from "@builder.io/qwik";
import { IndexedDatabaseService } from "~/services/IndexedDatabaseService";

export interface PresentationStore {
  state: {
    id: string;
  };
  getters: {
    id: QRL<() => string>;
  };
  stored: Signal<PresentationStore["state"][]>
}

export const PresentationContextId =
  createContextId<PresentationStore>("presentation");

export const PresentationContextProvider = component$(() => {
  const state = useStore<PresentationStore["state"]>(() => ({
    id: '0',
  }));

  const getters = useStore<PresentationStore["getters"]>(() => ({
    id: $((): string => {
      if (state.id == '0') state.id = Date.now().toString();
      return state.id;
    }),
  }));

  const stored = useSignal<PresentationStore["state"][]>([])

  useOnWindow(
    "load",
    $(async () => {
      const db = IndexedDatabaseService();
      const presentations = await db.getObjectStores();
      if (presentations.length) {
        stored.value = presentations.map((id) => ({ id }));
        state.id = stored.value[0].id;
      } else db.version.update()
    })
  );

  useContextProvider(PresentationContextId, { state, getters, stored });
  return <Slot />;
});
