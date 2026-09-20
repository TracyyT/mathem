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

class IndefiniteIntegralVerification(BaseModel):
    operation: Literal["indefinite-integral"]
    integrand: str
    variable: Literal["x"]


class IndefiniteIntegralProblemCandidate(BaseModel):
    topic: str
    prompt: str
    expression: str
    correct_answer: str
    answer_type: Literal["indefinite-integral"]
    hint: str
    verification: IndefiniteIntegralVerification

ALGEBRA_I_EASY_STRUCTURES = [
    (
        "addition or subtraction",
        "Use an equation of the form x + a = b "
        "or x - a = b. Use small integers. "
        "Vary the constants and vary between "
        "addition and subtraction."
    ),
    (
        "multiplication",
        "Use an equation of the form a*x = b. "
        "Choose small integers so the solution "
        "is an integer. Vary the coefficient "
        "and solution across generated problems."
    ),
    (
        "division",
        "Use an equation of the form x/a = b. "
        "Choose small nonzero integers so the "
        "solution is an integer. Vary both the "
        "divisor and solution across generated "
        "problems."
    ),
    (
        "two-step",
        "Use an equation of the form a*x + b = c "
        "or a*x - b = c. Use small integers and "
        "make the solution an integer. Vary the "
        "coefficient, constants, and whether the "
        "equation uses addition or subtraction."
    ),
]
algebra_i_easy_structure_index = 0


def get_next_algebra_i_easy_structure():
    global algebra_i_easy_structure_index

    structure = ALGEBRA_I_EASY_STRUCTURES[
        algebra_i_easy_structure_index
    ]

    algebra_i_easy_structure_index = (
        algebra_i_easy_structure_index + 1
    ) % len(ALGEBRA_I_EASY_STRUCTURES)

    return structure

def get_algebra_difficulty_instructions(
    difficulty: str,
):
    rubrics = {
        "Easy": (
            "Generate a one-step or two-step linear "
            "equation with exactly one real solution. "
            "Use small integer coefficients and keep "
            "the arithmetic simple. Do not use "
            "parentheses, quadratics, or variables on "
            "both sides. The solution should be an "
            "integer."
        ),
        "Medium": (
            "Generate a multi-step linear equation "
            "with exactly one real solution. Use "
            "parentheses, distribution, combining like "
            "terms, or variables on both sides. Use "
            "integer coefficients and keep the "
            "arithmetic reasonable by hand. Do not "
            "generate quadratic equations."
        ),
        "Hard": (
            "Generate an Algebra I quadratic equation "
            "that requires factoring, completing the "
            "square, or the quadratic formula. The "
            "equation may require rearranging terms "
            "before solving. Keep all coefficients "
            "small and reasonable for hand calculation. "
            "Require real solutions. If the solutions "
            "are irrational, keep the radicals simple, "
            "such as sqrt(2), sqrt(3), sqrt(5), or "
            "sqrt(7). Avoid large discriminants or "
            "complicated radicals."
        ),
    }

    return rubrics.get(
        difficulty,
        rubrics["Medium"],
    )

CALCULUS_I_EASY_STRUCTURES = [
    (
        "polynomial",
        "Use a polynomial with 3 to 5 terms and "
        "small integer coefficients."
    ),
    (
        "negative powers",
        "Include at least one negative integer power "
        "of x, such as x**-2 or x**-3. Keep the "
        "rest of the expression simple."
    ),
    (
        "fractional powers",
        "Include at least one fractional power of x, "
        "such as x**(1/2) or x**(3/2). Keep the "
        "rest of the expression simple."
    ),
    (
        "basic trigonometric",
        "Use a simple sum or difference containing "
        "sin(x) or cos(x), possibly with a basic "
        "polynomial term. Do not place another "
        "function inside sin or cos."
    ),
    (
        "basic exponential",
        "Use a simple sum or difference containing "
        "exp(x), possibly with a basic polynomial "
        "term. Do not use exp of a composite "
        "expression."
    ),
]

calculus_i_easy_structure_index = 0
def get_next_calculus_i_easy_structure():
    global calculus_i_easy_structure_index

    structure = CALCULUS_I_EASY_STRUCTURES[
        calculus_i_easy_structure_index
    ]

    calculus_i_easy_structure_index = (
        calculus_i_easy_structure_index + 1
    ) % len(CALCULUS_I_EASY_STRUCTURES)

    return structure

def get_calculus_i_difficulty_instructions(
    difficulty: str,
):
    rubrics = {
        "Easy": (
            "Generate a basic derivative problem using "
            "direct differentiation rules only: the power "
            "rule, constant multiple rule, sum and "
            "difference rules, or basic derivatives of "
            "sin(x), cos(x), and exp(x). Keep coefficients "
            "small and the expression reasonable by hand. "
            "Do not require the product rule, quotient "
            "rule, or chain rule."
        ),
        "Medium": (
            "Generate a derivative problem requiring "
            "exactly one main derivative technique: "
            "the product rule, quotient rule, or chain "
            "rule. Vary which of these techniques is "
            "used across generated problems. Keep the "
            "functions simple and the algebra reasonable "
            "by hand. Do not combine multiple major "
            "derivative rules in the same problem."
        ),
        "Hard": (
            "Generate a derivative problem requiring "
            "exactly two main derivative techniques. "
            "Examples include product plus chain, "
            "quotient plus chain, or product plus "
            "quotient. Keep the expression compact and "
            "reasonable to differentiate by hand. "
            "Use at most two main function factors. "
            "Trigonometric or exponential functions may "
            "be used, but avoid logarithms of composite "
            "functions, deeply nested functions, and "
            "expressions that require three or more "
            "major derivative rules."
        ),
    }

    return rubrics.get(
        difficulty,
        rubrics["Medium"],
    )

def get_calculus_ii_difficulty_instructions(
    difficulty: str,
):
    rubrics = {
        "Easy": (
            "Generate a basic integral that can be "
            "solved directly using standard "
            "antiderivative rules, such as the power "
            "rule, constant multiple rule, or simple "
            "sums and differences. Use small integer "
            "coefficients. Do not require substitution, "
            "integration by parts, trigonometric "
            "substitution, or other advanced techniques."
        ),
        "Medium": (
            "Generate an integral requiring exactly one "
            "main integration technique: straightforward "
            "u-substitution or basic integration by "
            "parts. Keep the expression compact and "
            "reasonable to solve by hand. Do not require "
            "trigonometric substitution, repeated "
            "integration by parts, or multiple major "
            "integration techniques."
        ),
        "Hard": (
            "Generate an integral requiring a more "
            "advanced Calculus II technique, such as "
            "trigonometric substitution, repeated "
            "integration by parts, or a more involved "
            "substitution. Keep the expression reasonable "
            "to solve by hand. Use only one main advanced "
            "strategy and avoid combining several "
            "unrelated advanced techniques."
        ),
    }

    return rubrics.get(
        difficulty,
        rubrics["Medium"],
    )

def generate_equation_candidate(
    course: str,
    difficulty: str,
):
    difficulty_instructions = (
        get_algebra_difficulty_instructions(
            difficulty
        )
    )

    easy_structure_instructions = ""

    if difficulty == "Easy":
        structure_name, structure_instructions = (
            get_next_algebra_i_easy_structure()
        )

        easy_structure_instructions = (
            "\n\nEasy problem structure:\n"
            f"{structure_name}\n"
            f"{structure_instructions}"
        )
        
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
                    "Use x as the variable. "
                    "The operation must be solve-equation. "
                    "The answer_type must be solution-set. "
                    "Create a fresh problem with different "
                    "coefficients from previous examples. "
                    "The problem must be reasonable to solve "
                    "by hand.\n\n"
                    "Difficulty requirements:\n"
                    f"{difficulty_instructions}"
                    f"{easy_structure_instructions}"
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
    difficulty_instructions = (
        get_calculus_i_difficulty_instructions(
            difficulty
        )
    )
    easy_structure_instructions = ""

    if difficulty == "Easy":
        structure_name, structure_instructions = (
            get_next_calculus_i_easy_structure()
        )

        easy_structure_instructions = (
            "\n\nEasy problem structure:\n"
            f"{structure_name}\n"
            f"{structure_instructions}"
        )

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
                    "Use x as the variable. "
                    "The verification expression must be "
                    "valid SymPy syntax and contain only "
                    "the function being differentiated, "
                    "not an equation or function definition. "
                    "Keep the problem reasonable to solve "
                    "by hand.\n\n"
                    "Difficulty requirements:\n"
                    f"{difficulty_instructions}"
                    f"{easy_structure_instructions}"
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
    difficulty_instructions = (
        get_calculus_ii_difficulty_instructions(
            difficulty
        )
    )
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
                    "Choose bounds that keep the exact "
                    "answer reasonable to calculate by hand. "
                    "Create a fresh problem with different "
                    "coefficients, bounds, and integrands. "
                    "The verification integrand and bounds "
                    "must use valid SymPy syntax. "
                    "Keep the problem reasonable to solve "
                    "by hand.\n\n"
                    "Difficulty requirements:\n"
                    f"{difficulty_instructions}"
                ),
            },
        ],
        text_format=DefiniteIntegralProblemCandidate,
    )

    return response.output_parsed.model_dump()

def generate_indefinite_integral_candidate(
    course: str,
    difficulty: str,
):
    difficulty_instructions = (
        get_calculus_ii_difficulty_instructions(
            difficulty
        )
    )
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
                    "For indefinite integrals, the correct "
                    "answer must include a symbolic "
                    "arbitrary constant such as + C."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Generate one {course} "
                    f"{difficulty.lower()}-difficulty "
                    "indefinite integral problem. "
                    "The operation must be "
                    "indefinite-integral. "
                    "Use x as the variable. "
                    "Create a fresh problem with different "
                    "coefficients and integrands. "
                    "Keep the problem reasonable to solve "
                    "by hand. "
                    "The correct answer must include a "
                    "symbolic arbitrary constant such as + C. "
                    "The verification integrand must use "
                    "valid SymPy syntax.\n\n"
                    "Difficulty requirements:\n"
                    f"{difficulty_instructions}"
                ),
            },
        ],
        text_format=IndefiniteIntegralProblemCandidate,
    )

    return response.output_parsed.model_dump()

def generate_verified_equation_problem(
    course: str,
    difficulty: str,
    verifier,
    duplicate_checker=None,
    max_attempts: int = 5,
):
    for attempt in range(
        1,
        max_attempts + 1,
    ):
        candidate = generate_equation_candidate(
            course,
            difficulty,
        )

        if not verifier(candidate):
            print(
                f"AI equation candidate "
                f"failed verification "
                f"(attempt {attempt}/{max_attempts})"
            )
            continue

        if (
            duplicate_checker
            and duplicate_checker(candidate)
        ):
            print(
                f"AI equation candidate "
                f"was a recent duplicate "
                f"(attempt {attempt}/{max_attempts})"
            )
            continue

        return candidate

    return None

def generate_verified_derivative_problem(
    course: str,
    difficulty: str,
    verifier,
    duplicate_checker=None,
    max_attempts: int = 5,
):
    for attempt in range(
        1,
        max_attempts + 1,
    ):
        candidate = generate_derivative_candidate(
            course,
            difficulty,
        )

        if not verifier(candidate):
            print(
                f"AI derivative candidate "
                f"failed verification "
                f"(attempt {attempt}/{max_attempts})"
            )
            continue

        if (
            duplicate_checker
            and duplicate_checker(candidate)
        ):
            print(
                f"AI derivative candidate "
                f"was a recent duplicate "
                f"(attempt {attempt}/{max_attempts})"
            )
            continue

        return candidate

    return None

def generate_verified_definite_integral_problem(
    course: str,
    difficulty: str,
    verifier,
    duplicate_checker=None,
    max_attempts: int = 5,
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

        if not verifier(candidate):
            print(
                f"AI definite integral candidate "
                f"failed verification "
                f"(attempt {attempt}/{max_attempts})"
            )
            continue

        if (
            duplicate_checker
            and duplicate_checker(candidate)
        ):
            print(
                f"AI definite integral candidate "
                f"was a recent duplicate "
                f"(attempt {attempt}/{max_attempts})"
            )
            continue

        return candidate

    return None

def generate_verified_indefinite_integral_problem(
    course: str,
    difficulty: str,
    verifier,
    duplicate_checker=None,
    max_attempts: int = 5,
):
    for attempt in range(
        1,
        max_attempts + 1,
    ):
        candidate = (
            generate_indefinite_integral_candidate(
                course,
                difficulty,
            )
        )

        if not verifier(candidate):
            print(
                f"AI indefinite integral candidate "
                f"failed verification "
                f"(attempt {attempt}/{max_attempts})"
            )
            continue

        if (
            duplicate_checker
            and duplicate_checker(candidate)
        ):
            print(
                f"AI indefinite integral candidate "
                f"was a recent duplicate "
                f"(attempt {attempt}/{max_attempts})"
            )
            continue

        return candidate

    return None