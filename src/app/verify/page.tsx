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
import { MailCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

function VerifyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken, user } = useAuth(); // Use auth context

  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let userEmail: string | null = null;
    try {
      userEmail = localStorage.getItem('emailForVerification');
    } catch (error) {
      console.warn("Could not read from localStorage", error);
    }

    if (!userEmail) {
      userEmail = searchParams.get('email');
    }

    if (userEmail) {
      setEmail(userEmail);
    } else {
      toast.error("Could not determine which email to verify. Please try signing up again.");
      router.push('/login');
    }
  }, [searchParams, router]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user?.username) {
      router.replace(`/profile/${user.username}`);
    }
  }, [user, router]);


  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading('Verifying...');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        toast.success("Verification Successful! Redirecting...", { id: loadingToast });
        setToken(data.token); // Set token in context
        try {
          localStorage.removeItem('emailForVerification');
        } catch(e) {
          console.warn("could not remove email from localstorage")
        }
        
        // The AuthContext and useEffect will handle fetching the user and redirecting
      } else {
        toast.error(data.msg || "Invalid or expired OTP. Please try again.", { id: loadingToast });
      }
    } catch (error: any) {
      console.error("Verification process failed:", error);
      toast.error(error.message || "Could not connect to the server.", { id: loadingToast });
    } finally {
        setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    const loadingToast = toast.loading('Resending OTP...');
    try {
      const response = await fetch('/api/auth/resend-otp', { // Assuming this endpoint exists
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("A new OTP has been sent to your email address.", { id: loadingToast });
      } else {
        throw new Error(data.msg || "Failed to resend OTP");
      }
    } catch (error: any) {
        toast.error(error.message || "Could not resend OTP. Please try again.", { id: loadingToast });
    }
    setIsResending(false);
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
        <form onSubmit={handleVerify}>
            <CardHeader>
            <CardTitle className="flex items-center gap-2"><MailCheck /> Verify Your Account</CardTitle>
            <CardDescription>
                An OTP has been sent to <span className="font-medium text-foreground">{email}</span>. 
                Please enter it below to complete your registration.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="otp">6-Digit OTP</Label>
                <Input 
                    id="otp" 
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    disabled={isLoading || isResending}
                    pattern="\d{6}"
                    title="Please enter a 6-digit OTP"
                />
            </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" type="submit" disabled={isLoading || isResending}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Verify & Continue'}
                </Button>
                <Button 
                    variant="link" 
                    type="button" 
                    onClick={handleResendOtp}
                    disabled={isLoading || isResending}
                    className="text-muted-foreground"
                >
                    {isResending ? <Loader2 className="animate-spin mr-2" /> : null}
                    Didn't receive the code? Resend OTP
                </Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}


export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[calc(100vh-15rem)]"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <VerifyPageContent />
        </Suspense>
    )
}
