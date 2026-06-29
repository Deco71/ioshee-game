import type { NextObjects } from "../types/commonTypes";

export class FallingObjects {
    objects: NextObjects;
    y: number;

    constructor(nextObjects: NextObjects = [null, null, null, null], y: number = 0) {
        this.objects = nextObjects;
        this.y = y;
    }
}