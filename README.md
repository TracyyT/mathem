# MathEm

**One problem at a time, on your schedule.**

MathEm is a personalized math-practice web app designed to make consistent practice simple, focused, and manageable.

**Live Demo:** https://tracyyt.github.io/mathem/

## About

Instead of giving users long problem sets, MathEm focuses on one scheduled problem at a time while still allowing users to practice whenever they want.

Users can choose their math course, challenge level, and practice schedule. MathEm then provides a problem on scheduled practice days and lets users decide whether their next problem should be easier, the same, or harder.

## Current Features

- Algebra I, Calculus I, and Calculus II practice
- Easy, Medium, and Hard challenge levels
- Custom practice schedules
  - Daily
  - 3x per week
  - Weekly
- User-selected practice days
- Scheduled Today's MathEm
- Separate unlimited Practice mode
- Custom math input keyboard
- Answer checking and hints
- Easier / Same / Harder preference after completion
- Daily completion tracking
- Local streak tracking
- Persistent preferences and progress using localStorage
- Progress and settings overview

## How It Works

### Today

The Today page checks the user's practice schedule and provides a MathEm when practice is scheduled for that day.

After solving the problem, users can choose whether they want their next MathEm to feel:

**Easier · Same · Harder**

### Practice

Practice mode lets users solve additional problems at any time without affecting their scheduled MathEm.

Users can select a course and challenge level and continue practicing immediately after completing a problem.

## Tech Stack

**Frontend**
- React
- JavaScript
- Vite
- React Router
- CSS

**Current Storage**
- Browser localStorage

**Planned Backend**
- Python
- FastAPI
- SymPy

## Future Development

MathEm is currently an early MVP. Planned features include:

- Larger math problem bank
- AI-generated practice questions
- SymPy-based mathematical answer verification
- Adaptive difficulty
- Schedule-based streak tracking
- Completion history and accuracy
- Topic mastery and practice trends
- User accounts and cloud storage
- Improved mobile experience

A future problem-generation pipeline will use AI to generate candidate math problems while independently verifying their mathematical correctness before presenting them to users.

## Project Philosophy

> Math practice does not need to feel like another assignment.

MathEm is designed around short, personalized, and consistent practice — one problem at a time.

**Ready to MathEm?**