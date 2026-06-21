// hooks/useGameEngine.ts
import { useRef, useEffect } from "react";
import { IosheeGameEngine } from "../gameEngine/GameEngine";

export function useGameEngine(hmrVersion: number) {

    const engineRef = useRef<IosheeGameEngine | null>(null);
    if (!engineRef.current) {
        engineRef.current = new IosheeGameEngine();
    }

    useEffect(() => {
        engineRef.current?.reset();
    }, [hmrVersion]);

    useEffect(() => {
        const engine = engineRef.current;
        if (!engine) return;

        const handleKeyDown = (e: KeyboardEvent) => engine.handleKeyDown(e.code);
        const handleKeyUp = (e: KeyboardEvent) => engine.handleKeyUp(e.code);

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [hmrVersion]);

    useEffect(() => {
        const engine = engineRef.current;
        if (!engine) return;

        const socket = new WebSocket("ws://localhost:8080/ws");

        const handleOpen = () => console.log("Game WebSocket connected");
        const handleMessage = () => engine.moveGreenDown();
        const handleClose = () => console.log("Game WebSocket disconnected");
        const handleError = (event: Event) => console.error("Game WebSocket error:", event);

        socket.addEventListener("open", handleOpen);
        socket.addEventListener("message", handleMessage);
        socket.addEventListener("close", handleClose);
        socket.addEventListener("error", handleError);

        return () => {
            socket.removeEventListener("open", handleOpen);
            socket.removeEventListener("message", handleMessage);
            socket.removeEventListener("close", handleClose);
            socket.removeEventListener("error", handleError);
            socket.close();
        };
    }, [hmrVersion]);

    return engineRef;
}