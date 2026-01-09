
'use client';

import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { Rocket, User, Settings, Compass, Milestone, Activity, Hourglass, Menu, LogIn, X, ChevronDown, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { SettingsProvider } from '@/context/settings-context';
import { AuthProvider, useAuth } from '@/context/auth-context'; // Import AuthProvider and useAuth
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    let initialScale = 1;
    try {
      const storedValue = localStorage.getItem('fontSizeScale');
      if (storedValue) {
        const parsedValue = parseFloat(storedValue);
        if (!isNaN(parsedValue)) {
          initialScale = Math.max(0.8, Math.min(1.3, parsedValue));
        }
      }
    } catch (e) {
      console.warn("Could not access localStorage for initial font size.", e);
    }
    document.documentElement.style.fontSize = `${initialScale * 16}px`;
  }, []);


  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `${GeistSans.variable} antialiased font-sans`,
          'min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300'
        )}
      >
        <AuthProvider>
          <SettingsProvider>
              <div className="flex flex-col flex-1">
                {isMounted && <Header />}
                {isMounted && <main className="flex-grow container mx-auto px-4 py-8">{children}</main>}
                {isMounted && <Footer />}
              </div>
              <Toaster position="bottom-right" />
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // Use the auth context

  const handleLogout = () => {
    logout();
    // No need to push to router here, context can handle it or UI will just update
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center mx-auto px-4">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block text-lg">
              Cosmic Explorer
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm flex-grow">
            <Link href="/explore" className="transition-colors hover:text-primary text-foreground/80 flex items-center gap-1.5">
              <Compass className="h-4 w-4" /> Explore
            </Link>

             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="transition-colors hover:text-primary text-foreground/80 flex items-center gap-1.5 px-0 hover:bg-transparent">
                  Browse <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                   <Link href="/explore-by-type" className="flex items-center gap-1.5 w-full">
                     <Milestone className="h-4 w-4" /> Mission Types
                   </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                   <Link href="/explore?filter=active" className="flex items-center gap-1.5 w-full">
                     <Activity className="h-4 w-4" /> Active Missions
                   </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                   <Link href="/explore?filter=future" className="flex items-center gap-1.5 w-full">
                     <Hourglass className="h-4 w-4" /> Future Missions
                   </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="flex items-center gap-2 ml-auto">
              <div className="hidden md:flex items-center gap-2">
                <ThemeToggle />
                 {user ? (
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                           <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.username}`} alt={user.username} />
                              <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                           </Avatar>
                         </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                         <DropdownMenuLabel>My Account</DropdownMenuLabel>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem asChild>
                            <Link href="/profile">
                               <User className="mr-2 h-4 w-4" />
                               <span>Profile</span>
                            </Link>
                         </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                            <Link href="/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                         </DropdownMenuItem>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                         </DropdownMenuItem>
                      </DropdownMenuContent>
                   </DropdownMenu>
                 ) : (
                   <Button asChild>
                      <Link href="/login">Join</Link>
                   </Button>
                 )}
              </div>

            <Button variant="ghost" size="icon" className="md:hidden text-foreground/80 hover:text-primary" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Full-screen Mobile Menu */}
      <div className={cn(
        "fixed inset-0 z-[100] bg-background/95 backdrop-blur-lg p-6 transition-all duration-300 ease-in-out md:hidden",
        isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}>
         <div className="flex justify-between items-center mb-10">
            <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                <Rocket className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Cosmic Explorer</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
            </Button>
         </div>
         <nav className="flex flex-col gap-4">
            {user ? (
               <>
                 <Link href="/profile" className="text-2xl font-semibold p-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-4" onClick={() => setIsMobileMenuOpen(false)}>
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.username}`} alt={user.username} />
                       <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    My Profile
                 </Link>
                 <Link href="/settings" className="text-xl p-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-4" onClick={() => setIsMobileMenuOpen(false)}>
                    <Settings className="h-5 w-5 text-accent" /> Settings
                 </Link>
               </>
            ) : (
              <Link href="/login" className="text-2xl font-semibold p-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-4" onClick={() => setIsMobileMenuOpen(false)}>
                  <LogIn className="h-6 w-6 text-primary" /> Join The Exploration
              </Link>
            )}
            <Link href="/explore" className="text-xl p-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-4" onClick={() => setIsMobileMenuOpen(false)}>
                <Compass className="h-5 w-5 text-accent" /> Explore All
            </Link>
             <Link href="/explore-by-type" className="text-xl p-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-4" onClick={() => setIsMobileMenuOpen(false)}>
                <Milestone className="h-5 w-5 text-accent" /> Mission Types
            </Link>
             <Link href="/explore?filter=active" className="text-xl p-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-4" onClick={() => setIsMobileMenuOpen(false)}>
                <Activity className="h-5 w-5 text-accent" /> Active Missions
            </Link>
             <Link href="/explore?filter=future" className="text-xl p-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-4" onClick={() => setIsMobileMenuOpen(false)}>
                <Hourglass className="h-5 w-5 text-accent" /> Future Missions
            </Link>
            {user && (
              <Button variant="destructive" className="mt-8" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                 <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            )}
         </nav>
         <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
            <div /> 
            <ThemeToggle />
         </div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 max-w-screen-2xl mx-auto px-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Cosmic Explorer. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
