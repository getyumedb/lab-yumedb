import React from 'react';
import { cn } from '../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div className={cn("animate-pulse bg-zinc-800/50 rounded-lg", className)} {...props} />
  );
};

export function AnimeDetailSkeleton() {
  return (
    <div className="pb-20 max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-32">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <div className="lg:w-1/4 space-y-8">
          <Skeleton className="aspect-[3/4.5] rounded-[2rem]" />
          <div className="space-y-4">
            <Skeleton className="h-14 rounded-2xl" />
            <Skeleton className="h-14 rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
          <Skeleton className="h-48 rounded-[2rem]" />
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4 space-y-16">
          <div className="space-y-6">
            <div className="flex gap-3">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-16 md:h-24 w-3/4 rounded-xl" />
            <Skeleton className="h-8 w-1/2 rounded-xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-white/5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[1, 2].map(i => (
              <div key={i} className="space-y-6">
                <Skeleton className="h-6 w-40" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map(j => (
                    <Skeleton key={j} className="h-16 w-full rounded-2xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-[3/4.5] rounded-3xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}
