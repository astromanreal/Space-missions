'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the shape of the settings
interface SettingsState {
  fontSizeScale: number;
  showCardImages: boolean;
  cardSize: 'small' | 'large';
}

// Define the shape of the context value
interface SettingsContextProps extends SettingsState {
  setFontSizeScale: Dispatch<SetStateAction<number>>;
  setShowCardImages: Dispatch<SetStateAction<boolean>>;
  setCardSize: Dispatch<SetStateAction<'small' | 'large'>>;
}

// Local storage keys
const FONT_SIZE_LS_KEY = 'fontSizeScale';
const CARD_IMAGES_LS_KEY = 'showCardImages';
const CARD_SIZE_LS_KEY = 'cardSize';

// Default values
const DEFAULT_FONT_SIZE_SCALE = 1;
const DEFAULT_SHOW_CARD_IMAGES = true; // Set default to true
const DEFAULT_CARD_SIZE = 'small'; // Set default to small

// Create the context
const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

// Create the provider component
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [fontSizeScale, setFontSizeScale] = useState<number>(DEFAULT_FONT_SIZE_SCALE);
  const [showCardImages, setShowCardImages] = useState<boolean>(DEFAULT_SHOW_CARD_IMAGES);
  const [cardSize, setCardSize] = useState<'small' | 'large'>(DEFAULT_CARD_SIZE);
  const [isMounted, setIsMounted] = useState(false); // Prevent hydration mismatch

  // Load settings from local storage on mount
  useEffect(() => {
    setIsMounted(true);
    let storedScale: number | null = null;
    let storedShowImages: boolean | null = null;
    let storedCardSize: 'small' | 'large' | null = null;

    try {
      // Font Size
      const scaleValue = localStorage.getItem(FONT_SIZE_LS_KEY);
      if (scaleValue) {
        const parsedScale = parseFloat(scaleValue);
        if (!isNaN(parsedScale)) {
          storedScale = Math.max(0.8, Math.min(1.3, parsedScale)); // Clamp value
        }
      }

      // Card Images
      const imagesValue = localStorage.getItem(CARD_IMAGES_LS_KEY);
      if (imagesValue !== null) {
        storedShowImages = imagesValue === 'true';
      }

      // Card Size
      const sizeValue = localStorage.getItem(CARD_SIZE_LS_KEY);
      if (sizeValue === 'small' || sizeValue === 'large') {
        storedCardSize = sizeValue;
      }

    } catch (e) {
      console.warn("Could not access localStorage for settings.", e);
    }

    // Use defaults if nothing is stored
    setFontSizeScale(storedScale ?? DEFAULT_FONT_SIZE_SCALE);
    setShowCardImages(storedShowImages ?? DEFAULT_SHOW_CARD_IMAGES);
    setCardSize(storedCardSize ?? DEFAULT_CARD_SIZE);

     // Apply initial font size immediately after loading
     const finalScale = storedScale ?? DEFAULT_FONT_SIZE_SCALE;
     document.documentElement.style.fontSize = `${finalScale * 16}px`;

  }, []);

  // Save font size changes to local storage and apply style
  useEffect(() => {
    if (isMounted) {
      document.documentElement.style.fontSize = `${fontSizeScale * 16}px`; // Base 16px
      try {
        localStorage.setItem(FONT_SIZE_LS_KEY, fontSizeScale.toString());
      } catch (e) {
        console.warn("Could not save font size to localStorage.", e);
      }
    }
  }, [fontSizeScale, isMounted]);

  // Save card image visibility to local storage
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(CARD_IMAGES_LS_KEY, showCardImages.toString());
      } catch (e) {
        console.warn("Could not save card image visibility to localStorage.", e);
      }
    }
  }, [showCardImages, isMounted]);

  // Save card size to local storage
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(CARD_SIZE_LS_KEY, cardSize);
      } catch (e) {
        console.warn("Could not save card size to localStorage.", e);
      }
    }
  }, [cardSize, isMounted]);


  const value = {
    fontSizeScale,
    setFontSizeScale,
    showCardImages,
    setShowCardImages,
    cardSize,
    setCardSize,
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
