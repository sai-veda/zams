"use client";

import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import type { Datasource } from '@/lib/store';

export const AddDataModal = () => {
  const { isAddDataModalOpen, toggleAddDataModal, addDatasource } = useAppStore();
  
  const [name, setName] = useState('');
  const [type, setType] = useState<Datasource['type']>('PDF');
  const [status, setStatus] = useState<Datasource['status']>('Uploaded');
  const [errors, setErrors] = useState<{
    name?: string;
  }>({});
  
  // Dropdown states
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  
  // Refs for dropdown components
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  
  // Handle outside clicks for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setTypeDropdownOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: typeof errors = {};
    if (!name.trim()) {
      newErrors.name = 'Datasource name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Add new datasource
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });

    addDatasource({
      name,
      type,
      status,
      createdAt: formattedDate,
      createdBy: 'John Doe' // Normally would use the current user
    });

    // Reset form
    setName('');
    setType('PDF');
    setStatus('Uploaded');
    setErrors({});
  };
  
  // Color helpers
  const getTypeColor = (selectedType: string) => {
    switch (selectedType) {
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

  const getStatusColor = (selectedStatus: string) => {
    switch (selectedStatus) {
      case "Uploaded":
      case "Connected":
        return "bg-green-50 text-[#067647]";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  if (!isAddDataModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={toggleAddDataModal}
      ></div>
      
      {/* Modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b p-4 sticky top-0 bg-white">
          <h2 className="text-lg font-medium">Add New Datasource</h2>
          <button 
            onClick={toggleAddDataModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Name field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Datasource Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter datasource name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          {/* Type field */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <div className="relative" ref={typeDropdownRef}>
              <button
                type="button"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white flex items-center justify-between"
                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
              >
                <span className={`px-2 py-0.5 rounded-md ${getTypeColor(type)}`}>
                  {type}
                </span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              
              {typeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  {["PDF", "CSV", "DOCX"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => {
                        setType(option as Datasource['type']);
                        setTypeDropdownOpen(false);
                      }}
                    >
                      <span className={`px-2 py-0.5 rounded-md mr-2 ${getTypeColor(option)}`}>
                        {option}
                      </span>
                      {type === option && (
                        <Check size={16} className="ml-auto text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Status field */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="relative" ref={statusDropdownRef}>
              <button
                type="button"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white flex items-center justify-between"
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              >
                <span className={`px-2 py-0.5 rounded-md ${getStatusColor(status)}`}>
                  {status}
                </span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              
              {statusDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  {["Uploaded", "Connected"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => {
                        setStatus(option as Datasource['status']);
                        setStatusDropdownOpen(false);
                      }}
                    >
                      <span className={`px-2 py-0.5 rounded-md mr-2 ${getStatusColor(option)}`}>
                        {option}
                      </span>
                      {status === option && (
                        <Check size={16} className="ml-auto text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={toggleAddDataModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#007AFF] text-white rounded-md text-sm"
            >
              Add Datasource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 