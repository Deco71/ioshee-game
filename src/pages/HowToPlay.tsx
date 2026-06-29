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
                    ioshee is a puzzle game about building the perfect burger!
                    Ingredients fall from above — stack them between the <strong>top and bottom bun</strong> to
                    assemble a complete, delicious hamburger and score big points.
                </p>

                <div className="htp-goal-banner">
                    <span className="htp-goal-icon">🍔</span>
                    <div>
                        <strong>Final Goal</strong>
                        <p>
                            Seal ingredients between a <strong>bottom bun</strong> and a <strong>top bun</strong>
                            to complete a burger. The more ingredients inside — and the rarer they are —
                            the higher your score!
                        </p>
                    </div>
                </div>

                <div className="htp-steps">
                    <div className="htp-step">
                        <div className="htp-step-number">1</div>
                        <div className="htp-step-content">
                            <h3>Ingredients Fall from Above</h3>
                            <p>
                                Bun halves and burger ingredients drop into the columns of the board one at a time.
                                You cannot control <em>what</em> falls, only <em>where</em> it lands.
                            </p>
                        </div>
                    </div>

                    <div className="htp-step">
                        <div className="htp-step-number">2</div>
                        <div className="htp-step-content">
                            <h3>Move to Choose a Column</h3>
                            <p>
                                Move your character left or right using the
                                <strong> ← → arrow keys</strong> (or <strong>A / D</strong>).
                                The falling ingredient will drop into the column you're standing under.
                            </p>
                        </div>
                    </div>

                    <div className="htp-step">
                        <div className="htp-step-number">3</div>
                        <div className="htp-step-content">
                            <h3>Build Your Burger</h3>
                            <p>
                                Stack ingredients between a <strong>bottom bun</strong> and a <strong>top bun</strong>
                                in the same column. When the top bun lands on the bottom bun,
                                the burger is complete and gets served!
                            </p>
                        </div>
                    </div>

                    <div className="htp-step">
                        <div className="htp-step-number">4</div>
                        <div className="htp-step-content">
                            <h3>Fuller Burgers = More Points</h3>
                            <p>
                                Every ingredient inside the bun adds to your score. A burger with
                                <strong> patty + lettuce + tomato + cheese</strong> scores far more than a plain bun sandwich.
                                But watch out — a burger <em>missing the patty</em> loses a score bonus!
                            </p>
                        </div>
                    </div>

                    <div className="htp-step">
                        <div className="htp-step-number">5</div>
                        <div className="htp-step-content">
                            <h3>Don't Let the Board Fill Up</h3>
                            <p>
                                If any column fills to the top with no room left, it's game over.
                                Keep completing burgers to clear space and keep the kitchen running!
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
                            <p>The base of your burger. Catches all the ingredients above it.</p>
                        </div>
                        <div className="htp-piece-card">
                            <div className="htp-piece-icon">🔝</div>
                            <strong>Top Bun</strong>
                            <p>Seals the burger. Drop it to complete and score!</p>
                        </div>
                        <div className="htp-piece-card">
                            <div className="htp-piece-icon">🥩</div>
                            <strong>Patty</strong>
                            <p>The star ingredient. A burger without it scores fewer points!</p>
                        </div>
                        <div className="htp-piece-card">
                            <div className="htp-piece-icon">🥬</div>
                            <strong>Lettuce</strong>
                            <p>Fresh and crunchy. Adds a nice score bonus.</p>
                        </div>
                        <div className="htp-piece-card">
                            <div className="htp-piece-icon">🍅</div>
                            <strong>Tomato</strong>
                            <p>Juicy and ripe. Stack it for extra points.</p>
                        </div>
                        <div className="htp-piece-card">
                            <div className="htp-piece-icon">🧀</div>
                            <strong>Cheese</strong>
                            <p>Melty goodness. The finishing touch for a perfect score.</p>
                        </div>
                    </div>
                </div>

                <div className="htp-scoring-note">
                    <span className="htp-scoring-icon">⭐</span>
                    <div>
                        <strong>Scoring Tip</strong>
                        <p>
                            The perfect burger — <strong>bottom bun → patty → lettuce → tomato → cheese → top bun</strong> —
                            earns the maximum score. Missing or duplicating ingredients reduces your reward.
                            Plan your stacks wisely!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HowToPlay;
