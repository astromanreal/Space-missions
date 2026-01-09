import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Update defaults to match the new settings defaults
const DEFAULT_CARD_SIZE = 'small';
const DEFAULT_SHOW_IMAGES = true;

export default function Loading() {
  const gridClass = DEFAULT_CARD_SIZE === 'small'
    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

  const cardPadding = DEFAULT_CARD_SIZE === 'small' ? 'p-3' : 'p-4';
  const titleSize = DEFAULT_CARD_SIZE === 'small' ? 'h-5 w-3/4 mb-1' : 'h-6 w-3/4 mb-2';
  const descSize = DEFAULT_CARD_SIZE === 'small' ? 'h-3 w-1/2' : 'h-4 w-1/2';
  const footerPadding = DEFAULT_CARD_SIZE === 'small' ? 'p-2' : 'p-4';
  const buttonHeight = DEFAULT_CARD_SIZE === 'small' ? 'h-8' : 'h-10';
  const contentPadding = DEFAULT_CARD_SIZE === 'small' ? 'pt-0' : 'p-4 pt-0';

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">Explore Space Missions</h1>
      <p className="text-lg text-muted-foreground">Discover the spacecraft and technologies humanity has sent to explore the cosmos.</p>

      {/* Mimic Mission Cards Grid */}
      <div className={gridClass}>
        {[...Array(DEFAULT_CARD_SIZE === 'small' ? 10 : 6)].map((_, i) => (
           <Card key={i} className="flex flex-col overflow-hidden h-full">
             <CardHeader className={cardPadding}>
               {DEFAULT_SHOW_IMAGES && <Skeleton className="aspect-[4/3] w-full mb-3 rounded-md" />}
               <Skeleton className={titleSize} />
               <Skeleton className={descSize} />
             </CardHeader>
             <CardContent className={cn(cardPadding, contentPadding, "flex-grow")}>
                 {DEFAULT_CARD_SIZE === 'small' && (
                    <div className="space-y-1 mt-1">
                        <Skeleton className="h-3 w-4/5" />
                        <Skeleton className="h-3 w-3/5" />
                    </div>
                 )}
                 {DEFAULT_CARD_SIZE === 'large' && (
                   <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                   </div>
                 )}
             </CardContent>
             <CardFooter className={cn(footerPadding, "border-t border-border/50")}>
                <Skeleton className={cn(buttonHeight, "w-full")} />
             </CardFooter>
           </Card>
        ))}
      </div>
    </div>
  );
}
