function getProblem(problems, course, difficulty) {
  const matchingProblems = problems.filter(
    (problem) =>
      problem.course === course &&
      problem.difficulty === difficulty,
  )

  if (matchingProblems.length === 0) {
    return null
  }

  return matchingProblems[0]
}

export default getProblem