
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DEFAULT_CARD_SIZE = 'large';

export default function Loading() {
  const gridClass = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">Explore Space Missions</h1>
      <p className="text-lg text-muted-foreground">Discover the spacecraft and technologies humanity has sent to explore the cosmos.</p>

      <div className={gridClass}>
        {[...Array(6)].map((_, i) => (
           <Card key={i} className="flex flex-col overflow-hidden h-full">
             <Skeleton className="aspect-[16/10] w-full" />
             <CardHeader className="p-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
             </CardHeader>
             <CardContent className="flex-grow p-4 pt-0 space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-5 w-3/4" />
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
