import React, { useState, useEffect } from "react";
import { userService } from "../services/user";
import { useNotification } from "../hooks/useNotification";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Notas = () => {
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    academicInfo: null,
    gradesData: null,
  });
  const [selectedSemester, setSelectedSemester] = useState("");
  const [filteredGrades, setFilteredGrades] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [academicResponse, gradesResponse] = await Promise.allSettled([
          userService.getAcademicInfo(),
          userService.getGrades(),
        ]);

        const newData = { ...data };

        if (academicResponse.status === "fulfilled" && academicResponse.value.success) {
          newData.academicInfo = academicResponse.value.data;
        }

        if (gradesResponse.status === "fulfilled" && gradesResponse.value.success) {
          newData.gradesData = gradesResponse.value.data;

          // Set default semester to the latest available
          const semesters = [...new Set(gradesResponse.value.data.notas.map((nota) => nota.semestre))].sort();
          if (semesters.length > 0) {
            setSelectedSemester(semesters[semesters.length - 1]);
          }
        } else if (gradesResponse.status === "rejected") {
          addNotification("Error al cargar las notas", "error");
        }

        setData(newData);
      } catch (error) {
        console.error("Error fetching grades:", error);
        addNotification("Error al cargar los datos", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addNotification]);

  // Filter grades by selected semester
  useEffect(() => {
    if (data.gradesData && selectedSemester) {
      const filtered = data.gradesData.notas.filter((nota) => nota.semestre === selectedSemester);
      setFilteredGrades(filtered);
    }
  }, [data.gradesData, selectedSemester]);

  const getGradeColor = (nota, notaAprobacion) => {
    if (nota >= notaAprobacion) {
      return "text-green-400";
    } else {
      return "text-red-400";
    }
  };

  const getGradeStatus = (nota, notaAprobacion) => {
    return nota >= notaAprobacion ? "Aprobado" : "Desaprobado";
  };

  const getTipoNotaLabel = (tipoNota) => {
    const tipos = {
      R: "Regular",
      H: "Homologación",
      C: "Convalidación",
    };
    return tipos[tipoNota] || tipoNota;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const { academicInfo, gradesData } = data;
  const fullName = academicInfo
    ? `${academicInfo.nombres} ${academicInfo.apellidoPaterno} ${academicInfo.apellidoMaterno}`.trim()
    : "";

  const semesters = gradesData ? [...new Set(gradesData.notas.map((nota) => nota.semestre))].sort() : [];

  return (
    <div className="space-y-8">
      {/* Student Information */}
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Registro de Notas</h1>

        {academicInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-100 dark:bg-white/10 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-white/70 mb-1">Código de Estudiante</h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{academicInfo.alumno}</p>
            </div>

            <div className="bg-gray-100 dark:bg-white/10 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-white/70 mb-1">Nombre Completo</h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{fullName}</p>
            </div>

            <div className="bg-gray-100 dark:bg-white/10 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-white/70 mb-1">Programa Académico</h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{academicInfo.carrera}</p>
              {academicInfo.especialidad && (
                <p className="text-sm text-gray-700 dark:text-white/80">{academicInfo.especialidad}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Semester Selector and Grades Table */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">Notas por Semestre</h2>

          {semesters.length > 0 && (
            <div className="flex items-center space-x-3">
              <label className="text-gray-900 dark:text-white font-medium">Semestre:</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-primary-500"
              >
                {semesters.map((semester) => (
                  <option
                    key={semester}
                    value={semester}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {semester}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {filteredGrades.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300 dark:border-white/20">
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Código</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Curso</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Categoría</th>
                  <th className="text-center py-3 px-4 text-gray-900 dark:text-white font-semibold">Créditos</th>
                  <th className="text-center py-3 px-4 text-gray-900 dark:text-white font-semibold">Nota</th>
                  <th className="text-center py-3 px-4 text-gray-900 dark:text-white font-semibold">Estado</th>
                  <th className="text-center py-3 px-4 text-gray-900 dark:text-white font-semibold">Tipo</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Fecha fin</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white font-semibold">Resolución</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((grade, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-white/90 font-mono">{grade.cursoId}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white/90">{grade.nombreCurso}</td>
                    <td className="py-3 px-4 text-gray-700 dark:text-white/80">{grade.categoria}</td>
                    <td className="py-3 px-4 text-center text-gray-900 dark:text-white/90">{grade.creditos}</td>
                    <td
                      className={`py-3 px-4 text-center font-bold text-lg ${getGradeColor(
                        grade.nota,
                        grade.notaAprobacion
                      )}`}
                    >
                      {grade.nota}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          grade.nota >= grade.notaAprobacion
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {getGradeStatus(grade.nota, grade.notaAprobacion)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-700 dark:text-white/80">
                      {getTipoNotaLabel(grade.tipoNota)}
                    </td>
                    <td className="py-3 px-4 text-gray-700 dark:text-white/80">
                      {grade.fechaFin ? new Date(grade.fechaFin).toLocaleDateString("es-PE") : "-"}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-700 dark:text-white/80">
                      {getTipoNotaLabel(grade.resolucion)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-white/80">
              {selectedSemester ? "No hay notas disponibles para este semestre." : "No hay notas disponibles."}
            </p>
          </div>
        )}

        {/* Summary */}
        {filteredGrades.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-300 dark:border-white/20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-100 dark:bg-white/10 rounded-lg p-4 text-center">
                <h4 className="text-sm font-medium text-gray-600 dark:text-white/70 mb-1">Total cursos llevados</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{gradesData.notas.length}</p>
              </div>

              <div className="bg-gray-100 dark:bg-white/10 rounded-lg p-4 text-center">
                <h4 className="text-sm font-medium text-gray-600 dark:text-white/70 mb-1">Total cursos Aprobados</h4>
                <p className="text-2xl font-bold text-green-400">
                  {gradesData.notas.filter((grade) => grade.nota >= grade.notaAprobacion).length}
                </p>
              </div>

              <div className="bg-gray-100 dark:bg-white/10 rounded-lg p-4 text-center">
                <h4 className="text-sm font-medium text-gray-600 dark:text-white/70 mb-1">Total creditos acumulados</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{gradesData.totalCreditos}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/dashboard"
            className="flex items-center p-4 bg-red-100 dark:bg-red-600/20 hover:bg-red-200 dark:hover:bg-red-600/30 rounded-lg transition-colors group"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <p className="text-sm text-gray-600 dark:text-white/70">Ir al inicio</p>
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
              <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-200">
                Mis Pagos
              </h4>
              <p className="text-sm text-gray-600 dark:text-white/70">Estado de pagos</p>
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
              <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-200">
                Mi Perfil
              </h4>
              <p className="text-sm text-gray-600 dark:text-white/70">Datos personales</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Notas;
