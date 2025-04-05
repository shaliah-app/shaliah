import { NullPointerError } from "~/types/Errors";
import { $, type Signal } from "@qwik.dev/core";

type Unwrapped<T> = T extends Signal<infer U> ? U : T;

/**
 * Creates a state storage service that persists state objects to localStorage.
 *
 * @template STATE - The type of the state object to be stored.
 * @param key - The key under which the state is stored in localStorage.
 *
 * @returns An object with two methods:
 *  - set: Serializes and stores the state in localStorage using the provided key.
 *  - cast: Parses the stored JSON string from localStorage back to a state object.
 *
 * @remarks
 * This service uses JSON serialization to store state, hence the state must be serializable.
 * It throws a NullPointerError if no value is found for the provided key,
 * and a SyntaxError if the parsed value is not an object.
 */
export const StateStorageService = <STATE extends object>(key: string) => {
  const set = $((state: Unwrapped<STATE>): void =>
    localStorage.setItem(key, JSON.stringify(state))
  );

  const cast = $((value: string | null): Unwrapped<STATE> => {
    if (value === null)
      throw new NullPointerError(
        `No value found in localStorage for key "${key}"`
      );
    const parsed = JSON.parse(value);
    if (typeof parsed === "object" && parsed !== null)
      return parsed as Unwrapped<STATE>;
    throw new SyntaxError(`Parsed value for key "${key}" is not an object`);
  });

  return { set, cast };
};
