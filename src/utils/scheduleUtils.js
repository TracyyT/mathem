export function isScheduledForToday(settings) {
  if (settings.schedule === 'Daily') {
    return true
  }

  const todayName = new Date().toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
    },
  )

  return settings.scheduleDays.includes(todayName)
}