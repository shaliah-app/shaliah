import {
  $,
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useOnWindow,
  useStore,
} from "@builder.io/qwik";

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
    array: [
      {
        id: 1,
        file_name: "peak.jpg",
        preview: "slide-placeholder-1.jpg",
      },
      {
        id: 2,
        file_name: "from-the-sky.png",
        preview: "slide-placeholder-2.jpg",
      },
      {
        id: 3,
        file_name: "lavender fields by chopin.jpg",
        preview: "slide-placeholder-3.jpg",
      },
      {
        id: 4,
        file_name: "SunsetBest.jpg",
        preview: "slide-placeholder-4.jpg",
      },
      {
        id: 5,
        file_name: "SpookyFrozenMountains.png",
        preview: "slide-placeholder-5.jpg",
      },
    ],
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
