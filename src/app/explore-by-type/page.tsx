

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { missionTypeDetails, type MissionTypeDetail } from '@/lib/mission-types'; // Import shared details


export default function ExploreByTypePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">Explore by Mission Type</h1>
      <p className="text-lg text-muted-foreground">
        Discover missions based on their primary function or destination, and the typical technologies involved.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Object.entries(missionTypeDetails).map(([slug, type]) => (
          // Pass the slug as the 'type' query parameter to the /explore page
          <Link href={`/explore?type=${slug}`} key={slug} className="group flex">
            <Card className="flex flex-col w-full h-full overflow-hidden hover:shadow-lg hover:shadow-accent/20 transition-shadow duration-300 bg-card/80 backdrop-blur-sm border border-border/50 hover:-translate-y-1">
              <CardHeader className="flex-row items-center gap-4 pb-2">
                 <div className="bg-primary/10 p-3 rounded-full text-primary">
                  {type.icon}
                </div>
                <CardTitle className="text-xl">{type.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col space-y-4">
                 <div className="aspect-video relative mb-4 rounded-md overflow-hidden">
                   <Image
                     src={type.imageUrl} // Use the direct imageUrl from missionTypeDetails
                     alt={`${type.name} mission concept`}
                     layout="fill"
                     objectFit="cover"
                     data-ai-hint={type.imageHint}
                     className="transition-transform duration-300 group-hover:scale-105"
                   />
                 </div>
                 <div className="flex-grow"> {/* Ensure description takes available space */}
                    <CardDescription>
                      <span className="font-medium text-foreground/80">Key Tech:</span> {type.keyTech}
                    </CardDescription>
                 </div>
                <div className="mt-auto pt-2"> {/* Push button to the bottom */}
                    <Button variant="link" className="p-0 text-accent group-hover:underline">
                      View {type.name} Missions &rarr;
                    </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

