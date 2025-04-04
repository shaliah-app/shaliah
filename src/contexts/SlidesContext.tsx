import type { QRL } from "@qwik.dev/core";
import {
  $,
  component$,
  createContextId,
  Slot,
  useContext,
  useContextProvider,
  useStore,
  useTask$,
} from "@qwik.dev/core";

// import array from "~/utils/slides.json";
import { blankSlide, type SlideEntity } from "~/types/SlideEntity";
import { PresentationContextId } from "./PresentationContext";
import { IndexedDatabaseService } from "~/services/IndexedDatabaseService";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import type { FileRecord, MediaFileRecord } from "~/types/FileRecord";
import { processVideoFile } from "~/utils/processVideoFile";

interface SlidesStore {
  state: {
    active: SlideEntity;
    list: SlideEntity[];
  };
  actions: {
    display: QRL<(slide: SlideEntity) => void>;
    remove: QRL<(id: number) => Promise<void>>;
    load: QRL<(files: MediaFileRecord[] | File[]) => void>;
  };
}

export const SlidesContextId = createContextId<SlidesStore>("slides");

export const SlidesContextProvider = component$(() => {
  const presentation = useContext(PresentationContextId);

  const state = useStore<SlidesStore["state"]>({
    active: blankSlide,
    list: [],
  });

  const _database = useStore(() => ({
    save: $(async (files: FileRecord[]) => {
      const table = await presentation.getters.id();
      const db = IndexedDatabaseService(table);
      for (let i = 0; i < files.length; i++) {
        await db.save(files[i]);
      }
    }),
    update: $(async (file: FileRecord) => {
      const table = await presentation.getters.id();
      const db = IndexedDatabaseService(table);
      await db.update(file);
    }),
    get: $(async (id: number) => {
      const table = await presentation.getters.id();
      const db = IndexedDatabaseService(table);
      return await db.getById(id);
    }),
    delete: $(async (id: number) => {
      const table = await presentation.getters.id();
      const db = IndexedDatabaseService(table);
      await db.remove(id);
    }),
  }));

  const _displayNearest = $((index: number) => {
    state.active = state.list[index + 1] || state.list[index - 1] || blankSlide;
  });

  const _castFilesToMediaFileRecords = $(
    async (files: File[]): Promise<MediaFileRecord[]> => {
      const records = await Promise.all(
        files.map(async (file, i) => {
          const baseRecord: MediaFileRecord = {
            id: Date.now() + i,
            file,
            type: file.type.startsWith("video") ? "video" : "image",
          };
          if (baseRecord.type === "video") {
            const processed = await processVideoFile(file);
            Object.assign(baseRecord, processed);
          }
          return baseRecord;
        })
      );
      return records;
    }
  );

  const actions = useStore<SlidesStore["actions"]>(() => ({
    load: $(async (files: MediaFileRecord[] | File[]) => {
      if (files.length === 0) return;
      const mediaFiles: MediaFileRecord[] =
        files[0] instanceof File
          ? await _castFilesToMediaFileRecords(files as File[])
          : (files as MediaFileRecord[]);

      // TODO: it might be of MediaFileRecord type directly, not SlideEntity
      const slides = mediaFiles.map((slide) => ({
        id: slide.id,
        fileName: slide.file.name,
        preview: URL.createObjectURL(slide.file),
        type: slide.type,
        hasAudio: slide.type === "video" && slide.hasAudio,
      }));

      state.list.push(...slides);

      _database.save(mediaFiles);
    }),
    remove: $(async (id: number) => {
      const index = state.list.findIndex((slide) => slide.id === id);

      if (index === -1) throw new Error(`Slide with id ${id} not found`);

      if (state.active.id === id) _displayNearest(index);

      state.list.splice(index, 1);

      await _database.delete(id);
    }),
    display: $((slide) => {
      state.active = slide;
    }),
  }));

  useTask$(async ({ track }) => {
    const p = track(() => presentation.state.id);
    if (p == "0") return;
    const mediaFiles = await IndexedDatabaseService<MediaFileRecord>(p).index();
    actions.load(mediaFiles);
  });

  useLocalStorage("slides_store", state);

  useContextProvider(SlidesContextId, { state, actions });
  return <Slot />;
});
