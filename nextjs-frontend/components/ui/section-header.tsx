import type { LucideIcon } from "lucide-react"

interface SectionHeaderProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function SectionHeader({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold font-display text-foreground">
          {Icon && <Icon className="h-5 w-5 text-primary" />}
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
