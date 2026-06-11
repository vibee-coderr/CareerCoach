from data.roles import ROLE_SKILLS


def find_skill_gap(user_skills, target_role):

    required_skills = ROLE_SKILLS.get(
        target_role,
        []
    )

    missing_skills = []

    user_skills_lower = [
        skill.lower()
        for skill in user_skills
    ]

    for skill in required_skills:

        if skill.lower() not in user_skills_lower:
            missing_skills.append(skill)

    return {
        "required_skills": required_skills,
        "missing_skills": missing_skills
    }