import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  getSettings,
  saveSettings,
} from '../utils/settingsStorage'

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

  const completeSetup = () => {
    let scheduleDays

    if (schedule === 'Daily') {
      scheduleDays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ]
    } else if (schedule === 'Weekly') {
      scheduleDays = ['Monday']
    } else {
      scheduleDays = [
        'Monday',
        'Wednesday',
        'Friday',
      ]
    }

    saveSettings({
      ...currentSettings,
      course,
      difficulty,
      schedule,
      scheduleDays,
    })

    localStorage.setItem('mathem-setup-seen', 'true')

    navigate('/home')
  }

  const skipSetup = () => {
    localStorage.setItem('mathem-setup-seen', 'true')

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
        <p className="page-eyebrow">Quick setup</p>

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
                  course === option ? 'selected' : ''
                }
                onClick={() => setCourse(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="setup-question">
          <p className="setup-number">02</p>

          <h2>How challenging should it feel?</h2>

          <div className="setup-options">
            {['Easy', 'Medium', 'Hard'].map((option) => (
              <button
                key={option}
                type="button"
                className={
                  difficulty === option ? 'selected' : ''
                }
                onClick={() => setDifficulty(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="setup-question">
          <p className="setup-number">03</p>

          <h2>How often do you want to MathEm?</h2>

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
                  schedule === option ? 'selected' : ''
                }
                onClick={() => setSchedule(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="primary-button setup-finish-button"
          onClick={completeSetup}
        >
          Start MathEm →
        </button>
      </div>
    </main>
  )
}

export default SetupPage