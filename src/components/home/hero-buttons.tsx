
'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, Compass, Rss } from 'lucide-react';

export default function HeroButtons() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin text-primary" />;
  }

  return (
    <>
      <Button asChild size="lg">
        <Link href="/explore">
          Explore Missions <Compass className="ml-2" />
        </Link>
      </Button>
      <Button asChild variant="outline" size="lg">
        <Link href="/feed">
          View Mission Feed <Rss className="ml-2" />
        </Link>
      </Button>
    </>
  );
}
