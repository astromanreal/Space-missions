import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import Link from "next/link";
import { Rocket, Telescope, CalendarClock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Featured Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 [perspective:1000px]">
        <FeatureCard
          title="Most Iconic Missions"
          description="Relive the journeys that changed our understanding of the universe."
          icon={<Rocket className="text-primary" />}
          link="/explore?filter=iconic"
        />
        <FeatureCard
          title="Active Missions"
          description="See the spacecraft currently exploring the vastness of space."
          icon={<Activity className="text-primary" />}
          link="/explore?filter=active"
        />
        <FeatureCard
          title="Recent Launches"
          description="Stay updated with the latest missions venturing into the final frontier."
          icon={<CalendarClock className="text-primary" />}
          link="/explore?filter=recent"
        />
        <FeatureCard
          title="Future Exploration"
          description="Discover the ambitious plans shaping tomorrow's space travel."
          icon={<Telescope className="text-primary" />}
          link="/explore?filter=future"
        />
      </section>

       {/* Explore by Mission Type (Simplified) */}
       <section className="text-center">
         <h2 className="text-3xl font-bold mb-8">Explore by Mission Type</h2>
         <div className="flex flex-wrap justify-center gap-4">
           {['Orbiter', 'Flyby', 'Lander', 'Rover', 'Sample Return', 'Mars', 'Moon', 'Solar', 'Asteroid', 'Telescope'].map((type) => (
             <Link href={`/explore?type=${type.toLowerCase().replace(' ', '-')}`} key={type}>
               <Button variant="outline" className="border-primary/50 hover:bg-primary/10 hover:text-primary">
                 {type} Missions
               </Button>
             </Link>
           ))}
         </div>
       </section>

    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

function FeatureCard({ title, description, icon, link }: FeatureCardProps) {
  return (
    <Card className={cn(
        "overflow-hidden transition-all duration-300 ease-out",
        "bg-card/80 backdrop-blur-sm border border-border/50",
        "group hover:shadow-xl hover:shadow-primary/30",
        "hover:[transform:rotateX(5deg)_rotateY(-5deg)_scale(1.05)]",
        "active:[transform:rotateX(2deg)_rotateY(-2deg)_scale(1.02)]"
        )}>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="bg-primary/10 p-3 rounded-full transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4 min-h-[3em]">{description}</CardDescription>
        <Link href={link}>
          <Button variant="link" className="p-0 text-accent group-hover:underline">
            Learn More &rarr;
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}