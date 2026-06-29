import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";

export type Theme = "dark" | "light";

interface ThemeState {
    theme: Theme;
}

type ThemeAction = { type: "TOGGLE_THEME" };

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
}


function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
    switch (action.type) {
        case "TOGGLE_THEME":
            return { theme: state.theme === "dark" ? "light" : "dark" };
        default:
            return state;
    }
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "ioshee-theme";

function getInitialTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    // Fall back to OS preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(themeReducer, undefined, () => ({
        theme: getInitialTheme(),
    }));

    // Sync DOM attribute & localStorage whenever theme changes
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", state.theme);
        localStorage.setItem(STORAGE_KEY, state.theme);
    }, [state.theme]);

    const toggleTheme = () => dispatch({ type: "TOGGLE_THEME" });

    return (
        <ThemeContext.Provider value={{ theme: state.theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
    return ctx;
}
