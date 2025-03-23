"use client";

import { useState } from 'react';
import { X } from 'lucide-react';
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

  if (!isAddDataModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={toggleAddDataModal}
      ></div>
      
      {/* Modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10">
        <div className="flex items-center justify-between border-b p-4">
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
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as Datasource['type'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="PDF">PDF</option>
              <option value="CSV">CSV</option>
              <option value="DOCX">DOCX</option>
            </select>
          </div>
          
          {/* Status field */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Datasource['status'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="Uploaded">Uploaded</option>
              <option value="Connected">Connected</option>
            </select>
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