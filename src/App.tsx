import { useMemo, useState } from "react";
import CanvasWrapper from "./CanvasWrapper";
import { useImagePreloader } from "./useImagePreloader";

function App() {

    const assetsToLoad = useMemo(() => new Map<string, string>([
        ["green", "https://upload.wikimedia.org/wikipedia/commons/d/d2/Svg_example_square.svg"],
        ["tiger", "https://upload.wikimedia.org/wikipedia/commons/f/fd/Ghostscript_Tiger.svg"],
        ["react", "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"]
    ]), []);

    const { isReady, images, progress } = useImagePreloader(assetsToLoad);
    const [roomInput, setRoomInput] = useState<string>("");
    const [roomName, setRoomName] = useState<string>("");


    function goBack() {
        setRoomName("");
    }

    const canvasWrapper = useMemo(() => <CanvasWrapper images={images} roomName={roomName} goBack={goBack} />, [images, roomName]);

    if (!roomName) {
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