import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export type UserRole = "admin" | "alumni" | "student";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  graduationYear?: number;
  department?: string;
  // ...add other fields as needed from your backend
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  graduationYear?: number;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(false);

  // Attach/remove JWT in axios on token change
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchMe();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    }
    // eslint-disable-next-line
  }, [token]);

  // Call backend to verify and fetch current user
  const fetchMe = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`${API}/api/users/me`);
      setUser(res.data);
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password });
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setIsLoading(false);
      return true;
    } catch {
      setIsLoading(false);
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      return false;
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      await axios.post(`${API}/api/auth/register`, userData);
      setIsLoading(false);
      // Optional: auto-login after register:
      // await login(userData.email, userData.password);
      return true;
    } catch {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // PATCH user profile with backend
  const updateUser = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      const res = await axios.put(`${API}/api/users/me`, userData);
      setUser(res.data);
      setIsLoading(false);
      return true;
    } catch {
      setIsLoading(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export default AuthContext;