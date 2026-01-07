'use client'; // Make this a client component to use context

import { useState, useEffect } from 'react'; // Import hooks
import MissionCard from '@/components/mission-card';
import { getSpaceMissions, SpaceMission } from '@/services/space-missions';
import ExploreFilters from '@/components/explore-filters'; // Import the filters component
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'; // Import CardHeader, CardContent
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { missionTypeDetails } from '@/lib/mission-types'; // Import shared mission type details
import { useSearchParams } from 'next/navigation'; // Use hook instead of prop
import { useSettings } from '@/context/settings-context'; // Import settings context
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state

// Define homepage filter details (similar structure to missionTypeDetails)
// Added 'active' filter details
const homepageFilterDetails: { [key: string]: { name: string; description: string } } = {
    iconic: { name: 'Iconic Missions', description: 'Highlighting some of the most famous and impactful space missions.' },
    recent: { name: 'Recent Missions', description: 'Exploring missions launched in recent years, showcasing current technology.' },
    future: { name: 'Future Missions', description: 'Looking ahead at planned and upcoming space exploration ventures.' },
    active: { name: 'Active Missions', description: 'Tracking missions currently operational and exploring the cosmos.' },
};


// This component will fetch data on the client side initially
export default function ExplorePage() {
  const searchParams = useSearchParams();
  const { cardSize, showCardImages } = useSettings(); // Use settings

  const [missions, setMissions] = useState<SpaceMission[]>([]);
  const [filteredMissions, setFilteredMissions] = useState<SpaceMission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for filter options (now using curated lists)
  const [uniqueAgencies, setUniqueAgencies] = useState<string[]>([]);
  const [uniqueStatuses, setUniqueStatuses] = useState<string[]>([]);
  const [uniqueYears, setUniqueYears] = useState<number[]>([]);
  
  // Hardcoded curated lists for simplified filtering
  const curatedTargets = ['Sun', 'Moon', 'Mars', 'Jupiter', 'Saturn', 'Venus', 'Pluto', 'Asteroid', 'Interstellar'];
  const curatedTypes = ['Orbiter', 'Lander', 'Rover', 'Flyby', 'Telescope', 'Sample Return', 'Solar Observatory'];


  // State for page title/subtitle
   const [pageTitle, setPageTitle] = useState('Explore Space Missions');
   const [pageSubtitle, setPageSubtitle] = useState('Discover the spacecraft and technologies humanity has sent to explore the cosmos.');
   const [isTypeOrFilterView, setIsTypeOrFilterView] = useState(false);


  // Fetch missions on mount
  useEffect(() => {
    async function loadMissions() {
      setIsLoading(true);
      const fetchedMissions = await getSpaceMissions();
      setMissions(fetchedMissions);

       // Extract unique values for filters based on fetched missions
       setUniqueAgencies(Array.from(new Set(fetchedMissions.map(m => m.agency))).sort());
       setUniqueStatuses(Array.from(new Set(fetchedMissions.map(m => m.status))).sort());
       setUniqueYears(Array.from(new Set(fetchedMissions.map(m => m.launchYear))).sort((a, b) => b - a));

      setIsLoading(false);
    }
    loadMissions();
  }, []);

  // Filter missions whenever searchParams or missions change
  useEffect(() => {
    if (isLoading) return; // Don't filter while loading

    // Extract filter values from searchParams
    const searchQuery = searchParams.get('q') || undefined;
    const generalFilter = searchParams.get('filter') || undefined; // 'iconic', 'recent', 'future', 'active'
    let typeFilter = searchParams.get('type') || undefined;     // 'orbiter', 'rover', 'mars', etc. (from any source)
    const agencyFilter = searchParams.get('agency') || undefined;
    const statusFilter = searchParams.get('status') || undefined;
    const targetFilter = searchParams.get('target') || undefined;
    const yearFilter = searchParams.get('year') || undefined;
    const specificTypeFilter = searchParams.get('missionType') || undefined; // from the new dropdown

    // If a specific type filter from the dropdown is chosen, it takes precedence
    if (specificTypeFilter) {
      typeFilter = specificTypeFilter;
    }

    // Define which types are target-based vs function-based (using the imported details)
    const targetBasedTypes = Object.entries(missionTypeDetails)
          .filter(([_, details]) => details.isTargetBased)
          .map(([key, _]) => key);

    // Determine if any *specific* filter is active
    const isSpecificFilterActive = !!(searchQuery || agencyFilter || statusFilter || targetFilter || yearFilter || specificTypeFilter);

    // Determine if the page view originated from a 'type' or 'filter' link click
    const currentIsTypeOrFilterView = (searchParams.get('type') || generalFilter) && !isSpecificFilterActive;
    setIsTypeOrFilterView(currentIsTypeOrFilterView); // Update state

    // Filter logic
    const newlyFilteredMissions = missions.filter(mission => {
      let match = true;
      const missionTypeLower = mission.missionType.toLowerCase();
      const missionTargetLower = mission.target.toLowerCase();
      const missionStatusLower = mission.status.toLowerCase();

      if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          match = match && (
              mission.name.toLowerCase().includes(lowerQuery) ||
              mission.agency.toLowerCase().includes(lowerQuery) ||
              missionTargetLower.includes(lowerQuery)
          );
      }

      if (isSpecificFilterActive) {
          if (agencyFilter && agencyFilter !== 'all') {
              match = match && mission.agency.toLowerCase() === agencyFilter.toLowerCase();
          }
          if (statusFilter && statusFilter !== 'all') {
              match = match && missionStatusLower === statusFilter.toLowerCase();
          }
          if (targetFilter && targetFilter !== 'all') {
              match = match && missionTargetLower.includes(targetFilter.toLowerCase());
          }
           if (yearFilter && yearFilter !== 'all') {
              match = match && mission.launchYear.toString() === yearFilter;
           }
            // Handle the new mission type filter
           if (specificTypeFilter && specificTypeFilter !== 'all') {
              match = match && missionTypeLower.includes(specificTypeFilter.toLowerCase());
           }

      } else {
        if (generalFilter) {
            let generalMatch = false;
            if (generalFilter === 'iconic') {
               generalMatch = ['Voyager 1', 'Hubble Space Telescope', 'James Webb Space Telescope'].includes(mission.name);
            } else if (generalFilter === 'recent') {
              const currentYear = new Date().getFullYear();
              generalMatch = mission.launchYear >= currentYear - 5;
            } else if (generalFilter === 'future') {
              generalMatch = missionStatusLower === 'planned';
            } else if (generalFilter === 'active') {
               generalMatch = missionStatusLower === 'active';
            }
            match = match && generalMatch;
        }

        // This handles the type filter from the 'Explore by Type' page
        if (typeFilter && !specificTypeFilter) {
            const typeFilterClean = typeFilter.replace('-', ' ').toLowerCase();
            let typeMatch = false;
            if (targetBasedTypes.includes(typeFilterClean)) {
                typeMatch = missionTargetLower.includes(typeFilterClean);
            } else {
                const missionFunctions = missionTypeLower.split(/[,/]/).map(t => t.trim());
                typeMatch = missionFunctions.some(func => func.includes(typeFilterClean));
            }
            match = match && typeMatch;
        }
      }
      return match;
    });

    setFilteredMissions(newlyFilteredMissions);

     // Determine Page Title and Subtitle based on filters
     let newTitle = 'Explore Space Missions';
     let newSubtitle = 'Discover the spacecraft and technologies humanity has sent to explore the cosmos.';
     // Use the original `type` param for title, not the specific one from the filter dropdown
     const currentFilterOrTypeSlug = searchParams.get('type') || generalFilter;
     if (currentIsTypeOrFilterView && currentFilterOrTypeSlug) {
       const details = missionTypeDetails[currentFilterOrTypeSlug] || homepageFilterDetails[currentFilterOrTypeSlug];
       if (details) {
         newTitle = details.name;
         newSubtitle = details.description;
       }
     }
     setPageTitle(newTitle);
     setPageSubtitle(newSubtitle);

  }, [searchParams, missions, isLoading]); // Depend on searchParams and missions


  // Dynamic grid class based on cardSize setting
  const gridClass = cardSize === 'small'
    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' // More columns for small
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'; // Fewer for large


  if (isLoading) {
      // Render a loading skeleton structure similar to the final page
     return (
       <div className="space-y-8">
         <Skeleton className="h-10 w-3/4" />
         <Skeleton className="h-6 w-1/2" />
         <Card className="p-4 mb-8 bg-card/80 backdrop-blur-sm">
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 items-end">
             <div className="relative col-span-1 sm:col-span-2 lg:col-span-1 xl:col-span-2">
               <Skeleton className="h-6 w-16 mb-1.5" />
               <Skeleton className="h-10 w-full" />
             </div>
             {[...Array(5)].map((_, i) => ( // Updated to 5 for the new filter
                <div key={i} className="col-span-1">
                    <Skeleton className="h-6 w-12 mb-1.5" />
                    <Skeleton className="h-10 w-full" />
                </div>
             ))}
           </div>
         </Card>
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
      <h1 className="text-4xl font-bold tracking-tight">{pageTitle}</h1>
      <p className="text-lg text-muted-foreground">{pageSubtitle}</p>

      {/* Conditionally render the filters */}
      {!isTypeOrFilterView && (
        <ExploreFilters
          agencies={uniqueAgencies}
          statuses={uniqueStatuses}
          targets={curatedTargets}
          years={uniqueYears}
          types={curatedTypes}
        />
      )}


      {filteredMissions.length > 0 ? (
         <div className={gridClass}> {/* Use dynamic grid class */}
          {filteredMissions.map((mission) => (
            <MissionCard
                key={mission.name}
                mission={mission}
                // Pass down settings
                cardSize={cardSize}
                showImage={showCardImages}
            />
          ))}
        </div>
      ) : (
         <div className="text-center py-16">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
           <p className="text-xl text-muted-foreground">No missions found matching your criteria.</p>
           <p className="text-sm text-muted-foreground">Try adjusting the filters or search terms.</p>
         </div>
       )}

    </div>
  );
}
