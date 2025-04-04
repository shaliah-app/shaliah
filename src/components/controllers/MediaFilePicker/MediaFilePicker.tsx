import type { MediaFileRecord } from "~/types/FileRecord";
import type { PropsOf, QRL } from "@qwik.dev/core";
import { component$, useSignal, $, Slot } from "@qwik.dev/core";
import { castToMediaFileRecord } from "~/client/utils/castToMediaFileRecord";

interface MediaFilePickerProps extends PropsOf<"input"> {
  onFilesSelected$: QRL<(files: MediaFileRecord[]) => void>;
  children?: any;
}

export const MediaFilePicker = component$<MediaFilePickerProps>(
  ({ accept, onFilesSelected$, ...rest }) => {
    const fileInputRef = useSignal<HTMLInputElement>();

    // Trigger the hidden file input when the wrapper is clicked
    const triggerMediaFilePicker$ = $(() => {
      fileInputRef.value?.click();
    });

    // Handle file selection
    const handleFileChange$ = $(async (event: Event) => {
      const input = event.target as HTMLInputElement;
      const files = Array.from(input.files || []);

      if (files.length === 0) return;

      const mediaFiles = await Promise.all(
        files.map(async (f) => await castToMediaFileRecord(f))
      );

      try {
        onFilesSelected$(mediaFiles);
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
          accept={accept || "image/*"}
          onChange$={handleFileChange$}
          style="display: none"
          {...rest}
        />
        <div onClick$={triggerMediaFilePicker$} style="height: fit-content;">
          <Slot />
        </div>
      </>
    );
  }
);