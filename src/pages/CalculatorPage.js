import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, BookOpen, Percent, CheckCircle } from 'lucide-react';
import { calculateNeededGrade, saveToLocalStorage, loadFromLocalStorage } from '../utils/helpers';

const CalculatorPage = () => {
  const [grades, setGrades] = useState(() => loadFromLocalStorage('calculatorGrades', []));
  const [newGradeName, setNewGradeName] = useState('');
  const [newGradePercentage, setNewGradePercentage] = useState('');
  const [newGradeValue, setNewGradeValue] = useState('');
  const [targetGrade, setTargetGrade] = useState(() => loadFromLocalStorage('calculatorTargetGrade', 3.0));

  useEffect(() => {
    saveToLocalStorage('calculatorGrades', grades);
  }, [grades]);

  useEffect(() => {
    saveToLocalStorage('calculatorTargetGrade', targetGrade);
  }, [targetGrade]);

  const currentWeightedSum = grades.reduce((sum, g) => sum + (g.grade * g.percentage), 0);
  const currentPercentage = grades.reduce((sum, g) => sum + g.percentage, 0);
  const currentOverallGrade = currentPercentage > 0 ? currentWeightedSum / currentPercentage : 0;
  const neededGrade = calculateNeededGrade(currentOverallGrade, currentPercentage, targetGrade);

  const handleAddGrade = () => {
    if (newGradeName.trim() && newGradePercentage > 0 && newGradePercentage <= 100) {
      const newGrade = {
        id: `g${Date.now()}`,
        name: newGradeName.trim(),
        percentage: parseFloat(newGradePercentage),
        grade: parseFloat(newGradeValue) || 0
      };
      setGrades([...grades, newGrade]);
      setNewGradeName('');
      setNewGradePercentage('');
      setNewGradeValue('');
    }
  };

  const handleDeleteGrade = (id) => {
    setGrades(grades.filter(g => g.id !== id));
  };

  const handleGradeValueChange = (id, value) => {
    setGrades(grades.map(g => g.id === id ? { ...g, grade: parseFloat(value) || 0 } : g));
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-3xl"
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
        Calculadora de Notas
      </motion.h1>

      <motion.div
        className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-lg mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-gray-700" />
          Notas Actuales
        </h2>
        <div className="space-y-4">
          <AnimatePresence>
            {grades.map((grade) => (
              <motion.div
                key={grade.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm"
              >
                <div className="flex-1 grid grid-cols-3 gap-2 items-center">
                  <span className="font-medium text-gray-800">{grade.name}</span>
                  <span className="text-gray-600">{grade.percentage}%</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="5"
                    value={grade.grade}
                    onChange={(e) => handleGradeValueChange(grade.id, e.target.value)}
                    className="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>
                <motion.button
                  onClick={() => handleDeleteGrade(grade.id)}
                  className="ml-4 p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Plus className="w-6 h-6 text-gray-700" />
            Añadir Nueva Nota
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Nombre (Ej: Parcial 1)"
              value={newGradeName}
              onChange={(e) => setNewGradeName(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <input
              type="number"
              step="1"
              min="1"
              max="100"
              placeholder="Porcentaje (%)"
              value={newGradePercentage}
              onChange={(e) => setNewGradePercentage(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <input
              type="number"
              step="0.01"
              min="0"
              max="5"
              placeholder="Calificación (0-5)"
              value={newGradeValue}
              onChange={(e) => setNewGradeValue(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <motion.button
              onClick={handleAddGrade}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              Añadir
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Percent className="w-7 h-7 text-gray-700" />
          Resultados
        </h2>
        <div className="space-y-3">
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Porcentaje Evaluado:</span>{' '}
            <span className="font-bold text-gray-700">{currentPercentage.toFixed(2)}%</span>
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Nota Actual Ponderada:</span>{' '}
            <span className={`font-bold ${currentOverallGrade >= 3.0 ? 'text-green-600' : 'text-red-600'}`}>
              {currentOverallGrade.toFixed(2)}
            </span>
          </p>
          <div className="flex items-center gap-3">
            <label htmlFor="targetGrade" className="text-lg text-gray-700 font-semibold">
              Nota Mínima para Pasar:
            </label>
            <input
              id="targetGrade"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={targetGrade}
              onChange={(e) => setTargetGrade(parseFloat(e.target.value) || 0)}
              className="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          {currentPercentage < 100 ? (
            <p className="text-xl text-gray-800">
              <span className="font-semibold">Necesitas en el {(100 - currentPercentage).toFixed(2)}% restante:</span>{' '}
              <span className="font-bold text-gray-700">{neededGrade.toFixed(2)}</span>
            </p>
          ) : (
            <p className="text-xl text-gray-800 font-bold text-green-700 flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              ¡Materia finalizada! Nota final: {currentOverallGrade.toFixed(2)}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CalculatorPage;