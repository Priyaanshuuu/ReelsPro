"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import { useToast } from '@/app/hooks/use-toast';
import { Github} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login successful",
        description: "Welcome back to ReelsPro!",
      });
      router.push('/feed');
    }, 1000);
  };
  
  const handleOAuthLogin = (provider: string) => {
    setIsLoading(true);
    
    // Simulate OAuth login
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: `${provider} login successful`,
        description: "Welcome back to ReelsPro!",
      });
      router.push('/feed');
    }, 1000);
  };
  
   {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-muted">
      {/* Left Side (Image / Illustration / Branding) */}
      <div className="hidden md:flex flex-col items-center justify-center bg-primary text-white p-10">
        <h1 className="text-4xl font-bold mb-4">Welcome Back 👋</h1>
        <p className="text-base text-muted">
          Reconnect with your ReelsPro community. Lets get you logged in.
        </p>
        {/* Optional: Add an illustration here */}
      </div>

      {/* Right Side (Login Form) */}
      <div className="w-full max-w-md mx-auto py-12 px-6 md:px-10 bg-background shadow-md rounded-lg">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Log in to ReelsPro</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Choose your preferred login method
          </p>
        </div>

        <div className="space-y-3">
          <Button
            className="w-full flex items-center justify-center gap-2 h-11"
            onClick={() => handleOAuthLogin("Google")}
            disabled={isLoading}
          >
            {/* Google Icon */}
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <Button
            className="w-full flex items-center justify-center gap-2 h-11"
            onClick={() => handleOAuthLogin("GitHub")}
            disabled={isLoading}
          >
            <Github className="h-4 w-4" />
            Continue with GitHub
          </Button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              or login with email
            </span>
          </div>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
}