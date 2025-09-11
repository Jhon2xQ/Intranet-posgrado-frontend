import React, { useState, useEffect } from "react";
import { userService } from "../services/user";
import { useNotification } from "../hooks/useNotification";
import PaymentSummary from "../components/ui/PaymentSummary";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Pagos = () => {
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    academicInfo: null,
    paymentsData: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [academicResponse, paymentsResponse] = await Promise.allSettled([
          userService.getAcademicInfo(),
          userService.getPayments(),
        ]);

        const newData = {
          academicInfo: null,
          paymentsData: null,
        };

        if (
          academicResponse.status === "fulfilled" &&
          academicResponse.value.success
        ) {
          newData.academicInfo = academicResponse.value.data;
        }

        if (
          paymentsResponse.status === "fulfilled" &&
          paymentsResponse.value.success
        ) {
          newData.paymentsData = paymentsResponse.value.data;
        } else if (paymentsResponse.status === "rejected") {
          addNotification("Error al cargar los pagos", "error");
        }

        setData(newData);
      } catch (error) {
        console.error("Error fetching payments:", error);
        addNotification("Error al cargar los datos", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addNotification]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const { academicInfo, paymentsData } = data;
  const fullName = academicInfo
    ? `${academicInfo.nombres} ${academicInfo.apellidoPaterno} ${academicInfo.apellidoMaterno}`.trim()
    : "";

  return (
    <div className="space-y-8">
      {/* Student Information */}
      <div className="card">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-white mb-6">
          Estado de Pagos
        </h1>

        {academicInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-neutral-100 dark:bg-white/10 rounded-lg p-4">
              <h3 className="text-sm font-medium text-neutral-600 dark:text-white/70 mb-1">
                Código de Estudiante
              </h3>
              <p className="text-lg font-semibold text-neutral-800 dark:text-white">
                {academicInfo.alumno}
              </p>
            </div>

            <div className="bg-neutral-100 dark:bg-white/10 rounded-lg p-4">
              <h3 className="text-sm font-medium text-neutral-600 dark:text-white/70 mb-1">
                Nombre Completo
              </h3>
              <p className="text-lg font-semibold text-neutral-800 dark:text-white">
                {fullName}
              </p>
            </div>

            <div className="bg-neutral-100 dark:bg-white/10 rounded-lg p-4">
              <h3 className="text-sm font-medium text-neutral-600 dark:text-white/70 mb-1">
                Programa Académico
              </h3>
              <p className="text-lg font-semibold text-neutral-800 dark:text-white">
                {academicInfo.carrera}
              </p>
              {academicInfo.especialidad && (
                <p className="text-sm text-neutral-700 dark:text-white/80">
                  {academicInfo.especialidad}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <PaymentSummary paymentData={paymentsData} />
        </div>

        {/* Payment History */}
        <div className="lg:col-span-2">
          <div className="card h-full">
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-6">
              Historial de Pagos
            </h2>

            {paymentsData && paymentsData.pagos.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white dark:bg-neutral-800">
                      <tr className="border-b border-neutral-300 dark:border-white/20">
                        <th className="text-left py-3 px-4 text-neutral-800 dark:text-white font-semibold">
                          Recibo
                        </th>
                        <th className="text-left py-3 px-4 text-neutral-800 dark:text-white font-semibold">
                          Semestre
                        </th>
                        <th className="text-center py-3 px-4 text-neutral-800 dark:text-white font-semibold">
                          Monto
                        </th>
                        <th className="text-left py-3 px-4 text-neutral-800 dark:text-white font-semibold">
                          Fecha
                        </th>
                        <th className="text-left py-3 px-4 text-neutral-800 dark:text-white font-semibold">
                          Lugar de Pago
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentsData.pagos.slice(0, 6).map((payment, index) => (
                        <tr
                          key={index}
                          className="border-b border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3 px-4 text-neutral-800 dark:text-white/90 font-mono">
                            {payment.recibo}
                          </td>
                          <td className="py-3 px-4 text-neutral-800 dark:text-white/90">
                            {payment.semestre}
                          </td>
                          <td className="py-3 px-4 text-center text-neutral-800 dark:text-white/90 font-semibold">
                            S/{" "}
                            {payment.monto.toLocaleString("es-PE", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-3 px-4 text-neutral-700 dark:text-white/80">
                            {new Date(payment.fecha).toLocaleDateString(
                              "es-PE",
                            )}
                          </td>
                          <td className="py-3 px-4 text-neutral-700 dark:text-white/80">
                            {payment.lugarPago}
                          </td>
                        </tr>
                      ))}
                      {paymentsData.pagos.length > 6 &&
                        paymentsData.pagos.slice(6).map((payment, index) => (
                          <tr
                            key={index + 6}
                            className="border-b border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                          >
                            <td className="py-3 px-4 text-neutral-800 dark:text-white/90 font-mono">
                              {payment.recibo}
                            </td>
                            <td className="py-3 px-4 text-neutral-800 dark:text-white/90">
                              {payment.semestre}
                            </td>
                            <td className="py-3 px-4 text-center text-neutral-800 dark:text-white/90 font-semibold">
                              S/{" "}
                              {payment.monto.toLocaleString("es-PE", {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                            <td className="py-3 px-4 text-neutral-700 dark:text-white/80">
                              {new Date(payment.fecha).toLocaleDateString(
                                "es-PE",
                              )}
                            </td>
                            <td className="py-3 px-4 text-neutral-700 dark:text-white/80">
                              {payment.lugarPago}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <p className="text-neutral-600 dark:text-white/80">
                  No hay pagos registrados.
                </p>
              </div>
            )}

            {/* Payment Statistics */}
            {paymentsData && paymentsData.pagos.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-neutral-100 dark:bg-white/10 rounded-lg p-4 text-center">
                    <h4 className="text-sm font-medium text-neutral-600 dark:text-white/70 mb-1">
                      Total de Pagos
                    </h4>
                    <p className="text-2xl font-bold text-neutral-800 dark:text-white">
                      {paymentsData.pagos.length}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/dashboard"
            className="flex items-center p-4 bg-red-100 dark:bg-red-600/20 hover:bg-red-200 dark:hover:bg-red-600/30 rounded-lg transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-200">
                Dashboard
              </h4>
              <p className="text-sm text-gray-600 dark:text-white/70">
                Ir al inicio
              </p>
            </div>
          </a>

          <a
            href="/notas"
            className="flex items-center p-4 bg-blue-100 dark:bg-blue-600/20 hover:bg-blue-200 dark:hover:bg-blue-600/30 rounded-lg transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-200">
                Mis Notas
              </h4>
              <p className="text-sm text-gray-600 dark:text-white/70">
                Ver calificaciones
              </p>
            </div>
          </a>

          <a
            href="/perfil"
            className="flex items-center p-4 bg-green-100 dark:bg-green-600/20 hover:bg-green-200 dark:hover:bg-green-600/30 rounded-lg transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-200">
                Mi Perfil
              </h4>
              <p className="text-sm text-gray-600 dark:text-white/70">
                Datos personales
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Pagos;
