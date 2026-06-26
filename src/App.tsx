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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
                <h2>Enter Room Name</h2>
                <input
                    type="text"
                    value={roomInput}
                    onChange={(e) => setRoomInput(e.target.value)}
                    style={{ padding: '10px', fontSize: '16px', marginBottom: '20px' }}
                />
                <button
                    onClick={() => {
                        if (roomInput) {
                            setRoomName(roomInput);
                        }
                    }}
                    style={{ padding: '10px 20px', fontSize: '16px' }}
                >
                    Connect
                </button>
                <button
                    onClick={() => setSinglePlayer(true)}
                    style={{ padding: '10px 20px', fontSize: '16px', marginTop: '12px' }}
                >
                    Single Player
                </button>
            </div>
        );
    } else if (!isReady) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
                <h2>Loading Game Assets...</h2>
                <p>{progress}%</p>
                <div style={{ width: '200px', height: '20px', background: '#ccc', borderRadius: '10px' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'green', borderRadius: '10px', transition: 'width 0.2s' }} />
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
            {canvasWrapper}
        </div>
    );
}

export default App;