import ai_generator


duplicate_problem = {
    "topic": "Calculus I",
    "prompt": "Find the derivative.",
    "expression": "3*x**4 + 2*x",
    "correct_answer": "12*x**3 + 2",
    "answer_type": "expression",
    "hint": "Use the power rule.",
    "verification": {
        "operation": "derivative",
        "expression": "3*x**4 + 2*x",
        "variable": "x",
    },
}

new_problem = {
    "topic": "Calculus I",
    "prompt": "Find the derivative.",
    "expression": "5*x**3 - x",
    "correct_answer": "15*x**2 - 1",
    "answer_type": "expression",
    "hint": "Use the power rule.",
    "verification": {
        "operation": "derivative",
        "expression": "5*x**3 - x",
        "variable": "x",
    },
}


candidates = [
    duplicate_problem,
    duplicate_problem,
    duplicate_problem,
]

def fake_generator(course, difficulty):
    return candidates.pop(0)


def always_valid(problem):
    return True


def duplicate_checker(problem):
    return (
        problem["verification"]["expression"]
        == "3*x**4 + 2*x"
    )


original_generator = (
    ai_generator.generate_derivative_candidate
)

ai_generator.generate_derivative_candidate = (
    fake_generator
)


try:
    result = (
        ai_generator
        .generate_verified_derivative_problem(
            course="Calculus I",
            difficulty="Easy",
            verifier=always_valid,
            duplicate_checker=duplicate_checker,
        )
    )

    print("\nReturned problem:")
    print(result)

finally:
    ai_generator.generate_derivative_candidate = (
        original_generator
    )