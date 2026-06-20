import { useEffect, useRef, useState } from "react"
import type { PreloadedImages } from "./types/commonTypes";

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
    const [count, setCount] = useState(0);
    const { images } = props;


    //Reset states and logic when HMR occurs
    useEffect(() => {
        setCount(0);
    }, [hmrVersion]);

    useEffect(() => {
        render();
    }, [images, count]);


    function render() {
        const ctx = getCanvasContext();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.fillStyle = 'red';
        ctx.fillRect(50, 50, 200, 100);
        const greenImage = images.get("green");
        if (greenImage) {
            console.log("Rendering green image at x:", count * 10, greenImage.width, greenImage.height);
            ctx.drawImage(greenImage, count * 10, 0);
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
        <canvas id="game-canvas" ref={canvasRef} width={400} height={400} onClick={() => {setCount(count + 1)}} />
    );
}

export default CanvasWrapper;