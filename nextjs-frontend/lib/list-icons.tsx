import {
  Star,
  Heart,
  Trophy,
  Repeat,
  Bookmark,
  Flame,
  Gift,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  star: Star,
  heart: Heart,
  trophy: Trophy,
  repeat: Repeat,
  bookmark: Bookmark,
  flame: Flame,
  gift: Gift,
  sparkles: Sparkles,
}

export function getListIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || Star
}

export function ListIcon({
  iconName,
  color,
  className = "h-3.5 w-3.5",
}: {
  iconName: string
  color?: string
  className?: string
}) {
  const Icon = getListIcon(iconName)
  return <Icon className={className} style={color ? { color } : undefined} />
}
