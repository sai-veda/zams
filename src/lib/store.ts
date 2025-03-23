import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Define types for our store
export interface Datasource {
  id: number;
  name: string;
  type: "PDF" | "CSV" | "DOCX";
  status: "Uploaded" | "Connected";
  createdAt: string;
  createdBy: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Define filter types
export type FilterType = "PDF" | "CSV" | "DOCX" | null;
export type FilterStatus = "Uploaded" | "Connected" | null;
export type SortField = "createdAt" | "createdBy" | null;
export type SortDirection = "asc" | "desc";

// Define our store state
interface AppState {
  // UI state
  isSidebarMinimized: boolean;
  isMobile: boolean;
  
  // User state
  user: User | null;
  
  // Datasources state
  datasources: Datasource[];
  searchQuery: string;
  typeFilter: FilterType;
  statusFilter: FilterStatus;
  sortField: SortField;
  sortDirection: SortDirection;
  isAddDataModalOpen: boolean;
  
  // Chat state
  messages: ChatMessage[];
  streamingResponse: string;
  isLoading: boolean;
  
  // Actions
  setIsSidebarMinimized: (value: boolean) => void;
  toggleSidebar: () => void;
  setIsMobile: (value: boolean) => void;
  setSearchQuery: (query: string) => void;
  setTypeFilter: (type: FilterType) => void;
  setStatusFilter: (status: FilterStatus) => void;
  setSortField: (field: SortField) => void;
  setSortDirection: (direction: SortDirection) => void;
  toggleSortDirection: () => void;
  addDatasource: (datasource: Omit<Datasource, 'id'>) => void;
  toggleAddDataModal: () => void;
  setUser: (user: User | null) => void;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setStreamingResponse: (response: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

// Mock data for datasources
const mockDatasources: Datasource[] = [
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

// Sample user data
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@zams.com',
  avatar: '/john_doe.png'
};

// Create the store with zustand
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      isSidebarMinimized: false,
      isMobile: false,
      user: mockUser,
      datasources: mockDatasources,
      searchQuery: '',
      typeFilter: null,
      statusFilter: null,
      sortField: null,
      sortDirection: "asc",
      isAddDataModalOpen: false,
      messages: [],
      streamingResponse: '',
      isLoading: false,
      
      // Actions
      setIsSidebarMinimized: (value) => set({ isSidebarMinimized: value }),
      toggleSidebar: () => set((state) => ({ isSidebarMinimized: !state.isSidebarMinimized })),
      setIsMobile: (value) => set({ isMobile: value }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setTypeFilter: (type) => set({ typeFilter: type }),
      setStatusFilter: (status) => set({ statusFilter: status }),
      setSortField: (field) => set({ sortField: field }),
      setSortDirection: (direction) => set({ sortDirection: direction }),
      toggleSortDirection: () => set((state) => ({ 
        sortDirection: state.sortDirection === "asc" ? "desc" : "asc" 
      })),
      addDatasource: (datasource) => set((state) => {
        const newId = Math.max(...state.datasources.map(d => d.id), 0) + 1;
        return { 
          datasources: [
            { id: newId, ...datasource }, 
            ...state.datasources
          ],
          isAddDataModalOpen: false
        };
      }),
      toggleAddDataModal: () => set((state) => ({ 
        isAddDataModalOpen: !state.isAddDataModalOpen 
      })),
      setUser: (user) => set({ user }),
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      setMessages: (messages) => set({ messages }),
      setStreamingResponse: (response) => set({ streamingResponse: response }),
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'zams-storage', // unique name for localStorage
      // Only persist certain parts of the state
      partialize: (state) => ({
        user: state.user,
        messages: state.messages,
      }),
    }
  )
); 