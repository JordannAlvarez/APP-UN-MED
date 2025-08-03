import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, GraduationCap, Trash2, Edit } from 'lucide-react';
import { calculatePAPA, calculatePAPI, generateUniqueId, saveToLocalStorage, loadFromLocalStorage } from '../utils/helpers';
import CourseCard from '../components/CourseCard';

const HistoryPage = () => {
  const [semesters, setSemesters] = useState(() => loadFromLocalStorage('academicHistory', []));
  const [newSemesterName, setNewSemesterName] = useState('');
  const [showAddSemesterForm, setShowAddSemesterForm] = useState(false);
  const [editingSemesterId, setEditingSemesterId] = useState(null);
  const [editingSemesterName, setEditingSemesterName] = useState('');

  useEffect(() => {
    saveToLocalStorage('academicHistory', semesters);
  }, [semesters]);

  const papa = calculatePAPA(semesters);
  const papi = calculatePAPI(semesters);

  const handleAddSemester = () => {
    if (newSemesterName.trim()) {
      const newSemester = {
        id: generateUniqueId(),
        name: newSemesterName.trim(),
        courses: []
      };
      // Añadir el nuevo semestre al principio de la lista
      setSemesters([newSemester, ...semesters]);
      setNewSemesterName('');
      setShowAddSemesterForm(false);
    }
  };

  const handleDeleteSemester = (semesterId) => {
    setSemesters(semesters.filter(sem => sem.id !== semesterId));
  };

  const handleUpdateSemesterName = (semesterId) => {
    setSemesters(semesters.map(sem =>
      sem.id === semesterId ? { ...sem, name: editingSemesterName } : sem
    ));
    setEditingSemesterId(null);
    setEditingSemesterName('');
  };

  const handleAddCourse = (semesterId) => {
    const updatedSemesters = semesters.map(sem => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          courses: [...sem.courses, {
            id: generateUniqueId(),
            name: 'Nueva Materia',
            credits: 3,
            grades: [],
            finalGrade: 0,
            notes: ''
          }]
        };
      }
      return sem;
    });
    setSemesters(updatedSemesters);
  };

  const handleUpdateCourse = (semesterId, updatedCourse) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          courses: sem.courses.map(course =>
            course.id === updatedCourse.id ? updatedCourse : course
          )
        };
      }
      return sem;
    }));
  };

  const handleDeleteCourse = (semesterId, courseId) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          courses: sem.courses.filter(course => course.id !== courseId)
        };
      }
      return sem;
    }));
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-4xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-4xl font-extrabold text-gray-900 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Historial Académico
      </motion.h1>

      <motion.div
        className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-lg mb-8 flex justify-around items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="text-center">
          <p className="text-gray-600 text-lg">PAPA</p>
          <p className={`text-5xl font-extrabold ${papa >= 3.0 ? 'text-green-600' : 'text-red-600'}`}>
            {papa.toFixed(2)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-lg">PAPI</p>
          <p className={`text-5xl font-extrabold ${papi >= 3.0 ? 'text-green-600' : 'text-red-600'}`}>
            {papi.toFixed(2)}
          </p>
        </div>
      </motion.div>

      <motion.button
        onClick={() => setShowAddSemesterForm(!showAddSemesterForm)}
        className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors mb-6 mx-auto"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {showAddSemesterForm ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        {showAddSemesterForm ? 'Cerrar Formulario' : 'Añadir Nuevo Semestre'}
      </motion.button>

      <AnimatePresence>
        {showAddSemesterForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 p-6 rounded-2xl mb-8 overflow-hidden border border-gray-200"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Detalles del Nuevo Semestre</h3>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Nombre del Semestre (Ej: 2024-1)"
                value={newSemesterName}
                onChange={(e) => setNewSemesterName(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <motion.button
                onClick={handleAddSemester}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Crear Semestre
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        <AnimatePresence>
          {semesters.map((semester) => (
            <motion.div
              key={semester.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                {editingSemesterId === semester.id ? (
                  <input
                    type="text"
                    value={editingSemesterName}
                    onChange={(e) => setNewSemesterName(e.target.value)}
                    onBlur={() => handleUpdateSemesterName(semester.id)}
                    onKeyPress={(e) => { if (e.key === 'Enter') handleUpdateSemesterName(semester.id); }}
                    className="text-3xl font-bold text-gray-800 px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                ) : (
                  <h2 className="text-3xl font-bold text-gray-800">{semester.name}</h2>
                )}
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => {
                      setEditingSemesterId(semester.id);
                      setEditingSemesterName(semester.name);
                    }}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteSemester(semester.id)}
                    className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {semester.courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onUpdateCourse={(updatedCourse) => handleUpdateCourse(semester.id, updatedCourse)}
                      onDeleteCourse={(courseId) => handleDeleteCourse(semester.id, courseId)}
                    />
                  ))}
                </AnimatePresence>
              </div>
              <motion.button
                onClick={() => handleAddCourse(semester.id)}
                className="mt-6 flex items-center gap-2 px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                Añadir Materia
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default HistoryPage;