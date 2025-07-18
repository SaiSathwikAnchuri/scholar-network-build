import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  graduationYear?: number;
  department?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@college.edu',
    name: 'John Admin',
    role: 'admin',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    isOnline: true,
  },
  {
    id: '2',
    email: 'sarah.johnson@gmail.com',
    name: 'Sarah Johnson',
    role: 'alumni',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    graduationYear: 2020,
    currentPosition: 'Senior Software Engineer',
    company: 'Google',
    location: 'San Francisco, CA',
    bio: 'Passionate software engineer with 4+ years of experience in web development.',
    skills: ['React', 'Node.js', 'Python', 'AWS'],
    linkedin: 'https://linkedin.com/in/sarahjohnson',
    department: 'Computer Science',
    degree: 'B.Tech',
    isOnline: true,
  },
  {
    id: '3',
    email: 'mike.student@college.edu',
    name: 'Mike Chen',
    role: 'student',
    profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    graduationYear: 2025,
    department: 'Computer Science',
    degree: 'B.Tech',
    bio: 'Final year student passionate about AI and machine learning.',
    skills: ['Python', 'Machine Learning', 'TensorFlow'],
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      role: userData.role,
      profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
      graduationYear: userData.graduationYear,
      department: userData.department,
      isOnline: true,
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoading,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};