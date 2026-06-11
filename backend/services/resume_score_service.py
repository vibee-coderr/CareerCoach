def calculate_resume_score(skill_gap):
    
    required = skill_gap["required_skills"]
    missing = skill_gap["missing_skills"]

    matched = len(required) - len(missing)

    score = round(
        (matched / len(required)) * 100
    )

    strengths = [
        skill
        for skill in required
        if skill not in missing
    ]

    return {
        "score": score,
        "matched_skills": matched,
        "total_required_skills": len(required),
        "strengths": strengths,
        "improvements": missing
    }