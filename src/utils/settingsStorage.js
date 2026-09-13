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

export function saveSettings(settings) {
  localStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify(settings),
  )

  window.dispatchEvent(new Event('mathem-settings-updated'))
}