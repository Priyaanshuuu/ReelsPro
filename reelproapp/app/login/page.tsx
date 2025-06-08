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
        <h1 className="text-3xl font-bold tracking-tight text-white">Welcome Back 👋</h1>
        <p className="text-sm text-gray-400 mt-1">Login to your ReelsPro account</p>
      </div>

      <div className="space-y-3">
        <Button
          className="w-full flex items-center justify-center gap-2 h-11 bg-[#272727] hover:bg-[#333] text-white"
          onClick={() => handleOAuthLogin("Google")}
          disabled={isLoading}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path d="..." fill="#4285F4" />
            <path d="..." fill="#34A853" />
            <path d="..." fill="#FBBC05" />
            <path d="..." fill="#EA4335" />
          </svg>
          Continue with Google
        </Button>

        <Button
          className="w-full flex items-center justify-center gap-2 h-11 bg-[#272727] hover:bg-[#333] text-white"
          onClick={() => handleOAuthLogin("GitHub")}
          disabled={isLoading}
        >
          <Github className="h-4 w-4" />
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
        <Link href="/auth/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  </div>
);
  }
}