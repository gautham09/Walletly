import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types/types';



// Define the shape of the context value
interface UserContextType {
  user: User | null;
  signIn: (userData: User) => void;
  signOut: () => void;
}

// Create context for user (with default value as null)
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to access user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// UserProvider to wrap the app and provide user data globally
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Function to set user data (login)
  const signIn = (userData: User) => {
    setUser(userData);
  };

  // Function to clear user data (logout)
  const signOut = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};
