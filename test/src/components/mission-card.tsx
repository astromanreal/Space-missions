
import type { SpaceMission } from '@/services/space-missions';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Tag, CheckCircle, Clock, MapPin, Target, Cpu, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MissionCardProps {
  mission: SpaceMission;
  cardSize: 'small' | 'large'; // Accept card size setting
  showImage: boolean; // Accept image visibility setting
}

// Function to determine badge variant based on status
const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (!status) return 'outline';
  switch (status.toLowerCase()) {
    case 'active':
      return 'default'; // Use primary color (Neon Blue in dark theme)
    case 'completed':
      return 'secondary'; // Use secondary color (Purple in dark theme)
    case 'planned':
      return 'outline';
    default:
      return 'outline';
  }
};

export default function MissionCard({ mission, cardSize, showImage }: MissionCardProps) {
  const {
    missionName,
    launch,
    agency,
    missionType,
    status,
    target,
    objectives,
    image,
    _id, // Use the actual ID for the link
  } = mission;

  const launchYear = launch.launchDate ? new Date(launch.launchDate).getFullYear() : 'N/A';


  return (
    <Card className={cn(
        "flex flex-col overflow-hidden h-full transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 bg-card/80 backdrop-blur-sm border border-border/50",
    )}>
      <CardHeader className={cn("p-3", cardSize === 'small' ? 'pb-2' : 'p-4')}>
        {/* Conditionally render image based on showImage prop */}
        {showImage && image && (
          <div className="relative aspect-[4/3] w-full mb-3 rounded-md overflow-hidden">
            <Image
              src={image} // Use the direct image URL from mission data
              alt={`Image of ${missionName} mission`}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={`${target} ${missionType} space mission`}
              sizes={cardSize === 'small' ? '(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px' : '(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 400px'} // Optimize image loading
            />
            <Badge
              variant={getStatusVariant(status)}
              className="absolute top-1.5 right-1.5 z-10 backdrop-blur-sm bg-opacity-80 text-xs px-1.5 py-0.5" // Smaller badge for all sizes
            >
              {status}
            </Badge>
          </div>
        )}
        <CardTitle className={cn("font-semibold", cardSize === 'small' ? 'text-base' : 'text-xl')}>{missionName}</CardTitle>
         <CardDescription className={cn("text-muted-foreground", cardSize === 'small' ? 'text-xs' : 'text-sm')}>{agency.name}</CardDescription>
      </CardHeader>

       {/* Conditionally render detailed content for large cards */}
       {cardSize === 'large' && (
        <CardContent className="p-4 pt-0 space-y-3 flex-grow">
           <div className="flex items-center text-sm text-muted-foreground">
             <Calendar className="mr-1.5 h-3.5 w-3.5" /> Launch Year: {launchYear}
           </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Tag className="mr-1.5 h-3.5 w-3.5" /> Type: {missionType}
          </div>
           <div className="flex items-center text-sm text-muted-foreground">
             <Target className="mr-1.5 h-3.5 w-3.5" /> Target: {target}
           </div>
            {objectives && objectives.length > 0 && (
            <p className="text-sm line-clamp-2">
               <span className="font-medium text-foreground/80">Objective:</span> {objectives[0]}
            </p>
            )}
         </CardContent>
       )}

        {/* Minimal content for small cards or if large card content is hidden */}
        {cardSize === 'small' && (
             <CardContent className="p-3 pt-0 flex-grow">
                 <div className="flex items-center text-xs text-muted-foreground">
                     <Calendar className="mr-1 h-3 w-3" /> {launchYear}
                     <span className="mx-1">|</span>
                     <Tag className="mr-1 h-3 w-3" /> {missionType}
                 </div>
                 <div className="flex items-center text-xs text-muted-foreground mt-1">
                     <Target className="mr-1 h-3 w-3" /> {target}
                 </div>
             </CardContent>
         )}


      <CardFooter className={cn("border-t border-border/50", cardSize === 'small' ? 'p-2' : 'p-4')}>
        <Link href={`/missions/${_id}`} className="w-full">
          <Button variant="outline" className={cn("w-full glow-on-hover border-primary/50 hover:bg-primary/10 hover:text-primary", cardSize === 'small' ? 'h-8 text-xs px-2' : 'h-10')}>
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
