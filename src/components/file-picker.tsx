import type { QRL } from "@qwik.dev/core";
import { component$, useSignal, $, Slot, useContext } from "@qwik.dev/core";
import { SlidesContextId } from "~/contexts/SlidesContext";

interface FilePickerProps {
  accept?: string;
  multiple?: boolean;
  onFilesSelected$: QRL<(files: File[]) => void>;
}

export const FilePicker = component$((props: FilePickerProps) => {
  const fileInputRef = useSignal<HTMLInputElement>();

  // Trigger the hidden file input when the wrapper is clicked
  const triggerFilePicker$ = $(() => {
    fileInputRef.value?.click();
  });

  // Handle file selection
  const handleFileChange$ = $(async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);

    if (files.length === 0) return;

    try {
      props.onFilesSelected$(files);
    } finally {
      // Reset the input value after handling files
      if (fileInputRef.value) {
        fileInputRef.value.value = "";
      }
    }
  });

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={props.accept || "image/*"}
        multiple={props.multiple}
        onChange$={handleFileChange$}
        style="display: none"
      />
      <div onClick$={triggerFilePicker$} style="height: fit-content;">
        <Slot />
      </div>
    </>
  );
});

export const SlidePicker = component$(() => {
  const slides = useContext(SlidesContextId);

  return (
    <FilePicker
      onFilesSelected$={(files) => slides.actions.load(files)}
      multiple={true}
      accept="image/png,image/jpg,image/jpeg,video/mp4,video/webm,video/ogg"
    >
      <Slot />
    </FilePicker>
  );
});
