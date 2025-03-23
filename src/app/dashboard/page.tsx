"use client";

import { useState } from "react";
import Link from "next/link";
import { PanelLeft } from "lucide-react"
import { Sidebar } from "@/components/Sidebar";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };
  
  // Mock data based on the screenshot
  const datasources = [
    { id: 1, name: "website - data", type: "PDF", status: "Uploaded", createdAt: "Jan 6 2024", createdBy: "Olivia Ryhe" },
    { id: 2, name: "website - data", type: "PDF", status: "Uploaded", createdAt: "Jan 28 2024", createdBy: "Natalie Crag" },
    { id: 3, name: "Products", type: "CSV", status: "Uploaded", createdAt: "Feb 4 2024", createdBy: "Phoenix Baker" },
    { id: 4, name: "user - data", type: "CSV", status: "Connected", createdAt: "Feb 8 2024", createdBy: "Natalie Crag" },
    { id: 5, name: "website - data", type: "DOCX", status: "Uploaded", createdAt: "March 7 2024", createdBy: "Olivia Ryhe" },
    { id: 6, name: "website - data", type: "CSV", status: "Uploaded", createdAt: "March 7 2024", createdBy: "Phoenix Baker" },
    { id: 7, name: "Server Files", type: "DOCX", status: "Uploaded", createdAt: "March 21 2024", createdBy: "Natalie Crag" },
    { id: 8, name: "website - data", type: "CSV", status: "Uploaded", createdAt: "March 28 2024", createdBy: "Olivia Ryhe" },
    { id: 9, name: "user - data", type: "PDF", status: "Connected", createdAt: "June 9 2024", createdBy: "Natalie Crag" },
    { id: 10, name: "user - data", type: "DOCX", status: "Connected", createdAt: "June 29 2024", createdBy: "Olivia Ryhe" },
    { id: 11, name: "user - data", type: "DOCX", status: "Connected", createdAt: "July 2 2024", createdBy: "Phoenix Baker" },
    { id: 12, name: "user - data", type: "DOCX", status: "Uploaded", createdAt: "Aug 1 2024", createdBy: "Natalie Crag" },
    { id: 13, name: "website - data", type: "PDF", status: "Uploaded", createdAt: "Sept 21 2024", createdBy: "Olivia Ryhe" },
    { id: 14, name: "Server Files", type: "CSV", status: "Connected", createdAt: "Sept 21 2024", createdBy: "Natalie Crag" },
    { id: 15, name: "website - data", type: "PDF", status: "Uploaded", createdAt: "Sept 21 2024", createdBy: "Olivia Ryhe" },
    { id: 16, name: "Server Files", type: "CSV", status: "Connected", createdAt: "Sept 21 2024", createdBy: "Natalie Crag" },
  ];

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
        return "bg-green-50 text-[#067647]";
      case "Connected":
        return "bg-green-50 text-[#067647]";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isMinimized={isSidebarMinimized} onToggleMinimize={toggleSidebar} />
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-6">
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

          <h1 className="font-sans text-xl pt-2 font-semibold leading-[1.5] text-[#18181B] mt-4 mb-2">Datasources</h1>
          <div>
            <p className="text-sm text-[#18181B]">Upload files, connect to databases, or integrate with apps.</p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 mt-6">
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 justify-end w-full md:w-auto">
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-[#18181B]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M5 10H15M2.5 5H17.5M7.5 15H12.5" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Type
              </button>
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-[#18181B]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <circle cx="10" cy="10" r="7.5" stroke="#667085" strokeWidth="1.66667"/>
                  <path d="M10 6.66667V10.8333" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round"/>
                  <circle cx="10" cy="13.3333" r="0.833333" fill="#667085"/>
                </svg>
                Status
              </button>
              <button className="px-4 py-2 bg-[#007AFF] text-white rounded-md text-sm flex items-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M10 4.16667V15.8333M4.16667 10H15.8333" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Add Data
              </button>
              <button className="p-2 border border-gray-300 rounded-md">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 6V6.01M10 10V10.01M10 14V14.01" stroke="#667085" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead >
                <tr>
                  <th scope="col" className="w-[47px] px-2 py-3 text-left text-xs font-normal text-[#18181B]">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                    </div>
                  </th>
                  <th scope="col" className="min-w-[85px] px-2 py-3 text-left text-xs font-normal text-[#18181B]">
                    Datasource
                  </th>
                  <th scope="col" className="min-w-[85px] px-2 py-3 text-left text-xs font-normal text-[#18181B]">
                    Type
                  </th>
                  <th scope="col" className="min-w-[85px] px-2 py-3 text-left text-xs font-normal text-[#18181B]">
                    Status
                  </th>
                  <th scope="col" className="min-w-[85px] px-2 py-3 text-left text-xs font-normal text-[#18181B]">
                    <div className="flex items-center">
                      Created at
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                        <path d="M8 3.33333V12.6667M8 3.33333L12 7.33333M8 3.33333L4 7.33333" stroke="#667085" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </th>
                  <th scope="col" className="min-w-[85px] px-2 py-3 text-left text-xs font-normal text-[#18181B]">
                    <div className="flex items-center">
                      Created by
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                        <path d="M8 3.33333V12.6667M8 3.33333L12 7.33333M8 3.33333L4 7.33333" stroke="#667085" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {datasources.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-2 py-4 whitespace-nowrap">
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