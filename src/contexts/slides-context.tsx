import {
  $,
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useOnWindow,
  useStore,
  useTask$,
} from "@builder.io/qwik";

import array from "~/utils/slides.json";
import { isBrowser } from "@builder.io/qwik/build";

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

  // Update localStorage
  useTask$(({ track }) => {
    const newActiveSlide = track(() => store.active);
    if (isBrowser)
      localStorage.setItem("active", JSON.stringify(newActiveSlide));
  });

  // Synchronize store
  useOnWindow(
    "storage",
    $((e: StorageEvent) => {
      if (e.key && e.key in store) {
        const key = e.key as keyof SlidesStore;
        store[key] = JSON.parse(String(e.newValue));
      }
    })
  );

  useContextProvider(SlidesContextId, store);
  return <Slot />;
});
