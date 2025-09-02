import React, { useState, useEffect } from 'react';
import { userService } from '../services/user';
import { authService } from '../services/auth';
import { useNotification } from '../hooks/useNotification';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Perfil = () => {
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [changingPassword, setChangingPassword] = useState(false);
  const [personalInfo, setPersonalInfo] = useState(null);
  const [passwordData, setPasswordData] = useState({
    nuevaContrasenia: '',
    confirmarContrasenia: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        setLoading(true);
        const response = await userService.getPersonalInfo();
        
        if (response.success) {
          setPersonalInfo(response.data);
        } else {
          addNotification('Error al cargar información personal', 'error');
        }
      } catch (error) {
        console.error('Error fetching personal info:', error);
        addNotification('Error al cargar los datos personales', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, [addNotification]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.nuevaContrasenia.trim()) {
      errors.nuevaContrasenia = 'La nueva contraseña es requerida';
    } else if (passwordData.nuevaContrasenia.length < 6) {
      errors.nuevaContrasenia = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!passwordData.confirmarContrasenia.trim()) {
      errors.confirmarContrasenia = 'Confirme la nueva contraseña';
    } else if (passwordData.nuevaContrasenia !== passwordData.confirmarContrasenia) {
      errors.confirmarContrasenia = 'Las contraseñas no coinciden';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    try {
      setChangingPassword(true);
      const response = await authService.changePassword(passwordData.nuevaContrasenia);
      
      if (response.success) {
        addNotification('Contraseña actualizada exitosamente', 'success');
        setPasswordData({
          nuevaContrasenia: '',
          confirmarContrasenia: ''
        });
      } else {
        addNotification(response.message || 'Error al cambiar contraseña', 'error');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      addNotification(error.message || 'Error al cambiar contraseña', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const fullName = personalInfo 
    ? `${personalInfo.nombres} ${personalInfo.apellidoPaterno} ${personalInfo.apellidoMaterno}`.trim()
    : '';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card">
        <h1 className="text-2xl font-bold text-white mb-2">Mi Perfil</h1>
        <p className="text-white/80">Gestiona tu información personal y configuración de cuenta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6">Información Personal</h2>
          
          {personalInfo ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-white/70 mb-1">Código de Estudiante</h3>
                  <p className="text-lg font-semibold text-white">{personalInfo.alumno}</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-white/70 mb-1">Documento de Identidad</h3>
                  <p className="text-lg font-semibold text-white">{personalInfo.nroDocumento}</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white/70 mb-1">Nombre Completo</h3>
                <p className="text-lg font-semibold text-white">{fullName}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-white/70 mb-1">Nombres</h3>
                  <p className="text-white">{personalInfo.nombres}</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-white/70 mb-1">Apellido Paterno</h3>
                  <p className="text-white">{personalInfo.apellidoPaterno}</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white/70 mb-1">Apellido Materno</h3>
                <p className="text-white">{personalInfo.apellidoMaterno}</p>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white/70 mb-1">Correo Electrónico</h3>
                <p className="text-white">{personalInfo.email}</p>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white/70 mb-1">Teléfono</h3>
                <p className="text-white">{personalInfo.telefono || 'No registrado'}</p>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white/70 mb-1">Dirección</h3>
                <p className="text-white">{personalInfo.direccion || 'No registrada'}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-white/80">No se pudo cargar la información personal.</p>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6">Cambiar Contraseña</h2>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-blue-200 font-medium mb-1">Recomendaciones de Seguridad</h4>
                  <ul className="text-blue-200/80 text-sm space-y-1">
                    <li>• Usa al menos 6 caracteres</li>
                    <li>• Combina letras, números y símbolos</li>
                    <li>• No uses información personal</li>
                  </ul>
                </div>
              </div>
            </div>

            <Input
              label="Nueva Contraseña"
              name="nuevaContrasenia"
              type="password"
              value={passwordData.nuevaContrasenia}
              onChange={handlePasswordChange}
              error={passwordErrors.nuevaContrasenia}
              placeholder="Ingrese su nueva contraseña"
              autoComplete="new-password"
            />

            <Input
              label="Confirmar Nueva Contraseña"
              name="confirmarContrasenia"
              type="password"
              value={passwordData.confirmarContrasenia}
              onChange={handlePasswordChange}
              error={passwordErrors.confirmarContrasenia}
              placeholder="Confirme su nueva contraseña"
              autoComplete="new-password"
            />

            <Button
              type="submit"
              className="w-full"
              loading={changingPassword}
              disabled={changingPassword}
            >
              Cambiar Contraseña
            </Button>
          </form>
        </div>
      </div>

      {/* Account Information */}
      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-6">Información de la Cuenta</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">Cuenta Activa</h3>
            <p className="text-white/70 text-sm">Tu cuenta está verificada y activa</p>
          </div>

          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">Seguridad</h3>
            <p className="text-white/70 text-sm">Conexión segura y encriptada</p>
          </div>

          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">Soporte</h3>
            <p className="text-white/70 text-sm">Contacta al administrador si necesitas ayuda</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/dashboard"
            className="flex items-center p-4 bg-primary-600/20 hover:bg-primary-600/30 rounded-lg transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-white group-hover:text-primary-200">Dashboard</h4>
              <p className="text-sm text-white/70">Ir al inicio</p>
            </div>
          </a>

          <a
            href="/notas"
            className="flex items-center p-4 bg-secondary-600/20 hover:bg-secondary-600/30 rounded-lg transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-secondary-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-white group-hover:text-secondary-200">Mis Notas</h4>
              <p className="text-sm text-white/70">Ver calificaciones</p>
            </div>
          </a>

          <a
            href="/pagos"
            className="flex items-center p-4 bg-green-600/20 hover:bg-green-600/30 rounded-lg transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-white group-hover:text-green-200">Mis Pagos</h4>
              <p className="text-sm text-white/70">Estado financiero</p>
            </div>
          </a>

          <button
            onClick={() => window.print()}
            className="flex items-center p-4 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-white group-hover:text-purple-200">Imprimir Perfil</h4>
              <p className="text-sm text-white/70">Datos personales</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
