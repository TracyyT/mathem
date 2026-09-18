from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import sympy as sp

from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application,
    convert_xor,
)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


transformations = (
    standard_transformations
    + (
        implicit_multiplication_application,
        convert_xor,
    )
)

problem_bank = [
    {
        "id": 101,
        "course": "Algebra I",
        "topic": "Linear Equations",
        "difficulty": "Easy",
        "prompt": "Solve for x:",
        "expression": "4x + 3 = 19",
        "correct_answer": "4",
        "answer_type": "expression",
        "hint": "Subtract 3 from both sides, then divide by 4.",
    },
    {
        "id": 102,
        "course": "Calculus I",
        "topic": "Derivatives",
        "difficulty": "Medium",
        "prompt": "Differentiate:",
        "expression": "f(x) = 2x^3 + 5x^2 - 4x",
        "correct_answer": "6x^2 + 10x - 4",
        "answer_type": "expression",
        "hint": "Differentiate each term using the power rule.",
    },
    {
        "id": 103,
        "course": "Calculus II",
        "topic": "Integration",
        "difficulty": "Medium",
        "prompt": "Find the indefinite integral:",
        "expression": "∫ 4x^3 dx",
        "correct_answer": "x^4 + C",
        "answer_type": "indefinite-integral",
        "hint": "Increase the exponent by 1, then divide by the new exponent.",
    },
]

class AnswerRequest(BaseModel):
    student_answer: str
    correct_answer: str
    answer_type: str = "expression"

class ProblemRequest(BaseModel):
    course: str
    difficulty: str

class PracticeAnswerRequest(BaseModel):
    problem_id: int
    student_answer: str

def parse_math(expression: str):
    expression = (
        expression
        .replace("²", "^2")
        .replace("³", "^3")
        .replace("×", "*")
        .replace("÷", "/")
    )

    return parse_expr(
        expression,
        transformations=transformations,
    )


def parse_solution_set(expression: str):
    expression = (
        expression
        .lower()
        .replace("x", "")
        .replace("=", "")
        .replace("and", ",")
        .replace(" ", "")
    )

    values = expression.split(",")

    return {
        parse_math(value)
        for value in values
        if value
    }

def check_indefinite_integral(
    student_answer: str,
    correct_answer: str,
):
    student = parse_math(student_answer)
    correct = parse_math(correct_answer)

    x = sp.Symbol("x")

    student_constants = (
        student.free_symbols - {x}
    )

    if not student_constants:
        return False

    student_derivative = sp.diff(student, x)
    correct_derivative = sp.diff(correct, x)

    return (
        sp.simplify(
            student_derivative
            - correct_derivative
        ) == 0
    )

def find_problem(problem_id: int):
    for problem in problem_bank:
        if problem["id"] == problem_id:
            return problem

    return None

@app.get("/")
def root():
    return {
        "message": "MathEm API is running"
    }

@app.post("/generate-problem")
def generate_problem(request: ProblemRequest):
    matching_problems = [
        problem
        for problem in problem_bank
        if (
            problem["course"] == request.course
            and problem["difficulty"] == request.difficulty
        )
    ]

    if not matching_problems:
        return {
            "error": "No matching problem found."
        }

    problem = matching_problems[0]

    return {
        "id": problem["id"],
        "course": problem["course"],
        "topic": problem["topic"],
        "difficulty": problem["difficulty"],
        "prompt": problem["prompt"],
        "expression": problem["expression"],
        "hint": problem["hint"],
    }

@app.post("/check-answer")
def check_answer(request: AnswerRequest):
    try:
        if request.answer_type == "solution-set":
            student = parse_solution_set(
                request.student_answer
            )

            correct = parse_solution_set(
                request.correct_answer
            )

            return {
                "correct": student == correct
            }
        if request.answer_type == "indefinite-integral":
            is_correct = check_indefinite_integral(
                request.student_answer,
                request.correct_answer,
            )

            return {
                "correct": bool(is_correct)
        } 
        
        student = parse_math(
            request.student_answer
        )

        correct = parse_math(
            request.correct_answer
        )

        is_correct = (
            sp.simplify(student - correct) == 0
        )

        return {
            "correct": bool(is_correct)
        }

    except Exception:
        return {
            "correct": False,
            "error": "Could not understand the math expression."
        }
    
@app.post("/check-practice-answer")
def check_practice_answer(
    request: PracticeAnswerRequest
):
    problem = find_problem(request.problem_id)

    if not problem:
        return {
            "correct": False,
            "error": "Problem not found."
        }

    try:
        answer_type = problem.get(
            "answer_type",
            "expression",
        )

        correct_answer = problem[
            "correct_answer"
        ]

        if answer_type == "solution-set":
            student = parse_solution_set(
                request.student_answer
            )

            correct = parse_solution_set(
                correct_answer
            )

            return {
                "correct": student == correct
            }

        if answer_type == "indefinite-integral":
            is_correct = check_indefinite_integral(
                request.student_answer,
                correct_answer,
            )

            return {
                "correct": bool(is_correct)
            }

        student = parse_math(
            request.student_answer
        )

        correct = parse_math(
            correct_answer
        )

        is_correct = (
            sp.simplify(student - correct) == 0
        )

        return {
            "correct": bool(is_correct)
        }

    except Exception:
        return {
            "correct": False,
            "error": "Could not understand the math expression."
        }