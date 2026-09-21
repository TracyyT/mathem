const difficulties = [
  'Easy',
  'Medium',
  'Hard',
]

export function getNextDifficulty(
  currentDifficulty,
  choice,
) {
  const currentIndex = difficulties.indexOf(
    currentDifficulty,
  )

  if (currentIndex === -1) {
    return currentDifficulty
  }

  if (choice === 'Easier') {
    return difficulties[
      Math.max(0, currentIndex - 1)
    ]
  }

  if (choice === 'Harder') {
    return difficulties[
      Math.min(
        difficulties.length - 1,
        currentIndex + 1,
      )
    ]
  }

  return currentDifficulty
}

