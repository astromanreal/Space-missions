
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ColorScheme = 'galaxy' | 'nebula' | 'solar-flare' | 'supernova';

// Define the shape of the settings
interface SettingsState {
  fontSizeScale: number;
  theme: Theme;
  colorScheme: ColorScheme;
}

// Define the shape of the context value
interface SettingsContextProps extends SettingsState {
  setFontSizeScale: Dispatch<SetStateAction<number>>;
  setTheme: Dispatch<SetStateAction<Theme>>;
  setColorScheme: Dispatch<SetStateAction<ColorScheme>>;
}

// Local storage keys
const FONT_SIZE_LS_KEY = 'fontSizeScale';
const THEME_LS_KEY = 'theme';
const COLOR_SCHEME_LS_KEY = 'colorScheme';


// Default values
const DEFAULT_FONT_SIZE_SCALE = 1;
const DEFAULT_THEME: Theme = 'dark';
const DEFAULT_COLOR_SCHEME: ColorScheme = 'galaxy';


// Create the context
const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

// Create the provider component
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [fontSizeScale, setFontSizeScale] = useState<number>(DEFAULT_FONT_SIZE_SCALE);
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(DEFAULT_COLOR_SCHEME);
  const [isMounted, setIsMounted] = useState(false);

  // Load settings from local storage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const storedScale = localStorage.getItem(FONT_SIZE_LS_KEY);
      if (storedScale) {
        const parsedScale = parseFloat(storedScale);
        if (!isNaN(parsedScale)) setFontSizeScale(Math.max(0.8, Math.min(1.3, parsedScale)));
      }
      
      const storedTheme = localStorage.getItem(THEME_LS_KEY) as Theme | null;
      if (storedTheme) setTheme(storedTheme);

      const storedColorScheme = localStorage.getItem(COLOR_SCHEME_LS_KEY) as ColorScheme | null;
      if (storedColorScheme) setColorScheme(storedColorScheme);

    } catch (e) {
      console.warn("Could not access localStorage for settings.", e);
    }
  }, []);

  // Effect for font size
  useEffect(() => {
    if (isMounted) {
      document.documentElement.style.fontSize = `${fontSizeScale * 16}px`;
      localStorage.setItem(FONT_SIZE_LS_KEY, fontSizeScale.toString());
    }
  }, [fontSizeScale, isMounted]);

  // Effect for theme (light/dark/system)
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(THEME_LS_KEY, theme);
    }
  }, [theme, isMounted]);

  // Effect for color scheme
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(COLOR_SCHEME_LS_KEY, colorScheme);
    }
  }, [colorScheme, isMounted]);


  const value = {
    fontSizeScale,
    setFontSizeScale,
    theme,
    setTheme,
    colorScheme,
    setColorScheme,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// Create a custom hook to use the settings context
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
