import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { userService } from "../../services/user";
import { EXTERNAL_LINKS } from "../../constants";
import logoHW from "../../assets/images/logo-HW.png";
import logoHB from "../../assets/images/logo-HB.png";
import userBlackIcon from "../../assets/fonts/user-black.svg";
import userWhiteIcon from "../../assets/fonts/user-white.svg";

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConsultasMenuOpen, setIsConsultasMenuOpen] = useState(false);
  const [studentCode, setStudentCode] = useState("");
  const { username, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const consultasMenuRef = useRef(null);

  const handleLogout = async () => {
    await logout();
  };

  // Fetch student code from academic info
  useEffect(() => {
    const fetchStudentCode = async () => {
      try {
        const response = await userService.getAcademicInfo();
        if (response.success && response.data?.alumno) {
          setStudentCode(response.data.alumno);
        }
      } catch (error) {
        console.error("Error fetching student code:", error);
      }
    };
    fetchStudentCode();
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside mobile menu container
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        // Additional check: don't close if clicking on mobile menu content
        const mobileMenuContent = document.querySelector(".mobile-menu-content");
        if (!mobileMenuContent || !mobileMenuContent.contains(event.target)) {
          setIsMobileMenuOpen(false);
        }
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (consultasMenuRef.current && !consultasMenuRef.current.contains(event.target)) {
        setIsConsultasMenuOpen(false);
      }
    };

    if (isMobileMenuOpen || isUserMenuOpen || isConsultasMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isMobileMenuOpen, isUserMenuOpen, isConsultasMenuOpen]);

  const isActive = (path) => location.pathname === path;

  const consultasItems = [
    { path: "/notas", label: "Notas" },
    { path: "/pagos", label: "Pagos" },
  ];

  return (
    <header className="bg-white  dark:bg-neutral-900 sticky top-0 z-40 border-b-2 border-blue-500 dark:border-amber-500 shadow-lg shadow-blue-400/20 dark:shadow-yellow-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Link to="/dashboard" className="block">
                <img
                  src={isDark ? logoHB : logoHW}
                  alt="Logo"
                  className="max-h-10 sm:max-h-14 w-auto hover:opacity-80 transition-opacity cursor-pointer"
                />
              </Link>
            </div>

            {/* Consultas Dropdown */}
            <div className="hidden md:block relative" ref={consultasMenuRef}>
              <button
                onClick={() => setIsConsultasMenuOpen(!isConsultasMenuOpen)}
                className="flex items-center space-x-1 text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white transition-colors border border-blue-400/20 dark:border-yellow-400/20 px-3 py-2 rounded-lg hover:bg-blue-500/10 dark:hover:bg-amber-500/10"
              >
                <span className="text-sm font-medium">Consultas</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isConsultasMenuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Consultas Dropdown Menu */}
              {isConsultasMenuOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-blue-400/20 dark:border-yellow-400/20">
                  {consultasItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        isActive(item.path)
                          ? "bg-blue-500 dark:bg-amber-500 text-white dark:text-black font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-blue-500/10 dark:hover:bg-amber-500/10 hover:text-blue-600 dark:hover:text-yellow-400"
                      }`}
                      onClick={() => setIsConsultasMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side: External Links, Theme Toggle & User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* External Links */}
            <a
              href={EXTERNAL_LINKS.CAJA_UNSAAC}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-yellow-400 text-sm font-medium transition-colors"
            >
              Caja UNSAAC
            </a>
            <a
              href={EXTERNAL_LINKS.TRAMITE_DOCUMENTARIO}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-yellow-400 text-sm font-medium transition-colors"
            >
              Trámite Documentario
            </a>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-yellow-400 hover:bg-blue-500/10 dark:hover:bg-amber-500/10 transition-colors"
              title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-yellow-400 transition-colors bg-blue-500/10 dark:bg-amber-500/10 px-3 rounded-lg border border-blue-400/20 dark:border-yellow-400/20"
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  <img src={isDark ? userWhiteIcon : userBlackIcon} alt="User" className="w-10 h-10" />
                </div>
                <span className="text-sm font-medium">{studentCode || "Cargando..."}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Desktop Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-blue-400/20 dark:border-yellow-400/20">
                  <Link
                    to="/perfil"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-500/10 dark:hover:bg-amber-500/10 hover:text-blue-600 dark:hover:text-yellow-400 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <hr className="my-2 border-gray-200 dark:border-gray-600" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-500/10 dark:hover:bg-amber-500/10 hover:text-blue-600 dark:hover:text-yellow-400 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: Logo + Menu button */}
          <div className="md:hidden flex items-center space-x-4" ref={mobileMenuRef}>
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-amber-500"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-blue-400/20 dark:border-yellow-400/20 mt-4 pt-4 mobile-menu-content">
            <div className="space-y-2">
              {/* Theme toggle in mobile */}
              <div className="px-4 py-2 mb-4">
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-3 text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-yellow-400 transition-colors"
                >
                  {isDark ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                  <span className="text-sm font-medium">{isDark ? "Modo Claro" : "Modo Oscuro"}</span>
                </button>
              </div>

              {/* Profile */}
              <div className="px-4 py-2 mb-2">
                <Link
                  to="/perfil"
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive("/perfil")
                      ? "bg-blue-500 dark:bg-amber-500 text-white dark:text-black"
                      : "text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-yellow-400 hover:bg-blue-500/10 dark:hover:bg-amber-500/10"
                  }`}
                  onClick={() => {
                    setTimeout(() => setIsMobileMenuOpen(false), 100);
                  }}
                >
                  <img src={isDark ? userWhiteIcon : userBlackIcon} alt="User" className="w-8 h-8" />
                  <span>Mi Perfil</span>
                </Link>
              </div>

              {/* Consultas items */}
              <div className="px-4 py-2 mb-2">
                <h3 className="text-gray-500 dark:text-white/60 text-xs font-medium uppercase tracking-wider mb-2">
                  Consultas
                </h3>
                {consultasItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 mb-1 ${
                      isActive(item.path)
                        ? "bg-blue-500 dark:bg-amber-500 text-white dark:text-black"
                        : "text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-yellow-400 hover:bg-blue-500/10 dark:hover:bg-amber-500/10"
                    }`}
                    onClick={() => {
                      setTimeout(() => setIsMobileMenuOpen(false), 100);
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* External Links */}
              <div className="px-4 py-2 mb-4">
                <h3 className="text-gray-500 dark:text-white/60 text-xs font-medium uppercase tracking-wider mb-2">
                  Enlaces
                </h3>
                <a
                  href={EXTERNAL_LINKS.CAJA_UNSAAC}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-yellow-400 hover:bg-blue-500/10 dark:hover:bg-amber-500/10 transition-colors rounded-lg mb-1"
                >
                  Caja UNSAAC
                </a>
                <a
                  href={EXTERNAL_LINKS.TRAMITE_DOCUMENTARIO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-yellow-400 hover:bg-blue-500/10 dark:hover:bg-amber-500/10 transition-colors rounded-lg"
                >
                  Trámite Documentario
                </a>
              </div>

              <hr className="my-2 border-blue-400/20 dark:border-yellow-400/20" />

              {/* Profile and logout */}

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white/80 hover:text-blue-600 dark:hover:text-yellow-400 hover:bg-blue-500/10 dark:hover:bg-amber-500/10 transition-colors rounded-lg"
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
