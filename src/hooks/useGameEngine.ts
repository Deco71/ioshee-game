import { useRef, useEffect, useState, useMemo } from "react";
import { IosheeGameEngine } from "../gameEngine/GameEngine";
import { createGameSocket } from "../socket/GameSocket";

interface UseGameEngineOptions {
    singlePlayer?: boolean;
}

export function useGameEngine(channelName: string, options: UseGameEngineOptions = {}) {
    const { singlePlayer = false } = options;
    const engine = useMemo(() => new IosheeGameEngine(), []);

    const sendMessageRef = useRef<(payload: unknown) => void>(() => {
        return;
    });

    const [connected, setConnected] = useState(singlePlayer);
    const [ready, setReady] = useState(singlePlayer);
    const [wasReady, setWasReady] = useState(singlePlayer);

    useEffect(() => {
        engine.reset();
    }, [engine]);

    useEffect(() => {
        if (!singlePlayer) {
            return;
        }

        setConnected(true);
        setReady(true);
        setWasReady(true);
    }, [engine, singlePlayer]);

    useEffect(() => {
        if (!connected || !ready) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            engine.handleKey(e.code, sendMessageRef.current);
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [connected, engine, ready]);

    useEffect(() => {
        if (singlePlayer) return;
        const { sendMessage, cleanupReconnect } = createGameSocket(channelName, {
            onOpen: () => {
                setConnected(true);
                console.log("Game WebSocket connected");
            },
            onReady: () => {
                setReady(true);
                setWasReady(true);
            },
            onMoveGreenDown: () => engine.moveFallingObjectsDown(),
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

        sendMessageRef.current = sendMessage;

        return cleanupReconnect;
    }, [channelName, engine, singlePlayer]);

    return { engine, connected, ready, wasReady };
}