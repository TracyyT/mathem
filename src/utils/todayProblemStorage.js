const TODAY_PROBLEM_KEY = 'mathem-today-problem'

export function getTodayProblem() {
  const stored = localStorage.getItem(
    TODAY_PROBLEM_KEY,
  )

  if (!stored) {
    return null
  }

  try {
    const data = JSON.parse(stored)

    const today = new Date()
      .toLocaleDateString('en-CA')

    if (data.date !== today) {
      localStorage.removeItem(
        TODAY_PROBLEM_KEY,
      )
      return null
    }

    return data.problem
  } catch {
    localStorage.removeItem(
      TODAY_PROBLEM_KEY,
    )
    return null
  }
}

export function saveTodayProblem(problem) {
  const today = new Date()
    .toLocaleDateString('en-CA')

  localStorage.setItem(
    TODAY_PROBLEM_KEY,
    JSON.stringify({
      date: today,
      problem,
    }),
  )
}

export function clearTodayProblem() {
  localStorage.removeItem(
    TODAY_PROBLEM_KEY,
  )
}