import * as React from "react"

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <div className="relative">{children}</div>
}
Tooltip.displayName = "Tooltip";

export function TooltipTrigger({ asChild = false, children, ...props }: { asChild?: boolean, children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  if (asChild) {
    return React.cloneElement(children as React.ReactElement, props);
  }
  return <div {...props}>{children}</div>;
}
TooltipTrigger.displayName = "TooltipTrigger";

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
TooltipContent.displayName = "TooltipContent";

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
TooltipProvider.displayName = "TooltipProvider"; 