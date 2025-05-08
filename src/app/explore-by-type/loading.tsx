import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-3/4" /> {/* Title */}
      <Skeleton className="h-6 w-1/2" /> {/* Subtitle */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="flex flex-col h-full overflow-hidden">
            <CardHeader className="flex-row items-center gap-4 pb-2">
              <Skeleton className="h-12 w-12 rounded-full" /> {/* Icon */}
              <Skeleton className="h-6 w-3/5" /> {/* Title */}
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <Skeleton className="aspect-video w-full rounded-md" /> {/* Image */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" /> {/* Label */}
                <Skeleton className="h-4 w-full" /> {/* Description line 1 */}
                <Skeleton className="h-4 w-4/5" /> {/* Description line 2 */}
              </div>
               <Skeleton className="h-5 w-2/5 mt-2" /> {/* Button */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
