export interface GameSocketHandlers {
    onOpen: () => void;
    onReady: () => void;
    onMoveGreenDown: () => void;
    onReset: () => void;
    onPause: () => void;
    onClose: () => void;
    onError: (event: Event) => void;
}

export function createGameSocket(
    channelName: string,
    handlers: GameSocketHandlers,
) {
    let socket: WebSocket | null = null;
    let reconnectTimer: number | null = null;
    let attemptingConnection = false;
    let sendInterval: number | null = null;

    const sendMessage = (payload: unknown) => {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(typeof payload === "string" ? payload : JSON.stringify(payload));
        } else {
            console.warn("Game socket is not open; cannot send message", payload);
        }
    };

    const scheduleReconnect = () => {
        if (reconnectTimer != null) return;
        reconnectTimer = window.setTimeout(() => {
            reconnectTimer = null;
            connect();
        }, 500);
    };

    const connect = () => {
        if (attemptingConnection) return;
        attemptingConnection = true;

        socket = new WebSocket(`ws://localhost:8080/ws?room=${channelName}`);

        const handleOpen = () => {
            attemptingConnection = false;
            handlers.onOpen();
        };

        const handleMessage = (event: MessageEvent) => {
            const message = event.data;
            if (message === "ready") {
                handlers.onReady();
            } else if (message === "moveGreenDown") {
                handlers.onMoveGreenDown();
            } else if (message === "reset") {
                handlers.onReset();
            } else if (message === "pause") {
                handlers.onPause();
            }
        };

        const handleClose = () => {
            attemptingConnection = false;
            handlers.onClose();
            scheduleReconnect();
        };

        const handleError = (event: Event) => {
            attemptingConnection = false;
            handlers.onError(event);
            scheduleReconnect();
        };

        socket.addEventListener("open", handleOpen);
        socket.addEventListener("message", handleMessage);
        socket.addEventListener("close", handleClose);
        socket.addEventListener("error", handleError);

        return () => {
            if (sendInterval != null) {
                clearInterval(sendInterval);
                sendInterval = null;
            }
            if (!socket) return;
            socket.removeEventListener("open", handleOpen);
            socket.removeEventListener("message", handleMessage);
            socket.removeEventListener("close", handleClose);
            socket.removeEventListener("error", handleError);
            socket.close();
            socket = null;
        };
    };

    const cleanup = connect();

    const cleanupReconnect = () => {
        if (reconnectTimer != null) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }
        cleanup?.();
    };

    return { sendMessage, cleanupReconnect };
}
