import { useRef, useEffect, useState, useMemo } from "react";
import { IosheeGameEngine } from "../gameEngine/GameEngine";
import { createGameSocket } from "../socket/GameSocket";

export function useGameEngine(channelName: string) {
    const engine = useMemo(() => new IosheeGameEngine(), []);

    const sendMessageRef = useRef<(payload: unknown) => void>(() => {
        console.warn("Send message called before socket is ready");
    });

    const [connected, setConnected] = useState(false);
    const [ready, setReady] = useState(false);
    const [wasReady, setWasReady] = useState(false);

    useEffect(() => {
        engine.reset();
    }, [engine]);

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
        const { sendMessage, cleanupReconnect } = createGameSocket(channelName, {
            onOpen: () => {
                setConnected(true);
                console.log("Game WebSocket connected");
            },
            onReady: () => {
                setReady(true);
                setWasReady(true);
            },
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

        sendMessageRef.current = sendMessage;

        return cleanupReconnect;
    }, [channelName, engine]);

    return { engine, connected, ready, wasReady };
}