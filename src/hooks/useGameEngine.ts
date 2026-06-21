// hooks/useGameEngine.ts
import { useRef, useEffect, useState } from "react";
import { IosheeGameEngine } from "../gameEngine/GameEngine";
import { createGameSocket } from "../socket/GameSocket";

export function useGameEngine(channelName: string) {

    const engineRef = useRef<IosheeGameEngine | null>(null);
    const sendMessageRef = useRef<(payload: unknown) => void>(() => {
        console.warn("Send message called before socket is ready");
    });
    const [connected, setConnected] = useState(false);
    const [ready, setReady] = useState(false);

    if (!engineRef.current) {
        engineRef.current = new IosheeGameEngine();
    }

    useEffect(() => {
        engineRef.current?.reset();
        setConnected(false);
    }, []);

    useEffect(() => {
        const engine = engineRef.current;
        if (!engine) return;
        if (!connected) return;

        const handleKeyDown = (e: KeyboardEvent) => engine.handleKey(e.code, sendMessageRef.current);

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [connected]);

    useEffect(() => {
        const engine = engineRef.current;
        if (!engine) return;

        const {sendMessage, cleanupReconnect} = createGameSocket(channelName, 
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

        sendMessageRef.current = sendMessage;

        return cleanupReconnect;
    }, [channelName]);

    return { engineRef, connected, ready };
}