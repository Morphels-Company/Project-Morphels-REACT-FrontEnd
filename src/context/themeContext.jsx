import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme-preference') || '');

    useEffect(() => {
        const rootHtml = document.documentElement;

        if (theme) {
            rootHtml.style.colorScheme = theme;
            localStorage.setItem('theme-preference', theme);
        } else {
            rootHtml.style.removeProperty('color-scheme');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => {
            if (!prev) {
                const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                return isSystemDark ? 'light' : 'dark';
            }
            return prev === 'light' ? 'dark' : 'light';
        });
    };

    // tema realmente em uso (inclui o caso em que ainda segue o sistema)
    const isDark =
        theme === 'dark' ||
        (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}