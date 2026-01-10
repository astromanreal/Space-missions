
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MissionUpdate } from "@/services/updates";
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { User } from "lucide-react";

interface MissionUpdateCardProps {
    update: MissionUpdate;
}

export default function MissionUpdateCard({ update }: MissionUpdateCardProps) {
    const timeAgo = formatDistanceToNow(new Date(update.createdAt), { addSuffix: true });

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
                <CardTitle className="text-xl">{update.title}</CardTitle>
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
                <p className="text-foreground/90 leading-relaxed">
                    {update.content}
                </p>
            </CardContent>
        </Card>
    );
}
