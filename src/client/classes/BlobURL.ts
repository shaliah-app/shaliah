export class BlobURL {
  url: string;
  id: string;

  constructor(blob: Blob) {
    this.url = URL.createObjectURL(blob);
    this.id = this.url.split("/").pop()!;
  }

  static create(blob: Blob) {
    return new BlobURL(blob);
  }

  revoke() {
    URL.revokeObjectURL(this.url);
  }
}
