import type { QRL, Signal } from "@qwik.dev/core";
import {
  $,
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useSignal,
  useStore,
} from "@qwik.dev/core";
import { useSharedState } from "~/hooks/useSharedState";

export interface PresentationStore {
  state: {
    id: string;
  };
  getters: {
    id: QRL<() => string>;
  };
  stored: Signal<PresentationStore["state"][]>;
}

export const PresentationContextId =
  createContextId<PresentationStore>("presentation");

export const PresentationContextProvider = component$(() => {
  const state = useStore<PresentationStore["state"]>(() => ({
    id: "0",
  }));

  const getters = useStore<PresentationStore["getters"]>(() => ({
    id: $((): string => {
      if (state.id == "0") state.id = Date.now().toString();
      return state.id;
    }),
  }));

  const stored = useSignal<PresentationStore["state"][]>([]);

  useSharedState(PresentationContextId.id, state);

  useContextProvider(PresentationContextId, { state, getters, stored });
  return <Slot />;
});