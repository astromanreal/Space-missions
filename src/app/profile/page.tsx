'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cog, Loader2, Edit } from "lucide-react"; // Import Edit icon
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '@/context/auth-context';

export default function ProfilePage() {
    const router = useRouter();
    const { user, isLoading } = useAuth(); // Use the auth context

    useEffect(() => {
        // If not loading and no user is found, redirect to login
        if (!isLoading && !user) {
            router.replace('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-15rem)]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    // Mock data for display purposes, as these are not in the 'me' endpoint response
    const displayUser = {
        ...user,
        bio: user.bio || 'Space enthusiast and explorer. Following the stars, one mission at a time.',
        bannerUrl: 'https://i.pinimg.com/736x/b8/45/ad/b845ada17bf21c3f8d38c587d09c4ddf.jpg',
        avatarUrl: `https://api.dicebear.com/8.x/lorelei/svg?seed=${user.username}`,
        followersCount: 0,
        followingCount: 0,
    };


    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Card className="w-full">
                 <div className="relative h-48 w-full">
                    <Image
                        src={displayUser.bannerUrl}
                        alt={`${displayUser.username}'s banner`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-t-lg"
                        data-ai-hint="galaxy stars nebula"
                    />
                    <div className="absolute bottom-0 left-6 transform translate-y-1/2">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                            <AvatarImage src={displayUser.avatarUrl} alt={displayUser.username} />
                            <AvatarFallback className="text-4xl">{displayUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <CardHeader className="pt-20">
                    <div className="flex justify-end gap-2">
                         <Button variant="outline" asChild>
                            <Link href="/settings"><Edit className="mr-2 h-4 w-4" />Edit Profile</Link>
                         </Button>
                         <Button variant="outline" asChild>
                            <Link href="/settings"><Cog className="mr-2 h-4 w-4" />Settings</Link>
                         </Button>
                    </div>
                    <CardTitle className="text-3xl font-bold">{displayUser.username}</CardTitle>
                    <CardDescription className="text-muted-foreground">{displayUser.email}</CardDescription>
                    <p className="pt-2 text-muted-foreground">{displayUser.bio}</p>
                    <div className="flex gap-6 pt-4 text-sm">
                         <div>
                            <span className="font-bold">{displayUser.followingCount}</span>
                            <span className="text-muted-foreground ml-1">Following</span>
                        </div>
                        <div>
                            <span className="font-bold">{displayUser.followersCount}</span>
                            <span className="text-muted-foreground ml-1">Followers</span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <Tabs defaultValue="missions" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="missions">Favorite Missions</TabsTrigger>
                            <TabsTrigger value="followers">Followers</TabsTrigger>
                            <TabsTrigger value="following">Following</TabsTrigger>
                        </TabsList>
                        <TabsContent value="missions" className="py-4">
                            <div className="text-center text-muted-foreground p-8">
                                <h3 className="text-lg font-semibold">Favorite Missions</h3>
                                <p>This user has not favorited any missions yet.</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="followers" id="followers" className="py-4 space-y-4">
                             <p className="text-center text-muted-foreground">Followers feature coming soon!</p>
                        </TabsContent>
                        <TabsContent value="following" id="following" className="py-4 space-y-4">
                            <p className="text-center text-muted-foreground">Following feature coming soon!</p>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
