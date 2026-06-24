import { useEffect, useRef, useCallback } from "react";
import type { PreloadedImages } from "./types/commonTypes";
import { useGameEngine } from "./hooks/useGameEngine";
import { Images } from "./enum/images";

interface CanvasWrapperProps {
    images: PreloadedImages;
    roomName: string;
    goBack: () => void;
}

function CanvasWrapper(props: CanvasWrapperProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const requestRef = useRef<number | null>(null);

    const { images, roomName, goBack } = props;
    const { engine, connected, ready, wasReady } = useGameEngine(roomName);

    const getCanvasContext = useCallback((): CanvasRenderingContext2D => {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error("Failed to get canvas element");
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Failed to get 2D context from canvas");
        return ctx;
    }, []);

    const render = useCallback((ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = 'red';
        ctx.fillRect(50, 50, 200, 100);

        const greenImage = images.get(Images.GREEN);
        const starImage = images.get(Images.GREEN_STAR);
        if (greenImage) {
            ctx.drawImage(greenImage, engine.counter, engine.y);
        }
        if (starImage) {
            ctx.drawImage(starImage, 100, 100);
        }
    }, [images, engine]);

    useEffect(() => {
        if (!ready) {
            return;
        }

        const ctx = getCanvasContext();

        const loop = () => {
            render(ctx);
            requestRef.current = requestAnimationFrame(loop);
        };

        requestRef.current = requestAnimationFrame(loop);

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
                requestRef.current = null;
            }
        };
    }, [ready, getCanvasContext, render]);

    return (
        <div>
            {connected ? (
                ready ? (
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "20px" }}>
                        <canvas
                            id="game-canvas"
                            ref={canvasRef}
                            width={400}
                            height={400}
                            style={{ border: "2px solid #333" }}
                        />
                    </div>) :
                    (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
                            <h2>{wasReady ? "The other player has disconnected..." : "Waiting for other players..."}</h2>
                            <p>The game will start once all players are ready.</p>
                        </div>
                    )
            ) :
                (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
                        <h2>Connecting to Game Server...</h2>
                        <p>Please wait while we establish a connection.</p>
                    </div>
                )}
            <button
                onClick={goBack}
                style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
            >
                Back to Room Selection
            </button>
        </div>
    );
}

export default CanvasWrapper;