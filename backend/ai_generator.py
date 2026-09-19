import os
from typing import Literal

from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel


load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


class EquationVerification(BaseModel):
    operation: Literal["solve-equation"]
    left_side: str
    right_side: str
    variable: Literal["x"]


class EquationProblemCandidate(BaseModel):
    topic: str
    prompt: str
    expression: str
    correct_answer: str
    answer_type: Literal["solution-set"]
    hint: str
    verification: EquationVerification

class DerivativeVerification(BaseModel):
    operation: Literal["derivative"]
    expression: str
    variable: Literal["x"]


class DerivativeProblemCandidate(BaseModel):
    topic: str
    prompt: str
    expression: str
    correct_answer: str
    answer_type: Literal["expression"]
    hint: str
    verification: DerivativeVerification

class DefiniteIntegralVerification(BaseModel):
    operation: Literal["definite-integral"]
    integrand: str
    variable: Literal["x"]
    lower_bound: str
    upper_bound: str


class DefiniteIntegralProblemCandidate(BaseModel):
    topic: str
    prompt: str
    expression: str
    correct_answer: str
    answer_type: Literal["expression"]
    hint: str
    verification: DefiniteIntegralVerification

def generate_equation_candidate(
    course: str,
    difficulty: str,
):
    response = client.responses.parse(
        model="gpt-5.6-luna",
        input=[
            {
                "role": "system",
                "content": (
                    "You generate short math practice "
                    "problems for students. Problems must "
                    "be solvable by hand. Use plain-text "
                    "mathematical expressions that SymPy "
                    "can parse for verification fields."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Generate one {course} "
                    f"{difficulty.lower()}-difficulty "
                    "equation-solving problem. "
                    "The operation must be "
                    "solve-equation. Use x as the "
                    "variable."
                ),
            },
        ],
        text_format=EquationProblemCandidate,
    )

    return response.output_parsed.model_dump()

def generate_derivative_candidate(
    course: str,
    difficulty: str,
):
    response = client.responses.parse(
        model="gpt-5.6-luna",
        input=[
            {
                "role": "system",
                "content": (
                    "You generate short math practice "
                    "problems for students. Problems must "
                    "be solvable by hand. Use plain-text "
                    "mathematical expressions that SymPy "
                    "can parse for all verification fields. "
                    "Do not include an equals sign or "
                    "function definition in the verification "
                    "expression."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Generate one {course} "
                    f"{difficulty.lower()}-difficulty "
                    "derivative problem. "
                    "The operation must be derivative. "
                    "Use x as the variable."
                ),
            },
        ],
        text_format=DerivativeProblemCandidate,
    )

    return response.output_parsed.model_dump()

def generate_definite_integral_candidate(
    course: str,
    difficulty: str,
):
    response = client.responses.parse(
        model="gpt-5.6-luna",
        input=[
            {
                "role": "system",
                "content": (
                    "You generate short math practice "
                    "problems for students. Problems must "
                    "be solvable by hand. Use plain-text "
                    "mathematical expressions that SymPy "
                    "can parse for all verification fields. "
                    "For definite integrals, provide the "
                    "integrand separately from the bounds "
                    "in the verification fields."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Generate one {course} "
                    f"{difficulty.lower()}-difficulty "
                    "definite integral problem. "
                    "The operation must be "
                    "definite-integral. "
                    "Use x as the variable. "
                    "Create a fresh problem with different "
                    "coefficients, bounds, and integrand. "
                    "Keep the problem short and reasonable "
                    "to solve by hand. "
                    "For medium difficulty, use one main "
                    "integration technique rather than "
                    "combining several advanced techniques. "
                    "Do not always use logarithms."
                ),
            },
        ],
        text_format=DefiniteIntegralProblemCandidate,
    )

    return response.output_parsed.model_dump()

def generate_verified_equation_problem(
    course: str,
    difficulty: str,
    verifier,
    max_attempts: int = 3,
):
    for attempt in range(
        1,
        max_attempts + 1,
    ):
        candidate = generate_equation_candidate(
            course,
            difficulty,
        )

        if verifier(candidate):
            return candidate

        print(
            f"AI candidate failed verification "
            f"(attempt {attempt}/{max_attempts})"
        )

    return None

def generate_verified_derivative_problem(
    course: str,
    difficulty: str,
    verifier,
    max_attempts: int = 3,
):
    for attempt in range(
        1,
        max_attempts + 1,
    ):
        candidate = generate_derivative_candidate(
            course,
            difficulty,
        )
        
        if verifier(candidate):
            return candidate

        print(
            f"AI derivative candidate failed "
            f"verification "
            f"(attempt {attempt}/{max_attempts})"
        )

    return None

def generate_verified_definite_integral_problem(
    course: str,
    difficulty: str,
    verifier,
    max_attempts: int = 3,
):
    for attempt in range(
        1,
        max_attempts + 1,
    ):
        candidate = (
            generate_definite_integral_candidate(
                course,
                difficulty,
            )
        )

        if verifier(candidate):
            return candidate

        print(
            f"AI definite integral candidate failed "
            f"verification "
            f"(attempt {attempt}/{max_attempts})"
        )

    return None