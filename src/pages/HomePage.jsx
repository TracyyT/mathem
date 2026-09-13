import { useEffect, useState } from 'react'
import {
  getSettings,
  saveSettings,
} from '../utils/settingsStorage'

import {
  getProgress,
  isTodayCompleted,
} from '../utils/progressStorage'


function HomePage() {
    const [progress, setProgress] = useState(
      () => getProgress(),
    )
    const [editingSetting, setEditingSetting] = useState(null)

    const [todayCompleted, setTodayCompleted] = useState(
      () => isTodayCompleted(),
    )

    const updateSetting = (key, value) => {
        const updatedSettings = {
            ...settings,
            [key]: value,
        }

        setSettings(updatedSettings)
        saveSettings(updatedSettings)
        setEditingSetting(null)
    }

    const [settings, setSettings] = useState(
        () => getSettings(),
    )

    useEffect(() => {
        const updateProgress = () => {
            setProgress(getProgress())
            setTodayCompleted(isTodayCompleted())
        }

        const updateSettings = () => {
            setSettings(getSettings())
        }

        window.addEventListener(
            'mathem-progress-updated',
            updateProgress,
        )

        window.addEventListener(
            'mathem-settings-updated',
            updateSettings,
        )

        return () => {
            window.removeEventListener(
            'mathem-progress-updated',
            updateProgress,
            )

            window.removeEventListener(
            'mathem-settings-updated',
            updateSettings,
            )
        }
    }, [])

  return (
    <section className="page">
      <div className="home-header">
        <div>
          <p className="page-eyebrow">Overview</p>
          <h1>Ready to MathEm?</h1>
          <p className="page-description">
            One focused problem, whenever it fits your schedule.
          </p>
        </div>
      </div>

        <div className="today-card">
        <div>
            <p className="card-label">
            Today's MathEm
            </p>

            {todayCompleted ? (
            <>
                <h2>MathEm’d ✓</h2>

                <p className="card-meta">
                You completed today's practice.
                </p>
            </>
            ) : (
            <>
            <h2>{settings.course}</h2>

            <p className="card-meta">
                {settings.difficulty}
             </p>
            </>
            )}
        </div>

        {!todayCompleted && (
            <button className="primary-button home-start-button">
            Start →
            </button>
        )}
        </div>

      <div className="home-section">
        <div className="section-heading">
          <div>
            <p className="card-label">Your setup</p>
            <h2>Your next practice</h2>
          </div>
        </div>

        <div className="practice-grid">
          <div className="practice-card">
            <p className="practice-label">Course</p>
            <h3>{settings.course}</h3>
            <button
                className="card-action"
                onClick={() => setEditingSetting('course')}
                >
                Change →
             </button>
          </div>

          <div className="practice-card">
            <p className="practice-label">Challenge level</p>
            <h3>{settings.difficulty}</h3>
            <button
                className="card-action"
                onClick={() => setEditingSetting('difficulty')}
                >
                Adjust →
              </button>
          </div>

          <div className="practice-card">
            <p className="practice-label">Schedule</p>
            <h3>{settings.schedule}</h3>
            <button
                className="card-action"
                onClick={() => setEditingSetting('schedule')}
                >
                Adjust →
              </button>
          </div>
        </div>

        {editingSetting && (
        <div className="setting-editor">
            <p className="setting-editor-label">
            {editingSetting === 'course' && 'Choose your course'}
            {editingSetting === 'difficulty' && 'Choose your challenge level'}
            {editingSetting === 'schedule' && 'Choose your schedule'}
            </p>

            <div className="setting-editor-options">
            {editingSetting === 'course' &&
                ['Algebra I', 'Calculus I', 'Calculus II'].map((option) => (
                <button
                    key={option}
                    type="button"
                    className={
                    settings.course === option ? 'selected' : ''
                    }
                    onClick={() => updateSetting('course', option)}
                >
                    {option}
                </button>
                ))}

            {editingSetting === 'difficulty' &&
                ['Easy', 'Medium', 'Hard'].map((option) => (
                <button
                    key={option}
                    type="button"
                    className={
                    settings.difficulty === option ? 'selected' : ''
                    }
                    onClick={() => updateSetting('difficulty', option)}
                >
                    {option}
                </button>
                ))}

            {editingSetting === 'schedule' &&
                ['Daily', '3x per week', 'Weekly'].map((option) => (
                <button
                    key={option}
                    type="button"
                    className={
                    settings.schedule === option ? 'selected' : ''
                    }
                    onClick={() => updateSetting('schedule', option)}
                >
                    {option}
                </button>
                ))}
            </div>

            <button
            type="button"
            className="setting-editor-cancel"
            onClick={() => setEditingSetting(null)}
            >
            Cancel
            </button>
        </div>
        )}

      </div>

      <div className="home-section">
        <div className="section-heading">
          <div>
            <p className="card-label">This week</p>
            <h2>Quick progress</h2>
          </div>
        </div>

        <div className="stats-grid">
            <div className="stat-card">
                <strong>
                {todayCompleted ? '✓' : '—'}
                </strong>

                <span>Today's MathEm</span>
            </div>

            <div className="stat-card">
                <strong>{progress.streak}</strong>
                <span>Current streak</span>
            </div>

            <div className="stat-card">
                <strong>
                {progress.nextDifficultyChoice}
                </strong>

                <span>Next challenge</span>
            </div>
            </div>
      </div>
    </section>
  )
}

export default HomePage