
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import Link from "next/link";
import { Rocket, Telescope, MapPin, CalendarClock, Atom, Activity } from "lucide-react"; // Added Activity icon
import { cn } from "@/lib/utils"; // Import cn for conditional classes

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative text-center py-20 md:py-32 lg:py-40 overflow-hidden rounded-lg shadow-xl bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-black">
        {/* Background elements - Simple placeholders */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {/* Placeholder for stars/galaxy */}
          <svg width="100%" height="100%">
             <defs>
                <pattern id="star-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
                   <circle cx="5" cy="5" r="1" fill="white"/>
                   <circle cx="25" cy="30" r="0.5" fill="white"/>
                   <circle cx="45" cy="15" r="0.8" fill="white"/>
                </pattern>
             </defs>
             <rect width="100%" height="100%" fill="url(#star-pattern)" />
          </svg>
        </div>
         <div className="absolute top-1/4 left-1/4 w-12 h-12 opacity-30 animate-float">
           {/* Placeholder satellite */}
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-primary"><path d="M12 2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 12 2M8.5 4.698a.5.5 0 0 1 .707-.707l.707.707a.5.5 0 0 1-.707.707l-.707-.707zM4.698 8.5a.5.5 0 0 1 .707.707l-.707.707a.5.5 0 0 1-.707-.707l.707-.707zm.001 6.804a.5.5 0 0 1-.707.707l-.707-.707a.5.5 0 0 1 .707-.707l.707.707zm3.799 3.798a.5.5 0 0 1-.707-.707l.707-.707a.5.5 0 0 1 .707.707l-.707-.707zm6.804 0a.5.5 0 0 1 .707.707l-.707.707a.5.5 0 0 1-.707-.707l.707.707zm3.798-3.8a.5.5 0 0 1 .707-.707l.707.707a.5.5 0 0 1-.707.707l-.707-.707zm.001-6.804a.5.5 0 0 1-.707-.707l.707.707a.5.5 0 1 1 .707.707l-.707.707zM12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14m-9 7a9 9 0 1 1 18 0 9 9 0 0 1-18 0m14-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-3 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>
         </div>
         <div className="absolute bottom-1/3 right-1/4 w-16 h-16 opacity-20 animate-float" style={{ animationDelay: '2s' }}>
            {/* Placeholder planet */}
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-secondary"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/><path d="M14.173 5.447a8.014 8.014 0 0 0-4.156 4.156C10.68 11.021 11 12.616 11 14c0 1.384-.32 2.979-1.017 4.397a8.01 8.01 0 0 0 4.156-4.156C13.32 12.979 13 11.384 13 10c0-1.384.32-2.979 1.017-4.397z"/></svg>
         </div>

        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-pulse">
            Cosmic Explorer
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 text-foreground/80 max-w-3xl mx-auto">
            All You Need to Know About the Technology Behind Space Exploration
          </p>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-10">
            Dive deep into the missions, spacecraft, and groundbreaking technologies that humanity uses to journey through the cosmos. Explore, learn, and be inspired.
          </p>
          <Link href="/explore">
            <Button size="lg" className="glow-button bg-accent text-accent-foreground hover:bg-accent/90">
              Explore Missions <Rocket className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 [perspective:1000px]"> {/* Added perspective */}
        <FeatureCard
          title="Most Iconic Missions"
          description="Relive the journeys that changed our understanding of the universe."
          icon={<Rocket className="text-primary" />}
          link="/explore?filter=iconic"
          imageSrc="https://i.pinimg.com/736x/fa/08/f6/fa08f6dd252b806c90f1e1e0ad70b2df.jpg"
          imageHint="iconic space mission"
        />
        <FeatureCard
          title="Active Missions"
          description="See the spacecraft currently exploring the vastness of space."
          icon={<Activity className="text-primary" />}
          link="/explore?filter=active"
          imageSrc="https://i.pinimg.com/736x/3b/8a/cd/3b8acd093bfa37695f86d4310bdea275.jpg"
          imageHint="active satellite earth"
        />
        <FeatureCard
          title="Recent Launches"
          description="Stay updated with the latest missions venturing into the final frontier."
          icon={<CalendarClock className="text-primary" />}
          link="/explore?filter=recent"
          imageSrc="https://i.pinimg.com/736x/77/ec/05/77ec0592682432414909d0f1b37a21b3.jpg"
          imageHint="recent rocket launch"
        />
        <FeatureCard
          title="Future Exploration"
          description="Discover the ambitious plans shaping tomorrow's space travel."
          icon={<Telescope className="text-primary" />}
          link="/explore?filter=future"
          imageSrc="https://i.pinimg.com/736x/1a/b6/a3/1ab6a3d432c798dc6a94f02a72ba4893.jpg"
          imageHint="future mars colony"
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
  imageSrc: string; // Added to accept direct image URLs
  imageHint: string;
}

function FeatureCard({ title, description, icon, link, imageSrc, imageHint }: FeatureCardProps) {
  return (
    // Added group class and hover effects for 3D transform
    <Card className={cn(
        "overflow-hidden transition-all duration-300 ease-out",
        "bg-card/80 backdrop-blur-sm border border-border/50",
        "group hover:shadow-xl hover:shadow-primary/30",
        "hover:[transform:rotateX(5deg)_rotateY(-5deg)_scale(1.05)]", // 3D tilt and scale on hover
        "active:[transform:rotateX(2deg)_rotateY(-2deg)_scale(1.02)]" // Slight effect on click
        )}>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="bg-primary/10 p-3 rounded-full transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4 min-h-[3em]">{description}</CardDescription>
        <div className="aspect-video relative mb-4 rounded-md overflow-hidden">
           <Image
             src={imageSrc} // Use the passed imageSrc
             alt={title}
             layout="fill"
             objectFit="cover"
             data-ai-hint={imageHint}
           />
         </div>
        <Link href={link}>
          <Button variant="link" className="p-0 text-accent group-hover:underline">
            Learn More &rarr;
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
