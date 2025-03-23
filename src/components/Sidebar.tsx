"use client";

import Link from "next/link";
import Image from "next/image";
import * as React from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Bot, ChevronUp, ChevronDown, Settings, Map } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // Adding a property to fix linter error
  children?: React.ReactNode;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export function Sidebar({ className, isMinimized = false }: SidebarProps) {
  const pathname = usePathname()
  
  // Mock navigation function to prevent 404s
  const handleNavClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // We're just preventing navigation for now
  };
  
  return (
    <div
      className={cn(
        "h-screen border-r bg-sidebar p-4 flex flex-col transition-all duration-300",
        isMinimized ? "w-16" : "w-80",
        className
      )}
    >
      {/* Logo and brand */}
      <Link href="/" className={cn("flex items-center cursor-pointer", isMinimized ? "justify-center" : "space-x-2", "mb-6")}>
        <div className="w-7 h-7 bg-[#007AFF] rounded-md flex items-center justify-center">
          <img 
            src="/logo_dashboard.svg" 
            alt="Zams Logo" 
            width="16" 
            height="16" 
          />
        </div>
        {!isMinimized && (
          <div className="leading-tight">
            <div className="font-medium text-sm text-sidebar-foreground">Zams</div>
            <div className="text-xs text-gray-500">Platform UI</div>
          </div>
        )}
      </Link>
      
      {/* Build a Model button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "flex items-center justify-center text-sm mb-8 rounded-md border border-border shadow-[0px_1px_2px_0px_#0000000D] font-medium text-sidebar-foreground bg-white",
                isMinimized ? "w-10 p-0 h-12 mx-auto" : "w-full h-12"
              )}
            >
              <Plus className="h-4 w-4 text-[#3F3F46]" />
              {!isMinimized && <span className="ml-2">Build a Model</span>}
            </Button>
          </TooltipTrigger>
          {isMinimized && <TooltipContent side="right">Build a Model</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
      
      {/* Navigation */}
      <div className="space-y-3">
        {!isMinimized && <div className="text-xs pl-2 font-medium text-[#3F3F46] mb-3">Pages</div>}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                onClick={handleNavClick}
                className={cn(
                  "py-3 text-sm rounded-md hover:bg-gray-100 cursor-pointer leading-none flex items-center",
                  isMinimized ? "justify-center px-0" : "px-2",
                  pathname === "/models" 
                    ? "bg-gray-100 text-sidebar-foreground font-medium" 
                    : "text-[#3F3F46] font-normal"
                )}
              >
                <Bot size={16} className={cn("text-[#3F3F46]", isMinimized ? "" : "mr-3")} />
                {!isMinimized && "Models"}
              </div>
            </TooltipTrigger>
            {isMinimized && <TooltipContent side="right">Models</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                onClick={handleNavClick}
                className={cn(
                  "py-3 text-sm rounded-md hover:bg-gray-100 cursor-pointer leading-none flex items-center",
                  isMinimized ? "justify-center px-0" : "px-2",
                  "bg-[#F4F4F5] text-[#18181B] font-medium"
                )}
              >
                <Image src="/datasources.svg" alt="Datasources" width={16} height={16} className={cn(isMinimized ? "" : "mr-3", "text-[#3F3F46]")} />
                {!isMinimized && "Datasources"}
              </div>
            </TooltipTrigger>
            {isMinimized && <TooltipContent side="right">Datasources</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                onClick={handleNavClick}
                className={cn(
                  "py-3 text-sm rounded-md hover:bg-gray-100 cursor-pointer leading-none flex items-center",
                  isMinimized ? "justify-center px-0" : "px-2 justify-between",
                  "text-[#3F3F46] font-normal"
                )}
              >
                <div className={cn("flex items-center", isMinimized ? "justify-center" : "")}>
                  <Map size={16} strokeWidth={2} className={cn(isMinimized ? "" : "mr-3", "text-[#3F3F46]")} />
                  {!isMinimized && "Workflows"}
                </div>
                {!isMinimized && (
                  <Badge variant="outline" className="text-xs bg-[#F4F4F5] text-[#18181B] font-semibold border-0 ml-2 px-2 py-0.5 rounded-md">
                    Coming soon
                  </Badge>
                )}
              </div>
            </TooltipTrigger>
            {isMinimized && <TooltipContent side="right">Workflows (Coming soon)</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                onClick={handleNavClick}
                className={cn(
                  "py-3 text-sm rounded-md hover:bg-gray-100 cursor-pointer leading-none flex items-center",
                  isMinimized ? "justify-center px-0" : "px-2",
                  pathname === "/settings" 
                    ? "bg-gray-100 text-sidebar-foreground font-medium" 
                    : "text-[#3F3F46] font-normal"
                )}
              >
                <Settings size={16} className={cn("text-[#3F3F46]", isMinimized ? "" : "mr-3")} />
                {!isMinimized && "Settings"}
              </div>
            </TooltipTrigger>
            {isMinimized && <TooltipContent side="right">Settings</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* User profile and collapse button at bottom */}
      <div className="mt-auto pt-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                "flex items-center",
                isMinimized ? "justify-center" : "justify-between"
              )}>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-md overflow-hidden">
                    <img 
                      src="/john_doe.png" 
                      alt="John Doe" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {!isMinimized && (
                    <div>
                      <div className="text-sm font-medium">John Doe</div>
                      <div className="text-xs text-gray-500">john.doe@zams.com</div>
                    </div>
                  )}
                </div>
                
                {!isMinimized && (
                  <div className="h-8 w-8 flex items-center justify-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            {isMinimized && <TooltipContent side="right">John Doe<br />john.doe@zams.com</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

Sidebar.displayName = "Sidebar"; 