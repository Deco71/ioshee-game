import { useEffect, useRef } from "react"
import type { PreloadedImages } from "./types/commonTypes";
import { IosheeGameEngine } from "./gameEngine/GameEngine";

// Create a version counter that increments every time Vite hot-reloads this file
let hmrVersion = 0;
if (import.meta.hot) {
    import.meta.hot.data.version = (import.meta.hot.data.version || 0) + 1;
    hmrVersion = import.meta.hot.data.version;
}

interface CanvasWrapperProps {
    images: PreloadedImages;
}

function CanvasWrapper(props: CanvasWrapperProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { images } = props;
    const gameEngineRef = useRef<IosheeGameEngine>(new IosheeGameEngine());
    const engine = gameEngineRef.current;
    
    // Track the animation frame so we can cancel it on unmount
    const requestRef = useRef<number>(null);


    // Reset states when HMR occurs
    useEffect(() => {
        gameEngineRef.current = new IosheeGameEngine();
    }, [hmrVersion]);

    useEffect(() => {
    
        const ctx = getCanvasContext();

        const loop = () => {

            render(ctx);

            requestRef.current = requestAnimationFrame(loop);
        };

        requestRef.current = requestAnimationFrame(loop);

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [images, hmrVersion]);

    // The Render Function
    function render(ctx: CanvasRenderingContext2D) {
        // Clear screen
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Draw background box
        ctx.fillStyle = 'red';
        ctx.fillRect(50, 50, 200, 100);
        
        // Draw moving image
        const greenImage = images.get("green");
        if (greenImage) {
            ctx.drawImage(greenImage, engine.counter, 0);
        }
    }

    function getCanvasContext(): CanvasRenderingContext2D {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error("Failed to get canvas element");
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Failed to get 2D context from canvas");
        return ctx;
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <canvas 
                id="game-canvas" 
                ref={canvasRef} 
                width={400} 
                height={400} 
                style={{ border: "2px solid #333" }}
                onClick={engine.updateCounter}
            />
        </div>
    );
}

export default CanvasWrapper;