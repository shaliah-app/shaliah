import {
  $,
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useOnWindow,
  useStore,
} from "@builder.io/qwik";

import array from "@/slides.json";

interface Slide {
  id: number;
  file_name: string;
  preview: string;
}

interface SlidesStore {
  _active: Slide | null;
  active: Slide | null;
  array: Slide[];
}

export const SlidesContextId = createContextId<SlidesStore>("slides");

export const SlidesContextProvider = component$(() => {
  const store = useStore<SlidesStore>(() => ({
    _active: null,
    get active() {
      return this._active ?? (this.array[0] || null);
    },
    set active(value) {
      this._active = value;
    },
    array,
  }));

  useOnWindow(
    "storage",
    $((e: StorageEvent) => {
      if (e.newValue) store.active = JSON.parse(e.newValue);
    })
  );

  useContextProvider(SlidesContextId, store);
  return <Slot />;
});
