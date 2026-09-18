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