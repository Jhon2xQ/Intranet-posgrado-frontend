import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useNotification } from './hooks/useNotification';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotificationToast from './components/common/NotificationToast';
import Header from './components/layout/Header';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard';
import Notas from './pages/Notas';
import Pagos from './pages/Pagos';
import Perfil from './pages/Perfil';

function AppContent() {
  const { notifications, removeNotification } = useNotification();

  return (
    <Router>
      <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <div>
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <Navigate to="/dashboard" replace />
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div>
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <Dashboard />
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/notas" element={
            <ProtectedRoute>
              <div>
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <Notas />
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/pagos" element={
            <ProtectedRoute>
              <div>
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <Pagos />
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/perfil" element={
            <ProtectedRoute>
              <div>
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <Perfil />
                </main>
              </div>
            </ProtectedRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        
        {/* Global Notifications */}
        <NotificationToast 
          notifications={notifications} 
          onRemove={removeNotification} 
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
