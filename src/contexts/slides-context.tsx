import {
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";

import array from "~/utils/slides.json";
import { useStorage } from "~/hooks/storage-hook";

export interface Slide {
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
const { id } = SlidesContextId

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

  // TODO: Should be merged into one hook, 
  //       like useLocalStorage$().
  useStorage.Track$(id, store);
  useStorage.Sync$(id, store);

  useContextProvider(SlidesContextId, store);
  return <Slot />;
});
