export class IosheeGameEngine {
    counter: number;
    y: number;

    constructor() {
        this.counter = 0;
        this.y = 0;
        this.updateCounter = this.updateCounter.bind(this);
        this.moveGreenDown = this.moveGreenDown.bind(this);
    }

    private updateCounter() {
        this.counter = this.counter + 10;
        if (this.counter > 400) {
            this.counter = -100;
        }
    }

    moveGreenDown() {
        this.y += 10;
        if (this.y > 400) {
            this.y = 0;
        }
    }

    handleKey(keyCode: string, sendMessage: (payload: unknown) => void) {
        sendMessage({ type: "key", keyCode });
        if (keyCode === "ArrowRight") {
            this.updateCounter();
        }
    }

    reset() {
        this.counter = 0;
        this.y = 0;
    }
}