import type { QRL } from "@builder.io/qwik";
import { component$, useSignal, $, Slot } from "@builder.io/qwik";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  onFilesSelected$: QRL<(files: File[]) => void>;
}

export const FileUpload = component$((props: FileUploadProps) => {
  const fileInputRef = useSignal<HTMLInputElement>();

  // Trigger the hidden file input when the wrapper is clicked
  const triggerFileUpload$ = $(() => {
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
      <div onClick$={triggerFileUpload$} style="height: fit-content;">
        <Slot />
      </div>
    </>
  );
});
