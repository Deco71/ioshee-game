import { useMemo, useState, useCallback } from "react";
import CanvasWrapper from "./CanvasWrapper";
import { useImagePreloader } from "./useImagePreloader";
import { Images } from "./types/Images";

function App() {

    const assetsToLoad = useMemo(() => new Map<Images, string>(Object.entries(Images) as [Images, string][]), []);

    const { isReady, images, progress } = useImagePreloader(assetsToLoad);
    const [roomInput, setRoomInput] = useState<string>("");
    const [roomName, setRoomName] = useState<string>("");
    const [singlePlayer, setSinglePlayer] = useState<boolean>(false);


    const goBack = useCallback(() => {
        setRoomName("");
        setSinglePlayer(false);
    }, []);

    const canvasWrapper = useMemo(() => (
        <CanvasWrapper key={`${singlePlayer ? "single" : "multi"}-${roomName}`} images={images} roomName={roomName} goBack={goBack} singlePlayer={singlePlayer} />
    ), [images, roomName, goBack, singlePlayer]);

    if (!roomName && !singlePlayer) {
        return (
            <div className="room-selection">
                <h2>Enter Room Name</h2>
                <input
                    className="input-field"
                    type="text"
                    value={roomInput}
                    onChange={(e) => setRoomInput(e.target.value)}
                />
                <button
                    className="button-primary"
                    onClick={() => {
                        if (roomInput) {
                            setRoomName(roomInput);
                        }
                    }}
                >
                    Connect
                </button>
                <button
                    className="button-primary"
                    onClick={() => setSinglePlayer(true)}
                >
                    Single Player
                </button>
            </div>
        );
    } else if (!isReady) {
        return (
            <div className="loading-screen">
                <h2>Loading Game Assets...</h2>
                <p>{progress}%</p>
                <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
            </div>
        );
    }

    return (
        <div className="screen-container">
            {canvasWrapper}
        </div>
    );
}

export default App;