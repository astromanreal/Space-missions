
'use client';

import type { SpaceMission } from '@/services/space-missions';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { ArrowRight, Building, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface TrackedMissionCardProps {
  mission: Partial<SpaceMission>;
}

export default function TrackedMissionCard({ mission }: TrackedMissionCardProps) {
  if (!mission.slug || !mission.missionName) {
    return null; // Don't render if essential data is missing
  }

  return (
    <Link href={`/missions/${mission.slug}`} className="group">
      <Card className="flex items-center overflow-hidden h-full transition-all duration-300 ease-in-out hover:shadow-md hover:shadow-primary/20 hover:border-primary/50 bg-card/80 backdrop-blur-sm border border-border/50 p-3 gap-4">
        {/* Image on the left */}
        <div className="relative aspect-square w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
          {mission.image ? (
            <Image
              src={mission.image}
              alt={`Image of ${mission.missionName} mission`}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={`${mission.target} ${mission.missionType} space mission`}
              sizes="64px"
            />
          ) : (
             <div className="w-full h-full bg-muted flex items-center justify-center">
                <Target className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Details in the middle */}
        <div className="flex-grow min-w-0">
          <p className="font-semibold truncate text-foreground">{mission.missionName}</p>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-x-3 gap-y-1 flex-wrap">
             {mission.agency && (
                 <span className="flex items-center gap-1.5"><Building className="h-3 w-3" />{mission.agency.name}</span>
             )}
             {mission.target && (
                <span className="flex items-center gap-1.5"><Target className="h-3 w-3" />{mission.target}</span>
             )}
          </div>
        </div>

        {/* Arrow on the right */}
        <div className="ml-auto flex-shrink-0">
           <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </Card>
    </Link>
  );
}
