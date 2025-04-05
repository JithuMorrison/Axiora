import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Browser-compatible Excel file handling
let usersData = [];
let mouData = [];

// Initialize with sample data if localStorage is empty
const initializeData = () => {
  if (typeof window !== 'undefined') {
    const storedUsers = localStorage.getItem('mouTrackerUsers');
    const storedMOU = localStorage.getItem('mouTrackerMOU');
    
    usersData = storedUsers ? JSON.parse(storedUsers) : [];
    mouData = storedMOU ? JSON.parse(storedMOU) : [];
  }
};

initializeData();

// Simulate file operations using localStorage
export const readExcel = (fileType) => {
  if (fileType === 'users') {
    return usersData;
  } else if (fileType === 'mou') {
    return mouData;
  }
  return [];
};

export const writeExcel = (fileType, data) => {
  if (fileType === 'users') {
    usersData = data;
    localStorage.setItem('mouTrackerUsers', JSON.stringify(data));
  } else if (fileType === 'mou') {
    mouData = data;
    localStorage.setItem('mouTrackerMOU', JSON.stringify(data));
  }
};

export const exportToExcel = (data, fileName) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  saveAs(blob, `${fileName}.xlsx`);
};

// User-related functions
export const getAllUsers = () => {
  return readExcel('users');
};

export const getUserByEmail = (email) => {
  const users = getAllUsers();
  return users.find(user => user.email === email);
};

export const addUser = (user) => {
  const users = getAllUsers();
  users.push(user);
  writeExcel('users', users);
};

// MOU-related functions
export const getAllMOU = () => {
  return readExcel('mou');
};

export const addMOU = (mou) => {
  const allMOU = getAllMOU();
  allMOU.push(mou);
  writeExcel('mou', allMOU);
};

export const filterMOU = (filters) => {
  const allMOU = getAllMOU();
  return allMOU.filter(mou => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return String(mou[key]).toLowerCase().includes(String(value).toLowerCase());
    });
  });
};

// Initialize with sample data if empty (optional)
export const initializeSampleData = () => {
  if (getAllUsers().length === 0) {
    writeExcel('users', [
      { name: 'Admin', email: 'admin@example.com', password: 'admin123' }
    ]);
  }
  
  if (getAllMOU().length === 0) {
    writeExcel('mou', [
      {
        instituteName: 'Sample University',
        startDate: '2023-01-01',
        endDate: '2025-12-31',
        signedBy: 'Dr. Smith',
        facultyDetails: 'Computer Science Department',
        academicYear: '2023-2025',
        purpose: 'Academic collaboration',
        outcomes: 'Student exchange program',
        createdBy: 'admin@example.com',
        createdAt: new Date().toISOString()
      }
    ]);
  }
};