import { $ } from "@builder.io/qwik";
import { DiffPatcher } from "jsondiffpatch";
import type { SerializableDelta } from "~/types/SerializableDelta";

/**
 * Computes a diff between two objects using jsondiffpatch's DiffPatcher.
 * Creates a new DiffPatcher instance to avoid serialization issues.
 *
 * @param {Record<string, any>} oldData - The original object.
 * @param {Record<string, any>} newData - The updated object.
 * @returns {SerializableDelta} - The delta representing the differences between oldData and newData.
 */
export const diff = $(
  (oldData: Record<string, any>, newData: Record<string, any>): SerializableDelta => {
    const diffPatcher = new DiffPatcher();
    return diffPatcher.diff(oldData, newData);
  }
);

/**
 * Applies a diff (delta) to the original object and returns the mutated object.
 * Creates a new DiffPatcher instance on each call to avoid serialization issues.
 *
 * @template T
 * @param {T} oldData - The original object to patch.
 * @param {SerializableDelta} changes - The delta that represents changes to be applied.
 * @returns {T} - The original object after applying the patch.
 */
export const patch = $(<T extends object>(oldData: T, changes: SerializableDelta): T => {
  const diffPatcher = new DiffPatcher();
  return diffPatcher.patch(oldData, changes) as T;
});
