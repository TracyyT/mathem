import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <main className="landing-page">
      <section className="landing-card">
        <p className="brand">math'em</p>

        <h1>One problem at a time, on your schedule.</h1>

        <p className="landing-description">
          Build a steady math habit with personalized practice that keeps things
          simple, focused, and manageable.
        </p>

        <button
          className="primary-button"
          onClick={() => navigate('/home')}
        >
          Let's get started
        </button>

        <button
          className="text-button"
          onClick={() => navigate('/about')}
        >
          Explore MathEm →
        </button>
      </section>
    </main>
  )
}

export default LandingPage