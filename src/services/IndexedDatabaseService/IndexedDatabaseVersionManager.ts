import { LocalStorageService } from "~/services/LocalStorageService";

export class IndexedDatabaseVersionManager {
  private key: string;
  private localStorageService: ReturnType<typeof LocalStorageService<number>>;

  constructor(dbName: string, defaultVersion: number = 1) {
    this.key = `idb_${dbName}_version`;
    this.localStorageService = LocalStorageService<number>(
      this.key,
      defaultVersion
    );
  }

  public async get(): Promise<number> {
    return (await this.localStorageService.load())!;
  }

  public async update(): Promise<void> {
    const newVersion = (await this.get()) + 1;
    await this.localStorageService.save(newVersion);
  }
}
