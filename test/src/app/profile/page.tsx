
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';

export default function ProfileRedirectPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        // Wait until the auth state is determined
        if (!isLoading) {
            if (user?._id) {
                // If user is logged in, redirect to their dynamic profile page
                router.replace(`/profile/${user._id}`);
            } else {
                // If no user is logged in, redirect to the login page
                router.replace('/login');
            }
        }
    }, [user, isLoading, router]);

    // Show a loading spinner while the redirection is happening
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-15rem)]">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
}
