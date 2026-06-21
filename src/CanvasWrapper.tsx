import { useEffect, useRef, useState } from "react"
import type { PreloadedImages } from "./types/commonTypes";
import { useGameEngine } from "./hooks/useGameEngine";

interface CanvasWrapperProps {
    images: PreloadedImages;
    roomName: string;
    goBack: () => void;
}

function CanvasWrapper(props: CanvasWrapperProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [wasReady, setWasReady] = useState(false);
    const { images, roomName } = props;

    const { engineRef, connected, ready } = useGameEngine(roomName);
    if (!engineRef.current) {
        throw new Error("Game engine not initialized");
    }
    const engine = engineRef.current;
    
    const requestRef = useRef<number | null>(null);


    useEffect(() => {
        if (!ready) {
            return;
        } else if (!wasReady) {
            setWasReady(true);
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
    }, [images, ready]);

    function render(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        ctx.fillStyle = 'red';
        ctx.fillRect(50, 50, 200, 100);
        
        const greenImage = images.get("green");
        if (greenImage) {
            ctx.drawImage(greenImage, engine.counter, engine.y);
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
        <div>
            { connected ? (
                ready ? (
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "20px" }}>
                        <canvas 
                            id="game-canvas" 
                            ref={canvasRef} 
                            width={400} 
                            height={400} 
                            style={{ border: "2px solid #333" }}
                            onClick={engine.updateCounter}
                        />
                        <p>Click the canvas to move the images.</p>
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
                onClick={props.goBack} 
                style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
            >
                Back to Room Selection
            </button>
        </div>
    );
}

export default CanvasWrapper;