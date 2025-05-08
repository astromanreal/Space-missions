// Add 'use client' for Header component as it now uses state
'use client';

import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// No longer need GeistMono here if not used directly in layout
// import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Link from 'next/link';
import { Rocket, User, Settings, Search, Telescope, Bot, Activity, Hourglass, Menu } from 'lucide-react'; // Added Menu icon
import { cn } from '@/lib/utils';
import AIChatbot from '@/components/ai-chatbot';
import ThemeToggle from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react'; // Import useEffect
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet'; // Import Sheet components & SheetTitle
import { SettingsProvider } from '@/context/settings-context'; // Import SettingsProvider

// Metadata can still be exported from server components or here if needed globally
// export const metadata: Metadata = {
//   title: 'Cosmic Explorer',
//   description:
//     'All You Need to Know About the Technology Behind Space Exploration',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isChatOpen, setIsChatOpen] = useState(false); // Manage chatbot state here

   // Apply initial font size scale on mount (moved from settings page)
   useEffect(() => {
    let initialScale = 1; // Default
    try {
      const storedValue = localStorage.getItem('fontSizeScale');
      if (storedValue) {
        const parsedValue = parseFloat(storedValue);
        if (!isNaN(parsedValue)) {
          // Ensure scale is within reasonable bounds if needed
          initialScale = Math.max(0.8, Math.min(1.3, parsedValue));
        }
      }
    } catch (e) {
      console.warn("Could not access localStorage for initial font size.", e);
    }
     // Apply the font size immediately. SettingsProvider will refine this.
    document.documentElement.style.fontSize = `${initialScale * 16}px`;
  }, []);


  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `${GeistSans.variable} antialiased font-sans`, // Removed GeistMono variable
          'min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300' // Added transition
        )}
      >
       {/* Wrap content with SettingsProvider */}
        <SettingsProvider>
           {/* Pass chat state setters/getters to Header */}
          <Header isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
          <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
          <Toaster />
          {/* Pass chat state to AIChatbot */}
          <AIChatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        </SettingsProvider>
      </body>
    </html>
  );
}

// Header component now needs props for chat state
function Header({ isChatOpen, setIsChatOpen }: { isChatOpen: boolean; setIsChatOpen: (open: boolean) => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-lg">
            Cosmic Explorer
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 text-sm flex-grow">
          <Link
            href="/explore"
            className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1"
          >
            <Search className="h-4 w-4" /> Explore Missions
          </Link>
          <Link
            href="/explore-by-type"
            className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1"
          >
            <Telescope className="h-4 w-4" /> Explore by Type
          </Link>
          <Link
            href="/explore?filter=active"
            className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1"
          >
            <Activity className="h-4 w-4" /> Active Missions
          </Link>
          <Link
            href="/explore?filter=future"
            className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1"
          >
            <Hourglass className="h-4 w-4" /> Future Missions
          </Link>
        </nav>

        {/* Right-aligned icons (Desktop) */}
        <div className="hidden md:flex items-center space-x-1 ml-auto">
          <Button variant="ghost" size="icon" asChild className="text-foreground/60 hover:text-primary">
            <Link href="/contact" aria-label="Contact">
              <User className="h-5 w-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(!isChatOpen)} className="text-foreground/60 hover:text-primary" aria-label="Toggle AI Chatbot">
            <Bot className="h-5 w-5" />
          </Button>

          <ThemeToggle />

          <Button variant="ghost" size="icon" asChild className="text-foreground/60 hover:text-primary">
            <Link href="/settings" aria-label="Settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="ml-auto md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground/60 hover:text-primary">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-background/95 backdrop-blur pt-10">
              {/* Add visually hidden title for accessibility */}
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col gap-4 text-lg">
                <SheetClose asChild>
                  <Link
                    href="/explore"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Search className="h-5 w-5" /> Explore Missions
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/explore-by-type"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Telescope className="h-5 w-5" /> Explore by Type
                  </Link>
                </SheetClose>
                 <SheetClose asChild>
                   <Link
                    href="/explore?filter=active"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Activity className="h-5 w-5" /> Active Missions
                  </Link>
                 </SheetClose>
                 <SheetClose asChild>
                   <Link
                    href="/explore?filter=future"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Hourglass className="h-5 w-5" /> Future Missions
                  </Link>
                 </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" /> Contact
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                   <Button variant="ghost" onClick={() => { setIsChatOpen(!isChatOpen); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 p-2 justify-start text-lg font-normal hover:bg-accent hover:text-accent-foreground" aria-label="Toggle AI Chatbot">
                     <Bot className="h-5 w-5" /> AI Assistant
                   </Button>
                 </SheetClose>
                 <SheetClose asChild>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5" /> Settings
                  </Link>
                 </SheetClose>
                 <div className="mt-4 flex items-center justify-center">
                    <ThemeToggle />
                 </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
