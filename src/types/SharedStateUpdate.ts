import type { SerializableDelta } from "./SerializableDelta";

export type SharedStateUpdate = [key: string, delta: SerializableDelta];