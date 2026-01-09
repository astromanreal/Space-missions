'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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


function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let userEmail: string | null = null;
    try {
      userEmail = localStorage.getItem('emailForPasswordReset');
    } catch (error) {
      console.warn("Could not read from localStorage", error);
    }
    
    // Fallback for query param if localStorage fails
    if (!userEmail) {
      userEmail = searchParams.get('email');
    }

    if (userEmail) {
      setEmail(userEmail);
    } else {
      toast.error("Could not determine which email to reset. Please start over.");
      router.push('/forgot-password');
    }
  }, [searchParams, router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading('Resetting password...');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.msg || "Your password has been changed. You can now log in.", { id: loadingToast });
        
        // Clean up localStorage
        try {
          localStorage.removeItem('emailForPasswordReset');
        } catch (error) {
          console.warn("Could not remove item from localStorage", error);
        }

        router.push('/login');

      } else {
         toast.error(data.error || "An unexpected error occurred.", { id: loadingToast });
      }

    } catch (error) {
       toast.error("Could not connect to the server. Please check your connection.", { id: loadingToast });
    }

    setIsLoading(false);
  };
  
  if (!email) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-15rem)]">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-15rem)]">
      <Card className="w-[450px]">
        <form onSubmit={handleResetPassword}>
            <CardHeader>
            <CardTitle className="flex items-center gap-2"><KeyRound /> Reset Your Password</CardTitle>
            <CardDescription>
                Enter the OTP sent to <span className="font-medium text-foreground">{email}</span> and set a new password.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="otp">6-Digit OTP</Label>
                <Input 
                    id="otp" 
                    type="text" 
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    disabled={isLoading}
                    pattern="\d{6}"
                    title="Please enter a 6-digit OTP"
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input 
                    id="new-password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
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

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[calc(100vh-15rem)]"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <ResetPasswordContent />
        </Suspense>
    )
}
