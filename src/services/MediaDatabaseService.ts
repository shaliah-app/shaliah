import { $ } from "@qwik.dev/core";
import type { MediaFileRecord } from "../types/FileRecord";
import { IndexedDatabaseService } from "./IndexedDatabaseService";

export const MediaDatabaseService = $((store: string) =>
  IndexedDatabaseService<MediaFileRecord>(store)
);
