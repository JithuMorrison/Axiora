import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const DATA_DIR = './data';

// Initialize data directory
if (!window.fs) {
  window.fs = require('fs');
  if (!window.fs.existsSync(DATA_DIR)) {
    window.fs.mkdirSync(DATA_DIR);
  }
}

const getUsersFile = () => `${DATA_DIR}/users.xlsx`;
const getMOUFile = () => `${DATA_DIR}/mou_data.xlsx`;

export const readExcel = (filePath) => {
  if (window.fs.existsSync(filePath)) {
    const buffer = window.fs.readFileSync(filePath);
    return XLSX.read(buffer, { type: 'buffer' });
  }
  return null;
};

export const writeExcel = (filePath, data, sheetName = 'Sheet1') => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
  window.fs.writeFileSync(filePath, buffer);
};

export const exportToExcel = (data, fileName) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${fileName}.xlsx`);
};

export const getAllUsers = () => {
  const wb = readExcel(getUsersFile());
  if (wb) {
    const ws = wb.Sheets[wb.SheetNames[0]];
    return XLSX.utils.sheet_to_json(ws);
  }
  return [];
};

export const getUserByEmail = (email) => {
  const users = getAllUsers();
  return users.find(user => user.email === email);
};

export const addUser = (user) => {
  const users = getAllUsers();
  users.push(user);
  writeExcel(getUsersFile(), users, 'Users');
};

export const getAllMOU = () => {
  const wb = readExcel(getMOUFile());
  if (wb) {
    const ws = wb.Sheets[wb.SheetNames[0]];
    return XLSX.utils.sheet_to_json(ws);
  }
  return [];
};

export const addMOU = (mou) => {
  const allMOU = getAllMOU();
  allMOU.push(mou);
  writeExcel(getMOUFile(), allMOU, 'MOU Data');
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