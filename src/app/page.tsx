
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Star, UserPlus } from "lucide-react";
import { SpaceMission } from "@/services/space-missions";
import MissionOfTheDayCard from "@/components/mission-of-the-day-card";
import HeroButtons from "@/components/home/hero-buttons";

async function getMissionOfTheDay(): Promise<SpaceMission | null> {
  try {
    // We need the full URL for server-side fetching
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:9002';
    const response = await fetch(`${baseUrl}/api/v1/missions/motd`, {
      next: { revalidate: 3600 * 6 } // Revalidate every 6 hours
    });

    if (!response.ok) {
      console.error("Failed to fetch Mission of the Day, status:", response.status);
      return null;
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching Mission of the Day:", error);
    return null;
  }
}

export default async function Home() {
  const missionOfTheDay = await getMissionOfTheDay();

  return (
    <div className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 space-y-20">
        
        {/* Main Hero Section */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            A Universe of Discovery Awaits
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Explore the definitive catalog of humanity's greatest adventures into the cosmos.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <HeroButtons />
          </div>
        </div>

        {/* Mission of the Day Section */}
        {missionOfTheDay && (
          <div className="space-y-8">
            <div className="relative text-center before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:bg-border">
              <h2 className="relative inline-block bg-background px-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                <Star className="w-8 h-8 text-primary inline-block mr-2 -mt-2" />
                Mission of the Day
              </h2>
            </div>
            <MissionOfTheDayCard mission={missionOfTheDay} />
          </div>
        )}

      </div>
    </div>
  );
}
