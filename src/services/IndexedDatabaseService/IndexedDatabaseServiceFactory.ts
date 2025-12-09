import type { FileRecord } from "~/types/Records";
import { IndexedDatabaseService } from "./IndexedDatabaseService.client";
import { $, type NoSerialize, noSerialize } from "@qwik.dev/core";
import { IndexedDatabaseVersionManager } from "./IndexedDatabaseVersionManager";

export const createIDBService = $(function (
  dbName: string
): NoSerialize<IndexedDatabaseService<FileRecord>> {
  const versionManager = new IndexedDatabaseVersionManager(dbName);

  return noSerialize(
    new IndexedDatabaseService<FileRecord>(dbName, versionManager)
  );
});
