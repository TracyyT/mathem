import { Link } from 'react-router-dom'

function AboutPage() {
  return (
    <main className="about-page">
      <div className="about-nav">
        <Link to="/" className="about-brand">
          math'em
        </Link>

        <Link to="/home" className="primary-button">
          Open MathEm →
        </Link>
      </div>

      <section className="about-hero">
        <p className="page-eyebrow">About MathEm</p>

        <h1>
          Math practice that fits into your day.
        </h1>

        <p>
          MathEm is a personalized math-practice app built
          around one simple idea: consistent practice does not
          need to feel overwhelming.
        </p>
      </section>

      <section className="about-grid">
        <div className="about-card">
          <p className="card-label">01</p>

          <h2>One problem at a time</h2>

          <p>
            Practice stays focused and manageable instead of
            turning into another long assignment.
          </p>
        </div>

        <div className="about-card">
          <p className="card-label">02</p>

          <h2>On your schedule</h2>

          <p>
            Choose when you want to practice and let MathEm
            keep your routine simple.
          </p>
        </div>

        <div className="about-card">
          <p className="card-label">03</p>

          <h2>Built to adapt</h2>

          <p>
            Choose whether the next problem should feel easier,
            the same, or harder.
          </p>
        </div>
      </section>

      <section className="about-future">
        <p className="card-label">Where it's going</p>

        <h2>Smarter practice, without the clutter.</h2>

        <p>
          Future versions will expand into AI-generated
          questions, verified math answers, deeper progress
          tracking, and adaptive practice.
        </p>

        <Link to="/home" className="primary-button">
          Try MathEm →
        </Link>
      </section>
    </main>
  )
}

export default AboutPage