import type { QRL } from "@builder.io/qwik";
import { component$, useSignal, $, Slot } from "@builder.io/qwik";
import { usePresentation } from "~/hooks/use-presentation";

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
        accept={props.accept || "image/png,image/jpg,image/jpeg"}
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
  const { addSlideFromFiles } = usePresentation()

  const storeSlides$ = $(async (files: File[]) => {
    addSlideFromFiles(files);
  });

  return (
    <FilePicker onFilesSelected$={storeSlides$} multiple={true}>
      <Slot />
    </FilePicker>
  );
});
