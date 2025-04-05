import { getUserByEmail, addUser } from './excel';

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

export const registerUser = (userData) => {
  if (isEmailRegistered(userData.email)) {
    throw new Error('Email already registered');
  }
  addUser(userData);
  return true;
};