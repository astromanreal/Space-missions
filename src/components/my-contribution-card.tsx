
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MissionUpdate } from "@/services/updates";
import { formatDistanceToNow } from 'date-fns';
import Link from "next/link";
import { Edit, Trash2, CheckCircle, Clock, XCircle, Link as LinkIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface MyContributionCardProps {
    update: MissionUpdate;
    onEdit: () => void;
    onDelete: () => void;
}

const getStatusInfo = (status: MissionUpdate['status']): { variant: "default" | "secondary" | "destructive" | "outline", icon: React.ReactNode, label: string } => {
    switch (status) {
        case 'approved':
            return { variant: 'default', icon: <CheckCircle className="h-4 w-4" />, label: 'Approved' };
        case 'pending':
            return { variant: 'outline', icon: <Clock className="h-4 w-4" />, label: 'Pending' };
        case 'rejected':
            return { variant: 'destructive', icon: <XCircle className="h-4 w-4" />, label: 'Rejected' };
        default:
            return { variant: 'secondary', icon: <Clock className="h-4 w-4" />, label: 'Unknown' };
    }
};

export function MyContributionCard({ update, onEdit, onDelete }: MyContributionCardProps) {
    const timeAgo = formatDistanceToNow(new Date(update.createdAt), { addSuffix: true });
    const { variant, icon, label } = getStatusInfo(update.status);
    const canEdit = update.status !== 'approved';

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 transition-all hover:shadow-md hover:border-primary/50">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg mb-1">{update.title}</CardTitle>
                        <CardDescription className="text-xs">
                            For mission <Link href={`/missions/${update.mission.slug}`} className="font-medium text-primary hover:underline">{update.mission.slug}</Link> &bull; Submitted {timeAgo}
                        </CardDescription>
                    </div>
                    <Badge variant={variant} className="flex items-center gap-1.5">
                        {icon}
                        <span>{label}</span>
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-foreground/90 leading-relaxed line-clamp-2 text-sm">
                    {update.content}
                </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                 <Button variant="link" asChild className="p-0 text-accent h-auto text-sm">
                    <a href={update.referenceLink} target="_blank" rel="noopener noreferrer">
                         <LinkIcon className="mr-1.5 h-3 w-3" />
                         Reference Link
                    </a>
                 </Button>
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                {/* The div is necessary to allow the tooltip to show for a disabled button */}
                                <div className="inline-block">
                                    <Button variant="outline" size="sm" onClick={onEdit} disabled={!canEdit}>
                                        <Edit className="h-4 w-4 mr-2" /> Edit
                                    </Button>
                                </div>
                            </TooltipTrigger>
                            {!canEdit && (
                                <TooltipContent>
                                    <p>Approved submissions cannot be edited.</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>

                    <Button variant="destructive" size="sm" onClick={onDelete}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

    