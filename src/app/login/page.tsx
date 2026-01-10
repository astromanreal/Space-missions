
'use client';

import { useState, useEffect } from "react";
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
import { Rocket, Loader2, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

type FormState = 'login' | 'create';

export default function LoginPage() {
  const [formState, setFormState] = useState<FormState>('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createConfirmPassword, setCreateConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, user } = useAuth(); // Use the auth context

  // Redirect if user is already logged in, handled by AuthProvider now


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading('Logging in...');

    try {
      await login(loginEmail, loginPassword);
      toast.success('Login successful! Redirecting...', { id: loadingToast });
      // The auth context's useEffect will now handle redirecting to the profile page
    } catch (error: any) {
      toast.error(error.message || "Invalid email or password.", { id: loadingToast });
    } finally {
        setIsLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createPassword !== createConfirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    const loadingToast = toast.loading('Creating account...');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: createEmail,
          password: createPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.msg || "OTP sent to email. Welcome aboard!", { id: loadingToast });
        
        try {
          localStorage.setItem('emailForVerification', createEmail);
          router.push('/verify');
        } catch (error) {
          console.error("Could not write to localStorage", error);
          // Fallback to query param if localStorage fails
          router.push(`/verify?email=${encodeURIComponent(createEmail)}`);
        }
      } else {
         toast.error(data.msg || "An unexpected error occurred.", { id: loadingToast });
      }
    } catch (error: any) {
      console.error("Registration request failed:", error);
      toast.error("Could not connect to the server. Please try again.", { id: loadingToast });
    }

    setIsLoading(false);
  };


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-15rem)]">
        <Card className="w-[400px] bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
          {formState === 'create' ? (
            <form onSubmit={handleCreateAccount}>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Rocket className="text-primary" /> Join the Exploration
                </CardTitle>
                <CardDescription>
                  Create an account to save your favorite missions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="new-email">Email</Label>
                  <Input 
                    id="new-email" 
                    type="email" 
                    placeholder="new-explorer@isro.gov"
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Password</Label>
                  <Input 
                    id="new-password" 
                    type="password"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password"
                    value={createConfirmPassword}
                    onChange={(e) => setCreateConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                </Button>
                <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Button variant="link" className="p-0 h-auto" type="button" onClick={() => setFormState('login')}>
                        Login
                    </Button>
                </p>
              </CardFooter>
            </form>
          ) : (
             <form onSubmit={handleLogin}>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <LogIn className="text-primary" /> Welcome Back
                </CardTitle>
                <CardDescription>
                  Sign in to your Cosmic Explorer account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="explorer@nasa.gov"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="password">Password</Label>
                        <Button variant="link" asChild className="p-0 h-auto text-xs">
                            <Link href="/forgot-password">Forgot Password?</Link>
                        </Button>
                    </div>
                  <Input 
                    id="password" 
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
                </Button>
                 <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Button variant="link" className="p-0 h-auto" type="button" onClick={() => setFormState('create')}>
                        Create one
                    </Button>
                </p>
              </CardFooter>
            </form>
          )}
        </Card>
    </div>
  );
}
