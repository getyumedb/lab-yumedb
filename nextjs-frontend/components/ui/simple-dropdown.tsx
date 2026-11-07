"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface SimpleDropdownProps {
  label: string
  options: string[]
  labels?: string[]
  selected: string
  onSelect: (value: string) => void
}

export function SimpleDropdown({
  label,
  options,
  labels,
  selected,
  onSelect,
}: SimpleDropdownProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg border transition-colors ${
          selected && options.includes(selected)
            ? "bg-primary/10 text-primary border-primary/30"
            : "bg-card text-muted-foreground border-border/50 hover:text-foreground hover:border-border"
        }`}
      >
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-50 w-48 bg-card border border-border rounded-xl shadow-xl shadow-background/80 py-1">
            {options.map((opt, i) => (
              <button
                type="button"
                key={opt}
                onClick={() => {
                  onSelect(opt)
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors ${
                  selected === opt
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {selected === opt && (
                  <span className="h-1.5 w-1.5 bg-primary rounded-full shrink-0" />
                )}
                {labels ? labels[i] : opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
