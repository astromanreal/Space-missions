
'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cog, Loader2, Satellite, Edit, UserX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '@/context/auth-context';
import MissionCard from '@/components/mission-card';
import { UserWithTracking } from '@/context/auth-context';
import toast from 'react-hot-toast';

export default function PublicProfilePage() {
    const params = useParams();
    const id = params.id as string;
    const { user: currentUser } = useAuth();
    
    const [profile, setProfile] = useState<UserWithTracking | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const isCurrentUserProfile = currentUser?._id === id;

    useEffect(() => {
        const fetchUserData = async () => {
            if (!id) {
                // Wait for the id from params to be available
                return;
            }
            
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/auth/user/${id}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("User not found.");
                    }
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch user profile.");
                }

                const data: UserWithTracking = await response.json();
                setProfile(data);

            } catch (err: any) {
                setError(err.message);
                console.error("Failed to fetch user data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUserData();

    }, [id]);

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
       // This state can happen if the fetch resulted in no profile, show error.
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
        <div className="w-full max-w-5xl mx-auto space-y-8">
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pt-8">
                <Avatar className="h-28 w-28 sm:h-36 sm:w-36 border-4 border-background shadow-lg flex-shrink-0">
                    <AvatarImage src={finalDisplayUser.avatarUrl} alt={finalDisplayUser.name} />
                    <AvatarFallback className="text-4xl">{finalDisplayUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center md:items-start w-full text-center md:text-left pt-4">
                    <h1 className="text-3xl sm:text-4xl font-bold">{finalDisplayUser.name}</h1>
                    <p className="text-lg text-muted-foreground">@{finalDisplayUser.username}</p>
                    <p className="mt-3 text-foreground/90 max-w-xl">{finalDisplayUser.bio}</p>
                    
                    {/* Followers and Following Section */}
                    <div className="flex items-center gap-6 mt-4">
                        <Link href="#" className="text-center group">
                            <span className="font-bold text-lg">142</span>
                            <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Followers</p>
                        </Link>
                        <Link href="#" className="text-center group">
                            <span className="font-bold text-lg">89</span>
                            <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Following</p>
                        </Link>
                    </div>

                     <div className="mt-6 flex gap-2 w-full justify-center md:justify-start">
                         {isCurrentUserProfile ? (
                            <>
                                <Button asChild variant="outline">
                                    <Link href="/settings"><Edit className="mr-2 h-4 w-4" />Edit Profile</Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/settings"><Cog className="mr-2 h-4 w-4" />Settings</Link>
                                </Button>
                            </>
                         ) : (
                            <Button disabled>Follow</Button>
                         )}
                    </div>
                </div>
            </div>

            {/* Tracked Missions Section */}
            <div className="px-4 sm:px-0">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Satellite className="text-primary"/>
                    Tracked Missions
                </h2>
                {finalDisplayUser.trackedMissions && finalDisplayUser.trackedMissions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {finalDisplayUser.trackedMissions.map(mission => (
                            <MissionCard key={mission._id} mission={mission} cardSize="small" showImage={true} />
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
