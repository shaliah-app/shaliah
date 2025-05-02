// Mirror of { Delta } from "jsondiffpatch",
// changing unknown to any to avoid type errors
// from Qwik serialization

export type AddedDelta = [any];
export type ModifiedDelta = [any, any];
export type DeletedDelta = [any, 0, 0];
export type MovedDelta = [any, number, 3];
export type TextDiffDelta = [string, 0, 2];

export interface ObjectDelta {
  [property: string]: SerializableDelta;
}

export interface ArrayDelta {
  _t: "a";
  [index: number | `${number}`]: SerializableDelta;
  [index: `_${number}`]: DeletedDelta | MovedDelta;
}

export type SerializableDelta =
  | AddedDelta
  | ModifiedDelta
  | DeletedDelta
  | ObjectDelta
  | ArrayDelta
  | MovedDelta
  | TextDiffDelta
  | undefined;
