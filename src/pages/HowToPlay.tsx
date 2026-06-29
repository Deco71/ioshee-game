import { useTheme } from "../context/ThemeContext";
import Button, { ButtonVariant } from "../components/Button";

interface HowToPlayProps {
    onBack: () => void;
}

function HowToPlay({ onBack }: HowToPlayProps) {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className="homepage">
            <header className="homepage-header">
                <button
                    id="btn-theme-toggle-htp"
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {theme === "dark" ? "☀️" : "🌙"}
                </button>
                <div className="logo-mark">🍔</div>
                <h1 className="game-title">ioshee</h1>
                <p className="game-subtitle">Stack it. Build it. Eat it.</p>
            </header>

            <div className="how-to-play-page">
                <Button variant={ButtonVariant.BACK} onClick={onBack}>
                    ← Back
                </Button>

                <h2 className="section-title">How to Play</h2>
                <p className="htp-intro">
                    <strong>ioshee</strong> is a fast-paced burger-building puzzle game! Stack falling ingredients between bun halves to build complete hamburgers.
                    But be fast! The <strong>game speeds up</strong> as time passes, making it harder to build the perfect burger!
                </p>

                <div className="htp-modes-section">
                    <h3 className="htp-modes-title">Game Modes</h3>
                    <div className="htp-modes-grid">
                        <div className="htp-mode-card htp-mode-card--single">
                            <h4>🎮 Single Player</h4>
                            <p>
                                Build burgers to score as many points as possible before reaching a <strong>game over</strong> (when the board fills up completely).
                            </p>
                        </div>
                        <div className="htp-mode-card htp-mode-card--multi">
                            <h4>👥 Multiplayer</h4>
                            <p>
                                Build burgers to <strong>"send" ingredients</strong> to the other player's board to disrupt their work. Win by clearing all ingredients on your board first, or making the opponent <strong>K.O.</strong>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="htp-steps">
                    <div className="htp-step">
                        <div className="htp-step-number">1</div>
                        <div className="htp-step-content">
                            <h3>Ingredients Fall</h3>
                            <p>
                                Bun halves and ingredients drop into the columns one at a time. You control where they land.
                            </p>
                        </div>
                    </div>

                    <div className="htp-step">
                        <div className="htp-step-number">2</div>
                        <div className="htp-step-content">
                            <h3>Swap Columns</h3>
                            <p>
                                Move left/right with the <strong>arrow keys</strong>, and press <strong>Up arrow</strong> to swap the columns above you.
                            </p>
                        </div>
                    </div>

                    <div className="htp-step">
                        <div className="htp-step-number">3</div>
                        <div className="htp-step-content">
                            <h3>Build Burgers</h3>
                            <p>
                                Stack ingredients between a <strong>bottom bun</strong> and a <strong>top bun</strong> in the same column to complete and serve it.
                            </p>
                        </div>
                    </div>

                    <div className="htp-step">
                        <div className="htp-step-number">4</div>
                        <div className="htp-step-content">
                            <h3>Clear Space</h3>
                            <p>
                                Stack two of the same ingredient consecutively to clear them, making room and gaining minor points.
                            </p>
                        </div>
                    </div>

                    <div className="htp-step">
                        <div className="htp-step-number">5</div>
                        <div className="htp-step-content">
                            <h3>Fuller Burgers = More Points</h3>
                            <p>
                                Stacking more ingredients inside a burger increases your score. A burger with all toppings (<strong>patty, lettuce, tomato, cheese</strong>) gets a bonus, while missing ingredients reduce the reward.
                            </p>
                        </div>
                    </div>

                    <div className="htp-step">
                        <div className="htp-step-number">6</div>
                        <div className="htp-step-content">
                            <h3>Don't Overflow</h3>
                            <p>
                                Keep completing burgers or matching ingredients to clear space. If any column fills to the top, it's game over!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="htp-pieces-section">
                    <h3 className="htp-pieces-title">Ingredients</h3>
                    <div className="htp-pieces-grid htp-pieces-grid--5">
                        <div className="htp-piece-card">
                            <div className="htp-piece-icon">🍞</div>
                            <strong>Bottom Bun</strong>
                            <p>The base. Catches ingredients above it.</p>
                        </div>
                        <div className="htp-piece-card">
                            <div className="htp-piece-icon">🔝</div>
                            <strong>Top Bun</strong>
                            <p>Seals the burger to complete it.</p>
                        </div>
                        <div className="htp-piece-card">
                            <div className="htp-piece-icon">🥩</div>
                            <strong>Patty</strong>
                            <p>Essential star ingredient for high scores.</p>
                        </div>
                        <div className="htp-piece-card">
                            <div className="htp-piece-icon">🥬</div>
                            <strong>Lettuce</strong>
                            <p>Fresh and crunchy green bonus.</p>
                        </div>
                        <div className="htp-piece-card">
                            <div className="htp-piece-icon">🍅</div>
                            <strong>Tomato</strong>
                            <p>Juicy slice for extra score.</p>
                        </div>
                        <div className="htp-piece-card">
                            <div className="htp-piece-icon">🧀</div>
                            <strong>Cheese</strong>
                            <p>Melty topping for a perfect score.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HowToPlay;
