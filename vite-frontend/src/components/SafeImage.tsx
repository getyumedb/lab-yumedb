import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '../lib/utils';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  alt?: string;
  className?: string;
  fallback?: React.ReactNode;
}

export function SafeImage({ src, alt, className, fallback, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={cn("flex items-center justify-center bg-zinc-900 border border-white/5 text-gray-700", className)}>
        {fallback || (
          <div className="flex flex-col items-center gap-2">
            <ImageOff className="w-8 h-8 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-tighter opacity-20">No Image</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
