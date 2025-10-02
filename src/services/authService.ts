import { User } from '../types';
import { users } from '../data/mockData';

const STORAGE_KEY = 'attendance_system_user';

export const authService = {
  login: (email: string, password: string): User | null => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
      return userWithoutPassword as User;
    }

    return null;
  },

  logout: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  },
};
