import { FallingObjects } from "../classes/FallingObjects";
import type { Gameboard, GameColumn, GameObject, NextObjects } from "../types/commonTypes";
import { Images } from "../types/Images";

export class IosheeGameEngine {
    gameBoard: Gameboard;
    fallingObjects: FallingObjects = new FallingObjects();
    nextObjects: NextObjects = [null, null, null, null];
    points: number = 0;

    private readonly fallingObjectPool: GameObject[] = [
        Images.BLACK_STAR,
        Images.GREEN_STAR,
        Images.RED_STAR,
        Images.WHITE_STAR,
        Images.YELLOW_STAR,
    ];

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

    private pickRandomItems<T>(items: T[], count: number) {
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    private spawnFallingObjects(numberOfObjects: number = 2) {
        const objects = [...Array<GameObject | null>(4)].map(() => null) as NextObjects;
        const randomImages = this.pickRandomItems(this.fallingObjectPool, numberOfObjects);
        const randomPositions = this.pickRandomItems([0, 1, 2, 3], numberOfObjects);

        randomPositions.forEach((position, index) => {
            objects[position] = randomImages[index] ?? null;
        });

        this.fallingObjects = new FallingObjects(objects);
    }

    moveFallingObjectsDown() {
        this.fallingObjects.y += 1;
        for (let i = 0; i < this.fallingObjects.objects.length; i++) {
            if (this.fallingObjects.objects[i] !== null) {
                const column = this.gameBoard[i];
                if (this.fallingObjects.y === 6 || column[this.fallingObjects.y+1] !== null) {
                    column[this.fallingObjects.y] = this.fallingObjects.objects[i];
                    this.fallingObjects.objects[i] = null;
                }
            }
        }
        if (this.fallingObjects.objects.every(obj => obj === null)) {
            this.spawnFallingObjects();
        }
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