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
import { useAppStore } from "@/lib/store"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isMinimized: boolean;
  badge?: string;
}

// Navigation item component to reduce repetition
const NavItem = ({ icon, label, isActive, isMinimized, badge }: NavItemProps) => {
  // Mock navigation function to prevent 404s
  const handleNavClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            onClick={handleNavClick}
            className={cn(
              "py-3 text-sm rounded-md hover:bg-gray-100 cursor-pointer leading-none flex items-center",
              isMinimized ? "justify-center px-0" : "px-2",
              isActive 
                ? "bg-gray-100 text-sidebar-foreground font-medium" 
                : "text-[#3F3F46] font-normal",
              badge && !isMinimized ? "justify-between" : ""
            )}
          >
            <div className={cn("flex items-center", isMinimized ? "justify-center" : "")}>
              {icon}
              {!isMinimized && label}
            </div>
            
            {!isMinimized && badge && (
              <Badge variant="outline" className="text-xs bg-[#F4F4F5] text-[#18181B] font-semibold border-0 ml-2 px-2 py-0.5 rounded-md">
                {badge}
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        {isMinimized && (
          <TooltipContent side="right">
            {label}
            {badge && ` (${badge})`}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { isSidebarMinimized, toggleSidebar, user } = useAppStore();
  
  return (
    <div
      className={cn(
        "h-screen border-r bg-sidebar p-4 flex flex-col transition-all duration-300",
        isSidebarMinimized ? "w-16" : "w-80",
        className
      )}
    >
      {/* Logo and brand */}
      <Link href="/" className={cn("flex items-center cursor-pointer", isSidebarMinimized ? "justify-center" : "space-x-2", "mb-6")}>
        <div className="w-7 h-7 bg-[#007AFF] rounded-md flex items-center justify-center">
          <Image 
            src="/logo_dashboard.svg" 
            alt="Zams Logo" 
            width={16} 
            height={16} 
          />
        </div>
        {!isSidebarMinimized && (
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
                isSidebarMinimized ? "w-10 p-0 h-12 mx-auto" : "w-full h-12"
              )}
            >
              <Plus className="h-4 w-4 text-[#3F3F46]" />
              {!isSidebarMinimized && <span className="ml-2">Build a Model</span>}
            </Button>
          </TooltipTrigger>
          {isSidebarMinimized && <TooltipContent side="right">Build a Model</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
      
      {/* Navigation */}
      <div className="space-y-3">
        {!isSidebarMinimized && <div className="text-xs pl-2 font-medium text-[#3F3F46] mb-3">Pages</div>}
        
        {/* Models nav item */}
        <NavItem 
          icon={<Bot size={16} className={cn("text-[#3F3F46]", isSidebarMinimized ? "" : "mr-3")} />}
          label="Models"
          isActive={pathname === "/models"}
          isMinimized={isSidebarMinimized}
        />
        
        {/* Datasources nav item */}
        <NavItem 
          icon={<Image src="/datasources.svg" alt="Datasources" width={16} height={16} className={cn(isSidebarMinimized ? "" : "mr-3", "text-[#3F3F46]")} />}
          label="Datasources"
          isActive={true}
          isMinimized={isSidebarMinimized}
        />
        
        {/* Workflows nav item */}
        <NavItem 
          icon={<Map size={16} strokeWidth={2} className={cn(isSidebarMinimized ? "" : "mr-3", "text-[#3F3F46]")} />}
          label="Workflows"
          isMinimized={isSidebarMinimized}
          badge="Coming soon"
        />
        
        {/* Settings nav item */}
        <NavItem 
          icon={<Settings size={16} className={cn("text-[#3F3F46]", isSidebarMinimized ? "" : "mr-3")} />}
          label="Settings"
          isActive={pathname === "/settings"}
          isMinimized={isSidebarMinimized}
        />
      </div>
      
      {/* User profile and collapse button at bottom */}
      <div className="mt-auto pt-4 flex flex-col gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn(
                "flex items-center",
                isSidebarMinimized ? "justify-center" : "justify-between"
              )}>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-md overflow-hidden">
                    <Image 
                      src={user?.avatar || "/john_doe.png"}
                      alt={user?.name || "User"} 
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {!isSidebarMinimized && user && (
                    <div>
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  )}
                </div>
                
                {!isSidebarMinimized && (
                  <div 
                    className="h-8 w-8 flex items-center justify-center text-muted-foreground cursor-pointer"
                    onClick={toggleSidebar}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ChevronUp className="h-3 w-3" />
                      <ChevronDown className="h-3 w-3 -mt-1" />
                    </div>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            {isSidebarMinimized && user && (
              <TooltipContent side="right">
                {user.name}<br />{user.email}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        
  
      </div>
    </div>
  )
}

Sidebar.displayName = "Sidebar"; 