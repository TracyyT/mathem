import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  getSettings,
  saveSettings,
} from '../utils/settingsStorage'

const weekDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

function SetupPage() {
  const navigate = useNavigate()

  const currentSettings = getSettings()

  const [course, setCourse] = useState(currentSettings.course)

  const [difficulty, setDifficulty] = useState(
    currentSettings.difficulty,
  )

  const [schedule, setSchedule] = useState(
    currentSettings.schedule,
  )

  const [selectedDays, setSelectedDays] = useState(
    currentSettings.scheduleDays || [],
  )

  const requiredDays =
    schedule === 'Daily'
      ? 7
      : schedule === '3x per week'
        ? 3
        : 1

  const changeSchedule = (newSchedule) => {
    setSchedule(newSchedule)

    if (newSchedule === 'Daily') {
      setSelectedDays(weekDays)
    } else {
      setSelectedDays([])
    }
  }

  const toggleDay = (day) => {
    if (schedule === 'Daily') {
      return
    }

    if (selectedDays.includes(day)) {
      setSelectedDays(
        selectedDays.filter(
          (selectedDay) => selectedDay !== day,
        ),
      )
      return
    }

    if (selectedDays.length >= requiredDays) {
      return
    }

    setSelectedDays([
      ...selectedDays,
      day,
    ])
  }

  const scheduleIsComplete =
    schedule === 'Daily' ||
    selectedDays.length === requiredDays

  const completeSetup = () => {
    if (!scheduleIsComplete) {
      return
    }

    saveSettings({
      ...currentSettings,
      course,
      difficulty,
      schedule,
      scheduleDays:
        schedule === 'Daily'
          ? weekDays
          : selectedDays,
    })

    localStorage.setItem(
      'mathem-setup-seen',
      'true',
    )

    navigate('/home')
  }

  const skipSetup = () => {
    localStorage.setItem(
      'mathem-setup-seen',
      'true',
    )

    navigate('/home')
  }

  return (
    <main className="setup-page">
      <button
        type="button"
        className="setup-skip"
        onClick={skipSetup}
      >
        Skip for now →
      </button>

      <div className="setup-container">
        <p className="page-eyebrow">
          Quick setup
        </p>

        <h1>Make MathEm yours.</h1>

        <p className="page-description">
          Tell us how you want to practice. You can change
          everything later.
        </p>

        <div className="setup-question">
          <p className="setup-number">01</p>

          <h2>What are you practicing?</h2>

          <div className="setup-options">
            {[
              'Algebra I',
              'Calculus I',
              'Calculus II',
            ].map((option) => (
              <button
                key={option}
                type="button"
                className={
                  course === option
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  setCourse(option)
                }
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="setup-question">
          <p className="setup-number">02</p>

          <h2>
            How challenging should it feel?
          </h2>

          <div className="setup-options">
            {[
              'Easy',
              'Medium',
              'Hard',
            ].map((option) => (
              <button
                key={option}
                type="button"
                className={
                  difficulty === option
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  setDifficulty(option)
                }
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="setup-question">
          <p className="setup-number">03</p>

          <h2>
            How often do you want to MathEm?
          </h2>

          <div className="setup-options">
            {[
              'Daily',
              '3x per week',
              'Weekly',
            ].map((option) => (
              <button
                key={option}
                type="button"
                className={
                  schedule === option
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  changeSchedule(option)
                }
              >
                {option}
              </button>
            ))}
          </div>

          {schedule !== 'Daily' && (
            <div className="setup-days">
              <p>
                {schedule === '3x per week'
                  ? 'Choose 3 days'
                  : 'Choose a day'}
              </p>

              <div className="setup-day-options">
                {weekDays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={
                      selectedDays.includes(day)
                        ? 'selected'
                        : ''
                    }
                    onClick={() =>
                      toggleDay(day)
                    }
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>

              <span className="setup-day-count">
                {selectedDays.length} / {requiredDays} selected
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          className="primary-button setup-finish-button"
          onClick={completeSetup}
          disabled={!scheduleIsComplete}
        >
          Start MathEm →
        </button>
      </div>
    </main>
  )
}

export default SetupPage