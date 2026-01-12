
'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, UserPlus, Loader2 } from 'lucide-react';

export default function HeroButtons() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader2 className="h-6 w-6 animate-spin text-primary" />;
  }

  if (user) {
    return (
      <>
        <Button asChild size="lg">
          <Link href="/profile">
            View Your Profile <User className="ml-2" />
          </Link>
        </Button>
        <Button asChild variant="link" size="lg">
          <Link href="/explore">
            Browse Missions <span aria-hidden="true">→</span>
          </Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <Button asChild size="lg">
        <Link href="/login">
          Join the Exploration <UserPlus className="ml-2" />
        </Link>
      </Button>
      <Button asChild variant="link" size="lg">
        <Link href="/explore">
          Browse Missions <span aria-hidden="true">→</span>
        </Link>
      </Button>
    </>
  );
}
