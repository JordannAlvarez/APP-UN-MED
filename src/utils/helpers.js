export const calculateNeededGrade = (currentGrade, currentPercentage, targetGrade = 3.0) => {
  if (currentPercentage >= 100) return 0; // Ya no hay más porcentaje por evaluar
  if (currentPercentage < 0) return 0; // Porcentaje inválido

  const remainingPercentage = 100 - currentPercentage;
  if (remainingPercentage <= 0) return 0;

  // La fórmula es: (nota_final_deseada * 100 - nota_actual * porcentaje_actual) / porcentaje_restante
  const needed = (targetGrade * 100 - currentGrade * currentPercentage) / remainingPercentage;

  return Math.max(0, Math.min(5.0, needed)); // Asegura que la nota esté entre 0 y 5
};

export const calculatePAPA = (semesters) => {
  let totalCredits = 0;
  let totalWeightedSum = 0;

  semesters.forEach(semester => {
    semester.courses.forEach(course => {
      totalCredits += course.credits;
      totalWeightedSum += course.finalGrade * course.credits; // Usar finalGrade de la DB
    });
  });

  return totalCredits > 0 ? (totalWeightedSum / totalCredits) : 0;
};

export const calculatePAPI = (semesters) => {
  if (semesters.length === 0) return 0;

  // El PAPI se calcula solo con el último semestre
  const lastSemester = semesters[semesters.length - 1];
  let totalCredits = 0;
  let totalWeightedSum = 0;

  lastSemester.courses.forEach(course => {
    totalCredits += course.credits;
    totalWeightedSum += course.finalGrade * course.credits; // Usar finalGrade de la DB
  });

  return totalCredits > 0 ? (totalWeightedSum / totalCredits) : 0;
};

export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to local storage", error);
  }
};

export const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error("Error loading from local storage", error);
    return defaultValue;
  }
};