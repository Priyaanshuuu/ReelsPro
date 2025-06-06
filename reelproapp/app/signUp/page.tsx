"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import { useToast } from '@/app/hooks/use-toast';
import { Github } from 'lucide-react';
//import { log } from 'console';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [form , setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
   try {
    const res = await fetch("api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if(res.ok){
      toast({
        title:"Account Created!!",
        description:"Welcome to Reels Pro"
      })
      console.log(data);
      
      router.push('/feed');
    }else{
      toast({
        title: "Error",
        description: data?.error || "Failed to create account",
      });
      console.log(data.error);
    }
   
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to create account",
    });
    console.log(error);
    
  } finally {
    setIsLoading(false);
  }
};

  const handleOAuthSignup = (provider: string) => {
    setIsLoading(true);
    
    // Simulate OAuth signup
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: `${provider} signup successful`,
        description: "Welcome to ReelsPro!",
      });
      router.push('/feed');
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              ReelsPro
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="text-sm text-gray-400 mt-1">
            Join ReelsPro and start sharing your videos
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <Button 
            className="w-full flex items-center justify-center gap-2 h-11 bg-gray-800 hover:bg-gray-700 text-white hover:cursor-pointer"
            onClick={() => handleOAuthSignup('Google')}
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
            onClick={() => handleOAuthSignup('GitHub')}
            disabled={isLoading}
          >
            <Github className="h-5 w-5" />
            Continue with GitHub
          </Button>
        </div>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator className="border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-gray-400">
              Or continue with
            </span>
          </div>
        </div>
        
        <form onSubmit={handleSignupSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-gray-300">Full Name</Label>
            <Input 
              id="name" 
              placeholder="Enter your name"
              required
              disabled={isLoading}
              onChange={(e) => setForm({...form, name: e.target.value})}
              className="bg-gray-900 text-white border-gray-700 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="username" className="text-gray-300">Username</Label>
            <Input 
              id="username" 
              placeholder="Choose a username"
              required
              disabled={isLoading}
              onChange={(e) => setForm({...form, username: e.target.value})}
              className="bg-gray-900 text-white border-gray-700 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com"
              required
              disabled={isLoading}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="bg-gray-900 text-white border-gray-700 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Create a password"
              required
              disabled={isLoading}
              onChange={(e) => setForm({...form, password: e.target.value})}
              className="bg-gray-900 text-white border-gray-700 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-11 bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
          
          <p className="text-xs text-gray-400 text-center mt-2">
            By signing up, you agree to our{" "}
            <Link href="#" className="text-blue-400 hover:underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="#" className="text-blue-400 hover:underline">Privacy Policy</Link>.
          </p>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
