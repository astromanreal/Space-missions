'use client';

import { useState, useEffect, useCallback } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Loader2, User, Link as LinkIcon, Rss } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MissionUpdate } from '@/services/updates';
import { useAuth } from '@/context/auth-context';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { CommentSection } from '@/components/comment-section';
import LikeButton from '@/components/like-button';
import { User as UserType } from '@/services/social';

export default function UpdateDetailPage() {
  const params = useParams();
  const updateId = params.id as string;
  const { user, isLoading: isAuthLoading } = useAuth();
  
  const [update, setUpdate] = useState<MissionUpdate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);

  const fetchUpdate = useCallback(async () => {
    if (!updateId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/updates/${updateId}`);
      if (!response.ok) {
        if (response.status === 404) notFound();
        throw new Error('Failed to fetch update.');
      }
      const result = await response.json();
      if (result.success) {
        setUpdate(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch update data.');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
      setUpdate(null);
    } finally {
      setIsLoading(false);
    }
  }, [updateId]);

  useEffect(() => {
    fetchUpdate();
  }, [fetchUpdate]);

  const handleLikeUpdate = (newLikes: Partial<UserType>[]) => {
    if (update) {
        setUpdate({ ...update, likes: newLikes });
    }
  };

   const handleCommentCountChange = useCallback((count: number) => {
    setCommentCount(count);
  }, []);

  if (isLoading || isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-15rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!update) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back to Mission Link */}
      {update.mission?.slug && (
        <Button variant="outline" asChild>
            <Link href={`/missions/${update.mission.slug}`}>
            &larr; Back to {update.mission.missionName}
            </Link>
        </Button>
      )}


      {/* Main Update Card */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-3xl">{update.title}</CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm pt-2">
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
              <span>Published on {format(new Date(update.createdAt), 'MMMM d, yyyy')}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90">
            <p>{update.content}</p>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
            {update.referenceLink && (
                <Button variant="link" asChild className="p-0 text-accent h-auto">
                    <a href={update.referenceLink} target="_blank" rel="noopener noreferrer">
                        Read Official Source <LinkIcon className="ml-1.5 h-3 w-3" />
                    </a>
                </Button>
            )}
             <div className="flex items-center gap-4">
                <LikeButton 
                    updateId={update._id}
                    likes={update.likes}
                    onLikeUpdate={handleLikeUpdate}
                />
            </div>
        </CardFooter>
      </Card>
      
      <Separator />

      {/* Comments Section */}
      <CommentSection updateId={update._id} onCommentCountChange={handleCommentCountChange} />
    </div>
  );
}
