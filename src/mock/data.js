export const defaultSemesters = [
  {
    id: 'sem1',
    name: 'Semestre 2023-1',
    courses: [
      {
        id: 'course1',
        name: 'Cálculo Diferencial',
        credits: 4,
        grades: [
          { id: 'g1', name: 'Parcial 1', percentage: 25, grade: 3.8 },
          { id: 'g2', name: 'Parcial 2', percentage: 25, grade: 4.2 },
          { id: 'g3', name: 'Quices', percentage: 20, grade: 3.5 },
          { id: 'g4', name: 'Final', percentage: 30, grade: 4.0 }
        ],
        finalGrade: 3.9
      },
      {
        id: 'course2',
        name: 'Programación Orientada a Objetos',
        credits: 3,
        grades: [
          { id: 'g5', name: 'Proyecto 1', percentage: 30, grade: 4.5 },
          { id: 'g6', name: 'Proyecto 2', percentage: 30, grade: 4.0 },
          { id: 'g7', name: 'Examen Final', percentage: 40, grade: 3.8 }
        ],
        finalGrade: 4.06
      }
    ]
  },
  {
    id: 'sem2',
    name: 'Semestre 2023-2',
    courses: [
      {
        id: 'course3',
        name: 'Álgebra Lineal',
        credits: 4,
        grades: [
          { id: 'g8', name: 'Parcial 1', percentage: 30, grade: 3.0 },
          { id: 'g9', name: 'Parcial 2', percentage: 30, grade: 3.5 },
          { id: 'g10', name: 'Quices', percentage: 10, grade: 4.0 },
          { id: 'g11', name: 'Final', percentage: 30, grade: 2.8 }
        ],
        finalGrade: 3.19
      },
      {
        id: 'course4',
        name: 'Estructuras de Datos',
        credits: 3,
        grades: [
          { id: 'g12', name: 'Talleres', percentage: 20, grade: 4.0 },
          { id: 'g13', name: 'Proyecto', percentage: 40, grade: 3.7 },
          { id: 'g14', name: 'Examen', percentage: 40, grade: 3.2 }
        ],
        finalGrade: 3.5
      }
    ]
  }
];