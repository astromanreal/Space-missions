
'use client';

import React, { useState, useEffect } from 'react';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { Rocket, User, Settings, Compass, Menu, LogIn, X, LogOut, Github, Instagram, ShieldCheck, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SettingsProvider, useSettings } from '@/context/settings-context';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Separator } from '@/components/ui/separator';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <SettingsProvider>
            <AppBody>{children}</AppBody>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


function AppBody({ children }: { children: React.ReactNode }) {
  const { theme, colorScheme } = useSettings();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      document.documentElement.classList.toggle('dark', isDark);
      document.documentElement.className = `${isDark ? 'dark' : 'light'} theme-${colorScheme}`;
    }
  }, [theme, colorScheme, isMounted]);

  // This effect handles system theme changes
  useEffect(() => {
    if (theme !== 'system' || !isMounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
       const isDark = mediaQuery.matches;
       document.documentElement.classList.toggle('dark', isDark);
       document.documentElement.className = `${isDark ? 'dark' : 'light'} theme-${colorScheme}`;
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, colorScheme, isMounted]);


  return (
    <div
      className={cn(
        `${GeistSans.variable} antialiased font-sans`,
        'min-h-screen bg-background text-foreground flex flex-col'
      )}
    >
        <div className="flex flex-col flex-1">
          {isMounted ? (
            <>
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
              <Footer />
            </>
          ) : (
             <div className="flex-grow" /> // Render empty space to avoid layout shift while mounting
          )}
        </div>
        <Toaster position="bottom-right" />
    </div>
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
          </nav>

          <div className="flex items-center gap-2 ml-auto">
              <div className="hidden md:flex items-center gap-2">
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
                         {user.role === 'admin' && (
                          <DropdownMenuItem asChild>
                            <Link href="/admin/dashboard">
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              <span>Admin Dashboard</span>
                            </Link>
                          </DropdownMenuItem>
                         )}
                         <DropdownMenuItem asChild>
                            <Link href="/profile">
                               <User className="mr-2 h-4 w-4" />
                               <span>Profile</span>
                            </Link>
                         </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                            <Link href="/my-contributions">
                               <FileText className="mr-2 h-4 w-4" />
                               <span>My Contributions</span>
                            </Link>
                         </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                            <Link href="/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </Link>
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
                 {user.role === 'admin' && (
                    <Link href="/admin/dashboard" className="text-xl p-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-4" onClick={() => setIsMobileMenuOpen(false)}>
                      <ShieldCheck className="h-5 w-5 text-accent" /> Admin Dashboard
                    </Link>
                 )}
                 <Link href="/my-contributions" className="text-xl p-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-4" onClick={() => setIsMobileMenuOpen(false)}>
                    <FileText className="h-5 w-5 text-accent" /> My Contributions
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
            {user && (
              <Button variant="destructive" className="mt-8" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                 <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            )}
         </nav>
      </div>
    </>
  );
}


function Footer() {
  const contactLinks = [
    { name: 'X (Twitter)', href: 'https://x.com/Sathyamsarthak', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
    { name: 'Instagram', href: 'https://www.instagram.com/srishikharji/', icon: <Instagram className="w-5 h-5" /> },
    { name: 'GitHub', href: 'https://github.com/astromanreal', icon: <Github className="w-5 h-5" /> },
  ];

  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col sm:flex-row items-center justify-between h-auto sm:h-20 max-w-screen-2xl mx-auto px-4 py-4 sm:py-0 text-sm text-muted-foreground gap-4">
        <p>&copy; {new Date().getFullYear()} Cosmic Explorer. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
           <Separator orientation="vertical" className="h-4" />
           <div className="flex items-center gap-3">
             {contactLinks.map(link => (
                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  {link.icon}
                  <span className="sr-only">{link.name}</span>
                </a>
             ))}
           </div>
        </div>
      </div>
    </footer>
  );
}

    