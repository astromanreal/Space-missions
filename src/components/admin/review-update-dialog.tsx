
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MissionUpdate } from "@/services/updates";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { User, Calendar, Check, X } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "../ui/badge";

interface ReviewUpdateDialogProps {
  update: MissionUpdate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (updateId: string, status: 'approved' | 'rejected') => void;
}

export function ReviewUpdateDialog({ update, open, onOpenChange, onUpdateStatus }: ReviewUpdateDialogProps) {
    if (!update) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{update.title}</DialogTitle>
                    <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 pt-2">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${update.author.username}`} alt={update.author.username} />
                                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <Link href={`/profile/${update.author.username}`} className="hover:underline font-medium text-foreground">
                                @{update.author.username}
                            </Link>
                        </div>
                        <span className="hidden sm:inline">&bull;</span>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Submitted on {format(new Date(update.createdAt), 'MMM d, yyyy')}</span>
                        </div>
                    </div>
                </DialogHeader>
                <div className="py-4 space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">For Mission</h3>
                        <Link href={`/missions/${update.mission.slug}`}>
                            <Badge variant="outline">{update.mission.missionName}</Badge>
                        </Link>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Content</h3>
                        <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md bg-muted/50 h-48 overflow-y-auto">
                            <p>{update.content}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Official Source</h3>
                        <a
                            href={update.referenceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline break-all text-sm"
                        >
                            {update.referenceLink}
                        </a>
                    </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="button" variant="destructive" onClick={() => onUpdateStatus(update._id, 'rejected')}>
                        <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                    <Button type="button" variant="default" onClick={() => onUpdateStatus(update._id, 'approved')}>

                        <Check className="mr-2 h-4 w-4" /> Approve
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
