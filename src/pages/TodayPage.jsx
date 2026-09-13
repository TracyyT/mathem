import { useRef, useState } from 'react'

function TodayPage() {
    
  const [answer, setAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [result, setResult] = useState(null)
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

    const checkAnswer = () => {
        const normalizedAnswer = answer
            .toLowerCase()
            .replaceAll(' ', '')
            .replaceAll('²', '^2')
            .replaceAll('*', '')
            .replaceAll('×', '')

        const acceptedAnswers = [
            '3x^2+8x-2',
            '8x+3x^2-2',
            '3x^2-2+8x',
        ]

        if (acceptedAnswers.includes(normalizedAnswer)) {
            setResult('correct')
        } else {
            setResult('wrong')
        }
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

          <button
            className="primary-button submit-answer"
            onClick={checkAnswer}
            >
            Submit answer
            </button>
            {result === 'wrong' && (
                <div className="answer-feedback wrong-feedback">
                    <div>
                    <p className="feedback-title">Not quite.</p>
                    <p className="feedback-text">
                        Give it another try, or use a hint if you need one.
                    </p>

                    {showHint && (
                        <div className="hint-box">
                        <p className="hint-label">Hint</p>
                        <p>
                            Differentiate each term separately using the power rule:
                            <span className="math-text"> d/dx(xⁿ) = nxⁿ⁻¹</span>.
                        </p>
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
                <div className="answer-feedback correct-feedback">
                    <div>
                    <p className="feedback-title">Correct!</p>
                    <p className="feedback-text">
                        Nice work.
                    </p>
                    </div>
                </div>
                )}

        </div>
      </div>
    </section>
  )
}

export default TodayPage