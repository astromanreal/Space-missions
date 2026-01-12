
import type { SpaceMission } from '@/services/space-missions';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Tag, Target, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MissionCardProps {
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

export default function MissionCard({ mission }: MissionCardProps) {
  const {
    missionName,
    launch,
    agency,
    missionType,
    status,
    destination,
    image,
    slug,
  } = mission;

  const launchYear = launch.launchDate ? new Date(launch.launchDate).getFullYear() : 'N/A';

  return (
    <Card className={cn(
        "group flex flex-col overflow-hidden h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 bg-card/80 backdrop-blur-sm border border-border/50",
    )}>
      {image && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image
                src={image}
                alt={`Image of ${missionName} mission`}
                fill
                style={{objectFit: "cover"}}
                className="transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={`${destination} ${missionType} space mission`}
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 400px"
            />
            <div className="absolute top-0 right-0 p-2">
                 <Badge
                    variant={getStatusVariant(status)}
                    className="backdrop-blur-sm bg-opacity-80 text-xs px-2 py-1"
                >
                    {status}
                </Badge>
            </div>
        </div>
      )}
      
      <CardHeader className="p-4 flex-shrink-0">
        <CardTitle className="text-lg font-bold">{missionName}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{agency.name}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow flex-shrink-0 px-4 pb-4 space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" /> <span>{launchYear}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
            <Tag className="mr-2 h-4 w-4" /> <span>{missionType}</span>
        </div>
        {destination && (
          <div className="flex items-center text-sm text-muted-foreground">
              <Target className="mr-2 h-4 w-4" /> <span>{destination}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-auto border-t border-border/50 flex-shrink-0 p-4">
        <Link href={`/missions/${slug}`} className="w-full">
          <Button variant="outline" className="w-full glow-on-hover border-primary/50 hover:bg-primary/10 hover:text-primary h-10">
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
