import { FallingObjects } from "../classes/FallingObjects";
import type { Gameboard, GameColumn, NextObjects } from "../types/commonTypes";
import { Images } from "../types/Images";

export class IosheeGameEngine {
    gameBoard: Gameboard;
    fallingObjects: FallingObjects = new FallingObjects();
    nextObjects: NextObjects = [null, null, null, null];
    points: number = 0;

    private createColumn = (): GameColumn => [null, null, null, null, null, null, null];

    constructor() {
        this.gameBoard = [this.createColumn(), this.createColumn(), this.createColumn(), this.createColumn()];
        this.updatePosition = this.updatePosition.bind(this);
        this.moveFallingObjectsDown = this.moveFallingObjectsDown.bind(this);
    }

    private updatePosition() {
        this.points = this.points + 10;
        if (this.points > 400) {
            this.points = -100;
        }
    }

    private spawnFallingObjects() {
        this.fallingObjects = new FallingObjects([
            Images.BLACK_STAR,
            Images.GREEN_STAR,
            Images.RED_STAR,
            Images.YELLOW_STAR,
        ]);
    }

    moveFallingObjectsDown() {
        console.log(JSON.stringify(this.gameBoard));
        this.fallingObjects.y -= 1;
        for (let i = 0; i < this.fallingObjects.objects.length; i++) {
            if (this.fallingObjects.objects[i] !== null) {
                const column = this.gameBoard[i];
                if (this.fallingObjects.y === 0 || column[this.fallingObjects.y-1] !== null) {
                    column[this.fallingObjects.y] = this.fallingObjects.objects[i];
                    this.fallingObjects.objects[i] = null;
                }
            }
        }
        if (this.fallingObjects.objects.every(obj => obj === null)) {
            this.spawnFallingObjects();
        }
        console.log(JSON.stringify(this.fallingObjects), JSON.stringify(this.gameBoard));
    }

    handleKey(keyCode: string, sendMessage: (payload: unknown) => void) {
        sendMessage({ type: "key", keyCode });
        if (keyCode === "ArrowRight") {
            this.updatePosition();
        }
    }

    reset() {
        this.gameBoard = [this.createColumn(), this.createColumn(), this.createColumn(), this.createColumn()];
        this.points = 0;
    }
}