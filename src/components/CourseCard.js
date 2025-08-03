import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, Edit, ChevronDown, ChevronUp, NotebookPen } from 'lucide-react';
import { calculateNeededGrade } from '../utils/helpers';

const CourseCard = ({ course, onUpdateCourse, onDeleteCourse }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingGradeId, setEditingGradeId] = useState(null);
  const [newGradeValue, setNewGradeValue] = useState('');
  const [newGradeName, setNewGradeName] = useState('');
  const [newGradePercentage, setNewGradePercentage] = useState('');
  const [showAddGradeForm, setShowAddGradeForm] = useState(false);
  const [editingCourseName, setEditingCourseName] = useState(false);
  const [courseNameInput, setCourseNameInput] = useState(course.name);
  const [editingCredits, setEditingCredits] = useState(false);
  const [creditsInput, setCreditsInput] = useState(course.credits);
  const [notes, setNotes] = useState(course.notes || '');

  // Calculate current overall grade from local grades state
  const currentWeightedSum = course.grades.reduce((sum, g) => sum + (g.grade * g.percentage), 0);
  const currentPercentage = course.grades.reduce((sum, g) => sum + g.percentage, 0);
  const currentOverallGrade = currentPercentage > 0 ? currentWeightedSum / currentPercentage : 0;
  const neededGrade = calculateNeededGrade(currentOverallGrade, currentPercentage);

  const handleGradeChange = (gradeId, field, value) => {
    const updatedGrades = course.grades.map(g =>
      g.id === gradeId ? { ...g, [field]: parseFloat(value) || 0 } : g
    );

    // Recalculate finalGrade for the course
    const newWeightedSum = updatedGrades.reduce((sum, g) => sum + (g.grade * g.percentage), 0);
    const newPercentage = updatedGrades.reduce((sum, g) => sum + g.percentage, 0);
    const newFinalGrade = newPercentage > 0 ? newWeightedSum / newPercentage : 0;

    onUpdateCourse({ ...course, grades: updatedGrades, finalGrade: newFinalGrade });
  };

  const handleAddGrade = () => {
    if (newGradeName.trim() && newGradePercentage > 0 && newGradePercentage <= 100) {
      const newGradeData = {
        id: `g${Date.now()}`, // Generate a local ID
        name: newGradeName.trim(),
        percentage: parseFloat(newGradePercentage),
        grade: parseFloat(newGradeValue) || 0
      };

      const updatedGrades = [...course.grades, newGradeData];

      // Recalculate finalGrade for the course
      const newWeightedSum = updatedGrades.reduce((sum, g) => sum + (g.grade * g.percentage), 0);
      const newPercentage = updatedGrades.reduce((sum, g) => sum + g.percentage, 0);
      const newFinalGrade = newPercentage > 0 ? newWeightedSum / newPercentage : 0;

      onUpdateCourse({ ...course, grades: updatedGrades, finalGrade: newFinalGrade });
      setNewGradeName('');
      setNewGradePercentage('');
      setNewGradeValue('');
      setShowAddGradeForm(false);
    }
  };

  const handleDeleteGrade = (gradeId) => {
    const updatedGrades = course.grades.filter(g => g.id !== gradeId);

    // Recalculate finalGrade for the course
    const newWeightedSum = updatedGrades.reduce((sum, g) => sum + (g.grade * g.percentage), 0);
    const newPercentage = updatedGrades.reduce((sum, g) => sum + g.percentage, 0);
    const newFinalGrade = newPercentage > 0 ? newWeightedSum / newPercentage : 0;

    onUpdateCourse({ ...course, grades: updatedGrades, finalGrade: newFinalGrade });
  };

  const handleEditGradeClick = (grade) => {
    setEditingGradeId(grade.id);
    setNewGradeValue(grade.grade.toString());
  };

  const handleSaveGradeEdit = (gradeId) => {
    handleGradeChange(gradeId, 'grade', newGradeValue);
    setEditingGradeId(null);
    setNewGradeValue('');
  };

  const handleCourseNameChange = () => {
    onUpdateCourse({ ...course, name: courseNameInput });
    setEditingCourseName(false);
  };

  const handleCreditsChange = () => {
    onUpdateCourse({ ...course, credits: parseInt(creditsInput) || 0 });
    setEditingCredits(false);
  };

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    onUpdateCourse({ ...course, notes: newNotes });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-md mb-4"
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            {editingCourseName ? (
              <input
                type="text"
                value={courseNameInput}
                onChange={(e) => setCourseNameInput(e.target.value)}
                onBlur={handleCourseNameChange}
                onKeyPress={(e) => { if (e.key === 'Enter') handleCourseNameChange(); }}
                className="text-xl font-bold text-gray-800 px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            ) : (
              <h3 className="text-xl font-bold text-gray-800">{course.name}</h3>
            )}
            <motion.button
              onClick={() => setEditingCourseName(!editingCourseName)}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            {editingCredits ? (
              <input
                type="number"
                value={creditsInput}
                onChange={(e) => setCreditsInput(e.target.value)}
                onBlur={handleCreditsChange}
                onKeyPress={(e) => { if (e.key === 'Enter') handleCreditsChange(); }}
                className="w-16 px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            ) : (
              <span>{course.credits} Créditos</span>
            )}
            <motion.button
              onClick={() => setEditingCredits(!editingCredits)}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`text-lg font-semibold ${course.finalGrade >= 3.0 ? 'text-green-600' : 'text-red-600'}`}>
            Actual: {course.finalGrade.toFixed(2)}
          </span>
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
          </motion.button>
          <motion.button
            onClick={() => onDeleteCourse(course.id)}
            className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="mb-4">
              <p className="text-gray-700 font-medium">Notas:</p>
              <ul className="space-y-2 mt-2">
                {course.grades.map((grade) => (
                  <li key={grade.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium text-gray-800">{grade.name} ({grade.percentage}%)</span>
                      {editingGradeId === grade.id ? (
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="5"
                          value={newGradeValue}
                          onChange={(e) => setNewGradeValue(e.target.value)}
                          onBlur={() => handleSaveGradeEdit(grade.id)}
                          onKeyPress={(e) => { if (e.key === 'Enter') handleSaveGradeEdit(grade.id); }}
                          className="ml-2 w-20 px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                      ) : (
                        <span className="ml-2 text-gray-700 font-semibold">{grade.grade.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={() => handleEditGradeClick(grade)}
                        className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDeleteGrade(grade.id)}
                        className="p-1 rounded-full text-red-600 hover:bg-red-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <motion.button
              onClick={() => setShowAddGradeForm(!showAddGradeForm)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors mb-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showAddGradeForm ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {showAddGradeForm ? 'Cerrar' : 'Añadir Nota'}
            </motion.button>

            <AnimatePresence>
              {showAddGradeForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 p-4 rounded-lg mb-4 overflow-hidden"
                >
                  <h4 className="font-semibold text-gray-800 mb-2">Nueva Nota</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Nombre (Ej: Parcial 1)"
                      value={newGradeName}
                      onChange={(e) => setNewGradeName(e.target.value)}
                      className="px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                    <input
                      type="number"
                      step="1"
                      min="1"
                      max="100"
                      placeholder="Porcentaje (%)"
                      value={newGradePercentage}
                      onChange={(e) => setNewGradePercentage(e.target.value)}
                      className="px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      placeholder="Calificación (0-5)"
                      value={newGradeValue}
                      onChange={(e) => setNewGradeValue(e.target.value)}
                      className="px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  </div>
                  <motion.button
                    onClick={handleAddGrade}
                    className="mt-3 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Guardar Nota
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Resumen del Curso</h4>
              <p className="text-gray-700">
                <span className="font-medium">Porcentaje Evaluado:</span> {currentPercentage.toFixed(2)}%
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Nota Actual Ponderada:</span> {currentOverallGrade.toFixed(2)}
              </p>
              {currentPercentage < 100 && (
                <p className="text-gray-700">
                  <span className="font-medium">Necesitas en el { (100 - currentPercentage).toFixed(2) }% restante:</span>{' '}
                  <span className="font-bold text-gray-700">{neededGrade.toFixed(2)}</span> para pasar con 3.0
                </p>
              )}
              {currentPercentage >= 100 && (
                <p className="text-gray-700 font-bold text-green-700">
                  ¡Curso finalizado! Nota final: {currentOverallGrade.toFixed(2)}
                </p>
              )}
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <NotebookPen className="w-5 h-5" /> Notas Adicionales
              </h4>
              <textarea
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                rows="3"
                placeholder="Escribe aquí cualquier cosa que debas recordar sobre esta materia..."
                value={notes}
                onChange={handleNotesChange}
              ></textarea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CourseCard;