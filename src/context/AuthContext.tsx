import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface User {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (userData: { user: User }) => void; 
  register: (userData: { user: User }) => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
  
      if (!parsedUser.token) {
        console.error("Token is missing in stored user:", parsedUser);
      }
  
      setUser(parsedUser);
    }
  }, []);
  

  const login = (userData: { user: User }) => {
    if (!userData.user || !userData.user.token) {
      console.error("🚨 User data is missing or invalid!", userData);
      return;
    }
  
    console.log("✅ User data received:", userData);
  
    localStorage.setItem("user", JSON.stringify(userData.user));
    localStorage.setItem("token", userData.user.token);
    setUser(userData.user);
  };
  const register = (userData: { user: User }) => {
    if (!userData.user || !userData.user.token) {
      console.error("🚨 User data is missing or invalid!", userData);
      return;
    }
  
    console.log("✅ User data received:", userData);
  
    localStorage.setItem("user", JSON.stringify(userData.user));
    localStorage.setItem("token", userData.user.token);
    setUser(userData.user);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user,setUser, login,register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
