"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PanelLeft, PlusCircle, Search, MoreVertical, ArrowUpDown } from "lucide-react"
import { Sidebar } from "@/components/Sidebar";
import { useAppStore } from "@/lib/store";

export default function Dashboard() {
  // Get state and actions from the store
  const {
    searchQuery,
    setSearchQuery,
    isSidebarMinimized,
    setIsSidebarMinimized,
    isMobile,
    setIsMobile,
    toggleSidebar,
    datasources
  } = useAppStore();
  
  useEffect(() => {
    // Check if we're on mobile and set sidebar minimized by default
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSidebarMinimized(window.innerWidth < 768);
    };
    
    // Run on initial load
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile, setIsSidebarMinimized]);
  
  const closeSidebar = () => {
    if (isMobile && !isSidebarMinimized) {
      setIsSidebarMinimized(true);
    }
  };
  
  // Helper functions for styling
  const getTypeColor = (type: string) => {
    switch (type) {
      case "PDF":
        return "bg-red-50 text-[#B42318]";
      case "CSV":
        return "bg-green-50 text-[#067647]";
      case "DOCX":
        return "bg-blue-50 text-[#1D4ED8]";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Uploaded":
      case "Connected":
        return "bg-green-50 text-[#067647]";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  // Table header component to reduce repetition
  const TableHeader = ({ label, sortable = false }: { label: string, sortable?: boolean }) => (
    <th scope="col" className="min-w-[85px] px-2 py-3 text-left text-xs font-normal text-[#18181B]">
      {sortable ? (
        <div className="flex items-center">
          {label}
          <ArrowUpDown size={16} className="ml-1 text-[#667085]" />
        </div>
      ) : (
        label
      )}
    </th>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - only show when not minimized on mobile */}
      <div className={`${isMobile && isSidebarMinimized ? 'hidden' : 'block'} ${isMobile ? 'absolute z-20 h-full' : ''}`}>
        <Sidebar isMinimized={isSidebarMinimized} onToggleMinimize={toggleSidebar} />
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && !isSidebarMinimized && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-10"
          onClick={closeSidebar}
        ></div>
      )}
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-6">
          {/* Header navigation */}
          <div className="flex items-center mb-2">
            <button className="mr-2" onClick={toggleSidebar}>
              <PanelLeft size={16} className="text-[#3F3F46]" />
            </button>
            <div className="h-4 border-r border-[#E4E4E7] mx-2"></div>
            <Link 
              href="/dashboard"
              className="inline-flex items-center"
            >
              <span className="ml-2 text-sm font-normal text-[#18181B]">Datasources</span>
            </Link>
          </div>

          {/* Page title and description */}
          <h1 className="font-sans text-xl pt-2 font-semibold leading-[1.5] text-[#18181B] mt-4 mb-2">Datasources</h1>
          <div className="max-w-xl">
            <p className="text-sm text-[#18181B]">Upload files, connect to databases, or integrate with apps.</p>
          </div>

          {/* Search and filters section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 mt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full max-w-xl">
              {/* Search input */}
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={20} className="text-[#667085]" />
                </div>
                <input
                  type="search"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Filter buttons */}
              <div className="flex space-x-2 w-full sm:w-auto">
                <button className="flex items-center px-3 py-2 border border-dashed border-[#E4E4E7] rounded-md text-sm text-[#18181B] w-1/2 sm:w-auto justify-center sm:justify-start">
                  <PlusCircle size={20} className="mr-2 text-[#667085]" />
                  Type
                </button>
                <button className="flex items-center px-3 py-2 border border-dashed border-[#E4E4E7] rounded-md text-sm text-[#18181B] w-1/2 sm:w-auto justify-center sm:justify-start">
                  <PlusCircle size={20} className="mr-2 text-[#667085]" />
                  Status
                </button>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center space-x-2 justify-between sm:justify-end w-full md:w-auto">
              <button className="px-4 py-2 bg-[#007AFF] text-white rounded-md text-sm flex items-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M10 4.16667V15.8333M4.16667 10H15.8333" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Add Data
              </button>
              <button className="p-2 border border-gray-300 rounded-md">
                <MoreVertical size={20} className="text-[#18181B]" />
              </button>
            </div>
          </div>

          {/* Data table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="w-[47px] pl-4 pr-1 py-3 text-left text-xs font-normal text-[#18181B]">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                    </div>
                  </th>
                  <TableHeader label="Datasource" />
                  <TableHeader label="Type" />
                  <TableHeader label="Status" />
                  <TableHeader label="Created at" sortable />
                  <TableHeader label="Created by" sortable />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {datasources.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="pl-4 pr-1 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <div className="text-sm font-normal text-[#18181B]">{item.name}</div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm text-[#18181B]">
                      {item.createdAt}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-sm text-[#18181B]">
                      {item.createdBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 