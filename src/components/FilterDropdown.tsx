"use client";

import { useState, useRef, useEffect } from 'react';
import { Check, X, PlusCircle } from 'lucide-react';

interface FilterDropdownProps<T extends string | null> {
  title: string;
  options: { value: string; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function FilterDropdown<T extends string | null>({ 
  title, 
  options, 
  value, 
  onChange 
}: FilterDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    // If the current value is already selected, clear it (toggle behavior)
    const newValue = value === optionValue ? null : optionValue;
    onChange(newValue as T);
    setIsOpen(false);
  };

  const clearFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null as T);
  };

  const getOptionColor = (optionValue: string) => {
    if (title === "Type") {
      switch (optionValue) {
        case "PDF":
          return "bg-red-50 text-[#B42318]";
        case "CSV":
          return "bg-green-50 text-[#067647]";
        case "DOCX":
          return "bg-blue-50 text-[#1D4ED8]";
        default:
          return "bg-gray-50 text-gray-700";
      }
    } else if (title === "Status") {
      switch (optionValue) {
        case "Uploaded":
        case "Connected":
          return "bg-green-50 text-[#067647]";
        default:
          return "bg-gray-50 text-gray-700";
      }
    }
    return "bg-gray-50 text-gray-700";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`flex items-center px-3 py-2 border ${
          value ? 'border-[#007AFF]' : 'border-dashed border-[#E4E4E7]'
        } rounded-md text-sm text-[#18181B] justify-center sm:justify-start`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value ? (
          <>
            <span className={`px-2 py-0.5 rounded-md mr-2 ${getOptionColor(value)}`}>
              {value}
            </span>
            <X 
              size={16} 
              className="ml-1 text-gray-500 hover:text-gray-700" 
              onClick={clearFilter}
            />
          </>
        ) : (
          <>
            <PlusCircle size={20} className="mr-2 text-[#667085]" />
            {title}
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 z-10 mt-1 w-48 rounded-md bg-white shadow-lg border border-gray-200 max-w-[90vw]">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 ${
                  value === option.value ? 'bg-gray-50' : ''
                }`}
                onClick={() => handleSelect(option.value)}
              >
                <span className={`px-2 py-0.5 rounded-md mr-2 ${getOptionColor(option.value)}`}>
                  {option.label}
                </span>
                {value === option.value && <Check size={16} className="ml-auto text-blue-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 