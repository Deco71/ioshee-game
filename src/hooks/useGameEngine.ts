// hooks/useGameEngine.ts
import { useRef, useEffect, useState } from "react";
import { IosheeGameEngine } from "../gameEngine/GameEngine";
import { createGameSocket } from "../socket/GameSocket";

export function useGameEngine(channelName: string) {

    const engineRef = useRef<IosheeGameEngine | null>(null);
    const [connected, setConnected] = useState(false);
    const [ready, setReady] = useState(false);

    if (!engineRef.current) {
        engineRef.current = new IosheeGameEngine();
    }

    function getPosition() {
        const engine = engineRef.current;
        if (!engine) {
            return { x: 0, y: 0 };
        }
        return { x: engine.counter, y: engine.y };
    }

    useEffect(() => {
        engineRef.current?.reset();
        setConnected(false);
    }, []);

    useEffect(() => {
        const engine = engineRef.current;
        if (!engine) return;
        if (!connected) return;

        const handleKeyDown = (e: KeyboardEvent) => engine.handleKeyDown(e.code);
        const handleKeyUp = (e: KeyboardEvent) => engine.handleKeyUp(e.code);

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [connected]);

    useEffect(() => {
        const engine = engineRef.current;
        if (!engine) return;

        const cleanupSocket = createGameSocket(channelName, getPosition, 
        {
            onOpen: () => {
                setConnected(true);
                console.log("Game WebSocket connected");
            },
            onReady: () => setReady(true),
            onMoveGreenDown: () => engine.moveGreenDown(),
            onReset: () => engine.reset(),
            onPause: () => setReady(false),
            onClose: () => {
                setConnected(false);
                console.log("Game WebSocket disconnected");
            },
            onError: (event) => {
                setConnected(false);
                console.error("Game WebSocket error:", event);
            },
        });

        return cleanupSocket;
    }, [channelName]);

    return { engineRef, connected, ready };
}