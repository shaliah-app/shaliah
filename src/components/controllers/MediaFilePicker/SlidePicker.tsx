import { component$, useContext, Slot } from "@qwik.dev/core";
import { SlidesContextId } from "~/contexts/SlidesContext";
import { MediaFilePicker } from "./MediaFilePicker";

export const SlidePicker = component$(() => {
  const slides = useContext(SlidesContextId);

  return (
    <MediaFilePicker
      onFilesSelected$={(files) => slides.actions.load(files)}
      multiple={true}
      accept="image/png,image/jpg,image/jpeg,video/mp4,video/webm,video/ogg"
    >
      <Slot />
    </MediaFilePicker>
  );
});
