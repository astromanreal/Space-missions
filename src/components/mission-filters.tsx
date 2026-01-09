
'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

interface FilterOptions {
  destinations: string[];
  statuses: string[];
  owners: string[];
  categories: string[];
  missionTypes: string[];
}

export interface FilterState {
  search: string;
  status: string;
  owner: string;
  destination: string;
  category: string;
  missionType: string;
  sort: string;
}

interface MissionFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters: FilterState;
}

const initialFilterState: FilterState = {
  search: '',
  status: '',
  owner: '',
  destination: '',
  category: '',
  missionType: '',
  sort: '-launchDate',
};

export default function MissionFilters({ onFilterChange, initialFilters }: MissionFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state with parent
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Fetch filter options from the API on mount
  useEffect(() => {
    async function fetchFilterOptions() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/v1/missions/filters');
        if (!response.ok) throw new Error('Failed to fetch filter options');
        const result = await response.json();
        if (result.success) {
          setFilterOptions(result.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFilterOptions();
  }, []);

  // Handle changes to any filter
  const handleInputChange = (name: keyof Omit<FilterState, 'search'>, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const newFilters = { ...initialFilterState, search: filters.search }; // Keep search term
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const sortOptions = [
    { value: '-launchDate', label: 'Launch Date (Newest)' },
    { value: 'launchDate', label: 'Launch Date (Oldest)' },
    { value: 'missionName', label: 'Name (A-Z)' },
    { value: '-missionName', label: 'Name (Z-A)' },
  ];
  
  if (isLoading) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
        {/* Filter Selects */}
        <Select value={filters.status} onValueChange={(value) => handleInputChange('status', value === 'all' ? '' : value)}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {filterOptions?.statuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.owner} onValueChange={(value) => handleInputChange('owner', value === 'all' ? '' : value)}>
          <SelectTrigger><SelectValue placeholder="Agency" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Agencies</SelectItem>
            {filterOptions?.owners.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.destination} onValueChange={(value) => handleInputChange('destination', value === 'all' ? '' : value)}>
          <SelectTrigger><SelectValue placeholder="Destination" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Destinations</SelectItem>
            {filterOptions?.destinations.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.category} onValueChange={(value) => handleInputChange('category', value === 'all' ? '' : value)}>
          <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {filterOptions?.categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        
        <Select value={filters.missionType} onValueChange={(value) => handleInputChange('missionType', value === 'all' ? '' : value)}>
          <SelectTrigger><SelectValue placeholder="Mission Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Mission Types</SelectItem>
            {filterOptions?.missionTypes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        
        <Select value={filters.sort} onValueChange={(value) => handleInputChange('sort', value)}>
          <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
          <SelectContent>
            {sortOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleReset} className="w-full xl:w-auto justify-center">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
