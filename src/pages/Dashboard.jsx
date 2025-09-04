import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/user";
import { useNotification } from "../hooks/useNotification";
import NoticesCarousel from "../components/ui/NoticesCarousel";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Dashboard = () => {
  const { username } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    academicInfo: null,
    notices: [],
    links: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all dashboard data in parallel
        const [academicResponse, noticesResponse, linksResponse] = await Promise.allSettled([
          userService.getAcademicInfo(),
          userService.getNotices(),
          userService.getLinks(),
        ]);

        const newData = { ...data };

        // Handle academic info
        if (academicResponse.status === "fulfilled" && academicResponse.value.success) {
          newData.academicInfo = academicResponse.value.data;
        } else if (academicResponse.status === "rejected") {
          console.error("Error fetching academic info:", academicResponse.reason);
        }

        // Handle notices
        if (noticesResponse.status === "fulfilled" && noticesResponse.value.success) {
          newData.notices = noticesResponse.value.data;
        } else if (noticesResponse.status === "rejected") {
          console.error("Error fetching notices:", noticesResponse.reason);
        }

        // Handle links
        if (linksResponse.status === "fulfilled" && linksResponse.value.success) {
          newData.links = linksResponse.value.data;
        } else if (linksResponse.status === "rejected") {
          console.error("Error fetching links:", linksResponse.reason);
        }

        setData(newData);
      } catch (error) {
        console.error("Dashboard error:", error);
        addNotification("Error al cargar los datos del dashboard", "error");
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
            ¡Bienvenid@, {fullName || username}!
          </h1>

          {academicInfo && (
            <div className="mt-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-neutral-900/20 dark:to-neutral-700/20 rounded-xl p-6 border border-blue-200/50 dark:border-neutral-600/50">
                <div className="flex items-center justify-center mb-4">
                  <h3 className="text-xl font-bold text-neutral-800 dark:text-white">Información Académica</h3>
                </div>

                <div
                  className={`grid grid-cols-1 gap-4 ${
                    academicInfo.especialidad ? "md:grid-cols-3" : "md:grid-cols-2"
                  }`}
                >
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 text-center border border-gray-200/50 dark:border-gray-700/50">
                    <div className="text-blue-600 dark:text-amber-400 text-sm font-medium uppercase tracking-wide mb-1">
                      Código
                    </div>
                    <div className="text-lg font-bold text-neutral-800 dark:text-white">{academicInfo.alumno}</div>
                  </div>

                  <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 text-center border border-gray-200/50 dark:border-gray-700/50">
                    <div className="text-blue-600 dark:text-amber-400 text-sm font-medium uppercase tracking-wide mb-1">
                      Programa
                    </div>
                    <div className="text-lg font-bold text-neutral-800 dark:text-white">{academicInfo.carrera}</div>
                  </div>

                  {academicInfo.especialidad && (
                    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 text-center border border-gray-200/50 dark:border-gray-700/50">
                      <div className="text-blue-600 dark:text-amber-400 text-sm font-medium uppercase tracking-wide mb-1">
                        Especialidad
                      </div>
                      <div className="text-lg font-bold text-neutral-800 dark:text-white">
                        {academicInfo.especialidad}
                      </div>
                    </div>
                  )}
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
                    <span className="text-neutral-800 dark:text-white font-medium group-hover:text-blue-500 dark:group-hover:text-amber-400 dark:group-hover:text-primary-200">
                      {link.titulo}
                    </span>
                    <svg
                      className="w-4 h-4 text-neutral-600 dark:text-white/60 group-hover:text-blue-500 dark:group-hover:text-amber-400 dark:group-hover:text-primary-200"
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
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/notas"
            className="flex items-center p-4 bg-blue-100 dark:bg-blue-600/20 hover:bg-blue-200 dark:hover:bg-blue-600/30 rounded-lg transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-neutral-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-200">
                Mis Notas
              </h4>
              <p className="text-sm text-neutral-600 dark:text-white/70">Ver calificaciones</p>
            </div>
          </a>

          <a
            href="/pagos"
            className="flex items-center p-4 bg-violet-100 dark:bg-violet-600/20 hover:bg-violet-200 dark:hover:bg-violet-600/30 rounded-lg transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-neutral-800 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-200">
                Mis Pagos
              </h4>
              <p className="text-sm text-neutral-600 dark:text-white/70">Estado de pagos</p>
            </div>
          </a>

          <a
            href="/perfil"
            className="flex items-center p-4 bg-green-100 dark:bg-green-600/20 hover:bg-green-200 dark:hover:bg-green-600/30 rounded-lg transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-neutral-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-200">
                Mi Perfil
              </h4>
              <p className="text-sm text-neutral-600 dark:text-white/70">Datos personales</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
