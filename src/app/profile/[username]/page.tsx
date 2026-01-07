'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMockUserByUsername, getMockUsers, type UserProfile } from "@/services/social";
import { Cog, UserPlus, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function UserCard({ user }: { user: UserProfile }) {
    return (
        <Card className="flex items-center p-3 gap-4">
            <Avatar>
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
                <Link href={`/profile/${user.username}`} className="font-semibold hover:underline">{user.name}</Link>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
            <Button variant="outline" size="sm">
                <UserPlus className="mr-2 h-4 w-4" /> Follow
            </Button>
        </Card>
    )
}


export default function PublicProfilePage({ params }: { params: { username: string } }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [followers, setFollowers] = useState<UserProfile[]>([]);
    const [following, setFollowing] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            const userProfile = await getMockUserByUsername(params.username);

            if (!userProfile) {
                notFound();
                return;
            }

            setUser(userProfile);

            // Fetch mock followers/following for now
            const mockFollowers = await getMockUsers(userProfile.followersCount);
            const mockFollowing = await getMockUsers(userProfile.followingCount);
            setFollowers(mockFollowers);
            setFollowing(mockFollowing);

            setIsLoading(false);
        };

        fetchUserData();
    }, [params.username]);

    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-15rem)]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card className="w-full">
                <div className="relative h-48 w-full">
                    <Image
                        src={user.bannerUrl}
                        alt={`${user.name}'s banner`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                        data-ai-hint="galaxy stars nebula"
                    />
                    <div className="absolute bottom-0 left-6 transform translate-y-1/2">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback className="text-4xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <CardHeader className="pt-20">
                    <div className="flex justify-end">
                        {/* This would be conditionally rendered based on if it's the current user's profile */}
                        <Button variant="outline">
                            <UserPlus className="mr-2 h-4 w-4" /> Follow
                        </Button>
                    </div>
                    <CardTitle className="text-3xl font-bold">{user.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">@{user.username}</CardDescription>
                    <p className="pt-2 text-muted-foreground">{user.bio}</p>
                    <div className="flex gap-6 pt-4 text-sm">
                        <Link href="#following" className="hover:underline">
                            <span className="font-bold">{following.length}</span>
                            <span className="text-muted-foreground ml-1">Following</span>
                        </Link>
                        <Link href="#followers" className="hover:underline">
                            <span className="font-bold">{followers.length}</span>
                            <span className="text-muted-foreground ml-1">Followers</span>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="missions" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="missions">Missions</TabsTrigger>
                            <TabsTrigger value="followers">Followers</TabsTrigger>
                            <TabsTrigger value="following">Following</TabsTrigger>
                        </TabsList>
                        <TabsContent value="missions" className="py-4">
                            <div className="text-center text-muted-foreground p-8">
                                <h3 className="text-lg font-semibold">Favorite Missions</h3>
                                <p>This user hasn't favorited any missions yet.</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="followers" id="followers" className="py-4 space-y-4">
                             {followers.map(follower => (
                                <UserCard key={follower.username} user={follower} />
                            ))}
                        </TabsContent>
                        <TabsContent value="following" id="following" className="py-4 space-y-4">
                            {following.map(followedUser => (
                                <UserCard key={followedUser.username} user={followedUser} />
                            ))}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
