export class IosheeGameEngine {
    counter: number;

    constructor() {
        this.counter = 0;
        this.updateCounter = this.updateCounter.bind(this);
    }

    
    updateCounter() {
        this.counter = this.counter + 10; // Move player 10 pixels to the right
        // Loop back if off screen
        if (this.counter > 400) {
            this.counter = -100;
        }
        console.log(`Counter updated to: ${this.counter}`);
    }
}