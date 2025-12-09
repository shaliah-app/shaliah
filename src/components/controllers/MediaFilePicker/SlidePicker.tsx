import {
  component$,
  Slot,
  $,
  type PropsOf,
  type QRL,
  noSerialize,
} from "@qwik.dev/core";
import { MediaFilePicker } from "./MediaFilePicker";
import type { SlideModel } from "~/types/SlideModel";
import { generateBlurhash } from "~/utils/blurhash.client";
import type { Optional } from "~/types/Optional";
import type { SlideMetadata } from "~/types/SlideModel";
import { processVideoFile } from "~/utils/processVideoFile.client";
import type { FileRecord } from "~/types/Records";

interface SlidePickerProps extends PropsOf<"input"> {
  onSlidesSelected$: QRL<(slides: SlideModel[]) => void>;
  children?: any;
}

const processMetadata = $(
  async (src: string, type: SlideModel["type"]): Promise<SlideMetadata> => {
    const meta = { url: src };
    if (type === "video") {
      const videoMetadata = await processVideoFile(src);
      Object.assign(meta, videoMetadata);
      src = videoMetadata.poster;
    }
    Object.assign(meta, { blurHash: await generateBlurhash(src) });
    return meta as SlideMetadata;
  }
);

export const SlidePicker = component$<SlidePickerProps>(
  ({ onSlidesSelected$, ...rest }) => {
    const castToSlides = $(async (fileRecords: FileRecord[]) => {
      const slides = await Promise.all(
        fileRecords.map(async (mediaFile) => {
          const { id, file } = mediaFile;

          const slide: Optional<SlideModel, "meta"> = {
            id,
            file: noSerialize(mediaFile),
            name: file.name,
            type: file.type.startsWith("video") ? "video" : "image",
          };

          const url = URL.createObjectURL(file);
          slide.meta = await processMetadata(url, slide.type);

          return slide as SlideModel;
        })
      );

      onSlidesSelected$(slides);
    });

    return (
      <MediaFilePicker
        onFilesSelected$={castToSlides}
        multiple={true}
        accept="image/png,image/jpg,image/jpeg,video/mp4,video/webm,video/ogg"
        {...rest}
      >
        <Slot />
      </MediaFilePicker>
    );
  }
);
