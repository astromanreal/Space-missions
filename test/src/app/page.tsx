
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden bg-background/50 rounded-2xl border border-border/50 shadow-lg">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-center lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative flex items-center gap-x-4 rounded-full px-4 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-border/50 hover:ring-border">
              <span className="font-semibold text-primary">Cosmic Explorer</span>
              <span className="h-4 w-px bg-muted-foreground/50" aria-hidden="true" />
              <Link href="/explore" className="flex items-center gap-x-1">
                <span className="absolute inset-0" aria-hidden="true" />
                Browse all missions
                <ArrowRight className="-mr-1 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            A Universe of Discovery Awaits
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            From the pioneering voyages that first touched the void to the cutting-edge telescopes peering into the dawn of time, explore the definitive catalog of humanity's greatest adventures.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/explore">
                Start Your Journey <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="link" size="lg">
              <Link href="/explore-by-type">
                Explore by Type <span aria-hidden="true">→</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
