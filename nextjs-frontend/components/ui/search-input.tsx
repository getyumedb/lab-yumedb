"use client"

import { Search } from "lucide-react"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  className?: string
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Buscar...",
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative flex-1 min-w-[200px] max-w-sm ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit?.()}
        onBlur={onSubmit}
        className="w-full pl-10 pr-4 py-2.5 bg-card text-sm text-foreground placeholder:text-muted-foreground rounded-lg border border-border/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
      />
    </div>
  )
}
