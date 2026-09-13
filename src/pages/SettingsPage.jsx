import { useEffect, useState } from 'react'

import { getSettings } from '../utils/settingsStorage'

function SettingsPage() {
  const [settings, setSettings] = useState(
    () => getSettings(),
  )

  useEffect(() => {
    const updateSettings = () => {
      setSettings(getSettings())
    }

    window.addEventListener(
      'mathem-settings-updated',
      updateSettings,
    )

    return () => {
      window.removeEventListener(
        'mathem-settings-updated',
        updateSettings,
      )
    }
  }, [])

  return (
    <section className="page">
      <p className="page-eyebrow">Settings</p>

      <h1>Your preferences</h1>

      <p className="page-description">
        Your current MathEm setup and practice preferences.
      </p>

      <div className="settings-list">
        <div className="settings-row">
          <div>
            <p className="practice-label">Course</p>
            <h3>{settings.course}</h3>
          </div>

          <span>Change from Home</span>
        </div>

        <div className="settings-row">
          <div>
            <p className="practice-label">Challenge level</p>
            <h3>{settings.difficulty}</h3>
          </div>

          <span>Change from Home</span>
        </div>

        <div className="settings-row">
          <div>
            <p className="practice-label">Schedule</p>
            <h3>{settings.schedule}</h3>

            <p className="settings-detail">
              {settings.schedule === 'Daily'
                ? 'Every day'
                : settings.scheduleDays
                    .map((day) => day.slice(0, 3))
                    .join(' · ')}
            </p>
          </div>

          <span>Change from Home</span>
        </div>
      </div>

      <div className="settings-note">
        More customization options will be added as MathEm grows.
      </div>
    </section>
  )
}

export default SettingsPage