interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "h-4 w-4 border",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-2",
}

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center py-8">
      <div
        className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin ${className}`}
      />
    </div>
  )
}
