
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User, LogOut, ShieldAlert, Loader2, Save, Edit, Palette, TextQuote, Image as ImageIcon } from "lucide-react";
import ThemeToggle from '@/components/theme-toggle';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSettings } from '@/context/settings-context';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"


const FONT_SIZE_STEP = 0.05;
const MIN_FONT_SIZE_SCALE = 0.8;
const MAX_FONT_SIZE_SCALE = 1.3;
const DEFAULT_FONT_SIZE_SCALE = 1;

export default function SettingsPage() {
  const router = useRouter();
  const { user, token, logout, updateUser } = useAuth();
  const {
    fontSizeScale,
    setFontSizeScale,
    showCardImages,
    setShowCardImages,
    cardSize,
    setCardSize,
  } = useSettings();

  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({ username: '', bio: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (user) {
      setFormData({
        username: user.username,
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const adjustFontSize = (adjustment: number) => {
    setFontSizeScale(prev => {
      const newScale = prev + adjustment;
      return Math.max(MIN_FONT_SIZE_SCALE, Math.min(MAX_FONT_SIZE_SCALE, newScale));
    });
  };

  const resetFontSize = () => setFontSizeScale(DEFAULT_FONT_SIZE_SCALE);
  const handleImageVisibilityChange = (checked: boolean) => setShowCardImages(checked);
  const handleCardSizeChange = (value: 'small' | 'large') => setCardSize(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading('Saving changes...');

    try {
      if (!token) {
        throw new Error("Authentication token not found.");
      }
      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();

      if (response.ok) {
        toast.success('Profile updated successfully!', { id: loadingToast });
        updateUser(result); // Update global user state
        setIsDialogOpen(false); // Close the dialog on success
      } else {
        toast.error(result.error || 'Failed to update profile.', { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred. Please try again.', { id: loadingToast });
      console.error("Failed to update profile:", error);
    } finally {
      setIsSubmitting(false);
    }
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

          {/* User Profile Section */}
          <div className="space-y-4">
             <h3 className="text-lg font-medium">User Profile</h3>
             <Separator />
             <div className="rounded-lg border p-4 space-y-4">
               <div className="flex items-start justify-between">
                 <div className="space-y-1">
                   <Label>Username</Label>
                   <p className="text-muted-foreground">{user?.username}</p>
                 </div>
               </div>
               <Separator />
               <div className="flex items-start justify-between">
                 <div className="space-y-1">
                   <Label>Bio</Label>
                   <p className="text-muted-foreground italic max-w-md">{user?.bio || 'No bio set.'}</p>
                 </div>
               </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleFormSubmit}>
                      <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                          Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">
                            Username
                          </Label>
                          <Input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="col-span-3"
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label htmlFor="bio" className="text-right pt-2">
                            Bio
                          </Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            placeholder="Tell us about your interest in space!"
                            value={formData.bio}
                            onChange={handleInputChange}
                            maxLength={250}
                            className="col-span-3"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                           <Button type="button" variant="secondary" disabled={isSubmitting}>
                              Cancel
                           </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
             </div>
          </div>


          {/* Appearance Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2"><Palette/> Appearance</h3>
            <Separator />
            <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center justify-between">
                <Label htmlFor="theme-toggle" className="flex flex-col space-y-1">
                    <span>Theme</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                    Select the application theme.
                    </span>
                </Label>
                {isMounted ? <ThemeToggle /> : <Skeleton className="h-10 w-10" />}
                </div>

                <div className="flex items-center justify-between">
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
                
                <div className="flex items-center justify-between">
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
                <Button variant="outline" onClick={handleLogout} disabled={!user}>
                    <LogOut className="mr-2" />
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
                    <ShieldAlert className="mr-2" />
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

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

    