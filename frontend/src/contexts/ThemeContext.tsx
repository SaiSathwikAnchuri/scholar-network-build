import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '@/types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Array<{ value: Theme; label: string; colors: string[] }>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes = [
  {
    value: 'light' as Theme,
    label: 'Light',
    colors: ['#3b82f6', '#f8fafc', '#1e293b']
  },
  {
    value: 'dark' as Theme,
    label: 'Dark',
    colors: ['#60a5fa', '#0f172a', '#e2e8f0']
  },
  {
    value: 'cyberpunk' as Theme,
    label: 'Cyberpunk',
    colors: ['#ff00ff', '#00ffff', '#ffff00']
  },
  {
    value: 'business' as Theme,
    label: 'Business',
    colors: ['#3b82f6', '#1e293b', '#64748b']
  },
  {
    value: 'emerald' as Theme,
    label: 'Emerald',
    colors: ['#10b981', '#f0fdf4', '#064e3b']
  },
  {
    value: 'synthwave' as Theme,
    label: 'Synthwave',
    colors: ['#ff007f', '#00ffff', '#ffff00']
  },
  {
    value: 'forest' as Theme,
    label: 'Forest',
    colors: ['#22c55e', '#f0fdf4', '#14532d']
  },
];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && themes.find(t => t.value === savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};