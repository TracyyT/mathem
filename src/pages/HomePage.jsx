import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  getSettings,
  saveSettings,
  hasScheduleChanged,
} from '../utils/settingsStorage'

import {
  getProgress,
  saveProgress,
  isTodayCompleted,
} from '../utils/progressStorage'

function HomePage() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(
    () => getProgress(),
  )

  const [settings, setSettings] = useState(
    () => getSettings(),
  )

  const [todayCompleted, setTodayCompleted] = useState(
    () => isTodayCompleted(),
  )

  const [editingSetting, setEditingSetting] = useState(null)

  const [selectedScheduleDays, setSelectedScheduleDays] = useState(
    () => getSettings().scheduleDays,
  )

  const [selectedSchedule, setSelectedSchedule] =
    useState(
      () => getSettings().schedule,
    )

  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  const saveSchedule = (updatedSettings) => {
    const oldSettings = getSettings()

    if (
      hasScheduleChanged(
        oldSettings,
        updatedSettings,
      )
    ) {
      const currentProgress = getProgress()

      saveProgress({
        ...currentProgress,
        streak: 0,
        lastCompletedDate: null,
      })
    }

    setSettings(updatedSettings)
    saveSettings(updatedSettings)
    setEditingSetting(null)
  }

  const updateSetting = (key, value) => {
    const updatedSettings = {
      ...settings,
      [key]: value,
    }

    setSettings(updatedSettings)
    saveSettings(updatedSettings)
    setEditingSetting(null)
  }

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

  const toggleScheduleDay = (day) => {
    const requiredDays =
      selectedSchedule === '3x per week'
        ? 3
        : 1

    if (selectedScheduleDays.includes(day)) {
      setSelectedScheduleDays(
        selectedScheduleDays.filter(
          (selectedDay) => selectedDay !== day,
        ),
      )

      return
    }

    if (selectedScheduleDays.length >= requiredDays) {
      return
    }

    setSelectedScheduleDays([
      ...selectedScheduleDays,
      day,
    ])
  }

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
          <button
            className="primary-button home-start-button"
            onClick={() => navigate('/today')}
            >
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
            <p className="practice-label">
              Challenge level
            </p>

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

            <p className="practice-setting-detail">
              {settings.schedule === 'Daily'
                ? 'Every day'
                : settings.scheduleDays
                    .map((day) => day.slice(0, 3))
                    .join(' · ')}
            </p>

            <button
              className="card-action"
              onClick={() => {
                setSelectedSchedule(settings.schedule)

                setSelectedScheduleDays(
                  settings.scheduleDays,
                )

                setEditingSetting('schedule')
              }}
            >
              Adjust →
            </button>
          </div>
        </div>

        {editingSetting && (
          <div className="setting-editor">
            <p className="setting-editor-label">
              {editingSetting === 'course' &&
                'Choose your course'}

              {editingSetting === 'difficulty' &&
                'Choose your challenge level'}

              {editingSetting === 'schedule' &&
                'Choose your schedule'}
            </p>

            <div className="setting-editor-options">
              {editingSetting === 'course' &&
                [
                  'Algebra I',
                  'Calculus I',
                  'Calculus II',
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={
                      settings.course === option
                        ? 'selected'
                        : ''
                    }
                    onClick={() =>
                      updateSetting(
                        'course',
                        option,
                      )
                    }
                  >
                    {option}
                  </button>
                ))}

              {editingSetting === 'difficulty' &&
                ['Easy', 'Medium', 'Hard'].map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      className={
                        settings.difficulty === option
                          ? 'selected'
                          : ''
                      }
                      onClick={() =>
                        updateSetting(
                          'difficulty',
                          option,
                        )
                      }
                    >
                      {option}
                    </button>
                  ),
                )}

              {editingSetting === 'schedule' &&
                ['Daily', '3x per week', 'Weekly'].map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      className={
                        selectedSchedule === option
                          ? 'selected'
                          : ''
                      }
                      onClick={() => {
                        if (option === 'Daily') {
                          const updatedSettings = {
                            ...settings,
                            schedule: 'Daily',
                            scheduleDays: weekDays,
                          }

                          saveSchedule(updatedSettings)
                          return
                        }

                        setSelectedSchedule(option)

                        if (option !== selectedSchedule) {
                          setSelectedScheduleDays([])
                        }
                      }}
                    >
                      {option}
                    </button>
                  ),
                )}
            </div>

            {editingSetting === 'schedule' &&
              selectedSchedule !== 'Daily' && (
                <div className="schedule-day-picker">
                  <p className="schedule-day-label">
                    {selectedSchedule === '3x per week'
                      ? 'Choose 3 days'
                      : 'Choose 1 day'}
                  </p>

                  <div className="schedule-days">
                    {weekDays.map((day) => (
                      <button
                        key={day}
                        type="button"
                        className={
                          selectedScheduleDays.includes(day)
                            ? 'selected'
                            : ''
                        }
                        onClick={() =>
                          toggleScheduleDay(day)
                        }
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="primary-button schedule-save-button"
                    disabled={
                      selectedSchedule === '3x per week'
                        ? selectedScheduleDays.length !== 3
                        : selectedScheduleDays.length !== 1
                    }
                    onClick={() => {
                      const updatedSettings = {
                      ...settings,
                      schedule: selectedSchedule,
                      scheduleDays: selectedScheduleDays,
                    }
                      saveSchedule(updatedSettings)
                    }}
                  >
                    Save schedule
                  </button>
                </div>
              )}

            <button
              type="button"
              className="setting-editor-cancel"
              onClick={() => {
                const savedSettings = getSettings()

                setSettings(savedSettings)

                setSelectedSchedule(
                  savedSettings.schedule,
                )

                setSelectedScheduleDays(
                  savedSettings.scheduleDays,
                )

                setEditingSetting(null)
              }}
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