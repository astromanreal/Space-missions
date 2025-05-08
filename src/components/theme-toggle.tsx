'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define the possible theme values
type Theme = 'light' | 'dark';

export default function ThemeToggle() {
  // State to hold the current theme ('light' or 'dark')
  // Default to 'light' initially, will be corrected by useEffect
  const [theme, setTheme] = React.useState<Theme>('light');
  const [mounted, setMounted] = React.useState(false);

  // Effect to set the initial theme based on localStorage or system preference
  React.useEffect(() => {
    setMounted(true); // Indicate component has mounted

    let initialTheme: Theme = 'light'; // Default guess

    try {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (storedTheme) {
          initialTheme = storedTheme;
        } else {
          // If no theme is stored, use system preference
          initialTheme = prefersDark ? 'dark' : 'light';
        }
    } catch (e) {
        // Handle cases where localStorage or matchMedia might not be available (e.g., SSR, specific browser settings)
        console.warn("Could not determine initial theme preference.", e);
    }


    setTheme(initialTheme);
    // Apply the initial theme class immediately after determining it
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');

  }, []); // Run only once on mount

  // Effect to apply theme changes to the document and localStorage
  React.useEffect(() => {
    // Only run this effect if the component is mounted
    // The initial theme is applied in the first useEffect
    if (mounted) {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
             console.warn("Could not save theme preference to localStorage.", e);
        }
    }
  }, [theme, mounted]);


  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Render a placeholder button until mounted to avoid hydration mismatch
  // The placeholder size should match the final button size
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled aria-label="Toggle theme" className="h-10 w-10 text-foreground/60">
        {/* Placeholder can be either icon, Sun is common. Match final size */}
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  // Render the actual button once mounted
  return (
    <Button
      variant="ghost"
      size="icon" // This defaults to h-10 w-10
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="transition-colors hover:text-primary text-foreground/60"
    >
      {/* Show the icon for the theme you will switch TO */}
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" /> // In dark mode, show Sun to switch to light
      ) : (
        <Moon className="h-5 w-5" /> // In light mode, show Moon to switch to dark
      )}
    </Button>
  );
}
