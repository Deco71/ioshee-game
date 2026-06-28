export interface GameSocketHandlers {
    onOpen: () => void;
    onReady: () => void;
    onMoveGreenDown: () => void;
    onPause: () => void;
    onClose: () => void;
    onError: (event: Event) => void;
}

export class GameSocket {
    private socket: WebSocket | null = null;
    private channelName: string;
    private handlers: GameSocketHandlers;
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    private reconnectAttempts = 0;
    private isClosedExplicitly = false;
    private messageQueue: (string | object)[] = [];
    
    // Exponential backoff configuration
    private readonly minReconnectDelay = 500;
    private readonly maxReconnectDelay = 10000;
    private readonly backoffFactor = 1.5;
    private readonly maxQueueSize = 100;

    constructor(channelName: string, handlers: GameSocketHandlers) {
        this.channelName = channelName;
        this.handlers = handlers;
        this.connect();
    }

    private connect() {
        if (this.isClosedExplicitly) return;
        this.cleanupSocket();

        const url = `ws://localhost:8080/ws?room=${encodeURIComponent(this.channelName)}`;
        const socket = new WebSocket(url);
        this.socket = socket;

        socket.addEventListener("open", this.handleOpen);
        socket.addEventListener("message", this.handleMessage);
        socket.addEventListener("close", this.handleClose);
        socket.addEventListener("error", this.handleError);
    }

    private handleOpen = () => {
        this.reconnectAttempts = 0;
        this.handlers.onOpen();
        this.flushQueue();
    };

    private handleMessage = (event: MessageEvent) => {
        const message = event.data;
        if (message === "ready") {
            this.handlers.onReady();
        } else if (message === "moveGreenDown") {
            this.handlers.onMoveGreenDown();
        } else if (message === "pause") {
            this.handlers.onPause();
        }
    };

    private handleClose = () => {
        this.handlers.onClose();
        this.scheduleReconnect();
    };

    private handleError = (event: Event) => {
        this.handlers.onError(event);
    };

    private scheduleReconnect() {
        if (this.isClosedExplicitly || this.reconnectTimer) return;

        // Exponential backoff with jitter
        const delay = Math.min(
            this.minReconnectDelay * Math.pow(this.backoffFactor, this.reconnectAttempts),
            this.maxReconnectDelay
        );
        // Add random jitter between -20% and +20%
        const jitter = (Math.random() - 0.5) * 0.2 * delay;
        const finalDelay = Math.max(0, delay + jitter);

        this.reconnectAttempts++;
        console.log(`[GameSocket] Scheduling reconnect in ${Math.round(finalDelay)}ms (attempt ${this.reconnectAttempts})`);

        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect();
        }, finalDelay);
    }

    public sendMessage(payload: unknown) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const data = typeof payload === "string" ? payload : JSON.stringify(payload);
            this.socket.send(data);
        } else {
            // Buffer messages when socket is offline or connecting
            if (this.messageQueue.length >= this.maxQueueSize) {
                const discarded = this.messageQueue.shift();
                console.warn("[GameSocket] Queue size limit reached. Discarded oldest message:", discarded);
            }
            this.messageQueue.push(payload as string | object);
            console.log("[GameSocket] Message queued (socket not open):", payload);
        }
    }

    private flushQueue() {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
        const queue = [...this.messageQueue];
        this.messageQueue = [];
        for (const payload of queue) {
            this.sendMessage(payload);
        }
    }

    private cleanupSocket() {
        if (this.socket) {
            this.socket.removeEventListener("open", this.handleOpen);
            this.socket.removeEventListener("message", this.handleMessage);
            this.socket.removeEventListener("close", this.handleClose);
            this.socket.removeEventListener("error", this.handleError);
            try {
                this.socket.close();
            } catch (err) {
                console.error("[GameSocket] Error while closing socket during cleanup:", err);
            }
            this.socket = null;
        }
    }

    public close() {
        this.isClosedExplicitly = true;
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        this.cleanupSocket();
        console.log("[GameSocket] Connection closed explicitly.");
    }
}

export function createGameSocket(
    channelName: string,
    handlers: GameSocketHandlers,
) {
    const gameSocket = new GameSocket(channelName, handlers);
    return {
        sendMessage: (payload: unknown) => gameSocket.sendMessage(payload),
        cleanupReconnect: () => gameSocket.close()
    };
}
