
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/services/social";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";

interface UserListDialogProps {
  title: string;
  users: Partial<User>[];
  trigger: React.ReactNode;
}

export function UserListDialog({ title, users, trigger }: UserListDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 pr-6">
            {users.length > 0 ? (
              users.map(user => (
                <div key={user._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                       <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${user.username}`} alt={user.name || user.username} />
                       <AvatarFallback>{user.name?.charAt(0) || user.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{user.name || user.username}</p>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                     <Link href={`/profile/${user.username}`}>View</Link>
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No users to display.</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

    
