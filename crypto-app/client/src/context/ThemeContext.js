import React, { createContext, useState, useContext, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Yerel depolamadan temayı al veya varsayılan olarak 'dark' kullan
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });

  // Tema değiştiğinde yerel depolamaya kaydet
  useEffect(() => {
    localStorage.setItem('theme', theme);
    // HTML kök elementinin tema özniteliğini güncelle
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Temayı değiştir
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 