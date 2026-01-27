
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Star, Compass, Rss } from "lucide-react";
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

        {/* Features Section */}
        <div className="py-12 sm:py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-primary">Discover More</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Everything about space exploration
                    </p>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        Dive into our comprehensive mission database or catch up on the latest updates from the community.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                        {/* Feature 1: Explore */}
                        <div className="flex flex-col rounded-lg bg-card/50 p-8 ring-1 ring-inset ring-border/50">
                            <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                                <Compass className="h-5 w-5 flex-none text-primary" />
                                Comprehensive Mission Catalog
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                                <p className="flex-auto">
                                    Search, filter, and sort through a vast collection of past, present, and future space missions. From the Apollo program to upcoming Artemis launches, find detailed information on every journey.
                                </p>
                                <p className="mt-6">
                                    <Button asChild variant="secondary">
                                        <Link href="/explore">
                                            Explore All Missions <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </p>
                            </dd>
                        </div>
                        {/* Feature 2: Feed */}
                        <div className="flex flex-col rounded-lg bg-card/50 p-8 ring-1 ring-inset ring-border/50">
                            <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                                <Rss className="h-5 w-5 flex-none text-primary" />
                                Live Community Feed
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                                <p className="flex-auto">
                                    Get the latest updates and discoveries from missions across the cosmos, contributed by a passionate community of space enthusiasts. Like, comment, and join the discussion.
                                </p>
                                <p className="mt-6">
                                    <Button asChild variant="secondary">
                                        <Link href="/feed">
                                            Go to the Feed <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </p>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
