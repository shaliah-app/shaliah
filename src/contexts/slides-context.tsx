import type { QRL } from "@builder.io/qwik";
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
import { IndexedDBService } from "~/db/idb";

interface SlidesStore {
  _active: SlideEntity | null;
  active: SlideEntity | null;
  array: SlideEntity[];
  remove: QRL<(id: number) => Promise<void>>;
  add: QRL<(files: File[]) => Promise<void>>;
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
    remove: $(async () => {}),
    add: $(async () => {}),
  }));

  useOnWindow(
    "load",
    $(async () => {
      store.add = $(async (files: File[]) => {
        for (const file of files) {
          const id = Date.now();
          await IndexedDBService.saveSlideFile(id, file);

          const slide = {
            id,
            fileName: file.name,
            preview: URL.createObjectURL(file),
          };

          store.array.push(slide);
        }
      });

      store.remove = $(async (id: number) => {
        const index = store.array.findIndex((slide) => slide.id === id);
        if (index === -1) throw new Error(`Slide with id ${id} not found`);
        store.array.splice(index, 1);
        await IndexedDBService.removeSlide(id);
      });

      store.add(await IndexedDBService.getAllFiles());
    })
  );

  // TODO: Should be merged into one hook,
  //       like useLocalStorage$().
  useStorage.Track$(id, store);
  useStorage.Sync$(id, store);

  useContextProvider(SlidesContextId, store);
  return <Slot />;
});
