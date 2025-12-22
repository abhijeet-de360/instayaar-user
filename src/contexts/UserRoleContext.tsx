import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'employer' | 'freelancer' | null;

interface UserRoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  userId: string | null;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};

export const UserRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored role in localStorage
    const storedRole = localStorage.getItem('userRole') as UserRole;
    const storedLoginStatus = localStorage.getItem('isLoggedIn') === 'true';
    const storedUserId = localStorage.getItem('userId');
    
    if (storedRole && storedLoginStatus && storedUserId) {
      setUserRole(storedRole);
      setIsLoggedIn(storedLoginStatus);
      setUserId(storedUserId);
    }
  }, []);

  const handleSetUserRole = (role: UserRole) => {
    setUserRole(role);
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  const handleSetIsLoggedIn = (loggedIn: boolean) => {
    setIsLoggedIn(loggedIn);
    localStorage.setItem('isLoggedIn', loggedIn.toString());
    
    if (loggedIn) {
      // Generate a unique user ID if logging in
      if (!userId) {
        const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setUserId(newUserId);
        localStorage.setItem('userId', newUserId);
      }
    } else {
      // Clear user data if logging out
      setUserRole(null);
      setUserId(null);
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
    }
  };

  return (
    <UserRoleContext.Provider value={{
      userRole,
      setUserRole: handleSetUserRole,
      isLoggedIn,
      setIsLoggedIn: handleSetIsLoggedIn,
      userId
    }}>
      {children}
    </UserRoleContext.Provider>
  );
};