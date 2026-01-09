import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
   // Mimic the structure of the detail page
   return (
     <div className="container mx-auto px-4 py-8 max-w-4xl">
       <article className="space-y-8">
         {/* Header Section */}
         <header className="space-y-4">
           <div className="flex items-center justify-between">
             <Skeleton className="h-12 w-3/5" /> {/* Title */}
             <Skeleton className="h-8 w-24" /> {/* Badge */}
           </div>
           <div className="flex items-center space-x-4">
             <Skeleton className="h-6 w-1/4" />
             <Skeleton className="h-6 w-1/4" />
             <Skeleton className="h-6 w-1/4" />
           </div>
         </header>

         {/* Image Section */}
         <Skeleton className="aspect-video w-full rounded-lg" />

         {/* Main Content Sections */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Left Column */}
           <div className="md:col-span-2 space-y-6">
             <section>
               <Skeleton className="h-8 w-1/3 mb-4" /> {/* Section Title */}
               <Skeleton className="h-4 w-full mb-2" />
               <Skeleton className="h-4 w-full mb-2" />
               <Skeleton className="h-4 w-5/6" />
             </section>
             <section>
               <Skeleton className="h-8 w-1/3 mb-4" /> {/* Section Title */}
               <div className="flex flex-wrap gap-2">
                 <Skeleton className="h-6 w-20 rounded-full" />
                 <Skeleton className="h-6 w-24 rounded-full" />
                 <Skeleton className="h-6 w-16 rounded-full" />
               </div>
             </section>
              <section>
               <Skeleton className="h-8 w-1/2 mb-4" /> {/* Section Title */}
               <Skeleton className="h-4 w-full mb-2" />
               <Skeleton className="h-4 w-full mb-2" />
               <Skeleton className="h-4 w-5/6" />
             </section>
           </div>

           {/* Right Column */}
           <div className="space-y-6">
             <Card className="bg-card/80 backdrop-blur-sm">
               <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
               <CardContent className="space-y-3">
                 <Skeleton className="h-5 w-full" />
                 <Skeleton className="h-5 w-full" />
               </CardContent>
             </Card>
             <Card className="bg-card/80 backdrop-blur-sm">
               <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
               <CardContent><Skeleton className="h-5 w-3/4" /></CardContent>
             </Card>
             <Card className="bg-card/80 backdrop-blur-sm">
               <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
               <CardContent><Skeleton className="h-5 w-3/4" /></CardContent>
             </Card>
           </div>
         </div>

         {/* Back Button */}
          <div className="mt-12 text-center">
             <Skeleton className="h-10 w-36 mx-auto" />
          </div>
       </article>
     </div>
   );
 }
