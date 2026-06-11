from groq import Groq
from dotenv import load_dotenv
import os
import json
import re

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_first_question(role, skills):

    prompt = f"""
You are an expert technical interviewer.

ROLE: {role}
CANDIDATE SKILLS: {skills}

TASK:
Generate the FIRST interview question.

Rules:
- Only one question
- Mix of conceptual + practical
- Medium difficulty
- No explanation

Return JSON:
{{
  "question": "",
  "difficulty": "easy|medium|hard"
}}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    content = response.choices[0].message.content
    content = re.sub(r"```json|```", "", content).strip()

    return json.loads(content)


def evaluate_answer(question, answer, role):

    prompt = f"""
You are a senior technical interviewer.

Question:
{question}

Candidate Answer:
{answer}

Role:
{role}

Evaluate the answer.

Return ONLY valid JSON:

{{
  "topic": "",
  "score": 0,
  "feedback": "",
  "correct_answer": "",
  "improvement_points": []
}}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    content = response.choices[0].message.content
    content = re.sub(r"```json|```", "", content).strip()

    return json.loads(content)

def generate_next_question(
    role,
    previous_question,
    candidate_answer,
    score
):

    prompt = f"""
You are an expert interviewer.

ROLE:
{role}

PREVIOUS QUESTION:
{previous_question}

CANDIDATE ANSWER:
{candidate_answer}

SCORE:
{score}/10

RULES:

If score < 6:
- Ask an easier follow-up question on the same topic.

If score between 6 and 8:
- Ask another medium question.

If score > 8:
- Increase difficulty and ask a more advanced question.

Return ONLY JSON:

{{
  "question": "",
  "difficulty": ""
}}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    content = response.choices[0].message.content

    content = re.sub(
        r"```json|```",
        "",
        content
    ).strip()

    return json.loads(content)