'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from 'react-hot-toast';
import { KeyRound, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading('Sending reset code...');

    try {
        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
            toast.success(data.msg || "If an account with that email exists, a reset code has been sent.", { id: loadingToast });

            // Store email in localStorage for the next step and redirect
            localStorage.setItem('emailForPasswordReset', email);
            router.push('/reset-password');

        } else {
             toast.error(data.error || "An unexpected error occurred. Please try again.", { id: loadingToast });
        }
    } catch (error) {
        toast.error("Could not connect to the server. Please check your connection.", { id: loadingToast });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-15rem)]">
      <Card className="w-[400px] bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
        <form onSubmit={handleSendResetLink}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><KeyRound /> Forgot Password</CardTitle>
            <CardDescription>
              Enter your email below to receive a password reset code.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="explorer@nasa.gov"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Send Reset Code'}
            </Button>
            <Button variant="link" asChild className="text-muted-foreground">
                <Link href="/login"><ArrowLeft className="mr-2 h-4 w-4" />Back to Login</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
