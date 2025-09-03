import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { EXTERNAL_LINKS } from '../../constants';

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { username, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  const handleLogout = async () => {
    await logout();
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside mobile menu container
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        // Additional check: don't close if clicking on mobile menu content
        const mobileMenuContent = document.querySelector('.mobile-menu-content');
        if (!mobileMenuContent || !mobileMenuContent.contains(event.target)) {
          setIsMobileMenuOpen(false);
        }
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isMobileMenuOpen || isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isMobileMenuOpen, isUserMenuOpen]);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/notas', label: 'Notas' },
    { path: '/pagos', label: 'Pagos' }
  ];

  return (
    <header className="bg-header-light dark:bg-header-dark sticky top-0 z-40 shadow-sm dark:shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Institution Name */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {/* Placeholder for logo - replace with actual logo */}
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-unsaac-700 text-sm font-bold">U</span>
              </div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold text-white dark:text-neutral-100">
                UNSAAC Posgrado
              </h1>
            </div>
          </div>

          {/* External Links */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href={EXTERNAL_LINKS.CAJA_UNSAAC}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Caja UNSAAC
            </a>
            <a
              href={EXTERNAL_LINKS.TRAMITE_DOCUMENTARIO}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Trámite Documentario
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-unsaac-600 text-white'
                    : 'text-white/80 hover:text-white hover:bg-unsaac-600/50 dark:text-neutral-300 dark:hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle & User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {/* User Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-header-light text-sm font-medium">
                    {username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {username || 'Usuario'}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Desktop Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-card-dark rounded-lg shadow-lg py-2 z-50 border border-neutral-200 dark:border-card-border">
                  <Link
                    to="/perfil"
                    className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-card-hover transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <hr className="my-2 border-neutral-200 dark:border-none" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-card-hover transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: Logo + Menu button */}
          <div className="md:hidden flex items-center space-x-4" ref={mobileMenuRef}>
            {/* Logo in mobile */}
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-header-light text-sm font-bold">U</span>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white/80 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-neutral-300 dark:border-none mt-4 pt-4 mobile-menu-content">
            <div className="space-y-2">
              {/* Theme toggle in mobile */}
              <div className="px-4 py-2 mb-4">
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors"
                >
                  {isDark ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                  <span className="text-sm font-medium">
                    {isDark ? 'Modo Claro' : 'Modo Oscuro'}
                  </span>
                </button>
              </div>
              
              {/* User info in mobile */}
              <div className="flex items-center space-x-3 px-4 py-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-header-light text-sm font-medium">
                    {username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-white dark:text-neutral-100 font-medium">{username || 'Usuario'}</span>
              </div>
              
              {/* Navigation items */}
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-unsaac-600 text-white'
                      : 'text-white/80 hover:text-white hover:bg-unsaac-600/50 dark:text-neutral-300 dark:hover:text-white'
                  }`}
                  onClick={() => {
                    // Small delay to allow navigation to complete before closing menu
                    setTimeout(() => setIsMobileMenuOpen(false), 100);
                  }}
                >
                  {item.label}
                </Link>
              ))}
              
              <hr className="my-2 border-neutral-300 dark:border-none" />
              
              {/* Profile and logout */}
              <Link
                to="/perfil"
                className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-unsaac-600/50 dark:text-neutral-300 dark:hover:text-white transition-colors rounded-lg"
                onClick={() => {
                  setTimeout(() => setIsMobileMenuOpen(false), 100);
                }}
              >
                Mi Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-unsaac-600/50 dark:text-neutral-300 dark:hover:text-white transition-colors rounded-lg"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
