export function isScheduledForDate(
  settings,
  date,
) {
  if (settings.schedule === 'Daily') {
    return true
  }

  const dayName = date.toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
    },
  )

  return settings.scheduleDays.includes(
    dayName,
  )
}

export function isScheduledForToday(settings) {
  return isScheduledForDate(
    settings,
    new Date(),
  )
}

export function getNextStreak(
  settings,
  currentStreak,
  lastCompletedDate,
) {
  if (!lastCompletedDate) {
    return 1
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lastCompleted = new Date(
    `${lastCompletedDate}T00:00:00`,
  )

  const previousScheduledDate =
    new Date(today)

  previousScheduledDate.setDate(
    previousScheduledDate.getDate() - 1,
  )

  while (
    !isScheduledForDate(
      settings,
      previousScheduledDate,
    )
  ) {
    previousScheduledDate.setDate(
      previousScheduledDate.getDate() - 1,
    )
  }

  if (
    previousScheduledDate.getTime() ===
    lastCompleted.getTime()
  ) {
    return currentStreak + 1
  }

  return 1
}

