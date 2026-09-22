# MathEm

**One problem at a time, on your schedule.**

MathEm is a personalized math practice web app designed to make consistent practice simple, focused, and manageable. Instead of overwhelming users with long problem sets, MathEm provides one problem at a time based on the user's course, difficulty, and practice schedule.

**Live Demo:** https://mathem.vercel.app

## About

MathEm combines scheduled practice with on-demand problem solving. Users can choose a math course, challenge level, and practice schedule, then receive a MathEm on their scheduled practice days.

Problems are dynamically generated using AI and independently verified with SymPy before being presented to the user. Answers are checked server-side so the correct answer is never exposed to the frontend.

After completing a scheduled MathEm, users can also choose whether their next problem should be easier, the same difficulty, or harder.

## Features

* Algebra I, Calculus I, and Calculus II practice
* AI-generated math problems
* Independent SymPy problem verification
* Server-side answer checking
* Easy, Medium, and Hard difficulty levels
* Custom practice schedules

  * Daily
  * 3x per week
  * Weekly
* User-selected practice days
* Scheduled Today's MathEm
* Unlimited Practice mode
* Custom math input keyboard
* Hints and immediate answer feedback
* Easier / Same / Harder preference after completion
* Schedule-based streak tracking
* Persistent preferences and progress with localStorage
* Progress and settings overview
* Duplicate-problem prevention
* Mathematical expressions rendered with KaTeX

## How It Works

### Today

The Today page checks the user's selected practice schedule and determines whether a MathEm is scheduled for that day.

When a problem is needed, the frontend requests one from the FastAPI backend. The backend generates a candidate problem using AI, independently verifies it with SymPy, and returns the problem with a unique ID while keeping the correct answer on the server.

After solving the problem, users can choose whether their next scheduled MathEm should be:

**Easier · Same · Harder**

The preference applies to the next scheduled problem while preserving the user's baseline difficulty setting.

### Practice

Practice mode allows users to solve additional problems at any time without affecting their scheduled MathEm or streak.

Users can select a course and difficulty and continue generating new problems as they practice.

## Problem Generation and Verification

MathEm uses a verification pipeline rather than directly displaying AI-generated math problems.

```text
Course + Difficulty
        ↓
AI-generated candidate problem
        ↓
Structured problem data
        ↓
Independent SymPy verification
        ↓
Reject and regenerate if invalid
        ↓
Store correct answer on backend
        ↓
Return public problem + unique ID
        ↓
User submits answer
        ↓
Server-side SymPy answer checking
```

This design separates AI generation from mathematical verification. The frontend never receives the stored correct answer.

## Tech Stack

### Frontend

* React
* JavaScript
* Vite
* React Router
* KaTeX
* CSS
* Browser localStorage

### Backend

* Python
* FastAPI
* SymPy
* OpenAI API
* Pydantic

### Deployment

* Vercel — frontend
* Render — FastAPI backend

## Architecture

```text
React / Vite Frontend
        ↓
     REST API
        ↓
FastAPI Backend
   ↙         ↘
OpenAI       SymPy
Generation   Verification
```

The frontend handles the user interface, scheduling preferences, and local progress. The backend is responsible for generating problems, validating their mathematical correctness, storing generated answers, and checking submitted answers.

## Current Courses

### Algebra I

Practice includes generated algebraic equations with difficulty-based variation.

### Calculus I

Practice includes derivative problems with different function structures and difficulty levels.

### Calculus II

Practice includes definite and indefinite integration problems.

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/TracyyT/mathem.git
cd mathem
```

### 2. Install frontend dependencies

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

### 3. Set up the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
OPENAI_API_KEY=your_openai_api_key
```

Start the API:

```bash
uvicorn main:app --reload
```

The frontend and backend can then run locally together.

## Future Development

Potential future improvements include:

* User accounts and cloud-based progress storage
* Completion history and accuracy statistics
* Topic-level practice selection
* Topic mastery and practice trends
* More courses and problem types
* Improved adaptive difficulty
* Expanded mathematical input support
* Improved mobile experience
* Persistent backend storage for generated problems

## Project Philosophy

> Math practice does not need to feel like another assignment.

MathEm is designed around short, personalized, and consistent practice — one problem at a time.

**Ready to MathEm?**
