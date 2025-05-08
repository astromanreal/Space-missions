import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Update defaults to match the new settings defaults
const DEFAULT_CARD_SIZE = 'small'; // Changed from 'large'
const DEFAULT_SHOW_IMAGES = true;

export default function Loading() {
  // Mimic the structure of the explore page
  const gridClass = DEFAULT_CARD_SIZE === 'small'
    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

  // Adjusted paddings and sizes for small cards
  const cardPadding = DEFAULT_CARD_SIZE === 'small' ? 'p-3' : 'p-4';
  const titleSize = DEFAULT_CARD_SIZE === 'small' ? 'h-5 w-3/4 mb-1' : 'h-6 w-3/4 mb-2';
  const descSize = DEFAULT_CARD_SIZE === 'small' ? 'h-3 w-1/2' : 'h-4 w-1/2';
  const footerPadding = DEFAULT_CARD_SIZE === 'small' ? 'p-2' : 'p-4';
  const buttonHeight = DEFAULT_CARD_SIZE === 'small' ? 'h-8' : 'h-10';
  const contentPadding = DEFAULT_CARD_SIZE === 'small' ? 'pt-0' : 'p-4 pt-0'; // Adjust content padding for small

  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-3/4" /> {/* Title */}
      <Skeleton className="h-6 w-1/2" /> {/* Subtitle */}

      {/* Mimic Search/Filter */}
       <Card className="p-4 mb-8 bg-card/80 backdrop-blur-sm">
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 items-end">
             <div className="relative col-span-1 sm:col-span-2 lg:col-span-1 xl:col-span-2">
               <Skeleton className="h-6 w-16 mb-1.5" />
               <Skeleton className="h-10 w-full" />
             </div>
             {[...Array(4)].map((_, i) => (
                <div key={i} className="col-span-1">
                    <Skeleton className="h-6 w-12 mb-1.5" />
                    <Skeleton className="h-10 w-full" />
                </div>
             ))}
              {/* Placeholder for reset button if filters were active */}
              {/* <div className="col-span-1 flex items-end">
                 <Skeleton className="h-10 w-full" />
              </div> */}
           </div>
         </Card>


      {/* Mimic Mission Cards Grid */}
      <div className={gridClass}>
        {/* Update array count to match small card default */}
        {[...Array(DEFAULT_CARD_SIZE === 'small' ? 10 : 6)].map((_, i) => (
           <Card key={i} className="flex flex-col overflow-hidden h-full">
             <CardHeader className={cardPadding}>
                {/* Conditionally render image skeleton */}
               {DEFAULT_SHOW_IMAGES && <Skeleton className="aspect-[4/3] w-full mb-3 rounded-md" />}
               <Skeleton className={titleSize} />
               <Skeleton className={descSize} />
             </CardHeader>
             {/* Minimal content skeleton for small cards */}
             <CardContent className={cn(cardPadding, contentPadding, "flex-grow")}>
                 {/* Add minimal skeleton lines for small cards */}
                 {DEFAULT_CARD_SIZE === 'small' && (
                    <div className="space-y-1 mt-1">
                        <Skeleton className="h-3 w-4/5" />
                        <Skeleton className="h-3 w-3/5" />
                    </div>
                 )}
                  {/* Content skeleton only for large cards */}
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
