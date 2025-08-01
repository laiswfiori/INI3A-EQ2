import { useEffect } from 'react';

const ThemeManager: React.FC = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  return null; 
};

export default ThemeManager;