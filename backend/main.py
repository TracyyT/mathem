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


class AnswerRequest(BaseModel):
    student_answer: str
    correct_answer: str
    answer_type: str = "expression"


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

@app.get("/")
def root():
    return {
        "message": "MathEm API is running"
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