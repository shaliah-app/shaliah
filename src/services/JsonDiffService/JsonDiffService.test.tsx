import { describe, it, expect } from "vitest";
import { diff, patch } from "./JsonDiffService";

describe("patch", () => {
  it("should update a value", async () => {
    const oldData = { x: 10, y: 20 };
    const newData = { x: 100, y: 20 };
    const delta = await diff(oldData, newData);
    const patchedData = await patch({ ...oldData }, delta);
    expect(patchedData).toEqual(newData);
  });

  it("should add a property", async () => {
    const oldData = { a: 1 };
    const newData = { a: 1, b: 2 };
    const delta = await diff(oldData, newData);
    const patchedData = await patch({ ...oldData }, delta);
    expect(patchedData).toEqual(newData);
  });

  it("should remove a property", async () => {
    const oldData = { a: 1, b: 2 };
    const newData = { a: 1 };
    const delta = await diff(oldData, newData);
    const patchedData = await patch({ ...oldData }, delta);
    expect(patchedData).toEqual(newData);
  });

  it("should return original object when delta is undefined", async () => {
    const oldData = { a: 1 };
    const patchedData = await patch({ ...oldData }, undefined);
    expect(patchedData).toEqual(oldData);
  });
});

describe("diff", () => {
  it("should return undefined when objects are identical", async () => {
    const data = { a: 1, b: 2 };
    const delta = await diff(data, { ...data });
    expect(delta).toBeUndefined();
  });

  it("should return a defined delta when objects differ", async () => {
    const oldData = { a: 1, b: 2 };
    const newData = { a: 1, b: 3 };
    const delta = await diff(oldData, newData);
    expect(delta).toBeDefined();
  });

  it("should detect added properties", async () => {
    const oldData = { a: 1 };
    const newData = { a: 1, b: 2 };
    const delta = await diff(oldData, newData);
    expect(delta).toBeDefined();
    expect(delta).toHaveProperty("b");
  });

  it("should detect removed properties", async () => {
    const oldData = { a: 1, b: 2 };
    const newData = { a: 1 };
    const delta = await diff(oldData, newData);
    expect(delta).toBeDefined();
    expect(delta).toHaveProperty("b");

    const patchedData = await patch({ ...oldData }, delta);
    expect(patchedData).toEqual(newData);
  });
});

describe("undefined inputs", () => {
  it("should compute a delta when oldData is undefined", async () => {
    const oldData = undefined as any;
    const newData = { a: 1 };
    const delta = await diff(oldData, newData);
    expect(delta).toBeDefined();
  });

  it("should compute a delta when newData is undefined", async () => {
    const oldData = { a: 1 };
    const newData = undefined as any;
    const delta = await diff(oldData, newData);
    expect(delta).toBeDefined();
  });

  it("should return undefined when patching an undefined object with undefined delta", async () => {
    const oldData = undefined as any;
    const patchedData = await patch(oldData, undefined);
    expect(patchedData).toBeUndefined();
  });

  it("should patch correctly when delta is undefined for a defined object", async () => {
    const oldData = { a: 1 };
    const patchedData = await patch({ ...oldData }, undefined);
    expect(patchedData).toEqual(oldData);
  });
});