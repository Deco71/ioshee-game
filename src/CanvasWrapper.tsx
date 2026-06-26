import { useEffect, useRef, useCallback, useState } from "react";
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
    singlePlayer?: boolean;
}

function CanvasWrapper(props: CanvasWrapperProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const requestRef = useRef<number | null>(null);
    const [scaleMultiplier, setScaleMultiplier] = useState(1);

    const { images, roomName, goBack, singlePlayer = false } = props;
    const { engine, connected, ready, wasReady } = useGameEngine(roomName, { singlePlayer });

    useEffect(() => {
        const handleResize = () => {
            const HEIGHT_BUFFER = 200; 
            const WIDTH_BUFFER = 40;   

            const availableWidth = window.innerWidth - WIDTH_BUFFER;
            const availableHeight = window.innerHeight - HEIGHT_BUFFER;

            const rawScale = Math.min(availableWidth, availableHeight) / 448;
            
            const scale = Math.max(rawScale, 0.2); 
            
            setScaleMultiplier(scale);
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

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

        const cellWidth = CELL_SIZE * scaleMultiplier;
        const cellHeight = CELL_SIZE * scaleMultiplier;
        const drawPiece = (imageKey: Images, columnIndex: number, rowIndex: number) => {
            const image = images.get(imageKey);
            if (!image) {
                return;
            }

            const boardOriginX = BOARD_ORIGIN_X * scaleMultiplier;
            const boardOriginY = BOARD_ORIGIN_Y * scaleMultiplier;
            ctx.drawImage(
                image,
                boardOriginX + columnIndex * cellWidth,
                boardOriginY + rowIndex * cellHeight,
                cellWidth,
                cellHeight,
            );
        };

        const boardOriginX = BOARD_ORIGIN_X * scaleMultiplier;
        const boardOriginY = BOARD_ORIGIN_Y * scaleMultiplier;

        ctx.strokeStyle = "#3b2f2a";
        ctx.lineWidth = 2;
        for (let columnIndex = 0; columnIndex < BOARD_COLUMNS; columnIndex++) {
            for (let rowIndex = 0; rowIndex < BOARD_ROWS; rowIndex++) {
                const x = boardOriginX + columnIndex * cellWidth;
                const y = boardOriginY + rowIndex * cellHeight;
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
    }, [images, engine, scaleMultiplier]);

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
        <div className="canvas-wrapper-container">
            {singlePlayer || connected ? (
                ready ? (
                    <div className="canvas-ready-container">
                        <canvas
                            id="game-canvas"
                            className="game-canvas"
                            ref={canvasRef}
                            width={Math.round(274 * scaleMultiplier)}
                            height={Math.round(448 * scaleMultiplier)}
                        />
                    </div>) :
                    (
                        <div className="waiting-message-container">
                            <h2>{wasReady ? "The other player has disconnected..." : "Waiting for other players..."}</h2>
                            <p>The game will start once all players are ready.</p>
                        </div>
                    )
            ) :
                (
                    <div className="connecting-message-container">
                        <h2>Connecting to Game Server...</h2>
                        <p>Please wait while we establish a connection.</p>
                    </div>
                )}
            <button
                className="back-button"
                onClick={goBack}
            >
                Back to Room Selection
            </button>
        </div>
    );
}

export default CanvasWrapper;