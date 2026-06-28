import { useRef, useEffect, useState, useMemo } from "react";
import { IosheeGameEngine } from "../gameEngine/GameEngine";
import { createGameSocket } from "../socket/GameSocket";
import type { GameEndStatus } from "../types/commonTypes";

interface UseGameEngineOptions {
    gameLevel: number;
    gameSpeed: number;
    singlePlayer: boolean;
}

export function useGameEngine(
        channelName: string,
        endGame: (endStatus: GameEndStatus) => void,
        options: UseGameEngineOptions
    ) {
    const { singlePlayer = false, gameLevel, gameSpeed} = options;
    const engine = useMemo(() => new IosheeGameEngine(gameLevel, gameSpeed, endGame),  []);

    const sendMessageRef = useRef<(payload: unknown) => void>(() => {
        return;
    });
    const [connected, setConnected] = useState(singlePlayer);
    const [ready, setReady] = useState(singlePlayer);
    const [wasReady, setWasReady] = useState(singlePlayer);

    useEffect(() => {
        engine.reset(gameLevel);
    }, [engine, gameLevel]);

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
            engine.handleKeyDown(e.code, sendMessageRef.current);
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            engine.handleKeyUp(e.code, sendMessageRef.current);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
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