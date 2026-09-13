function HomePage() {
  return (
    <section className="page">
      <div className="home-header">
        <div>
          <p className="page-eyebrow">Overview</p>
          <h1>Ready to MathEm?</h1>
          <p className="page-description">
            One focused problem, whenever it fits your schedule.
          </p>
        </div>
      </div>

      <div className="today-card">
        <div>
          <p className="card-label">Today's MathEm</p>
          <h2>Calculus I</h2>
          <p className="card-meta">
            Derivatives · Medium
          </p>
        </div>

        <button className="primary-button home-start-button">
          Start →
        </button>
      </div>

      <div className="home-section">
        <div className="section-heading">
          <div>
            <p className="card-label">Your setup</p>
            <h2>Your practice</h2>
          </div>
        </div>

        <div className="practice-grid">
          <div className="practice-card">
            <p className="practice-label">Course</p>
            <h3>Calculus I</h3>
            <button className="card-action">Change →</button>
          </div>

          <div className="practice-card">
            <p className="practice-label">Challenge level</p>
            <h3>Medium</h3>
            <button className="card-action">Adjust →</button>
          </div>

          <div className="practice-card">
            <p className="practice-label">Schedule</p>
            <h3>3x per week</h3>
            <button className="card-action">Adjust →</button>
          </div>
        </div>
      </div>

      <div className="home-section">
        <div className="section-heading">
          <div>
            <p className="card-label">This week</p>
            <h2>Quick progress</h2>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <strong>4</strong>
            <span>MathEms completed</span>
          </div>

          <div className="stat-card">
            <strong>83%</strong>
            <span>Accuracy</span>
          </div>

          <div className="stat-card">
            <strong>3</strong>
            <span>Current streak</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomePage