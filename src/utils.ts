import type { GameObject } from "./types/commonTypes";

export function areGameObjectsEqual(a: GameObject, b: GameObject): boolean {
    return a === b;
}