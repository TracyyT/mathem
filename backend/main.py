from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import sympy as sp
import uuid

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

generated_problems = {}

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
        "verification": {
            "operation": "derivative",
            "expression": "2*x^3 + 5*x^2 - 4*x",
            "variable": "x",
        },
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
        "verification": {
            "operation": "indefinite-integral",
            "integrand": "4*x^3",
            "variable": "x",
        },        
    },
    {
        "id": 104,
        "course": "Calculus I",
        "topic": "Product Rule",
        "difficulty": "Hard",
        "prompt": "Differentiate:",
        "expression": "f(x) = x^2(x + 3)",
        "correct_answer": "3x^2 + 6x",
        "answer_type": "expression",
        "hint": "Use the product rule, or expand first and then differentiate.",
        "verification": {
            "operation": "derivative",
            "expression": "x^2 * (x + 3)",
            "variable": "x",
        },
    },
    {
        "id": 105,
        "course": "Algebra I",
        "topic": "Quadratic Equations",
        "difficulty": "Hard",
        "prompt": "Solve for x:",
        "expression": "x^2 - 5x + 6 = 0",
        "correct_answer": "2,3",
        "answer_type": "solution-set",
        "hint": "Factor the quadratic, then set each factor equal to 0.",
        "verification": {
            "operation": "solve-equation",
            "left_side": "x^2 - 5x + 6",
            "right_side": "0",
            "variable": "x",
        },
    },
    {
        "id": 106,
        "course": "Calculus II",
        "topic": "Definite Integrals",
        "difficulty": "Easy",
        "prompt": "Evaluate:",
        "expression": "∫₀² x dx",
        "correct_answer": "2",
        "answer_type": "expression",
        "hint": "Find an antiderivative, then evaluate it at the upper and lower bounds.",
        "verification": {
            "operation": "definite-integral",
            "integrand": "x",
            "variable": "x",
            "lower_bound": "0",
            "upper_bound": "2",
        },
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
    problem_id: str
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

def find_problem(problem_id: str):
    return generated_problems.get(problem_id)

def verify_candidate_problem(problem):
    try:
        verification = problem.get("verification")

        if verification:
            operation = verification.get("operation")

            if operation == "derivative":
                return verify_derivative_problem(problem)
            
            if operation == "solve-equation":
                return verify_equation_problem(problem)
            
            if operation == "definite-integral":
                return verify_definite_integral_problem(problem)
            
            if operation == "indefinite-integral":
                return verify_indefinite_integral_problem(problem)
                        
        answer_type = problem.get(
            "answer_type",
            "expression",
        )

        correct_answer = problem[
            "correct_answer"
        ]

        if answer_type == "solution-set":
            solutions = parse_solution_set(
                correct_answer
            )

            return len(solutions) > 0

        if answer_type == "indefinite-integral":
            answer = parse_math(correct_answer)

            x = sp.Symbol("x")
            derivative = sp.diff(answer, x)

            return derivative is not None

        answer = parse_math(correct_answer)

        return answer is not None

    except Exception:
        return False
    
def verify_derivative_problem(problem):
    verification = problem.get("verification")

    if not verification:
        return False

    if verification.get("operation") != "derivative":
        return False

    expression = parse_math(
        verification["expression"]
    )

    variable = sp.Symbol(
        verification.get("variable", "x")
    )

    expected_answer = sp.diff(
        expression,
        variable,
    )

    claimed_answer = parse_math(
        problem["correct_answer"]
    )

    return (
        sp.simplify(
            expected_answer - claimed_answer
        ) == 0
    )

def verify_equation_problem(problem):
    verification = problem.get("verification")

    if not verification:
        return False

    if (
        verification.get("operation")
        != "solve-equation"
    ):
        return False

    left_side = parse_math(
        verification["left_side"]
    )

    right_side = parse_math(
        verification["right_side"]
    )

    variable = sp.Symbol(
        verification.get("variable", "x")
    )

    equation = sp.Eq(
        left_side,
        right_side,
    )

    expected_solutions = set(
        sp.solve(equation, variable)
    )

    claimed_solutions = parse_solution_set(
        problem["correct_answer"]
    )

    return (
        expected_solutions
        == claimed_solutions
    )

def verify_definite_integral_problem(problem):
    verification = problem.get("verification")

    if not verification:
        return False

    if (
        verification.get("operation")
        != "definite-integral"
    ):
        return False

    integrand = parse_math(
        verification["integrand"]
    )

    variable = sp.Symbol(
        verification.get("variable", "x")
    )

    lower_bound = parse_math(
        verification["lower_bound"]
    )

    upper_bound = parse_math(
        verification["upper_bound"]
    )

    expected_answer = sp.integrate(
        integrand,
        (
            variable,
            lower_bound,
            upper_bound,
        ),
    )

    claimed_answer = parse_math(
        problem["correct_answer"]
    )

    return (
        sp.simplify(
            expected_answer - claimed_answer
        ) == 0
    )

def verify_indefinite_integral_problem(problem):
    verification = problem.get("verification")

    if not verification:
        return False

    if (
        verification.get("operation")
        != "indefinite-integral"
    ):
        return False

    integrand = parse_math(
        verification["integrand"]
    )

    variable = sp.Symbol(
        verification.get("variable", "x")
    )

    expected_antiderivative = sp.integrate(
        integrand,
        variable,
    )

    claimed_answer = parse_math(
        problem["correct_answer"]
    )

    claimed_constants = (
        claimed_answer.free_symbols - {variable}
    )

    if not claimed_constants:
        return False
    
    claimed_derivative = sp.diff(
        claimed_answer,
        variable,
    )

    expected_derivative = sp.diff(
        expected_antiderivative,
        variable,
    )

    return (
        sp.simplify(
            claimed_derivative
            - expected_derivative
        ) == 0
    )

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
    if not verify_candidate_problem(problem):
        return {
            "error": "Generated problem could not be verified."
        }
    problem_id = str(uuid.uuid4())

    generated_problems[problem_id] = problem

    return {
        "id": problem_id,
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