'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Text, Plus, Minus, RotateCcw, Image as ImageIcon, ImageOff, Square, User, LogOut, ShieldAlert } from "lucide-react";
import ThemeToggle from '@/components/theme-toggle'; // Reuse the existing toggle
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch"; // Import Switch
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Import RadioGroup
import { useSettings } from '@/context/settings-context'; // Import useSettings hook
import { useAuth } from '@/context/auth-context'; // Import useAuth hook
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const FONT_SIZE_STEP = 0.05;
const MIN_FONT_SIZE_SCALE = 0.8; // 80%
const MAX_FONT_SIZE_SCALE = 1.3; // 130%
const DEFAULT_FONT_SIZE_SCALE = 1;

export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();
  // Use settings from context
  const {
    fontSizeScale,
    setFontSizeScale,
    showCardImages,
    setShowCardImages,
    cardSize,
    setCardSize,
  } = useSettings();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    // The logout function in the context will handle redirecting
  };

  const adjustFontSize = (adjustment: number) => {
    setFontSizeScale(prev => {
      const newScale = prev + adjustment;
      return Math.max(MIN_FONT_SIZE_SCALE, Math.min(MAX_FONT_SIZE_SCALE, newScale));
    });
  };

  const resetFontSize = () => {
    setFontSizeScale(DEFAULT_FONT_SIZE_SCALE);
  };

  const handleImageVisibilityChange = (checked: boolean) => {
    setShowCardImages(checked);
  };

  const handleCardSizeChange = (value: 'small' | 'large') => {
    setCardSize(value);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Settings className="h-6 w-6 text-primary" />
            Settings
          </CardTitle>
          <CardDescription>
            Manage your application and account preferences here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">

          {/* Appearance Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Appearance</h3>
            <Separator />
            <div className="flex items-center justify-between rounded-lg border p-4">
              <Label htmlFor="theme-toggle" className="flex flex-col space-y-1">
                <span>Theme</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Select the application theme.
                </span>
              </Label>
              {isMounted ? <ThemeToggle /> : <Skeleton className="h-10 w-10" />}
            </div>

             {/* Card Image Visibility Setting */}
             <div className="flex items-center justify-between rounded-lg border p-4">
               <Label htmlFor="card-images" className="flex flex-col space-y-1">
                 <span>Show Card Images</span>
                 <span className="font-normal leading-snug text-muted-foreground">
                   Display images on mission cards.
                 </span>
               </Label>
               {isMounted ? (
                 <Switch
                   id="card-images"
                   checked={showCardImages}
                   onCheckedChange={handleImageVisibilityChange}
                   aria-label="Toggle card image visibility"
                 />
               ) : <Skeleton className="h-6 w-11" />}
             </div>

              {/* Card Size Setting */}
              <div className="flex items-center justify-between rounded-lg border p-4">
               <Label htmlFor="card-size" className="flex flex-col space-y-1">
                 <span>Card Size</span>
                 <span className="font-normal leading-snug text-muted-foreground">
                   Choose the display size for mission cards.
                 </span>
               </Label>
               {isMounted ? (
                 <RadioGroup
                   id="card-size"
                   value={cardSize}
                   onValueChange={handleCardSizeChange}
                   className="flex items-center gap-4"
                   aria-label="Select card size"
                 >
                   <div className="flex items-center space-x-2">
                     <RadioGroupItem value="small" id="size-small" />
                     <Label htmlFor="size-small" className="font-normal">Small</Label>
                   </div>
                   <div className="flex items-center space-x-2">
                     <RadioGroupItem value="large" id="size-large" />
                     <Label htmlFor="size-large" className="font-normal">Large</Label>
                   </div>
                 </RadioGroup>
               ) : <Skeleton className="h-6 w-24" />}
              </div>

          </div>

          {/* Accessibility Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Accessibility</h3>
            <Separator />
            <div className="flex items-center justify-between rounded-lg border p-4">
              <Label htmlFor="font-size-controls" className="flex flex-col space-y-1">
                <span>Font Size</span>
                 <span className="font-normal leading-snug text-muted-foreground">
                  Adjust the base font size. (Current: {isMounted ? Math.round(fontSizeScale * 100) : 100}%)
                </span>
              </Label>
              <div id="font-size-controls" className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => adjustFontSize(-FONT_SIZE_STEP)}
                  disabled={!isMounted || fontSizeScale <= MIN_FONT_SIZE_SCALE}
                  aria-label="Decrease font size"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                 <Button
                   variant="ghost"
                   size="icon"
                   onClick={resetFontSize}
                   disabled={!isMounted || fontSizeScale === DEFAULT_FONT_SIZE_SCALE}
                   aria-label="Reset font size"
                 >
                   <RotateCcw className="h-4 w-4" />
                 </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => adjustFontSize(FONT_SIZE_STEP)}
                  disabled={!isMounted || fontSizeScale >= MAX_FONT_SIZE_SCALE}
                  aria-label="Increase font size"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Account</h3>
            <Separator />
             <div className="rounded-lg border p-4 space-y-4">
               <div className="flex items-center justify-between">
                <Label className="flex flex-col space-y-1">
                  <span>Log Out</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    End your current session.
                  </span>
                </Label>
                <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                </Button>
              </div>
              <Separator />
               <div className="flex items-center justify-between">
                <Label className="flex flex-col space-y-1">
                  <span className="text-destructive">Delete Account</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Permanently delete your account and all associated data.
                  </span>
                </Label>
                <Button variant="destructive" disabled>
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    Delete Account
                </Button>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for Skeleton needed for placeholders
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}
