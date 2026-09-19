from ai_generator import (
    generate_verified_derivative_problem,
)
from main import verify_candidate_problem


problem = generate_verified_derivative_problem(
    course="Calculus I",
    difficulty="Medium",
    verifier=verify_candidate_problem,
)

if problem:
    print("Verified derivative problem:")
    print(problem)
else:
    print(
        "Could not generate a verified "
        "derivative problem."
    )