import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, BookOpen, Users, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import './Navigation.css';

const NAV_ITEMS = [
  { label: 'Início', path: '/', icon: Home },
  { label: 'Método V.O.A.R.', path: '/voar', icon: Compass },
  { label: 'Minhas Histórias', path: '/minhas-historias', icon: BookOpen },
  { label: 'Roda de Histórias', path: '/roda-de-historias', icon: Users },
  { label: 'Perfil', path: '/perfil', icon: User }
];

export default function Navigation() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="desktop-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <img src="/image/icone app.png" alt="Logo Coautoria" className="sidebar-logo-img" />
          </div>
          <div className="sidebar-brand-text">
            <span className="brand-title">Coautoria</span>
            <span className="brand-sub">Método V.O.A.R.</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                end={item.path === '/'}
              >
                <Icon size={20} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-row">
            <span className="sidebar-version">Versão 1.0 · Mobile First</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="mobile-bottom-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
              end={item.path === '/'}
            >
              <div className="bottom-nav-icon-wrap">
                <Icon size={20} className="bottom-nav-icon" />
              </div>
              <span className="bottom-nav-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
