
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import { Comment } from '@/services/comments';
import { Loader2, MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { CommentCard } from './comment-card';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

interface CommentSectionProps {
  updateId: string;
  onCommentCountChange: (count: number) => void;
}

export function CommentSection({ updateId, onCommentCountChange }: CommentSectionProps) {
  const { user, token } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/updates/${updateId}/comments`);
      if (!response.ok) throw new Error("Failed to load comments.");
      const result = await response.json();
      if (result.success) {
        const fetchedComments = result.data || [];
        setComments(fetchedComments);
        // Call the callback with the count of all comments (top-level + replies)
        const totalComments = fetchedComments.reduce((acc: number, comment: Comment) => acc + 1 + (comment.replies?.length || 0), 0);
        onCommentCountChange(totalComments);
      } else {
        onCommentCountChange(0);
      }
    } catch (error: any) {
      toast.error(error.message || "Could not fetch comments.");
      onCommentCountChange(0);
    } finally {
      setIsLoading(false);
    }
  }, [updateId, onCommentCountChange]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handlePostComment = async () => {
    if (!user || !token) {
        toast.error("You must be logged in to comment.");
        return;
    }
    if (!newComment.trim()) return;

    setIsPosting(true);
    try {
        const response = await fetch(`/api/v1/updates/${updateId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content: newComment })
        });
        
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Failed to post comment.");
        }
        
        // Refetch to get the latest state including the new comment
        fetchComments();
        setNewComment('');
        toast.success("Comment posted!");

    } catch (error: any) {
        toast.error(error.message);
    } finally {
        setIsPosting(false);
    }
  };
  
  const onCommentDeleted = () => {
    // Refetch to ensure count and structure is correct
    fetchComments();
  };
  
  const onReplyAdded = () => {
    // Refetch to ensure count and structure is correct
    fetchComments();
  }

  const onReplyDeleted = () => {
     // Refetch to ensure count and structure is correct
     fetchComments();
  }


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-3"><MessageSquare /> Comments</h2>
      
      {user && (
        <div className="space-y-2">
           <Textarea 
             placeholder="Join the discussion..."
             value={newComment}
             onChange={(e) => setNewComment(e.target.value)}
             rows={3}
             disabled={isPosting}
           />
           <div className="flex justify-end">
                <Button onClick={handlePostComment} disabled={isPosting || !newComment.trim()}>
                    {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Post Comment
                </Button>
           </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
            {comments.map(comment => (
                <CommentCard 
                    key={comment._id} 
                    updateId={updateId}
                    comment={comment}
                    onCommentDeleted={onCommentDeleted}
                    onReplyAdded={onReplyAdded}
                    onReplyDeleted={onReplyDeleted}
                />
            ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-card/50">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No Comments Yet</h3>
            <p className="text-muted-foreground">Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}
