import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/user';
import { useNotification } from '../hooks/useNotification';
import NoticesCarousel from '../components/ui/NoticesCarousel';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { username } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    academicInfo: null,
    notices: [],
    links: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all dashboard data in parallel
        const [academicResponse, noticesResponse, linksResponse] = await Promise.allSettled([
          userService.getAcademicInfo(),
          userService.getNotices(),
          userService.getLinks()
        ]);

        const newData = { ...data };

        // Handle academic info
        if (academicResponse.status === 'fulfilled' && academicResponse.value.success) {
          newData.academicInfo = academicResponse.value.data;
        } else if (academicResponse.status === 'rejected') {
          console.error('Error fetching academic info:', academicResponse.reason);
        }

        // Handle notices
        if (noticesResponse.status === 'fulfilled' && noticesResponse.value.success) {
          newData.notices = noticesResponse.value.data;
        } else if (noticesResponse.status === 'rejected') {
          console.error('Error fetching notices:', noticesResponse.reason);
        }

        // Handle links
        if (linksResponse.status === 'fulfilled' && linksResponse.value.success) {
          newData.links = linksResponse.value.data;
        } else if (linksResponse.status === 'rejected') {
          console.error('Error fetching links:', linksResponse.reason);
        }

        setData(newData);
      } catch (error) {
        console.error('Dashboard error:', error);
        addNotification('Error al cargar los datos del dashboard', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [addNotification]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const { academicInfo, notices, links } = data;
  const fullName = academicInfo 
    ? `${academicInfo.nombres} ${academicInfo.apellidoPaterno} ${academicInfo.apellidoMaterno}`.trim()
    : username;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-4">
            ¡Bienvenido, {fullName || username}!
          </h1>
          
          {academicInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-neutral-100 dark:bg-white/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2">Información Académica</h3>
                <div className="space-y-2 text-neutral-700 dark:text-white/90">
                  <p><span className="font-medium">Código:</span> {academicInfo.alumno}</p>
                  <p><span className="font-medium">Carrera:</span> {academicInfo.carrera}</p>
                  {academicInfo.especialidad && (
                    <p><span className="font-medium">Especialidad:</span> {academicInfo.especialidad}</p>
                  )}
                </div>
              </div>
              
              <div className="bg-neutral-100 dark:bg-white/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2">Datos Personales</h3>
                <div className="space-y-2 text-neutral-700 dark:text-white/90">
                  <p><span className="font-medium">DNI:</span> {academicInfo.dni}</p>
                  <p><span className="font-medium">Email:</span> {academicInfo.email}</p>
                  <p><span className="font-medium">Teléfono:</span> {academicInfo.telefono}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Notices Carousel */}
        <div className="lg:col-span-2">
          <NoticesCarousel notices={notices} />
        </div>

        {/* Important Links */}
        <div className="card">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">Enlaces Importantes</h3>
          
          {links.length > 0 ? (
            <div className="space-y-3">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.enlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-neutral-100 dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 rounded-lg transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-800 dark:text-white font-medium group-hover:text-unsaac-600 dark:group-hover:text-primary-200">
                      {link.titulo}
                    </span>
                    <svg 
                      className="w-4 h-4 text-neutral-600 dark:text-white/60 group-hover:text-unsaac-600 dark:group-hover:text-primary-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                      />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-neutral-600 dark:text-white/80">No hay enlaces disponibles en este momento.</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">Accesos Rápidos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/notas"
            className="flex items-center p-4 bg-unsaac-100 dark:bg-primary-600/20 hover:bg-unsaac-200 dark:hover:bg-primary-600/30 rounded-lg transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-unsaac-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-neutral-800 dark:text-white group-hover:text-unsaac-600 dark:group-hover:text-primary-200">Mis Notas</h4>
              <p className="text-sm text-neutral-600 dark:text-white/70">Ver calificaciones</p>
            </div>
          </a>

          <a
            href="/pagos"
            className="flex items-center p-4 bg-success-100 dark:bg-secondary-600/20 hover:bg-success-200 dark:hover:bg-secondary-600/30 rounded-lg transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-success-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-neutral-800 dark:text-white group-hover:text-success-600 dark:group-hover:text-secondary-200">Mis Pagos</h4>
              <p className="text-sm text-neutral-600 dark:text-white/70">Estado de pagos</p>
            </div>
          </a>

          <a
            href="/perfil"
            className="flex items-center p-4 bg-neutral-200 dark:bg-green-600/20 hover:bg-neutral-300 dark:hover:bg-green-600/30 rounded-lg transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-neutral-600 dark:bg-green-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-neutral-800 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-green-200">Mi Perfil</h4>
              <p className="text-sm text-neutral-600 dark:text-white/70">Datos personales</p>
            </div>
          </a>

          <a
            href="https://caja.unsaac.edu.pe"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-neutral-200 dark:bg-purple-600/20 hover:bg-neutral-300 dark:hover:bg-purple-600/30 rounded-lg transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-neutral-600 dark:bg-purple-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-neutral-800 dark:text-white group-hover:text-neutral-600 dark:group-hover:text-purple-200">Caja UNSAAC</h4>
              <p className="text-sm text-neutral-600 dark:text-white/70">Portal de pagos</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
