import React, { useState, useEffect } from 'react';
import { userService } from '../services/user';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Notas = () => {
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    academicInfo: null,
    gradesData: null
  });
  const [selectedSemester, setSelectedSemester] = useState('');
  const [filteredGrades, setFilteredGrades] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [academicResponse, gradesResponse] = await Promise.allSettled([
          userService.getAcademicInfo(),
          userService.getGrades()
        ]);

        const newData = { ...data };

        if (academicResponse.status === 'fulfilled' && academicResponse.value.success) {
          newData.academicInfo = academicResponse.value.data;
        }

        if (gradesResponse.status === 'fulfilled' && gradesResponse.value.success) {
          newData.gradesData = gradesResponse.value.data;
          
          // Set default semester to the first available
          const semesters = [...new Set(gradesResponse.value.data.notas.map(nota => nota.semestre))];
          if (semesters.length > 0) {
            setSelectedSemester(semesters[0]);
          }
        } else if (gradesResponse.status === 'rejected') {
          addNotification('Error al cargar las notas', 'error');
        }

        setData(newData);
      } catch (error) {
        console.error('Error fetching grades:', error);
        addNotification('Error al cargar los datos', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addNotification]);

  // Filter grades by selected semester
  useEffect(() => {
    if (data.gradesData && selectedSemester) {
      const filtered = data.gradesData.notas.filter(nota => nota.semestre === selectedSemester);
      setFilteredGrades(filtered);
    }
  }, [data.gradesData, selectedSemester]);

  const getGradeColor = (nota, notaAprobacion) => {
    if (nota >= notaAprobacion) {
      return 'text-green-400';
    } else {
      return 'text-red-400';
    }
  };

  const getGradeStatus = (nota, notaAprobacion) => {
    return nota >= notaAprobacion ? 'Aprobado' : 'Desaprobado';
  };

  const getTipoNotaLabel = (tipoNota) => {
    const tipos = {
      'R': 'Regular',
      'H': 'Habilitación',
      'C': 'Convalidación'
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
    : '';

  const semesters = gradesData ? [...new Set(gradesData.notas.map(nota => nota.semestre))].sort() : [];

  return (
    <div className="space-y-8">
      {/* Student Information */}
      <div className="card">
        <h1 className="text-2xl font-bold text-white mb-6">Registro de Notas</h1>
        
        {academicInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-sm font-medium text-white/70 mb-1">Código de Estudiante</h3>
              <p className="text-lg font-semibold text-white">{academicInfo.alumno}</p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-sm font-medium text-white/70 mb-1">Nombre Completo</h3>
              <p className="text-lg font-semibold text-white">{fullName}</p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="text-sm font-medium text-white/70 mb-1">Programa Académico</h3>
              <p className="text-lg font-semibold text-white">{academicInfo.carrera}</p>
              {academicInfo.especialidad && (
                <p className="text-sm text-white/80">{academicInfo.especialidad}</p>
              )}
            </div>
            
            {gradesData && (
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-sm font-medium text-white/70 mb-1">Total de Créditos</h3>
                <p className="text-lg font-semibold text-white">{gradesData.totalCreditos}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Semester Selector and Grades Table */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 sm:mb-0">Notas por Semestre</h2>
          
          {semesters.length > 0 && (
            <div className="flex items-center space-x-3">
              <label className="text-white font-medium">Semestre:</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {semesters.map((semester) => (
                  <option key={semester} value={semester} className="bg-gray-800">
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
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-white font-semibold">Código</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Curso</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Categoría</th>
                  <th className="text-center py-3 px-4 text-white font-semibold">Créditos</th>
                  <th className="text-center py-3 px-4 text-white font-semibold">Nota</th>
                  <th className="text-center py-3 px-4 text-white font-semibold">Nota Mín.</th>
                  <th className="text-center py-3 px-4 text-white font-semibold">Estado</th>
                  <th className="text-center py-3 px-4 text-white font-semibold">Tipo</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((grade, index) => (
                  <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white/90 font-mono">{grade.cursoId}</td>
                    <td className="py-3 px-4 text-white/90">{grade.nombreCurso}</td>
                    <td className="py-3 px-4 text-white/80">{grade.categoria}</td>
                    <td className="py-3 px-4 text-center text-white/90">{grade.creditos}</td>
                    <td className={`py-3 px-4 text-center font-bold text-lg ${getGradeColor(grade.nota, grade.notaAprobacion)}`}>
                      {grade.nota}
                    </td>
                    <td className="py-3 px-4 text-center text-white/80">{grade.notaAprobacion}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        grade.nota >= grade.notaAprobacion 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {getGradeStatus(grade.nota, grade.notaAprobacion)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-white/80">
                      {getTipoNotaLabel(grade.tipoNota)}
                    </td>
                    <td className="py-3 px-4 text-white/80">
                      {grade.fechaFin ? new Date(grade.fechaFin).toLocaleDateString('es-PE') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white/80">
              {selectedSemester ? 'No hay notas disponibles para este semestre.' : 'No hay notas disponibles.'}
            </p>
          </div>
        )}

        {/* Summary */}
        {filteredGrades.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <h4 className="text-sm font-medium text-white/70 mb-1">Cursos en el Semestre</h4>
                <p className="text-2xl font-bold text-white">{filteredGrades.length}</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <h4 className="text-sm font-medium text-white/70 mb-1">Cursos Aprobados</h4>
                <p className="text-2xl font-bold text-green-400">
                  {filteredGrades.filter(grade => grade.nota >= grade.notaAprobacion).length}
                </p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <h4 className="text-sm font-medium text-white/70 mb-1">Promedio del Semestre</h4>
                <p className="text-2xl font-bold text-white">
                  {filteredGrades.length > 0 
                    ? (filteredGrades.reduce((sum, grade) => sum + grade.nota, 0) / filteredGrades.length).toFixed(2)
                    : '0.00'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notas;
