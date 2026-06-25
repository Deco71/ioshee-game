import { useEffect, useRef, useCallback } from "react";
import type { PreloadedImages } from "./types/commonTypes";
import { useGameEngine } from "./hooks/useGameEngine";
import { Images } from "./types/Images";

const BOARD_COLUMNS = 4;
const BOARD_ROWS = 7;
const CELL_SIZE = 56;
const BOARD_ORIGIN_X = 24;
const BOARD_ORIGIN_Y = 24;

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
        ctx.fillStyle = "#f6f2ea";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const cellWidth = CELL_SIZE;
        const cellHeight = CELL_SIZE;
        const drawPiece = (imageKey: Images, columnIndex: number, rowIndex: number) => {
            const image = images.get(imageKey);
            if (!image) {
                return;
            }

            ctx.drawImage(
                image,
                BOARD_ORIGIN_X + columnIndex * cellWidth,
                BOARD_ORIGIN_Y + rowIndex * cellHeight,
                cellWidth,
                cellHeight,
            );
        };

        ctx.strokeStyle = "#3b2f2a";
        ctx.lineWidth = 2;
        for (let columnIndex = 0; columnIndex < BOARD_COLUMNS; columnIndex++) {
            for (let rowIndex = 0; rowIndex < BOARD_ROWS; rowIndex++) {
                const x = BOARD_ORIGIN_X + columnIndex * cellWidth;
                const y = BOARD_ORIGIN_Y + rowIndex * cellHeight;
                ctx.strokeRect(x, y, cellWidth, cellHeight);
                const settledObject = engine.gameBoard[columnIndex][rowIndex];
                if (settledObject) {
                    drawPiece(settledObject, columnIndex, rowIndex);
                }
            }
        }

        engine.fallingObjects.objects.forEach((fallingObject, columnIndex) => {
            if (!fallingObject) {
                return;
            }

            const rowIndex = engine.fallingObjects.y;
            if (rowIndex < 0 || rowIndex >= BOARD_ROWS) {
                return;
            }

            drawPiece(fallingObject, columnIndex, rowIndex);
        });
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