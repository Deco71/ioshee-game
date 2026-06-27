import { useEffect, useRef, useCallback, useState } from "react";
import type { PreloadedImages } from "./types/commonTypes";
import { useGameEngine } from "./hooks/useGameEngine";
import { Images } from "./types/Images";

const BOARD_COLUMNS = 4;
const PREVIEW_ROWS = 1;
const PREVIEW_HEIGHT = PREVIEW_ROWS * 30;
const BOARD_ROWS = 7;
const TOTAL_ROWS = BOARD_ROWS + PREVIEW_ROWS;
const CELL_SIZE = 56;
const BOARD_ORIGIN_X = 24;
const BOARD_ORIGIN_Y = 24;
const BOARD_HEIGHT = TOTAL_ROWS * CELL_SIZE + 2 * BOARD_ORIGIN_Y + PREVIEW_HEIGHT;
const BOARD_WIDTH = BOARD_COLUMNS * CELL_SIZE + 2 * BOARD_ORIGIN_X;

interface CanvasWrapperProps {
    images: PreloadedImages;
    roomName: string;
    goBack: () => void;
    singlePlayer?: boolean;
    gameSpeed?: number;
    startLines?: number;
}

function CanvasWrapper(props: CanvasWrapperProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const requestRef = useRef<number | null>(null);
    const [scaleMultiplier, setScaleMultiplier] = useState(1);

    const { images, roomName, goBack, singlePlayer = false, gameSpeed = 1, startLines = 0 } = props;
    const { engine, connected, ready, wasReady } = useGameEngine(roomName, { singlePlayer });

    useEffect(() => {
        const handleResize = () => {
            const HEIGHT_BUFFER = 200; 
            const WIDTH_BUFFER = 40;   

            const availableWidth = window.innerWidth - WIDTH_BUFFER;
            const availableHeight = window.innerHeight - HEIGHT_BUFFER;

            const rawScale = Math.min(availableWidth, availableHeight) / BOARD_HEIGHT;
            
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
        const boardOriginX = BOARD_ORIGIN_X * scaleMultiplier;
        const boardOriginY = BOARD_ORIGIN_Y * scaleMultiplier;

        const drawPiece = (imageKey: Images, columnIndex: number, rowIndex: number) => {
            const image = images.get(imageKey);
            if (!image) {
                return;
            }

            // Calculate base Y position
            let y = boardOriginY + rowIndex * cellHeight;
            
            // Add the preview gap offset for pieces on the main board
            if (rowIndex >= PREVIEW_ROWS) {
                y += PREVIEW_HEIGHT * scaleMultiplier;
            }

            ctx.drawImage(
                image,
                boardOriginX + columnIndex * cellWidth,
                y,
                cellWidth,
                cellHeight,
            );
        };

        ctx.strokeStyle = "#3b2f2a";
        ctx.lineWidth = 2;

        // Draw Preview Row
        for (let columnIndex = 0; columnIndex < BOARD_COLUMNS; columnIndex++) {
            const x = boardOriginX + columnIndex * cellWidth;
            const y = boardOriginY;
            ctx.strokeRect(x, y, cellWidth, cellHeight);

            const nextObject = engine.nextObjects[columnIndex];
            if (nextObject) {
                drawPiece(nextObject, columnIndex, 0);
            }
        }

        // Draw Main Board
        for (let columnIndex = 0; columnIndex < BOARD_COLUMNS; columnIndex++) {
            for (let rowIndex = 0; rowIndex < BOARD_ROWS; rowIndex++) {
                const x = boardOriginX + columnIndex * cellWidth;
                const y = boardOriginY + (rowIndex + PREVIEW_ROWS) * cellHeight + (PREVIEW_HEIGHT * scaleMultiplier);
                ctx.strokeRect(x, y, cellWidth, cellHeight);
                const settledObject = engine.gameBoard[columnIndex][rowIndex];
                if (settledObject) {
                    drawPiece(settledObject, columnIndex, rowIndex + PREVIEW_ROWS);
                }
            }
        }

        // Draw Falling Objects
        engine.fallingObjects.objects.forEach((fallingObject, columnIndex) => {
            if (!fallingObject) {
                return;
            }

            const rowIndex = engine.fallingObjects.y + PREVIEW_ROWS;
            if (rowIndex < 0 || rowIndex >= TOTAL_ROWS) {
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

        let windowStartTime = performance.now();
        let currentPhase = 0;

        const gameLoop = (timestamp : number) => {
            const elapsed = timestamp - windowStartTime;
            if (!ready) return;

            if (currentPhase === 0) {
                engine.checkForEmptyFallingObjects();
                currentPhase = 1; 
            } 
            else if (currentPhase === 1 && elapsed >= 300 * (1 / gameSpeed)) {
                engine.handleCollision();
                currentPhase = 2;
            } 
            else if (elapsed >= 1000 * (1 / gameSpeed)) {
                engine.moveFallingObjectsDown();
                windowStartTime = timestamp - (elapsed % 1000 * (1 / gameSpeed)); 
                currentPhase = 0;
            }

            render(ctx);

            requestRef.current = requestAnimationFrame(gameLoop);
        };

        requestRef.current = requestAnimationFrame((timestamp) => {
            windowStartTime = timestamp;
            gameLoop(timestamp);
        });

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
                requestRef.current = null;
            }
        };
    }, [ready, engine, getCanvasContext, render]);

    return (
        <div className="canvas-wrapper-container">
            {singlePlayer || connected ? (
                ready ? (
                    <div className="canvas-ready-container">
                        <canvas
                            id="game-canvas"
                            className="game-canvas"
                            ref={canvasRef}
                            width={Math.round(BOARD_WIDTH * scaleMultiplier)}
                            height={Math.round(BOARD_HEIGHT * scaleMultiplier)}
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