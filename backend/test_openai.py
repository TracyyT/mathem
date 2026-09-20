from ai_generator import (
    generate_verified_definite_integral_problem,
)
from main import verify_candidate_problem


for difficulty in [
    "Easy",
    "Medium",
    "Hard",
]:
    print()
    print("=" * 50)
    print(difficulty.upper())
    print("=" * 50)

    for number in range(1, 4):
        problem = (
            generate_verified_definite_integral_problem(
                course="Calculus II",
                difficulty=difficulty,
                verifier=verify_candidate_problem,
            )
        )

        print()
        print(f"Problem {number}:")
        print(problem)