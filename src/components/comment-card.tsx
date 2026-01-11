
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Comment } from '@/services/comments';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import Link from 'next/link';
import { User, CornerDownRight, Trash2, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CommentCardProps {
    updateId: string;
    comment: Comment;
    onCommentDeleted: () => void;
    onReplyAdded: () => void;
    onReplyDeleted: () => void;
    isReply?: boolean;
}

export function CommentCard({ updateId, comment, onCommentDeleted, onReplyAdded, onReplyDeleted, isReply = false }: CommentCardProps) {
    const { user, token } = useAuth();
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isPostingReply, setIsPostingReply] = useState(false);

    const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
    const canDelete = user?._id === comment.author._id;

    const handleDelete = async () => {
        if (!token) return;
        const toastId = toast.loading('Deleting...');
        try {
            const response = await fetch(`/api/v1/comments/${comment._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                throw new Error("Failed to delete comment.");
            }
            toast.success("Deleted", { id: toastId });
            onCommentDeleted();
        } catch (error: any) {
            toast.error(error.message, { id: toastId });
        }
    };
    
    const handlePostReply = async () => {
        if (!token || !replyContent.trim()) return;
        setIsPostingReply(true);
        const toastId = toast.loading('Posting reply...');
        try {
            const response = await fetch(`/api/v1/updates/${updateId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                body: JSON.stringify({ content: replyContent, parentComment: comment._id })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Failed to post reply.");

            toast.success("Reply posted", { id: toastId });
            onReplyAdded();
            setReplyContent('');
            setIsReplying(false);
        } catch (error: any) {
             toast.error(error.message, { id: toastId });
        } finally {
            setIsPostingReply(false);
        }
    };

    return (
        <div className="flex gap-4">
            <Avatar className="h-9 w-9">
                <AvatarImage src={`https://api.dicebear.com/8.x/lorelei/svg?seed=${comment.author.username}`} />
                <AvatarFallback>{comment.author.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
                <div className="flex items-baseline gap-2">
                    <Link href={`/profile/${comment.author.username}`} className="font-bold text-sm hover:underline">{comment.author.username}</Link>
                    <span className="text-xs text-muted-foreground">{timeAgo}</span>
                </div>
                <p className="text-foreground/90 text-base">{comment.content}</p>
                <div className="flex items-center gap-2">
                    {user && !isReply && (
                         <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setIsReplying(!isReplying)}>
                            <CornerDownRight className="mr-1 h-3 w-3"/> Reply
                         </Button>
                    )}
                   {canDelete && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                    <Trash2 className="mr-1 h-3 w-3"/> Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your comment.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                   )}
                </div>

                {isReplying && (
                    <div className="pt-2 space-y-2">
                        <Textarea 
                            placeholder={`Replying to @${comment.author.username}...`}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={2}
                            disabled={isPostingReply}
                        />
                        <div className="flex justify-end gap-2">
                             <Button variant="ghost" size="sm" onClick={() => setIsReplying(false)} disabled={isPostingReply}>
                                Cancel
                             </Button>
                             <Button size="sm" onClick={handlePostReply} disabled={isPostingReply || !replyContent.trim()}>
                                {isPostingReply && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                Post Reply
                             </Button>
                        </div>
                    </div>
                )}
                
                {comment.replies && comment.replies.length > 0 && (
                    <div className="pt-4 space-y-4 border-l border-border/50 pl-4">
                        {comment.replies.map(reply => (
                             <CommentCard 
                                key={reply._id} 
                                updateId={updateId}
                                comment={reply}
                                onCommentDeleted={onReplyDeleted}
                                onReplyAdded={onReplyAdded}
                                onReplyDeleted={onReplyDeleted}
                                isReply
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
