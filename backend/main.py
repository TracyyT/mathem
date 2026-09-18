from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/")
def root():
    return {
        "message": "MathEm API is running"
    }


@app.post("/check-answer")
def check_answer(request: AnswerRequest):
    try:
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