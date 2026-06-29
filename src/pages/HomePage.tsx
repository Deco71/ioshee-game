import { useMemo, useState, useCallback } from "react";
import CanvasWrapper from "../gameEngine/CanvasWrapper";
import HowToPlay from "./HowToPlay";
import { useImagePreloader } from "../hooks/useImagePreloader";
import { Images } from "../types/Images";
import { useTheme } from "../context/ThemeContext";
import Button, { ButtonVariant } from "../components/Button";

type Screen = "home" | "how-to-play";

function HomePage() {

    const assetsToLoad = useMemo(() => new Map<Images, string>(Object.entries(Images) as [Images, string][]), []);

    const { isReady, images, progress } = useImagePreloader(assetsToLoad);
    const [roomName, setRoomName] = useState<string>("");
    const [singlePlayer, setSinglePlayer] = useState<boolean>(false);
    const [screen, setScreen] = useState<Screen>("home");
    const { theme, toggleTheme } = useTheme();

    const goBack = useCallback(() => {
        setRoomName("");
        setSinglePlayer(false);
    }, []);

    const canvasWrapper = useMemo(() => (
        <CanvasWrapper key={`${singlePlayer ? "single" : "multi"}-${roomName}`} images={images} roomName={roomName} goBack={goBack} singlePlayer={singlePlayer} />
    ), [images, roomName, goBack, singlePlayer]);

    if (!roomName && !singlePlayer) {

        if (screen === "how-to-play") {
            return <HowToPlay onBack={() => setScreen("home")} />;
        }

        // Home screen
        return (
            <div className="homepage">
                <header className="homepage-header">
                    <button
                        id="btn-theme-toggle"
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {theme === "dark" ? "☀️" : "🌙"}
                    </button>
                    <div className="logo-mark">🍔</div>
                    <h1 className="game-title">ioshee</h1>
                    <p className="game-subtitle">I need to change this name or someone could sue me 😬</p>
                </header>

                <main className="homepage-main">
                    <div className="menu-card">
                        <Button
                            id="btn-single-player"
                            variant={ButtonVariant.MENU_PRIMARY}
                            icon="🎮"
                            label="Single Player"
                            description="Play solo at your own pace"
                            onClick={() => setSinglePlayer(true)}
                        />
                        <Button
                            id="btn-multiplayer"
                            variant={ButtonVariant.MENU_PRIMARY}
                            icon="👥"
                            label="Multiplayer"
                            description="COMING SOON..."
                            disabled
                        />
                        <Button
                            id="btn-how-to-play"
                            variant={ButtonVariant.MENU_SECONDARY}
                            icon="📖"
                            label="How to Play"
                            description="Learn the rules and mechanics"
                            onClick={() => setScreen("how-to-play")}
                        />
                    </div>
                </main>

                <footer className="homepage-footer">
                    <p>WIP game, made with ❤️ by <strong>Deco</strong> - 100% fueled by burgers 🍔</p>
                </footer>
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

export default HomePage;