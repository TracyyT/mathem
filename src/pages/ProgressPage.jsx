import { useEffect, useState } from 'react'

import {
  getProgress,
  isTodayCompleted,
} from '../utils/progressStorage'

function ProgressPage() {
  const [progress, setProgress] = useState(
    () => getProgress(),
  )

  const [todayCompleted, setTodayCompleted] = useState(
    () => isTodayCompleted(),
  )

  useEffect(() => {
    const updateProgress = () => {
      setProgress(getProgress())
      setTodayCompleted(isTodayCompleted())
    }

    window.addEventListener(
      'mathem-progress-updated',
      updateProgress,
    )

    return () => {
      window.removeEventListener(
        'mathem-progress-updated',
        updateProgress,
      )
    }
  }, [])

  return (
    <section className="page">
      <p className="page-eyebrow">Progress</p>

      <h1>Your MathEm progress</h1>

      <p className="page-description">
        A simple snapshot of your current practice habit.
      </p>

      <div className="progress-overview-grid">
        <div className="stat-card">
          <strong>{progress.streak}</strong>
          <span>Current streak</span>
        </div>

        <div className="stat-card">
          <strong>{todayCompleted ? '✓' : '—'}</strong>
          <span>Today's MathEm</span>
        </div>

        <div className="stat-card">
          <strong>{progress.nextDifficultyChoice}</strong>
          <span>Next challenge</span>
        </div>
      </div>

      <div className="progress-placeholder-card">
        <p className="card-label">Coming next</p>

        <h2>More detailed progress</h2>

        <p>
          Future versions of MathEm will include completion
          history, accuracy, topic mastery, and practice trends.
        </p>
      </div>
    </section>
  )
}

export default ProgressPage