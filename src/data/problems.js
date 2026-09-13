const problems = [
  // -------------------------
  // Algebra I
  // -------------------------
  {
    id: 1,
    course: 'Algebra I',
    topic: 'Linear Equations',
    difficulty: 'Easy',
    prompt: 'Solve for x:',
    expression: '3x + 5 = 17',
    acceptedAnswers: ['4'],
    hint: 'Subtract 5 from both sides first, then divide by 3.',
  },

  {
    id: 2,
    course: 'Algebra I',
    topic: 'Factoring',
    difficulty: 'Medium',
    prompt: 'Factor completely:',
    expression: 'x² + 5x + 6',
    acceptedAnswers: [
      '(x+2)(x+3)',
      '(x+3)(x+2)',
    ],
    hint: 'Find two numbers that multiply to 6 and add to 5.',
  },

  {
    id: 3,
    course: 'Algebra I',
    topic: 'Quadratic Equations',
    difficulty: 'Hard',
    prompt: 'Solve for x:',
    expression: 'x² - 5x + 6 = 0',
    acceptedAnswers: [
      '2,3',
      '3,2',
      'x=2,3',
      'x=3,2',
      '2and3',
      '3and2',
    ],
    hint: 'Factor the quadratic, then set each factor equal to 0.',
  },

  // -------------------------
  // Calculus I
  // -------------------------
  {
    id: 4,
    course: 'Calculus I',
    topic: 'Derivatives',
    difficulty: 'Easy',
    prompt: 'Differentiate:',
    expression: 'f(x) = 5x²',
    acceptedAnswers: [
      '10x',
    ],
    hint: 'Use the power rule.',
  },

  {
    id: 5,
    course: 'Calculus I',
    topic: 'Derivatives',
    difficulty: 'Medium',
    prompt: 'Find f′(x) if:',
    expression: 'f(x) = x³ + 4x² - 2x + 7',
    acceptedAnswers: [
      '3x^2+8x-2',
      '8x+3x^2-2',
      '3x^2-2+8x',
    ],
    hint: 'Differentiate each term separately using the power rule.',
  },

  {
    id: 6,
    course: 'Calculus I',
    topic: 'Product Rule',
    difficulty: 'Hard',
    prompt: 'Differentiate:',
    expression: 'f(x) = x²(x + 3)',
    acceptedAnswers: [
      '3x^2+6x',
      '6x+3x^2',
      '3x(x+2)',
    ],
    hint: 'Use the product rule, or expand first and then differentiate.',
  },

  // -------------------------
  // Calculus II
  // -------------------------
  {
    id: 7,
    course: 'Calculus II',
    topic: 'Definite Integrals',
    difficulty: 'Easy',
    prompt: 'Evaluate:',
    expression: '∫₀² x dx',
    acceptedAnswers: [
      '2',
    ],
    hint: 'Find an antiderivative of x, then evaluate from 0 to 2.',
  },

  {
    id: 8,
    course: 'Calculus II',
    topic: 'Integration',
    difficulty: 'Medium',
    prompt: 'Find the indefinite integral:',
    expression: '∫ 3x² dx',
    acceptedAnswers: [
      'x^3+c',
      'x³+c',
    ],
    hint: 'Increase the exponent by 1, then divide by the new exponent.',
  },

  {
    id: 9,
    course: 'Calculus II',
    topic: 'Integration by Substitution',
    difficulty: 'Hard',
    prompt: 'Evaluate:',
    expression: '∫ 2x(x² + 1)³ dx',
    acceptedAnswers: [
      '(x^2+1)^4/4+c',
      '1/4(x^2+1)^4+c',
      '((x^2+1)^4)/4+c',
    ],
    hint: 'Let u = x² + 1.',
  },
]

export default problems