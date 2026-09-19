from ai_generator import (
    generate_verified_equation_problem,
)
from main import verify_candidate_problem


problem = generate_verified_equation_problem(
    course="Algebra I",
    difficulty="Medium",
    verifier=verify_candidate_problem,
)

if problem:
    print("Verified problem:")
    print(problem)
else:
    print(
        "Could not generate a verified problem."
    )