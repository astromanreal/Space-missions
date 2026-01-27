
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from './ui/button';
import { ThumbsUp, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { User } from '@/services/social';

interface LikeButtonProps {
    updateId: string;
    likes: Partial<User>[];
    onLikeUpdate: (likes: Partial<User>[]) => void;
}

export default function LikeButton({ updateId, likes, onLikeUpdate }: LikeButtonProps) {
    const { user, token } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    
    // No internal state for likes, we rely on the prop for the source of truth.
    // Default to an empty array if the prop is undefined.
    const currentLikes = likes || [];

    const isLiked = user ? currentLikes.some(l => l._id === user._id) : false;

    const handleLike = async () => {
        if (!user || !token) {
            toast.error("You must be logged in to like an update.");
            return;
        }

        if (!updateId) {
            toast.error("Cannot like update: update identifier is missing.");
            return;
        }

        setIsLoading(true);

        // Optimistic update: immediately update the UI
        const optimisticLikes = isLiked
            ? currentLikes.filter(l => l._id !== user._id)
            : [...currentLikes, { _id: user._id, username: user.username, name: user.name }];
        
        onLikeUpdate(optimisticLikes);

        try {
            const response = await fetch(`/api/v1/updates/${updateId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // The API call was successful. The parent's state, updated optimistically,
                // should now match the server state. If the server returned the final list,
                // we could use it here to be perfectly in sync.
                onLikeUpdate(result.data || []);
            } else {
                 throw new Error(result.error || "Server error on liking update.");
            }

        } catch (error: any) {
            // Revert on error
            onLikeUpdate(currentLikes);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Button 
            variant={isLiked ? "default" : "outline"}
            size="sm"
            onClick={handleLike} 
            disabled={isLoading || !user}
            className={cn("flex items-center gap-2")}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <ThumbsUp className={cn("h-4 w-4", isLiked && "fill-current")} />
            )}
            <span>{currentLikes.length} Like{currentLikes.length !== 1 && 's'}</span>
        </Button>
    );
}
