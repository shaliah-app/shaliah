import { $ } from "@qwik.dev/core";
import type { MediaFileRecord } from "../../types/Records";
import { IndexedDatabaseService } from "~/client/services";

export const MediaDatabaseService = $((store: string) =>
  IndexedDatabaseService<MediaFileRecord>(store)
);
