export class IosheeGameEngine {
    counter: number;
    y: number;

    constructor() {
        this.counter = 0;
        this.y = 0;
        this.updateCounter = this.updateCounter.bind(this);
        this.moveGreenDown = this.moveGreenDown.bind(this);
    }

    updateCounter() {
        this.counter = this.counter + 10;
        if (this.counter > 400) {
            this.counter = -100;
        }
    }

    moveGreenDown() {
        console.log("WebSocket event: move green down");
        this.y += 10;
        if (this.y > 400) {
            this.y = 0;
        }
    }

    handleKeyDown(keyCode: string) {
        console.log(`Key down: ${keyCode}`);
        if (keyCode === "ArrowRight") {
            this.updateCounter();
        }
    }

    handleKeyUp(keyCode: string) {
        console.log(`Key up: ${keyCode}`);
    }

    reset() {
        this.counter = 0;
        this.y = 0;
    }
}