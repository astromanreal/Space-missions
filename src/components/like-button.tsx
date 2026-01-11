
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from './ui/button';
import { ThumbsUp, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
    missionSlug: string; // missionSlug is no longer needed for this call but kept for prop consistency
    updateId: string;
    initialLikes: string[];
    onLikeUpdate: (likes: string[]) => void;
}

export default function LikeButton({ missionSlug, updateId, initialLikes, onLikeUpdate }: LikeButtonProps) {
    const { user, token } = useAuth();
    const [likes, setLikes] = useState(initialLikes);
    const [isLoading, setIsLoading] = useState(false);

    const isLiked = user ? likes.includes(user._id) : false;

    const handleLike = async () => {
        if (!user || !token) {
            toast.error("You must be logged in to like an update.");
            return;
        }

        // This check is no longer strictly necessary for the API call itself
        if (!updateId) {
            toast.error("Cannot like update: update identifier is missing.");
            return;
        }

        setIsLoading(true);

        // Optimistic update
        const originalLikes = [...likes];
        const newLikes = isLiked
            ? likes.filter(id => id !== user._id)
            : [...likes, user._id];
        
        setLikes(newLikes);
        onLikeUpdate(newLikes);

        try {
            // FIX #1: Correct the URL to match the backend endpoint
            const response = await fetch(`/api/v1/updates/${updateId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                 const errorData = await response.json().catch(() => ({ error: "Failed to update like status." }));
                 throw new Error(errorData.error);
            }

            const result = await response.json();
            if (result.success) {
                // FIX #2: The array is in result.data, not result.data.likes
                setLikes(result.data);
                onLikeUpdate(result.data);
            } else {
                 throw new Error(result.error || "Server error on liking update.");
            }

        } catch (error: any) {
            // Revert on error
            setLikes(originalLikes);
            onLikeUpdate(originalLikes);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Button 
            variant="outline" 
            size="sm"
            onClick={handleLike} 
            disabled={isLoading || !user}
            className={cn("flex items-center gap-2", isLiked && "bg-primary/10 text-primary border-primary/50")}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <ThumbsUp className={cn("h-4 w-4", isLiked && "fill-current")} />
            )}
            <span>{likes.length} Like{likes.length !== 1 && 's'}</span>
        </Button>
    );
}
