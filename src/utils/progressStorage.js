const PROGRESS_KEY = 'mathem-progress'

const defaultProgress = {
  streak: 0,
  lastCompletedDate: null,
  nextDifficultyChoice: 'Same',
}

function getTodayDate() {
  return new Date().toLocaleDateString('en-CA')
}

export function getProgress() {
  const savedProgress = localStorage.getItem(PROGRESS_KEY)

  if (!savedProgress) {
    return defaultProgress
  }

  return {
    ...defaultProgress,
    ...JSON.parse(savedProgress),
  }
}

export function saveProgress(progress) {
  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify(progress),
  )

  window.dispatchEvent(new Event('mathem-progress-updated'))
}

export function isTodayCompleted() {
  const progress = getProgress()

  return progress.lastCompletedDate === getTodayDate()
}

export function getTodayDateString() {
  return getTodayDate()
}

export function clearNextDifficultyChoice() {
  const progress = getProgress()

  saveProgress({
    ...progress,
    nextDifficultyChoice: 'Same',
  })
}