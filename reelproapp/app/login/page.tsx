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
  <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
    <div className="w-full max-w-md bg-[#1a1a1a] p-6 rounded-2xl shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back </h1>
        <p className="text-sm text-gray-400 mt-1">Login to your ReelsPro account</p>
      </div>

      <div className="space-y-3">
       <Button 
            className="w-full flex items-center justify-center gap-2 h-11 bg-gray-800 hover:bg-gray-700 text-white hover:cursor-pointer"
            onClick={() => handleOAuthLogin('google')}
            disabled={isLoading}
          >
            {/* Google SVG */}
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>

       <Button 
            className="w-full flex items-center justify-center gap-2 h-11 bg-gray-800 hover:bg-gray-700 text-white hover:cursor-pointer"
            onClick={() => handleOAuthLogin('github')}
            disabled={isLoading}
          >
            <Github className="h-5 w-5" />
            Continue with GitHub
          </Button>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <Separator className="bg-gray-600" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#1a1a1a] px-2 text-gray-400">or login with email</span>
        </div>
      </div>

      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            required
            disabled={isLoading}
            className="bg-[#272727] text-white border border-gray-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Link href="/auth/forgot-password" className="text-xs text-gray-400 hover:text-white">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            disabled={isLoading}
            className="bg-[#272727] text-white border border-gray-600"
          />
        </div>

        <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Don’t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  </div>
);
  }
}