import { FallingObjects } from "../classes/FallingObjects";
import { type Gameboard, type GameColumn, type GameObject, type NextObjects } from "../types/commonTypes";
import { Images } from "../types/Images";
import { areGameObjectsEqual } from "../utils";

export class IosheeGameEngine {
    gameBoard: Gameboard;
    fallingObjects: FallingObjects = new FallingObjects();
    nextObjects: NextObjects = [null, null, null, null];
    points: number = 0;
    marioPosition: number = 0;

    private readonly fallingObjectPool: GameObject[] = [
        Images.BLACK_STAR,
        Images.GREEN_STAR,
        Images.RED_STAR,
        Images.YELLOW_STAR,
    ];

    private createColumn = (): GameColumn => [null, null, null, null, null, null, null];

    constructor() {
        this.gameBoard = [this.createColumn(), this.createColumn(), this.createColumn(), this.createColumn()];
        this.updatePosition = this.updatePosition.bind(this);
        this.moveFallingObjectsDown = this.moveFallingObjectsDown.bind(this);
        this.handleKey = this.handleKey.bind(this);
        this.handleCollision = this.handleCollision.bind(this);
        this.spawnFallingObjects();
        this.spawnFallingObjects();
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

        this.fallingObjects = new FallingObjects([...this.nextObjects]);
        this.nextObjects = [...objects];
    }

    moveFallingObjectsDown() {
        this.fallingObjects.y += 1;
    }

    private invertGameColumns(position: number) {
        const nextPosition = position + 1;
        const currentColumn = this.gameBoard[position];
        this.gameBoard[position] = this.gameBoard[nextPosition];
        this.gameBoard[nextPosition] = currentColumn;
    }

    handleCollision() {
        for (let i = 0; i < this.fallingObjects.objects.length; i++) {
            if (this.fallingObjects.objects[i] !== null) {
                if (this.fallingObjects.y === 6 || this.gameBoard[i][this.fallingObjects.y+1] !== null) {
                    const column = this.gameBoard[i];
                    const fallingObjects = this.fallingObjects.objects;
                    if (areGameObjectsEqual(column[this.fallingObjects.y+1], fallingObjects[i])) {
                        fallingObjects[i] = null;
                        column[this.fallingObjects.y+1] = null;
                        this.points += 10;
                    } else {
                        this.gameBoard[i][this.fallingObjects.y] = fallingObjects[i];
                        fallingObjects[i] = null;
                    }
                }
            }
        }
    }

    checkForEmptyFallingObjects() {
        if (this.fallingObjects.objects.every(obj => obj === null)) {
            this.spawnFallingObjects();
        }
    }

    handleKey(keyCode: string, sendMessage: (payload: unknown) => void) {
        sendMessage({ type: "key", keyCode });
        if (keyCode === "ArrowRight") {
            this.marioPosition = Math.min(this.marioPosition + 1, 2);
        }
        else if (keyCode === "ArrowLeft") {
            this.marioPosition = Math.max(this.marioPosition - 1, 0);
        }
        else if (keyCode === "ArrowDown") {
            this.invertGameColumns(this.marioPosition);
        }
    }

    reset() {
        this.gameBoard = [this.createColumn(), this.createColumn(), this.createColumn(), this.createColumn()];
        this.points = 0;
        this.marioPosition = 0;
    }
}