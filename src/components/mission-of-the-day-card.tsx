
'use client';

import type { SpaceMission } from '@/services/space-missions';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Tag, Target, Building } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MissionOfTheDayCardProps {
  mission: SpaceMission;
}

const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (!status) return 'outline';
  switch (status.toLowerCase()) {
    case 'active':
    case 'ongoing':
      return 'default';
    case 'completed':
      return 'secondary';
    case 'planned':
    case 'upcoming':
      return 'outline';
    case 'failed':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function MissionOfTheDayCard({ mission }: MissionOfTheDayCardProps) {
  const {
    missionName,
    launch,
    agency,
    missionType,
    status,
    destination,
    objectives,
    image,
    slug,
  } = mission;

  const launchYear = launch.launchDate ? new Date(launch.launchDate).getFullYear() : 'N/A';

  return (
    <Card className={cn(
        "group w-full max-w-5xl mx-auto overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-primary/20 bg-card/80 backdrop-blur-sm border border-border/50",
    )}>
        <div className="flex flex-col lg:flex-row">
             {image && (
                <div className="lg:w-1/2 relative aspect-video lg:aspect-[4/3] w-full overflow-hidden">
                    <Image
                        src={image}
                        alt={`Image of ${missionName} mission`}
                        fill
                        style={{objectFit: "cover"}}
                        className="transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={`${destination} ${missionType} space mission`}
                        sizes="(max-width: 1024px) 90vw, 50vw"
                        priority
                    />
                </div>
            )}
            <div className="lg:w-1/2 flex flex-col p-8 justify-between">
                <div className="flex-grow space-y-4">
                     <div className="flex items-center justify-between gap-4">
                         <h3 className="text-3xl font-bold">{missionName}</h3>
                         <Badge
                            variant={getStatusVariant(status)}
                            className="backdrop-blur-sm bg-opacity-80 px-3 py-1 text-sm"
                        >
                            {status}
                        </Badge>
                     </div>

                    <p className="text-base text-muted-foreground line-clamp-3 leading-relaxed">
                        {objectives[0] || 'A pioneering mission to expand our understanding of the cosmos.'}
                    </p>

                    <div className="space-y-3 pt-4">
                         <div className="flex items-center text-base text-muted-foreground">
                            <Building className="mr-3 h-5 w-5 flex-shrink-0 text-primary/80" /> <span>{agency.name}</span>
                        </div>
                        <div className="flex items-center text-base text-muted-foreground">
                            <Calendar className="mr-3 h-5 w-5 flex-shrink-0 text-primary/80" /> <span>{launchYear}</span>
                        </div>
                        <div className="flex items-center text-base text-muted-foreground">
                            <Tag className="mr-3 h-5 w-5 flex-shrink-0 text-primary/80" /> <span>{missionType}</span>
                        </div>
                        {destination && (
                        <div className="flex items-center text-base text-muted-foreground">
                            <Target className="mr-3 h-5 w-5 flex-shrink-0 text-primary/80" /> <span>{destination}</span>
                        </div>
                        )}
                    </div>

                </div>

                <div className="mt-8">
                    <Link href={`/missions/${slug}`} className="w-full">
                        <Button size="lg" variant="outline" className="w-full glow-on-hover border-primary/50 hover:bg-primary/10 hover:text-primary h-12 text-base">
                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
      
    </Card>
  );
}
