// ============================================================
// Quiz Data - DESCÚBRETE Section
// 3 Tests with occasion-based scoring
// ============================================================

export type OccasionCategory = 'seduccion' | 'rumba' | 'playa' | 'diario' | 'negocios' | 'deporte';

export interface QuizOptionWithScore {
  value: string;
  label: string;
  description?: string;
  scores: Partial<Record<OccasionCategory, number>>;
}

export interface QuizQuestionDef {
  id: string;
  question: string;
  options: QuizOptionWithScore[];
}

export type QuizResultType = 'three-occasions' | 'single-occasion' | 'single-match';

export interface QuizDefinition {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  questionCount: number;
  resultCount: number;
  intro: {
    heading: string;
    subheading: string;
    description: string;
  };
  resultType: QuizResultType;
  getQuestions: (answers: Record<string, string>) => QuizQuestionDef[];
}

// ============================================================
// Occasion category metadata
// shopifyTag must match the EXACT tag in Shopify (case-insensitive comparison used)
// Actual Shopify tags: Seducción, Rumba, Playa, Diario, Negocios, Deporte
// ============================================================
export const OCCASION_META: Record<OccasionCategory, { label: string; tagline: string; shopifyTag: string }> = {
  seduccion: { label: 'Seducción', tagline: 'Magnetismo y cercanía', shopifyTag: 'seducción' },
  rumba: { label: 'Rumba', tagline: 'Presencia que se siente', shopifyTag: 'rumba' },
  playa: { label: 'Playa', tagline: 'Frescura y libertad', shopifyTag: 'playa' },
  diario: { label: 'Diario', tagline: 'Tu esencia de cada día', shopifyTag: 'diario' },
  negocios: { label: 'Negocios', tagline: 'Elegancia y poder', shopifyTag: 'negocios' },
  deporte: { label: 'Deporte', tagline: 'Energía y vitalidad', shopifyTag: 'deporte' },
};

// Normalize strings for comparison (strip accents, lowercase)
export function normalizeTag(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// ============================================================
// TEST 1: ¿Qué perfumes necesitas en tu vida?
// 8 preguntas → recomienda 3 fragancias por ocasión
// ============================================================
const TEST1_QUESTIONS: QuizQuestionDef[] = [
  {
    id: 'q1',
    question: '¿Cómo describirías tu estilo personal?',
    options: [
      { value: 'a', label: 'Elegante, me gusta verme bien siempre', scores: { negocios: 3 } },
      { value: 'b', label: 'Relajado/a, pero con intención', scores: { diario: 2, playa: 1 } },
      { value: 'c', label: 'Intenso/a, me gusta destacar', scores: { seduccion: 2, rumba: 1 } },
      { value: 'd', label: 'Clásico/a, prefiero ir a la segura', scores: { negocios: 2, diario: 1 } },
    ],
  },
  {
    id: 'q2',
    question: '¿Cuándo usas perfume con más frecuencia?',
    options: [
      { value: 'a', label: 'En citas o planes especiales', scores: { seduccion: 2 } },
      { value: 'b', label: 'En el trabajo o reuniones', scores: { negocios: 2 } },
      { value: 'c', label: 'En salidas nocturnas', scores: { rumba: 2 } },
      { value: 'd', label: 'Todos los días', scores: { diario: 2 } },
    ],
  },
  {
    id: 'q3',
    question: '¿Qué tipo de aroma te llama más la atención?',
    options: [
      { value: 'a', label: 'Sensual y envolvente', scores: { seduccion: 2 } },
      { value: 'b', label: 'Fresco y limpio', scores: { playa: 2, diario: 1 } },
      { value: 'c', label: 'Dulce o intenso', scores: { rumba: 2 } },
      { value: 'd', label: 'Elegante y equilibrado', scores: { negocios: 3 } },
    ],
  },
  {
    id: 'q4',
    question: '¿Qué tan fuerte te gusta que sea tu perfume?',
    options: [
      { value: 'a', label: 'Que se sienta cuando me acerco', scores: { seduccion: 2 } },
      { value: 'b', label: 'Que deje huella', scores: { rumba: 2, negocios: 1 } },
      { value: 'c', label: 'Que se note bastante', scores: { negocios: 1, rumba: 1 } },
      { value: 'd', label: 'Algo discreto y cómodo', scores: { diario: 2, playa: 1 } },
    ],
  },
  {
    id: 'q5',
    question: '¿En qué momento del día lo usas más?',
    options: [
      { value: 'a', label: 'Noche', scores: { rumba: 2, seduccion: 1 } },
      { value: 'b', label: 'Día', scores: { diario: 2, negocios: 1 } },
      { value: 'c', label: 'Tarde', scores: { negocios: 2 } },
      { value: 'd', label: 'Todo el día', scores: { diario: 2 } },
    ],
  },
  {
    id: 'q6',
    question: '¿Qué sensación quieres que otros tengan al olerte?',
    options: [
      { value: 'a', label: 'Deseo', scores: { seduccion: 2 } },
      { value: 'b', label: 'Confianza', scores: { negocios: 2 } },
      { value: 'c', label: 'Admiración', scores: { negocios: 2 } },
      { value: 'd', label: 'Cercanía', scores: { diario: 2, playa: 1 } },
    ],
  },
  {
    id: 'q7',
    question: 'Si tu perfume fuera un plan, sería…',
    options: [
      { value: 'a', label: 'Una cita especial', scores: { seduccion: 2 } },
      { value: 'b', label: 'Un día productivo', scores: { negocios: 2 } },
      { value: 'c', label: 'Una noche memorable', scores: { rumba: 2 } },
      { value: 'd', label: 'Un plan sin esfuerzo', scores: { playa: 2, diario: 1 } },
    ],
  },
  {
    id: 'q8',
    question: '¿Te gusta tener más de un perfume o usar siempre el mismo?',
    options: [
      { value: 'a', label: 'Me gusta tener opciones', scores: { rumba: 1, seduccion: 1, negocios: 1 } },
      { value: 'b', label: 'Uso uno principal', scores: { diario: 2 } },
      { value: 'c', label: 'Cambio según el mood', scores: { rumba: 2, seduccion: 1 } },
      { value: 'd', label: 'Prefiero algo versátil', scores: { diario: 2 } },
    ],
  },
];

// ============================================================
// TEST 2: Elige el perfume según la pareja que quieres
// Pregunta 1 = género, luego 7 preguntas adaptadas
// ============================================================
const TEST2_GENDER_QUESTION: QuizQuestionDef = {
  id: 'gender',
  question: '¿Cómo te identificas?',
  options: [
    { value: 'mujer', label: 'Mujer', scores: {} },
    { value: 'hombre', label: 'Hombre', scores: {} },
  ],
};

const TEST2_MUJER_QUESTIONS: QuizQuestionDef[] = [
  {
    id: 'q2',
    question: '¿Qué tipo de pareja quieres atraer?',
    options: [
      { value: 'a', label: 'Seguro, exitoso, elegante', scores: { negocios: 2, seduccion: 1 } },
      { value: 'b', label: 'Apasionado e intenso', scores: { seduccion: 2 } },
      { value: 'c', label: 'Divertido y espontáneo', scores: { rumba: 2 } },
      { value: 'd', label: 'Tranquilo y auténtico', scores: { diario: 2 } },
    ],
  },
  {
    id: 'q3',
    question: '¿Qué te enamora primero?',
    options: [
      { value: 'a', label: 'La presencia', scores: { negocios: 2 } },
      { value: 'b', label: 'La actitud', scores: { seduccion: 2 } },
      { value: 'c', label: 'La energía', scores: { rumba: 2 } },
      { value: 'd', label: 'La conversación', scores: { diario: 2 } },
    ],
  },
  {
    id: 'q4',
    question: '¿Cómo te gustaría que él te perciba?',
    options: [
      { value: 'a', label: 'Inolvidable', scores: { negocios: 2, seduccion: 1 } },
      { value: 'b', label: 'Deseable', scores: { seduccion: 2 } },
      { value: 'c', label: 'Natural', scores: { diario: 2 } },
      { value: 'd', label: 'Sofisticada', scores: { negocios: 2 } },
    ],
  },
  {
    id: 'q5',
    question: 'Tu cita ideal sería…',
    options: [
      { value: 'a', label: 'Cena elegante', scores: { negocios: 2 } },
      { value: 'b', label: 'Algo íntimo', scores: { seduccion: 2 } },
      { value: 'c', label: 'Un plan inesperado', scores: { rumba: 2 } },
      { value: 'd', label: 'Un café largo', scores: { diario: 2 } },
    ],
  },
  {
    id: 'q6',
    question: '¿Qué tan atrevida quieres verte?',
    options: [
      { value: 'a', label: 'Mucho', scores: { seduccion: 2, rumba: 1 } },
      { value: 'b', label: 'Lo justo', scores: { seduccion: 1, negocios: 1 } },
      { value: 'c', label: 'Depende del día', scores: { rumba: 1, diario: 1 } },
      { value: 'd', label: 'Más elegante que sexy', scores: { negocios: 2 } },
    ],
  },
  {
    id: 'q7',
    question: '¿Qué te gusta que un perfume diga de ti?',
    options: [
      { value: 'a', label: '"Ella sabe lo que quiere"', scores: { negocios: 2 } },
      { value: 'b', label: '"Ella es peligrosa"', scores: { seduccion: 2 } },
      { value: 'c', label: '"Ella es libre"', scores: { rumba: 2 } },
      { value: 'd', label: '"Ella es clase"', scores: { negocios: 1, diario: 1 } },
    ],
  },
  {
    id: 'q8',
    question: '¿Prefieres perfumes…',
    options: [
      { value: 'a', label: 'Intensos', scores: { seduccion: 2 } },
      { value: 'b', label: 'Envolventes', scores: { seduccion: 1, negocios: 1 } },
      { value: 'c', label: 'Dulces', scores: { rumba: 2 } },
      { value: 'd', label: 'Frescos elegantes', scores: { diario: 2, negocios: 1 } },
    ],
  },
];

const TEST2_HOMBRE_QUESTIONS: QuizQuestionDef[] = [
  {
    id: 'q2',
    question: '¿Qué tipo de mujer quieres atraer?',
    options: [
      { value: 'a', label: 'Elegante y segura', scores: { negocios: 2, seduccion: 1 } },
      { value: 'b', label: 'Apasionada', scores: { seduccion: 2 } },
      { value: 'c', label: 'Divertida y libre', scores: { rumba: 2 } },
      { value: 'd', label: 'Tranquila y auténtica', scores: { diario: 2 } },
    ],
  },
  {
    id: 'q3',
    question: '¿Qué te importa más en una primera impresión?',
    options: [
      { value: 'a', label: 'Presencia', scores: { negocios: 2 } },
      { value: 'b', label: 'Actitud', scores: { seduccion: 2 } },
      { value: 'c', label: 'Energía', scores: { rumba: 2 } },
      { value: 'd', label: 'Conexión', scores: { diario: 2 } },
    ],
  },
  {
    id: 'q4',
    question: '¿Cómo quieres que ella te perciba?',
    options: [
      { value: 'a', label: 'Admirable', scores: { negocios: 2 } },
      { value: 'b', label: 'Deseable', scores: { seduccion: 2 } },
      { value: 'c', label: 'Confiable', scores: { diario: 2 } },
      { value: 'd', label: 'Interesante', scores: { rumba: 1, negocios: 1 } },
    ],
  },
  {
    id: 'q5',
    question: 'Tu plan ideal sería…',
    options: [
      { value: 'a', label: 'Algo elegante', scores: { negocios: 2 } },
      { value: 'b', label: 'Algo íntimo', scores: { seduccion: 2 } },
      { value: 'c', label: 'Algo intenso', scores: { rumba: 2 } },
      { value: 'd', label: 'Algo simple pero real', scores: { diario: 2 } },
    ],
  },
  {
    id: 'q6',
    question: '¿Qué tan marcado te gusta tu perfume?',
    options: [
      { value: 'a', label: 'Que se note', scores: { negocios: 1, seduccion: 1 } },
      { value: 'b', label: 'Que deje huella', scores: { seduccion: 2 } },
      { value: 'c', label: 'Que acompañe', scores: { diario: 2 } },
      { value: 'd', label: 'Algo limpio', scores: { diario: 1, negocios: 1 } },
    ],
  },
  {
    id: 'q7',
    question: '¿Qué quieres que ella piense al olerte?',
    options: [
      { value: 'a', label: '"Él es diferente"', scores: { negocios: 2 } },
      { value: 'b', label: '"Él es peligroso"', scores: { seduccion: 2 } },
      { value: 'c', label: '"Él es auténtico"', scores: { diario: 2 } },
      { value: 'd', label: '"Él es elegante"', scores: { negocios: 2 } },
    ],
  },
  {
    id: 'q8',
    question: 'Prefieres aromas…',
    options: [
      { value: 'a', label: 'Intensos', scores: { seduccion: 2 } },
      { value: 'b', label: 'Amaderados', scores: { negocios: 1, diario: 1 } },
      { value: 'c', label: 'Dulces', scores: { rumba: 2 } },
      { value: 'd', label: 'Frescos elegantes', scores: { diario: 2, negocios: 1 } },
    ],
  },
];

// ============================================================
// TEST 3: Quiz General (similar al de Dubai → 1 fragancia)
// 5 preguntas rápidas → 1 perfume ideal
// ============================================================
const TEST3_QUESTIONS: QuizQuestionDef[] = [
  {
    id: 'q1',
    question: '¿Buscas fragancia para…?',
    options: [
      { value: 'a', label: 'Mujer', scores: {} },
      { value: 'b', label: 'Hombre', scores: {} },
      { value: 'c', label: 'Unisex', scores: {} },
    ],
  },
  {
    id: 'q2',
    question: '¿Para qué ocasión la necesitas?',
    options: [
      { value: 'a', label: 'Día a día', scores: { diario: 3 } },
      { value: 'b', label: 'Trabajo y reuniones', scores: { negocios: 3 } },
      { value: 'c', label: 'Citas y planes especiales', scores: { seduccion: 3 } },
      { value: 'd', label: 'Fiestas y salidas', scores: { rumba: 3 } },
    ],
  },
  {
    id: 'q3',
    question: '¿Qué tipo de aroma prefieres?',
    options: [
      { value: 'a', label: 'Fresco y limpio', scores: { playa: 2, diario: 1 } },
      { value: 'b', label: 'Amaderado y sofisticado', scores: { negocios: 3 } },
      { value: 'c', label: 'Dulce e intenso', scores: { rumba: 2, seduccion: 1 } },
      { value: 'd', label: 'Sensual y envolvente', scores: { seduccion: 3 } },
    ],
  },
  {
    id: 'q4',
    question: '¿Qué tan fuerte lo prefieres?',
    options: [
      { value: 'a', label: 'Sutil, solo para quien se acerque', scores: { diario: 2, playa: 1 } },
      { value: 'b', label: 'Moderado, que se note sin exagerar', scores: { negocios: 3 } },
      { value: 'c', label: 'Fuerte, que deje huella', scores: { seduccion: 2, rumba: 1 } },
    ],
  },
  {
    id: 'q5',
    question: '¿Qué palabra describe mejor lo que buscas?',
    options: [
      { value: 'a', label: 'Elegancia', scores: { negocios: 3 } },
      { value: 'b', label: 'Frescura', scores: { playa: 2, diario: 1 } },
      { value: 'c', label: 'Seducción', scores: { seduccion: 3 } },
      { value: 'd', label: 'Confianza', scores: { negocios: 2, diario: 1 } },
    ],
  },
];

// ============================================================
// Quiz Definitions
// ============================================================
export const QUIZ_DEFINITIONS: QuizDefinition[] = [
  {
    id: 'perfumes-vida',
    title: '¿Qué perfumes necesitas en tu vida?',
    subtitle: 'Descubre los 3 perfumes que te acompañan en cada momento',
    emoji: '🧠',
    questionCount: 8,
    resultCount: 3,
    intro: {
      heading: '¿Qué Perfumes Necesitas en Tu Vida?',
      subheading: 'Tu vida no tiene un solo escenario.',
      description: 'Este test descubre los 3 perfumes que necesitas para acompañarte en cada momento.',
    },
    resultType: 'three-occasions',
    getQuestions: () => TEST1_QUESTIONS,
  },
  {
    id: 'pareja-perfume',
    title: 'Elige el perfume según la pareja que quieres',
    subtitle: 'Tu fragancia dice más de lo que crees',
    emoji: '💞',
    questionCount: 8,
    resultCount: 1,
    intro: {
      heading: 'Elige el Perfume Según la Pareja que Quieres',
      subheading: 'Tu fragancia habla antes que tú.',
      description: 'Descubre cuál es el perfume SAME. ideal para atraer la energía que buscas.',
    },
    resultType: 'single-occasion',
    getQuestions: (answers) => {
      const gender = answers['gender'];
      if (gender === 'mujer') return [TEST2_GENDER_QUESTION, ...TEST2_MUJER_QUESTIONS];
      if (gender === 'hombre') return [TEST2_GENDER_QUESTION, ...TEST2_HOMBRE_QUESTIONS];
      return [TEST2_GENDER_QUESTION];
    },
  },
  {
    id: 'quiz-general',
    title: 'Tu perfume ideal',
    subtitle: 'Responde 5 preguntas y encuentra tu fragancia perfecta',
    emoji: '🔮',
    questionCount: 5,
    resultCount: 1,
    intro: {
      heading: 'Tu Perfume Ideal',
      subheading: 'No eliges un perfume al azar.',
      description: 'Eliges la energía que proyectas. Responde 5 preguntas rápidas y descubre tu fragancia SAME. perfecta.',
    },
    resultType: 'single-match',
    getQuestions: () => TEST3_QUESTIONS,
  },
];

// ============================================================
// Scoring utility
// ============================================================
export function calculateOccasionScores(
  answers: Record<string, string>,
  questions: QuizQuestionDef[]
): Record<OccasionCategory, number> {
  const scores: Record<OccasionCategory, number> = {
    seduccion: 0,
    rumba: 0,
    playa: 0,
    diario: 0,
    negocios: 0,
    deporte: 0,
  };

  questions.forEach((q) => {
    const userAnswer = answers[q.id];
    if (!userAnswer) return;

    const selectedOption = q.options.find((opt) => opt.value === userAnswer);
    if (!selectedOption) return;

    Object.entries(selectedOption.scores).forEach(([cat, pts]) => {
      scores[cat as OccasionCategory] += pts;
    });
  });

  return scores;
}

export function getTopOccasions(scores: Record<OccasionCategory, number>, count: number = 1): OccasionCategory[] {
  return (Object.entries(scores) as [OccasionCategory, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([cat]) => cat);
}

// For Test 1: pick top from each "group"
export function getThreeOccasionResults(scores: Record<OccasionCategory, number>): {
  impresionar: OccasionCategory;
  acompanar: OccasionCategory;
  disfrutar: OccasionCategory;
} {
  const powerGroup: OccasionCategory[] = ['seduccion', 'negocios'];
  const dailyGroup: OccasionCategory[] = ['diario', 'deporte'];
  const funGroup: OccasionCategory[] = ['rumba', 'playa'];

  const pickBest = (group: OccasionCategory[]) =>
    group.sort((a, b) => (scores[b] || 0) - (scores[a] || 0))[0];

  return {
    impresionar: pickBest(powerGroup),
    acompanar: pickBest(dailyGroup),
    disfrutar: pickBest(funGroup),
  };
}
