
'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, XCircle } from 'lucide-react'; // Import XCircle for reset button
import { Button } from './ui/button';

interface ExploreFiltersProps {
  agencies: string[];
  statuses: string[];
  targets: string[]; // Should contain simplified target names
  years: number[];
  types: string[]; // Add types prop
}

export default function ExploreFilters({ agencies, statuses, targets, years, types }: ExploreFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Initialize state from searchParams or defaults
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [agency, setAgency] = useState(searchParams.get('agency') || 'all');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [target, setTarget] = useState(searchParams.get('target') || 'all');
  const [year, setYear] = useState(searchParams.get('year') || 'all');
  const [missionType, setMissionType] = useState(searchParams.get('missionType') || 'all'); // Add state for mission type

  // Determine if any filters are active
  const areSpecificFiltersActive = agency !== 'all' || status !== 'all' || target !== 'all' || year !== 'all' || missionType !== 'all';
  const areAnyFiltersActive = areSpecificFiltersActive || searchQuery !== '';

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Determine if any specific filter is active based on CURRENT state
    const specificFilterIsBeingApplied = agency !== 'all' || status !== 'all' || target !== 'all' || year !== 'all' || missionType !== 'all';

    // Update or remove specific params based on state
    if (searchQuery) params.set('q', searchQuery); else params.delete('q');
    if (agency !== 'all') params.set('agency', agency); else params.delete('agency');
    if (status !== 'all') params.set('status', status); else params.delete('status');
    if (target !== 'all') params.set('target', target); else params.delete('target');
    if (year !== 'all') params.set('year', year); else params.delete('year');
    if (missionType !== 'all') params.set('missionType', missionType); else params.delete('missionType'); // Handle mission type

    // Handle general 'filter' and 'type' params from other pages
    const existingGeneralFilter = searchParams.get('filter');
    const existingTypeFilter = searchParams.get('type');

    // If a specific filter is being applied via the dropdowns, remove general ones
    if (specificFilterIsBeingApplied) {
      params.delete('filter');
      params.delete('type');
    } else {
       // Otherwise, preserve them if they existed
       if (existingGeneralFilter) params.set('filter', existingGeneralFilter);
       if (existingTypeFilter) params.set('type', existingTypeFilter);
    }

     startTransition(() => {
        const queryString = params.toString();
        router.replace(queryString ? `/explore?${queryString}` : '/explore', { scroll: false });
     });

  }, [searchQuery, agency, status, target, year, missionType, router, searchParams]);

  const handleResetFilters = () => {
     startTransition(() => {
         setSearchQuery('');
         setAgency('all');
         setStatus('all');
         setTarget('all');
         setYear('all');
         setMissionType('all'); // Reset mission type
        router.replace('/explore', { scroll: false });
     });
  };


  return (
    <Card className="p-4 mb-8 bg-card/80 backdrop-blur-sm border border-border/50">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 items-end">
         {/* Search Input */}
        <div className="relative col-span-1 sm:col-span-2 lg:col-span-2">
          <label htmlFor="search-missions" className="block text-sm font-medium text-muted-foreground mb-1.5">Search</label>
          <Search className="absolute left-3 top-[calc(50%+5px)] transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="search-missions"
            type="search"
            placeholder="Name, Agency, Target..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isPending}
          />
        </div>

        {/* Agency Select */}
        <div className="col-span-1">
            <label htmlFor="filter-agency" className="block text-sm font-medium text-muted-foreground mb-1.5">Agency</label>
            <Select value={agency} onValueChange={setAgency} disabled={isPending}>
              <SelectTrigger id="filter-agency" className="w-full">
                <SelectValue placeholder="Agency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agencies</SelectItem>
                {agencies.map((a) => (
                  <SelectItem key={a} value={a.toLowerCase()}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        {/* Status Select */}
        <div className="col-span-1">
            <label htmlFor="filter-status" className="block text-sm font-medium text-muted-foreground mb-1.5">Status</label>
            <Select value={status} onValueChange={setStatus} disabled={isPending}>
              <SelectTrigger id="filter-status" className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>
        
        {/* Mission Type Select */}
        <div className="col-span-1">
            <label htmlFor="filter-type" className="block text-sm font-medium text-muted-foreground mb-1.5">Type</label>
            <Select value={missionType} onValueChange={setMissionType} disabled={isPending}>
              <SelectTrigger id="filter-type" className="w-full">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((t) => (
                  <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        {/* Target Select */}
        <div className="col-span-1">
            <label htmlFor="filter-target" className="block text-sm font-medium text-muted-foreground mb-1.5">Target</label>
            <Select value={target} onValueChange={setTarget} disabled={isPending}>
              <SelectTrigger id="filter-target" className="w-full">
                <SelectValue placeholder="Target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Targets</SelectItem>
                {/* Use the simplified targets passed in props */}
                {targets.map((t) => (
                  <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        {/* Launch Year Select */}
        <div className="col-span-1">
            <label htmlFor="filter-year" className="block text-sm font-medium text-muted-foreground mb-1.5">Launch Year</label>
            <Select value={year} onValueChange={setYear} disabled={isPending}>
              <SelectTrigger id="filter-year" className="w-full">
                <SelectValue placeholder="Launch Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

         {/* Reset Button */}
         {areAnyFiltersActive && (
           <div className="col-span-1 flex items-end">
             <Button
               variant="ghost"
               onClick={handleResetFilters}
               disabled={isPending}
               className="w-full text-muted-foreground hover:text-destructive"
               aria-label="Reset all filters"
               title="Reset Filters"
             >
               <XCircle className="mr-2 h-4 w-4" /> Reset
             </Button>
           </div>
         )}
      </div>
    </Card>
  );
}
