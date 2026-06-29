import { FallingObjects } from "./FallingObjects";
import { type Gameboard, type GameColumn, GameEndStatus, type GameObject, type NextObjects } from "../types/commonTypes";
import { Images } from "../types/Images";
import { areGameObjectsEqual } from "../utils";

export class IosheeGameEngine {
    gameBoard: Gameboard;
    fallingObjects: FallingObjects = new FallingObjects();
    nextObjects: NextObjects = [null, null, null, null];
    gameSpeed: number;
    points: number = 0;
    marioPosition: number = 0;
    fastDroppingRef: boolean = false;
    endCallback: (endStatus: GameEndStatus) => void;

    private readonly fallingObjectPool: GameObject[] = [
        Images.BLACK_STAR,
        Images.GREEN_STAR,
        Images.RED_STAR,
        Images.YELLOW_STAR,
    ];

    private createColumn = (): GameColumn => [null, null, null, null, null, null, null];

    constructor(gameLevel: number, gameSpeed: number, endCallback: (gameEndStatus: GameEndStatus) => void) {
        this.gameBoard = this.createGameboard(gameLevel);
        this.gameSpeed = gameSpeed;

        this.updatePosition = this.updatePosition.bind(this);
        this.moveFallingObjectsDown = this.moveFallingObjectsDown.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleCollision = this.handleCollision.bind(this);
        this.reset = this.reset.bind(this);
        this.endCallback = endCallback;
        this.spawnFallingObjects();
        this.spawnFallingObjects();
    }

    private createGameboard(gameLevel: number): Gameboard {
        const gameBoard: Gameboard = [this.createColumn(), this.createColumn(), this.createColumn(), this.createColumn()];
        console.log(`Gameboard created with level ${gameLevel}:`, gameBoard);
        return gameBoard;
    }

    private updatePosition() {
        this.points = this.points + 10;
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

        //LOSING END CONDITION
        for (let i = 0; i < this.nextObjects.length; i++) {
            if (this.nextObjects[i] !== null) {
                if (this.gameBoard[i][0] !== null) {
                    if (areGameObjectsEqual(this.gameBoard[i][0], this.nextObjects[i])) {
                        this.gameBoard[i][0] = null;
                        this.nextObjects[i] = null;
                        this.points += 10;
                    } else {
                        console.log("Collision detected at the top! Game Over.");
                        this.endCallback(GameEndStatus.LOST_STATUS);
                        return;
                    }
                }
            }
        }
        

        this.fallingObjects = new FallingObjects([...this.nextObjects]);
        this.nextObjects = [...objects];
    }

    moveFallingObjectsDown() {
        this.fallingObjects.y += 1;
    }

    private invertGameColumns() {
        const currentColumn = this.gameBoard[this.marioPosition];
        const fallingObjects = this.fallingObjects.objects;
        
        if (fallingObjects[this.marioPosition] !== null) {
            if (this.gameBoard[this.marioPosition + 1][this.fallingObjects.y] !== null) {
                const tempFallingObject = fallingObjects[this.marioPosition];
                fallingObjects[this.marioPosition] = null;
                fallingObjects[this.marioPosition + 1] = tempFallingObject;
            }
        }
        if (fallingObjects[this.marioPosition + 1] !== null) {
            if (this.gameBoard[this.marioPosition][this.fallingObjects.y] !== null) {
                const tempFallingObject = fallingObjects[this.marioPosition + 1];
                fallingObjects[this.marioPosition + 1] = null;
                fallingObjects[this.marioPosition] = tempFallingObject;
            }
        }


        this.gameBoard[this.marioPosition] = this.gameBoard[this.marioPosition + 1];
        this.gameBoard[this.marioPosition + 1] = currentColumn;
    }

    private checkForEmptyBoard() {
        const isBoardEmpty = this.gameBoard.every(column => column.every(cell => cell === null));
        if (isBoardEmpty) {
            console.log("All objects removed! You win!");
            this.endCallback(GameEndStatus.WIN_STATUS);
        }
    }

    handleCollision() {
        let howMuchRemoved = 0;
        for (let i = 0; i < this.fallingObjects.objects.length; i++) {
            if (this.fallingObjects.objects[i] !== null) {
                if (this.fallingObjects.y === 6 || this.gameBoard[i][this.fallingObjects.y+1] !== null) {
                    const column = this.gameBoard[i];
                    const fallingObjects = this.fallingObjects.objects;
                    if (areGameObjectsEqual(column[this.fallingObjects.y+1], fallingObjects[i])) {
                        fallingObjects[i] = null;
                        column[this.fallingObjects.y+1] = null;
                        this.points += 10;
                        howMuchRemoved++;
                    } else {
                        this.gameBoard[i][this.fallingObjects.y] = fallingObjects[i];
                        fallingObjects[i] = null;
                    }
                }
            }
        }
        if (howMuchRemoved > 1) {
            this.checkForEmptyBoard();
        }
    }

    checkForEmptyFallingObjects() {
        if (this.fallingObjects.objects.every(obj => obj === null)) {
            this.spawnFallingObjects();
        }
    }

    handleKeyDown(keyCode: string, sendMessage: (payload: unknown) => void) {
        sendMessage({ type: "keyDown", keyCode });
        if (keyCode === "ArrowRight") {
            this.marioPosition = Math.min(this.marioPosition + 1, 2);
        }
        else if (keyCode === "ArrowLeft") {
            this.marioPosition = Math.max(this.marioPosition - 1, 0);
        }
        else if (keyCode === "ArrowUp") {
            this.invertGameColumns();
        } 
        else if (keyCode === "ArrowDown") {
            this.fastDroppingRef = true;
        }
    }

    handleKeyUp(keyCode: string, sendMessage: (payload: unknown) => void) {
        sendMessage({ type: "keyUp", keyCode });
        if (keyCode === "ArrowDown") {
            this.fastDroppingRef = false;
        }
    }

    reset(gameLevel: number) {
        this.gameBoard = this.createGameboard(gameLevel);
        this.points = 0;
        this.marioPosition = 0;
    }
}