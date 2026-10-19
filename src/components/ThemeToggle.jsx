import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`theme-slide-toggle ${isDark ? 'dark' : 'light'}`}
      onClick={toggleTheme}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={isDark ? 'Modo Claro' : 'Modo Escuro'}
    >
      <span className="theme-slide-track">
        <span className="track-icon sun-icon" aria-hidden="true">
          <Sun size={13} strokeWidth={2.4} />
        </span>
        <span className="track-icon moon-icon" aria-hidden="true">
          <Moon size={13} strokeWidth={2.4} />
        </span>
        <span className="theme-slide-thumb" aria-hidden="true">
          {isDark ? (
            <Moon size={12} strokeWidth={2.6} className="thumb-icon moon" />
          ) : (
            <Sun size={12} strokeWidth={2.6} className="thumb-icon sun" />
          )}
        </span>
      </span>
    </button>
  );
}
