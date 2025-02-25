import type { QRL } from "@builder.io/qwik";
import {
  $,
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";

interface PresentationStore {
  state: {
    id: number;
  };
  getters: {
    id: QRL<() => number>;
  };
  // actions: {
  //   restoreSlides: QRL<() => Promise<void>>;
  // };
}

export const PresentationContextId =
  createContextId<PresentationStore>("presentation");

export const PresentationContextProvider = component$(() => {
  // const slides = useContext(SlidesContextId);

  const state = useStore<PresentationStore["state"]>(() => ({
    id: 0,
  }));

  const getters = useStore<PresentationStore["getters"]>(() => ({
    id: $((): number => {
      // if (!this._id) this._id = Date.now();
      if (!state.id) state.id = 1; // should be a dymanic, different id
      return state.id;
    }),
  }));

  // const actions = useStore<PresentationStore["actions"]>(() => ({
  //   restoreSlides: $(async () => {
  //     const db = IndexedDatabaseService(String(getters.id()));
  //     slides.actions.add(await db.index());
  //   }),
  // }));

  useContextProvider(PresentationContextId, { state, getters });
  return <Slot />;
});
