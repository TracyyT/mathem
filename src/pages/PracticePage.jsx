import { useState, useRef } from 'react'
import {
  checkPracticeAnswer,
  generateProblem,
} from '../services/mathApi'
import MathDisplay from '../components/MathDisplay'

function PracticePage() {
    const [selectedCourse, setSelectedCourse] = useState('Calculus I')
    const [selectedDifficulty, setSelectedDifficulty] = useState('Medium')
    const [activeProblem, setActiveProblem] = useState(null)
    const [answer, setAnswer] = useState('')
    const [result, setResult] = useState(null)
    const [showHint, setShowHint] = useState(false)
    const answerInputRef = useRef(null)
    const [nextDifficultyChoice, setNextDifficultyChoice] = useState('Same')
    const [isChecking, setIsChecking] = useState(false)
    const [checkError, setCheckError] = useState(null) 
    const [isGenerating, setIsGenerating] = useState(false)
    const [generateError, setGenerateError] = useState(null)

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

        const startPractice = async () => {
        setIsGenerating(true)
        setGenerateError(null)

        try {
            const problem = await generateProblem(
            selectedCourse,
            selectedDifficulty,
            )

            setActiveProblem(problem)
            setAnswer('')
            setResult(null)
            setShowHint(false)
            setCheckError(null)
        } catch (error) {
            console.error(
            'Could not generate problem:',
            error,
            )

            setActiveProblem(null)
            setGenerateError(
            'Could not generate a practice problem right now. Please try again.',
            )
        } finally {
            setIsGenerating(false)
        }
        }

        const checkAnswer = async () => {
            if (
                !activeProblem ||
                !answer.trim() ||
                isChecking
            ) {
                return
            }

            setIsChecking(true)
            setCheckError(null)

            try {
                const data = await checkPracticeAnswer(
                activeProblem.id,
                answer,
                )

                if (data.error) {
                setResult(null)
                setCheckError(
                    'MathEm could not understand that answer. Try entering it another way.',
                )
                return
                }

                if (data.correct) {
                setResult('correct')
                setShowHint(false)
                } else {
                setResult('wrong')
                }
            } catch (error) {
                console.error(
                'Could not check answer:',
                error,
                )

                setResult(null)
                setCheckError(
                'Could not check your answer right now. Please try again.',
                )
            } finally {
                setIsChecking(false)
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
            setResult(null)
            setCheckError(null)

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
                setResult(null)
                setCheckError(null)

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
        setResult(null)

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

        const getNextDifficulty = () => {
            const levels = ['Easy', 'Medium', 'Hard']
            const currentIndex = levels.indexOf(selectedDifficulty)

            if (nextDifficultyChoice === 'Easier') {
                return levels[Math.max(0, currentIndex - 1)]
            }

            if (nextDifficultyChoice === 'Harder') {
                return levels[Math.min(levels.length - 1, currentIndex + 1)]
            }

            return selectedDifficulty
        }

        const practiceAnother = async () => {
        const nextDifficulty = getNextDifficulty()

        setIsGenerating(true)
        setGenerateError(null)

        try {
            const nextProblem = await generateProblem(
            selectedCourse,
            nextDifficulty,
            )

            setSelectedDifficulty(nextDifficulty)
            setActiveProblem(nextProblem)

            setAnswer('')
            setResult(null)
            setShowHint(false)
            setCheckError(null)
            setNextDifficultyChoice('Same')
        } catch (error) {
            console.error(
            'Could not generate problem:',
            error,
            )

            setGenerateError(
            'Could not generate another practice problem right now. Please try again.',
            )
        } finally {
            setIsGenerating(false)
        }
        }

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
        onClick={startPractice}
        disabled={isGenerating}
        >
        {isGenerating
            ? 'Generating...'
            : 'Generate Practice →'}
        </button>
        {generateError && (
            <p className="answer-error">
                {generateError}
            </p>
        )}

      </div>

        {activeProblem && (
        <div className="practice-problem-card">
            <div className="problem-meta">
            <span>{activeProblem.course}</span>
            <span>•</span>
            <span>{activeProblem.topic}</span>
            <span>•</span>
            <span>{activeProblem.difficulty}</span>
            </div>

            <div className="problem-content">
            <p className="problem-label">
                {activeProblem.prompt}
            </p>

            <MathDisplay
            math={
                activeProblem.displayExpression ||
                activeProblem.expression
            }
            />
            </div>

            <div className="answer-section">
            <label htmlFor="practice-answer">
                Your answer
            </label>

            <input
                ref={answerInputRef}
                id="practice-answer"
                type="text"
                value={answer}
                onChange={(event) => {
                    setAnswer(event.target.value)
                    setResult(null)
                    setShowHint(false)
                    setCheckError(null)
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
                onClick={() =>
                    insertAtCursor(key === 'Space' ? ' ' : key)
                }
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
                disabled={
                    isChecking || !answer.trim()
                }
                >
                {isChecking
                    ? 'Checking...'
                    : 'Submit answer'}
            </button>
            {checkError && (
            <p className="answer-error">
                {checkError}
            </p>
            )}
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

                        <p>{activeProblem.hint}</p>
                    </div>
                    )}
                </div>

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
            )}

            {result === 'correct' && (
                <div className="practice-complete-card">
                    <div className="practice-complete-header">
                    <div className="completed-check">✓</div>

                    <div>
                        <p className="practice-complete-title">
                        Nice work!
                        </p>

                        <p className="practice-complete-text">
                        Want to practice another?
                        </p>
                    </div>
                    </div>

                    <div className="next-difficulty">
                    <p className="next-difficulty-label">
                        How should the next one feel?
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
                    className="primary-button practice-another-button"
                    onClick={practiceAnother}
                    disabled={isGenerating}
                    >
                    {isGenerating
                        ? 'Generating...'
                        : 'Practice Another →'}
                    </button>
                    {generateError && (
                        <p className="answer-error">
                            {generateError}
                        </p>
                    )}
                </div>
                )}

            </div>
        </div>
        )}

    </section>
  )
}

export default PracticePage