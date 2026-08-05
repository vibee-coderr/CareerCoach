from groq import Groq
from dotenv import load_dotenv
import os
import json
import re

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def call_llm(prompt):

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


# -------------------------
# First Question
# -------------------------

def generate_first_question(
    role,
    skills,
    difficulty
):

    prompt = f"""
You are an expert technical interviewer.

Candidate Role:
{role}

Difficulty:
{difficulty}

Generate ONLY ONE interview question.

Difficulty Guidelines:

Easy:
- Definitions
- Basic concepts
- Beginner-friendly

Medium:
- Practical implementation
- APIs
- Real-world examples

Hard:
- System Design
- Optimization
- Production Architecture
- Scaling

Return ONLY JSON

{{
    "question":"",
    "difficulty":"{difficulty}"
}}
"""

    return call_llm(prompt)


# -------------------------
# Evaluate Answer
# -------------------------

def evaluate_answer(
    question,
    answer,
    role
):

    prompt = f"""
You are a Senior Technical Interviewer.

Role:
{role}

Question:
{question}

Candidate Answer:
{answer}

Evaluate the answer.

Return ONLY JSON.

{{
    "topic":"",
    "score":0,
    "feedback":"",
    "correct_answer":"",
    "improvement_points":[]
}}
"""

    return call_llm(prompt)


# -------------------------
# Next Question
# -------------------------

def generate_next_question(
    role,
    previous_question,
    candidate_answer,
    score,
    difficulty
):

    prompt = f"""
You are an experienced interviewer.

Role:
{role}

Current Difficulty:
{difficulty}

Previous Question:
{previous_question}

Candidate Answer:
{candidate_answer}

Candidate Score:
{score}/10

Rules:

If score <=4

Ask an easier follow-up on the SAME topic.

If score is between 5 and 7

Stay at the SAME difficulty.

If score >=8

Increase complexity.

Never repeat previous questions.

Return ONLY JSON.

{{
    "question":"",
    "difficulty":""
}}
"""

    return call_llm(prompt)