from ai_generator import (
    generate_verified_equation_problem,
)
from main import verify_candidate_problem


for number in range(1, 8):
    problem = (
        generate_verified_equation_problem(
            course="Algebra I",
            difficulty="Easy",
            verifier=verify_candidate_problem,
        )
    )

    print()
    print(f"Problem {number}:")
    print(problem)