from data.roadmaps import ROADMAPS


def generate_learning_roadmap(missing_skills):

    roadmap = {}

    week = 1

    for skill in missing_skills:

        if skill in ROADMAPS:

            roadmap[f"Week {week}"] = {
                "skill": skill,
                "topics": ROADMAPS[skill]
            }

            week += 1

    return roadmap