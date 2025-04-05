import { getUserByEmail } from './excelHandler';

export const authenticateUser = (email, password) => {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
};

export const isEmailRegistered = (email) => {
  return !!getUserByEmail(email);
};