"use client";

import { Skeleton } from "@/app/components/ui/skeleton";

export function FeedSkeleton() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="w-full max-w-md aspect-[9/16] relative">
        <Skeleton className="w-full h-full" />
        
        {/* User info skeleton */}
        <div className="absolute bottom-8 left-4 right-12 flex items-center">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="ml-3 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        
        {/* Action buttons skeleton */}
        <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="container max-w-4xl py-8">
      {/* Profile header skeleton */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full" />
        
        <div className="flex-1 space-y-4 w-full">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <Skeleton className="h-7 w-40" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
          </div>
          
          <div className="flex justify-center md:justify-start gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-5 w-10 mx-auto" />
                <Skeleton className="h-4 w-16 mt-1" />
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full max-w-sm" />
            <Skeleton className="h-4 w-3/4 max-w-sm" />
          </div>
        </div>
      </div>
      
      {/* Content tabs skeleton */}
      <Skeleton className="h-10 w-full mb-6" />
      
      <div className="grid grid-cols-3 gap-1 md:gap-2">
        {[...Array(9)].map((_, i) => (
          <Skeleton key={i} className="aspect-[9/16] rounded-md" />
        ))}
      </div>
    </div>
  );
}

export function CommentsSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-3 py-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
            
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            
            <div className="flex items-center gap-4 mt-1">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}