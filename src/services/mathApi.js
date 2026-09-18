const API_URL = import.meta.env.VITE_API_URL

export async function checkMathAnswer(
  studentAnswer,
  correctAnswer,
  answerType = 'expression',
) {
  const response = await fetch(
    `${API_URL}/check-answer`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        student_answer: studentAnswer,
        correct_answer: correctAnswer,
        answer_type: answerType,
      }),
    },
  )

  if (!response.ok) {
    throw new Error(
      `Server returned ${response.status}`,
    )
  }

  return response.json()
}

export async function generateProblem(
  course,
  difficulty,
) {
  const response = await fetch(
    `${API_URL}/generate-problem`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        course,
        difficulty,
      }),
    },
  )

  if (!response.ok) {
    throw new Error(
      `Server returned ${response.status}`,
    )
  }

  const data = await response.json()

  if (data.error) {
    throw new Error(data.error)
  }

  return {
    id: data.id,
    course: data.course,
    topic: data.topic,
    difficulty: data.difficulty,
    prompt: data.prompt,
    expression: data.expression,
    correctAnswer: data.correct_answer,
    answerType: data.answer_type,
    hint: data.hint,
  }
}