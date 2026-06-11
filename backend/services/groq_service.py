from groq import Groq
from dotenv import load_dotenv
import os
import json
import re

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def analyze_resume(resume_text, role="AI Engineer"):

    prompt = f"""
You are an expert AI Career Coach.

Your task is to analyze the resume and help the candidate become a successful {role}.

RULES:
- Return ONLY valid JSON
- No explanations
- No markdown
- No text outside JSON

OUTPUT FORMAT:

{{
  "skills": []
  
}}

RESUME:
{resume_text}

TARGET ROLE:
{role}

ANALYSIS TASK:
1. Extract technical + non-technical skills


"""
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    result = response.choices[0].message.content

    result = re.sub(r"```json|```", "", result).strip()

    return json.loads(result)