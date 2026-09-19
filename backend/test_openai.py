from ai_generator import (
    generate_verified_indefinite_integral_problem,
)
from main import verify_candidate_problem


problem = (
    generate_verified_indefinite_integral_problem(
        course="Calculus II",
        difficulty="Medium",
        verifier=verify_candidate_problem,
    )
)

if problem:
    print("Verified indefinite integral problem:")
    print(problem)
else:
    print(
        "Could not generate a verified "
        "indefinite integral problem."
    )