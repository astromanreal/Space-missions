'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { MissionUpdate } from '@/services/updates';
import MissionUpdateCard from '@/components/mission-update-card';
import { Loader2, Rss } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';

const UPDATES_PER_PAGE = 5;

// Function to shuffle an array
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

export default function FeedPage() {
  const [allUpdates, setAllUpdates] = useState<MissionUpdate[]>([]);
  const [visibleUpdates, setVisibleUpdates] = useState<MissionUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchAllUpdates = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/feed');
      if (!response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed to fetch the mission feed.");
          } else {
              throw new Error("Received an unexpected response from the server.");
          }
      }
      const data = await response.json();
      if (data.success) {
        const shuffled = shuffleArray(data.data || []);
        setAllUpdates(shuffled);
        setVisibleUpdates(shuffled.slice(0, UPDATES_PER_PAGE));
        setHasMore(shuffled.length > UPDATES_PER_PAGE);
      } else {
        throw new Error(data.error || "An error occurred while fetching the feed.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
      setAllUpdates([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllUpdates();
  }, [fetchAllUpdates]);

  const loadMoreUpdates = () => {
    const nextPage = page + 1;
    const newVisibleCount = nextPage * UPDATES_PER_PAGE;
    setVisibleUpdates(allUpdates.slice(0, newVisibleCount));
    setPage(nextPage);
    setHasMore(allUpdates.length > newVisibleCount);
  };
  

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Rss className="h-8 w-8 text-primary" />
          Mission Feed
        </h1>
        <p className="text-muted-foreground mt-1">
          The latest updates from missions across the cosmos, contributed by our community.
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-6">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      ) : allUpdates.length > 0 ? (
        <div className="space-y-6">
          {visibleUpdates.map(update => (
             update.mission?.slug ? (
                <MissionUpdateCard 
                    key={update._id} 
                    update={update} 
                    missionSlug={update.mission.slug}
                />
             ) : null
          ))}

          {hasMore && (
            <div className="text-center">
              <Button onClick={loadMoreUpdates} variant="outline">
                Load More Updates
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg bg-card/50">
            <Rss className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-semibold">The Feed is Quiet... For Now</h3>
            <p>No mission updates have been posted yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
