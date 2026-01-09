

'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cog, Loader2, Satellite, Edit, UserX, UserPlus, UserCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '@/context/auth-context';
import TrackedMissionCard from '@/components/tracked-mission-card'; // Import the new component
import { User } from '@/services/social';
import toast from 'react-hot-toast';
import { UserListDialog } from '@/components/user-list-dialog';

interface PublicProfileUser extends User {
    followers: Partial<User>[];
    following: Partial<User>[];
}

export default function PublicProfilePage() {
    const params = useParams();
    const username = params.id as string; // The param is now the username
    const { user: currentUser, token, updateUser } = useAuth();
    
    const [profile, setProfile] = useState<PublicProfileUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFollowLoading, setIsFollowLoading] = useState(false);

    const isCurrentUserProfile = currentUser?.username === username;

    const isFollowing = useMemo(() => {
        if (!currentUser || !currentUser.following || !profile) return false;
        return currentUser.following.some(followedUser => followedUser._id === profile._id);
    }, [currentUser, profile]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!username) return;
            
            setIsLoading(true);
            setError(null);

            try {
                // Use the new endpoint with the username
                const response = await fetch(`/api/auth/user/${username}`);
                if (!response.ok) {
                    if (response.status === 404) throw new Error("User not found.");
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch user profile.");
                }
                const data: PublicProfileUser = await response.json();
                setProfile(data);
            } catch (err: any) {
                setError(err.message);
                console.error("Failed to fetch user data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUserData();
    }, [username]);

    const handleFollowToggle = async () => {
        if (!token || !profile || !currentUser) {
            toast.error("You must be logged in to follow users.");
            return;
        }

        setIsFollowLoading(true);

        const originalFollowState = isFollowing;
        const originalProfileFollowers = profile.followers;
        const originalCurrentUserFollowing = currentUser.following;

        // Optimistic UI updates
        updateUser(prevUser => {
            if (!prevUser) return null;
            const newFollowing = originalFollowState
                ? prevUser.following?.filter(followed => followed._id !== profile._id)
                : [...(prevUser.following || []), profile];
            return { ...prevUser, following: newFollowing };
        });

        setProfile(prevProfile => {
            if (!prevProfile) return null;
            const newFollowers = originalFollowState
                ? prevProfile.followers.filter(follower => follower._id !== currentUser._id)
                : [...prevProfile.followers, { _id: currentUser._id, username: currentUser.username, name: currentUser.name }];
            return { ...prevProfile, followers: newFollowers };
        });


        try {
            // CRITICAL: The follow action still uses the user's _id
            const response = await fetch(`/api/auth/user/${profile._id}/follow`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            toast.success(data.msg);

        } catch (err: any) {
            toast.error(err.message);
            // Revert optimistic updates on failure
            updateUser(prevUser => prevUser ? { ...prevUser, following: originalCurrentUserFollowing } : null);
            setProfile(prevProfile => prevProfile ? { ...prevProfile, followers: originalProfileFollowers } : null);
        } finally {
            setIsFollowLoading(false);
        }
    };


    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-15rem)]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
             <div className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] text-center">
                <UserX className="h-16 w-16 text-destructive mb-4" />
                <h2 className="text-2xl font-bold">Profile Not Found</h2>
                <p className="text-muted-foreground">{error}</p>
                <Button asChild variant="outline" className="mt-6">
                    <Link href="/explore">Explore Missions</Link>
                </Button>
            </div>
        );
    }

    if (!profile) {
       return (
             <div className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] text-center">
                <UserX className="h-16 w-16 text-destructive mb-4" />
                <h2 className="text-2xl font-bold">Profile Not Found</h2>
                <p className="text-muted-foreground">The requested user could not be found.</p>
                <Button asChild variant="outline" className="mt-6">
                    <Link href="/explore">Explore Missions</Link>
                </Button>
            </div>
       );
    }
    
    const finalDisplayUser = {
        ...profile,
        name: profile.name || profile.username,
        bio: profile.bio || 'This user has not set a bio yet.',
        avatarUrl: `https://api.dicebear.com/8.x/lorelei/svg?seed=${profile.username}`,
    };


    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 pt-8">
            
            {/* Redesigned Profile Header */}
            <div className="space-y-6">
                 {/* Top section: Avatar, Name/Username, and Action Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                     <div className="flex items-center gap-4">
                         <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-primary/50 shadow-md">
                            <AvatarImage src={finalDisplayUser.avatarUrl} alt={finalDisplayUser.name} />
                            <AvatarFallback className="text-3xl">{finalDisplayUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold">{finalDisplayUser.name}</h1>
                            <p className="text-md text-muted-foreground">@{finalDisplayUser.username}</p>
                        </div>
                     </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                         {isCurrentUserProfile ? (
                            <Button asChild variant="outline" className="w-full sm:w-auto">
                                <Link href="/settings"><Edit className="mr-2 h-4 w-4" />Edit Profile</Link>
                            </Button>
                         ) : (
                            <Button onClick={handleFollowToggle} disabled={isFollowLoading || !currentUser} className="w-full sm:w-auto">
                                {isFollowLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : isFollowing ? (
                                    <UserCheck className="mr-2 h-4 w-4" />
                                ) : (
                                    <UserPlus className="mr-2 h-4 w-4" />
                                )}
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </Button>
                         )}
                    </div>
                </div>

                {/* Middle section: Bio */}
                <p className="text-foreground/90 max-w-xl text-center sm:text-left">{finalDisplayUser.bio}</p>

                {/* Bottom section: Stats */}
                <div className="flex items-center gap-6">
                    <UserListDialog
                        title="Followers"
                        users={finalDisplayUser.followers || []}
                        trigger={
                        <div className="text-left group cursor-pointer">
                            <span className="font-bold text-lg">{finalDisplayUser.followers?.length || 0}</span>
                            <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Followers</p>
                        </div>
                        }
                    />
                    <UserListDialog
                        title="Following"
                        users={finalDisplayUser.following || []}
                        trigger={
                        <div className="text-left group cursor-pointer">
                            <span className="font-bold text-lg">{finalDisplayUser.following?.length || 0}</span>
                            <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Following</p>
                        </div>
                        }
                    />
                </div>
            </div>


            {/* Tracked Missions Section */}
            <div className="px-4 sm:px-0 pt-4">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Satellite className="text-primary"/>
                    Tracked Missions
                </h2>
                {finalDisplayUser.trackedMissions && finalDisplayUser.trackedMissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {finalDisplayUser.trackedMissions.map(mission => (
                            <TrackedMissionCard key={mission._id} mission={mission} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg bg-card/50">
                        <Satellite className="mx-auto h-12 w-12 mb-4" />
                        <h3 className="text-lg font-semibold">No Tracked Missions</h3>
                        <p>This user hasn't tracked any missions yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
