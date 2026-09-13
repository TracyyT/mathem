import { useRef, useState } from 'react'
import problems from '../data/problems'
import getProblem from '../utils/getProblem'

function TodayPage() {
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [nextDifficultyChoice, setNextDifficultyChoice] = useState('Same')

  const answerInputRef = useRef(null)

    const selectedCourse = 'Algebra I'
    const selectedDifficulty = 'Easy'

    const problem = getProblem(
        problems,
        selectedCourse,
        selectedDifficulty,
    )

  const normalizeAnswer = (value) => {
    return value
      .toLowerCase()
      .replaceAll(' ', '')
      .replaceAll('²', '^2')
      .replaceAll('*', '')
      .replaceAll('×', '')
  }

  const checkAnswer = () => {
    const normalizedAnswer = normalizeAnswer(answer)

    const acceptedAnswers =
      problem.acceptedAnswers.map(normalizeAnswer)

    if (acceptedAnswers.includes(normalizedAnswer)) {
      setResult('correct')
      setShowHint(false)
    } else {
      setResult('wrong')
    }
  }

  const insertAtCursor = (value) => {
    const input = answerInputRef.current

    if (!input) return

    const start = input.selectionStart
    const end = input.selectionEnd

    const updatedAnswer =
      answer.slice(0, start) +
      value +
      answer.slice(end)

    setAnswer(updatedAnswer)

    requestAnimationFrame(() => {
      const newPosition = start + value.length

      input.focus()
      input.setSelectionRange(newPosition, newPosition)
    })
  }

  const deleteAtCursor = () => {
    const input = answerInputRef.current

    if (!input) return

    const start = input.selectionStart
    const end = input.selectionEnd

    if (start !== end) {
      const updatedAnswer =
        answer.slice(0, start) +
        answer.slice(end)

      setAnswer(updatedAnswer)

      requestAnimationFrame(() => {
        input.focus()
        input.setSelectionRange(start, start)
      })

      return
    }

    if (start === 0) return

    const updatedAnswer =
      answer.slice(0, start - 1) +
      answer.slice(start)

    setAnswer(updatedAnswer)

    requestAnimationFrame(() => {
      input.focus()
      input.setSelectionRange(start - 1, start - 1)
    })
  }

  const moveCursor = (direction) => {
    const input = answerInputRef.current

    if (!input) return

    const position = input.selectionStart

    const newPosition =
      direction === 'left'
        ? Math.max(0, position - 1)
        : Math.min(answer.length, position + 1)

    input.focus()
    input.setSelectionRange(newPosition, newPosition)
  }

  if (!problem) {
    return (
        <section className="page">
        <p className="page-eyebrow">Today</p>
        <h1>No MathEm available.</h1>
        <p className="page-description">
            We couldn't find a problem matching your current practice settings.
        </p>
        </section>
      )
    }

    if (isCompleted) {
    return (
        <section className="page">
        <p className="page-eyebrow">Today</p>

        <div className="completed-card">
            <div className="completed-check">✓</div>

            <h1>MathEm’d for today.</h1>

            <p className="page-description">
            Nice work. Your next MathEm will follow your practice schedule.
            </p>

            <div className="completed-summary">
            <span>{problem.course}</span>
            <span>•</span>
            <span>{problem.topic}</span>
            <span>•</span>
            <span>{problem.difficulty}</span>
            </div>
        </div>
        </section>
    )
    }

  return (
    <section className="page">
      <div className="problem-header">
        <div>
          <p className="page-eyebrow">Today</p>

          <h1>Your MathEm is ready.</h1>

          <p className="page-description">
            Take your time. One problem is enough.
          </p>
        </div>

        <span className="difficulty-badge">
          {problem.difficulty}
        </span>
      </div>

      <div className="problem-card">
        <div className="problem-meta">
          <span>{problem.course}</span>
          <span>•</span>
          <span>{problem.topic}</span>
        </div>

        <div className="problem-content">
          <p className="problem-label">
            {problem.prompt}
          </p>

          <h2 className="math-text">
            {problem.expression}
          </h2>
        </div>

        <div className="answer-section">
          <label htmlFor="answer">
            Your answer
          </label>

          <input
            ref={answerInputRef}
            id="answer"
            type="text"
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value)
              setResult(null)
              setShowHint(false)
            }}
            placeholder="Enter your answer"
          />

          <div className="math-keyboard">
            {[
                '1', '2', '3', '4', '5',
                '6', '7', '8', '9', '0',
                'x', '+', '-', '×', '/',
                '(', ')', '^', '√', 'π',
                ',', 'Space',
            ].map((key) => (
                <button
                key={key}
                type="button"
                onClick={() => insertAtCursor(key)}
                >
                {key}
                </button>
            ))}

            <button
                type="button"
                className="keyboard-control"
                onClick={() => moveCursor('left')}
            >
                ←
            </button>

            <button
                type="button"
                className="keyboard-control"
                onClick={() => moveCursor('right')}
            >
                →
            </button>

            <button
                type="button"
                className="keyboard-control delete-key"
                onClick={deleteAtCursor}
            >
                Delete
            </button>
            </div>

          <button
            type="button"
            className="primary-button submit-answer"
            onClick={checkAnswer}
          >
            Submit answer
          </button>

          {result === 'wrong' && (
            <div className="answer-feedback wrong-feedback">
              <div>
                <p className="feedback-title">
                  Not quite.
                </p>

                <p className="feedback-text">
                  Give it another try, or use a hint if you need one.
                </p>

                {showHint && (
                  <div className="hint-box">
                    <p className="hint-label">
                      Hint
                    </p>

                    <p>{problem.hint}</p>
                  </div>
                )}
              </div>

              <div className="feedback-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setResult(null)
                    setShowHint(false)
                    answerInputRef.current?.focus()
                  }}
                >
                  Try Again
                </button>

                {!showHint && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setShowHint(true)}
                  >
                    Hint
                  </button>
                )}
              </div>
            </div>
          )}

         {result === 'correct' && (
            <div className="mathemd-overlay">
                <div className="mathemd-card">
                <div className="mathemd-celebration">
                <div className="mathemd-check">✓</div>

                <p className="mathemd-title">MathEm’d!</p>

                <p className="mathemd-message">
                    You got it right.
                </p>

                <div className="streak-earned">
                    +1 🔥
                </div>
                </div>

                <div className="next-difficulty">
                <p className="next-difficulty-label">
                    How should the next MathEm feel?
                </p>

                <div className="difficulty-options">
                {['Easier', 'Same', 'Harder'].map((choice) => (
                    <button
                    key={choice}
                    type="button"
                    className={
                        nextDifficultyChoice === choice
                        ? 'selected'
                        : ''
                    }
                    onClick={() => setNextDifficultyChoice(choice)}
                    >
                    {choice}
                    </button>
                ))}
                </div>
                </div>

                <button
                    type="button"
                    className="primary-button done-button"
                    onClick={() => {
                        setIsCompleted(true)
                        setResult(null)
                        }}
                    >
                    Done
                    </button>

              </div>
            </div>
            )}

        </div>
      </div>
    </section>
  )
}

export default TodayPage