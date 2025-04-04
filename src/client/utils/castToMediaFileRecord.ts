import type {
  FileRecord,
  ImageFileRecord,
  MediaFileRecord,
  VideoFileRecord,
} from "~/types/FileRecord";
import { processVideoFile } from "~/utils/processVideoFile";
import { BlobURL } from "~/client/classes/BlobURL";

export const castToMediaFileRecord = async (
  file: File
): Promise<MediaFileRecord> => {
  const { url, id } = BlobURL.create(file);

  const baseRecord: FileRecord = {
    id,
    file,
    meta: {
      type: file.type.startsWith("video") ? "video" : "image",
      url,
    },
  };

  if (baseRecord.meta.type === "image") return baseRecord as ImageFileRecord;

  const videoMetadata = await processVideoFile(file);
  Object.assign(baseRecord.meta, videoMetadata);
  return baseRecord as VideoFileRecord;
};
