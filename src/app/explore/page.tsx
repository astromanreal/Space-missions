
'use client'; 

import { useState, useEffect, useCallback } from 'react';
import MissionCard from '@/components/mission-card';
import { SpaceMission } from '@/services/space-missions';
import { useSettings } from '@/context/settings-context';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import MissionFilters, { FilterState } from '@/components/mission-filters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from '@/lib/utils';

export default function ExplorePage() {
  const { cardSize, showCardImages } = useSettings(); 

  const [missions, setMissions] = useState<SpaceMission[]>([]);
  const [totalMissions, setTotalMissions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    owner: '',
    destination: '',
    category: '',
    missionType: '',
    sort: '-launchDate',
  });
  const [page, setPage] = useState(1);
  const limit = cardSize === 'small' ? 20 : 9;

  const totalPages = Math.ceil(totalMissions / limit);

  const fetchMissions = useCallback(async (currentFilters: FilterState, currentPage: number) => {
    setIsLoading(true);
    
    const params = new URLSearchParams();
    if (currentFilters.search) params.append('search', currentFilters.search);
    if (currentFilters.status) params.append('status', currentFilters.status);
    if (currentFilters.owner) params.append('owner', currentFilters.owner);
    if (currentFilters.destination) params.append('destination', currentFilters.destination);
    if (currentFilters.category) params.append('category', currentFilters.category);
    if (currentFilters.missionType) params.append('missionType', currentFilters.missionType);
    if (currentFilters.sort) params.append('sort', currentFilters.sort);
    params.append('page', currentPage.toString());
    params.append('limit', limit.toString());

    try {
      const response = await fetch(`/api/v1/missions?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch missions');
      }
      const data = await response.json();
      setMissions(data.data || []);
      setTotalMissions(data.count || 0);

    } catch (error) {
      console.error(error);
      setMissions([]);
      setTotalMissions(0);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchMissions(filters, page);
    }, 300); // Debounce search
    return () => clearTimeout(handler);
  }, [filters, page, fetchMissions]);
  
  const handleFilterChange = (newFilters: FilterState) => {
    setPage(1);
    setFilters(newFilters);
  };
  
  const gridClass = cardSize === 'small'
    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Explore Space Missions</h1>
        <p className="text-lg text-muted-foreground">Discover the spacecraft and technologies humanity has sent to explore the cosmos.</p>
      </div>

      <div className="p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search missions by name or objective..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
              className="pl-10 h-11 text-base"
            />
          </div>
          <Button 
            variant="outline" 
            className="h-11"
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        <div className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isFiltersVisible ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="pt-4">
            <MissionFilters onFilterChange={handleFilterChange} initialFilters={filters} />
          </div>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        {isLoading ? <Skeleton className="h-5 w-40" /> : `Found ${totalMissions} missions.`}
      </div>

      {isLoading ? (
        <div className={gridClass}>
          {[...Array(limit)].map((_, i) => (
            <Card key={i} className="flex flex-col overflow-hidden h-full">
              <CardHeader className="p-4">
                {showCardImages && <Skeleton className="aspect-[4/3] w-full mb-4 rounded-md" />}
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3 flex-grow">
                <Skeleton className="h-4 w-full" />
                {cardSize === 'large' && <Skeleton className="h-4 w-full" />}
              </CardContent>
              <CardFooter className="p-4 border-t border-border/50">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : missions.length > 0 ? (
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
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card/50">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold">No Missions Found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 pt-8">
            <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
            >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
            </Button>
            <span className="text-muted-foreground text-sm">
                Page {page} of {totalPages}
            </span>
            <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
            >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
      )}
    </div>
  );
}
