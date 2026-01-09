
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User, LogOut, ShieldAlert, Loader2, Save, Palette, Monitor, Sun, Moon, Edit, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { useSettings } from '@/context/settings-context';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'system';
type ColorScheme = 'galaxy' | 'nebula' | 'solar-flare' | 'supernova';

export default function SettingsPage() {
  const { user, token, logout, updateUser } = useAuth();
  const { theme, setTheme, colorScheme, setColorScheme } = useSettings();
  
  const [formData, setFormData] = useState({ username: '', bio: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
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
  
  const cancelEdit = () => {
      if (user) {
          setFormData({
            username: user.username,
            bio: user.bio || '',
          });
      }
      setIsEditingProfile(false);
  }

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
        updateUser(result); 
        setIsEditingProfile(false);
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

  const themes: { name: Theme; icon: React.ReactNode }[] = [
    { name: 'light', icon: <Sun /> },
    { name: 'dark', icon: <Moon /> },
    { name: 'system', icon: <Monitor /> },
  ];

  const colorSchemes: { name: ColorScheme; label: string; colors: string[] }[] = [
    { name: 'galaxy', label: 'Galaxy', colors: ['bg-sky-500', 'bg-cyan-400'] },
    { name: 'nebula', label: 'Nebula', colors: ['bg-purple-500', 'bg-pink-500'] },
    { name: 'solar-flare', label: 'Solar Flare', colors: ['bg-amber-500', 'bg-orange-500'] },
    { name: 'supernova', label: 'Supernova', colors: ['bg-red-500', 'bg-orange-400'] },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-7 w-7 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your application and account preferences.
        </p>
      </header>
      
      <div className="space-y-8">

        {/* User Profile Section */}
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-xl"><User /> User Profile</CardTitle>
              <CardDescription>Update your public profile information.</CardDescription>
            </div>
            {!isEditingProfile ? (
                 <Button variant="ghost" size="icon" onClick={() => setIsEditingProfile(true)}>
                    <Edit className="h-5 w-5" />
                 </Button>
            ) : (
                <Button variant="ghost" size="icon" onClick={cancelEdit}>
                    <X className="h-5 w-5" />
                </Button>
            )}
          </CardHeader>
          <CardContent>
            {isEditingProfile ? (
                 <form onSubmit={handleFormSubmit} className="space-y-4">
                     <div className="space-y-2">
                         <Label htmlFor="username">Username</Label>
                         <Input
                           id="username"
                           name="username"
                           value={formData.username}
                           onChange={handleInputChange}
                           disabled={isSubmitting}
                         />
                     </div>
                      <div className="space-y-2">
                         <Label htmlFor="bio">Bio</Label>
                         <Textarea
                           id="bio"
                           name="bio"
                           placeholder="Tell us about your interest in space!"
                           value={formData.bio}
                           onChange={handleInputChange}
                           maxLength={250}
                           disabled={isSubmitting}
                         />
                     </div>
                     <div className="flex justify-end gap-2 pt-2">
                         <Button type="button" variant="ghost" onClick={cancelEdit} disabled={isSubmitting}>Cancel</Button>
                         <Button type="submit" disabled={isSubmitting}>
                           {isSubmitting ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />}
                           Save Changes
                         </Button>
                     </div>
                 </form>
            ) : (
              <div className="space-y-4">
                <div>
                   <Label>Username</Label>
                   <p className="text-muted-foreground">{user?.username}</p>
                 </div>
                 <div>
                   <Label>Bio</Label>
                   <p className="text-muted-foreground italic max-w-md">{user?.bio || 'No bio set.'}</p>
                 </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl"><Palette/> Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-2 block">Theme</Label>
              <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted p-1">
                {themes.map((t) => (
                  <Button
                    key={t.name}
                    variant={theme === t.name ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setTheme(t.name)}
                    className="justify-start gap-2 capitalize"
                  >
                    {t.icon} {t.name}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Color Scheme</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {colorSchemes.map((cs) => (
                   <div key={cs.name} className="space-y-1.5 cursor-pointer" onClick={() => setColorScheme(cs.name)}>
                      <div className={cn(
                          "flex items-center space-x-1 rounded-md border-2 p-1.5 transition-colors",
                          colorScheme === cs.name ? 'border-primary' : 'border-transparent'
                      )}>
                         <div className="flex-1 space-y-1">
                            <div className={cn("h-4 w-full rounded-sm", cs.colors[0])} />
                            <div className={cn("h-4 w-full rounded-sm", cs.colors[1])} />
                         </div>
                      </div>
                      <span className="block w-full text-center text-xs text-muted-foreground capitalize">{cs.label}</span>
                   </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Section */}
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl"><ShieldAlert className="text-destructive"/> Account Actions</CardTitle>
            <CardDescription>Manage your session and account data.</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border">
             <div className="py-4 flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <Label>Log Out</Label>
                <span className="font-normal leading-snug text-muted-foreground">
                  End your current session on this device.
                </span>
              </div>
              <Button variant="outline" onClick={handleLogout} disabled={!user}>
                  <LogOut className="mr-2" />
                  Log Out
              </Button>
            </div>
             <div className="py-4 flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <Label className="text-destructive">Delete Account</Label>
                <span className="font-normal leading-snug text-muted-foreground">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </span>
              </div>
              <Button variant="destructive" disabled>
                  <ShieldAlert className="mr-2" />
                  Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
