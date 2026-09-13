import { useRef, useState } from 'react'

function TodayPage() {
    
  const [answer, setAnswer] = useState('')
  const answerInputRef = useRef(null)
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

        <span className="difficulty-badge">Medium</span>
      </div>

      <div className="problem-card">
        <div className="problem-meta">
          <span>Calculus I</span>
          <span>•</span>
          <span>Derivatives</span>
        </div>

        <div className="problem-content">
          <p className="problem-label">Solve</p>

          <h2>
            Find <span className="math-text">f′(x)</span> if
            <span className="math-text"> f(x) = x³ + 4x² - 2x + 7</span>.
          </h2>
        </div>

        <div className="answer-section">
          <label htmlFor="answer">Your answer</label>

          <input
            ref={answerInputRef}
            id="answer"
            type="text"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Enter your answer"
            />

          <div className="math-keyboard">
            {[
                '1', '2', '3', '4', '5',
                '6', '7', '8', '9', '0',
                'x', '+', '-', '×', '/',
                '(', ')', '^', '√', 'π',
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

          <button className="primary-button submit-answer">
            Submit answer
          </button>
        </div>
      </div>
    </section>
  )
}

export default TodayPage