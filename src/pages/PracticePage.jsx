import { useState } from 'react'

function PracticePage() {
  const [selectedCourse, setSelectedCourse] = useState('Calculus I')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium')

  const courses = [
    'Algebra I',
    'Calculus I',
    'Calculus II',
  ]

  const difficulties = [
    'Easy',
    'Medium',
    'Hard',
  ]

  return (
    <section className="page">
      <div>
        <p className="page-eyebrow">Practice</p>

        <h1>Practice whenever you want.</h1>

        <p className="page-description">
          Pick what you want to work on and start a MathEm.
        </p>
      </div>

      <div className="practice-setup-card">
        <div className="practice-option-section">
          <p className="practice-option-label">
            Choose a class
          </p>

          <div className="practice-choice-grid">
            {courses.map((course) => (
              <button
                key={course}
                type="button"
                className={
                  selectedCourse === course
                    ? 'practice-choice selected'
                    : 'practice-choice'
                }
                onClick={() => setSelectedCourse(course)}
              >
                {course}
              </button>
            ))}
          </div>
        </div>

        <div className="practice-option-section">
          <p className="practice-option-label">
            Choose a difficulty
          </p>

          <div className="practice-choice-grid">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                type="button"
                className={
                  selectedDifficulty === difficulty
                    ? 'practice-choice selected'
                    : 'practice-choice'
                }
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        <div className="practice-selection-summary">
          <span>{selectedCourse}</span>
          <span>•</span>
          <span>{selectedDifficulty}</span>
        </div>

        <button
          type="button"
          className="primary-button practice-start-button"
        >
          Start Practice →
        </button>
      </div>
    </section>
  )
}

export default PracticePage