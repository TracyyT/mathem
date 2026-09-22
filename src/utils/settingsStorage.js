const SETTINGS_KEY = 'mathem-settings'

const defaultSettings = {
  course: 'Calculus I',
  difficulty: 'Medium',
  schedule: '3x per week',
  scheduleDays: ['Monday', 'Wednesday', 'Friday'],
}

export function getSettings() {
  const savedSettings = localStorage.getItem(SETTINGS_KEY)

  if (!savedSettings) {
    return defaultSettings
  }

  return {
    ...defaultSettings,
    ...JSON.parse(savedSettings),
  }
}

export function hasScheduleChanged(
  oldSettings,
  newSettings,
) {
  if (
    oldSettings.schedule !==
    newSettings.schedule
  ) {
    return true
  }

  if (newSettings.schedule === 'Daily') {
    return false
  }

  const oldDays = [
    ...(oldSettings.scheduleDays || []),
  ].sort()

  const newDays = [
    ...(newSettings.scheduleDays || []),
  ].sort()

  return (
    JSON.stringify(oldDays) !==
    JSON.stringify(newDays)
  )
}

export function saveSettings(settings) {
  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify(settings),
  )

  window.dispatchEvent(new Event('mathem-settings-updated'))
}