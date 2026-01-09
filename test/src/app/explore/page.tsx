
'use client'; 

import { useState, useEffect } from 'react';
import MissionCard from '@/components/mission-card';
import { getSpaceMissions, SpaceMission } from '@/services/space-missions';
import { useSettings } from '@/context/settings-context';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Search } from 'lucide-react';


export default function ExplorePage() {
  const { cardSize, showCardImages } = useSettings(); 

  const [missions, setMissions] = useState<SpaceMission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch missions on mount
  useEffect(() => {
    async function loadMissions() {
      setIsLoading(true);
      const fetchedMissions = await getSpaceMissions();
      setMissions(fetchedMissions);
      setIsLoading(false);
    }
    loadMissions();
  }, []);

  // Dynamic grid class based on cardSize setting
  const gridClass = cardSize === 'small'
    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

  if (isLoading) {
     return (
       <div className="space-y-8">
         <h1 className="text-4xl font-bold tracking-tight">Explore Space Missions</h1>
         <p className="text-lg text-muted-foreground">Discover the spacecraft and technologies humanity has sent to explore the cosmos.</p>
          <div className={gridClass}>
            {[...Array(cardSize === 'small' ? 10 : 6)].map((_, i) => (
              <Card key={i} className="flex flex-col overflow-hidden h-full">
                <CardHeader className="p-4">
                  {showCardImages && <Skeleton className="aspect-[4/3] w-full mb-4 rounded-md" />}
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3 flex-grow">
                  <Skeleton className="h-4 w-full" />
                  {cardSize === 'large' && <Skeleton className="h-4 w-full" />}
                  {cardSize === 'large' && <Skeleton className="h-4 w-3/4" />}
                </CardContent>
                <CardFooter className="p-4 border-t border-border/50">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
       </div>
     );
   }


  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">Explore Space Missions</h1>
      <p className="text-lg text-muted-foreground">Discover the spacecraft and technologies humanity has sent to explore the cosmos.</p>

      {missions.length > 0 ? (
         <div className={gridClass}>
          {missions.map((mission) => (
            <MissionCard
                key={mission._id}
                mission={mission}
                cardSize={cardSize}
                showImage={showCardImages}
            />
          ))}
        </div>
      ) : (
         <div className="text-center py-16">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
           <p className="text-xl text-muted-foreground">No missions found.</p>
           <p className="text-sm text-muted-foreground">There may be an issue fetching data from the API.</p>
         </div>
       )}

    </div>
  );
}
