import * as React from "react"

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <div className="relative">{children}</div>
}

export function TooltipTrigger({ asChild, children, ...props }: { asChild?: boolean, children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>
}

export function TooltipContent({ children, side = "top", ...props }: { children: React.ReactNode, side?: "top" | "right" | "bottom" | "left" } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="absolute z-50 px-3 py-1.5 text-xs bg-black text-white rounded-md shadow-md" style={{ 
      [side === "top" ? "bottom" : side === "bottom" ? "top" : side === "left" ? "right" : "left"]: "100%",
      [side === "top" || side === "bottom" ? "left" : "top"]: "50%",
      transform: side === "top" || side === "bottom" ? "translateX(-50%)" : "translateY(-50%)"
    }} {...props}>
      {children}
    </div>
  )
}

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
} 