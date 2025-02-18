import {
  $,
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useOnWindow,
  useStore,
} from "@builder.io/qwik";

// import array from "~/utils/slides.json";
import { useStorage } from "~/hooks/storage-hook";
import { type SlideEntity } from "~/types/SlideEntity";
import { getAllSlides } from "~/db/idb";

interface SlidesStore {
  _active: SlideEntity | null;
  active: SlideEntity | null;
  array: SlideEntity[];
}

export const SlidesContextId = createContextId<SlidesStore>("slides");
const { id } = SlidesContextId;

export const SlidesContextProvider = component$(() => {
  const store = useStore<SlidesStore>(() => ({
    _active: null,
    get active() {
      return this._active ?? ((this.array.length > 0 && this.array[0]) || null);
    },
    set active(value) {
      this._active = value;
    },
    array: [],
  }));

  useOnWindow('load', $(async () => {

    getAllSlides().then((slides) => {
      slides.forEach((slide) => {
        const s = {
          id: slide.id,
          fileName: slide.file.name,
          preview: URL.createObjectURL(slide.file),
        }
        store.array.push(s);
      });
    })

  }))

  

  // TODO: Should be merged into one hook,
  //       like useLocalStorage$().
  useStorage.Track$(id, store);
  useStorage.Sync$(id, store);

  useContextProvider(SlidesContextId, store);
  return <Slot />;
});
