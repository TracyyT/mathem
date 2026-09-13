const problems = [
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
    hint: 'Look for two numbers that multiply to 6 and add to 5.',
  },

  {
    id: 3,
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
    id: 4,
    course: 'Calculus I',
    topic: 'Derivatives',
    difficulty: 'Easy',
    prompt: 'Differentiate:',
    expression: 'f(x) = 5x²',
    acceptedAnswers: [
      '10x',
    ],
    hint: 'Use the power rule: d/dx(xⁿ) = nxⁿ⁻¹.',
  },

  {
    id: 5,
    course: 'Calculus II',
    topic: 'Integrals',
    difficulty: 'Easy',
    prompt: 'Evaluate:',
    expression: '∫₀² x dx',
    acceptedAnswers: [
      '2',
    ],
    hint: 'First find an antiderivative of x, then evaluate it from 0 to 2.',
  },
]

export default problems