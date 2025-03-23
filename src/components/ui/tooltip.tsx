import * as React from "react"

interface TooltipContextValue {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextValue | undefined>(undefined);

export function Tooltip({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = React.useState(false);
  
  return (
    <TooltipContext.Provider value={{ isVisible, setIsVisible }}>
      <div className="relative">
        {children}
      </div>
    </TooltipContext.Provider>
  );
}
Tooltip.displayName = "Tooltip";

export function TooltipTrigger({ asChild = false, children, ...props }: { asChild?: boolean, children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(TooltipContext);
  
  if (!context) {
    throw new Error('TooltipTrigger must be used within a Tooltip');
  }
  
  const { setIsVisible } = context;
  
  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);
  
  const childProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleMouseEnter,
    onBlur: handleMouseLeave,
    ...props
  };
  
  if (asChild) {
    return React.cloneElement(children as React.ReactElement, childProps);
  }
  return <div {...childProps}>{children}</div>;
}
TooltipTrigger.displayName = "TooltipTrigger";

export function TooltipContent({ children, side = "top", ...props }: { children: React.ReactNode, side?: "top" | "right" | "bottom" | "left" } & React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(TooltipContext);
  
  if (!context) {
    throw new Error('TooltipContent must be used within a Tooltip');
  }
  
  if (!context.isVisible) {
    return null;
  }
  
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