import { Datasource } from './store';

// Mock data for datasources (this should match what's in the main store)
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

// In a real-world application, this would likely pull from a database
// For now, we'll use the same mock data from the client-side store
export async function getStoredDatasources(): Promise<Datasource[]> {
  return mockDatasources;
}

// We can add more server-side store functions here as needed 