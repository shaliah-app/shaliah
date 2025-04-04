export class NullPointerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NullPointerError";
  }
}