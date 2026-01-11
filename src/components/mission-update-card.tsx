
'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MissionUpdate } from "@/services/updates";
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { User, MessageSquare } from "lucide-react";
import LikeButton from "./like-button";
import { CommentSection } from "./comment-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from '@/context/auth-context';

interface MissionUpdateCardProps {
    update: MissionUpdate;
    missionSlug: string;
}

export default function MissionUpdateCard({ update: initialUpdate, missionSlug }: MissionUpdateCardProps) {
    const { user } = useAuth();
    const [update, setUpdate] = useState(initialUpdate);
    const [commentCount, setCommentCount] = useState(0);
    const [hasLoadedComments, setHasLoadedComments] = useState(false);
    const timeAgo = formatDistanceToNow(new Date(update.createdAt), { addSuffix: true });

    const handleLikeUpdate = (newLikes: string[]) => {
        setUpdate({ ...update, likes: newLikes });
    };

    const handleCommentCountChange = useCallback((count: number) => {
        setCommentCount(count);
        setHasLoadedComments(true);
    }, []);

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 transition-all hover:shadow-md">
            <CardHeader>
                <CardTitle className="text-xl">
                    <Link href={`/updates/${update._id}`} className="hover:underline">
                        {update.title}
                    </Link>
                </CardTitle>
                <CardDescription className="flex items-center gap-4 text-xs pt-1">
                     <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${update.author.username}`} alt={update.author.username}/>
                            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                        <Link href={`/profile/${update.author.username}`} className="hover:underline font-medium">
                            @{update.author.username}
                        </Link>
                     </div>
                     <span>&bull;</span>
                     <span>{timeAgo}</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-foreground/90 leading-relaxed line-clamp-2">
                    {update.content}
                </p>
            </CardContent>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b-0">
                    <CardFooter className="flex-col items-start gap-4">
                        <div className="flex items-center gap-4">
                            <LikeButton
                                updateId={update._id}
                                initialLikes={update.likes}
                                onLikeUpdate={handleLikeUpdate}
                            />
                            <AccordionTrigger className="p-0 h-auto hover:no-underline">
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <MessageSquare className="h-4 w-4" />
                                     <span>
                                        {hasLoadedComments ? `${commentCount} Comment${commentCount !== 1 ? 's' : ''}` : 'Comments'}
                                    </span>
                                </div>
                            </AccordionTrigger>
                        </div>
                    </CardFooter>
                    <AccordionContent>
                        <div className="p-4 pt-0">
                            <CommentSection 
                                updateId={update._id}
                                onCommentCountChange={handleCommentCountChange}
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>
    );
}
