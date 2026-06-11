from ollama import chat

def analyze_resume_ollama(resume_text):

    prompt = f"""
    Analyze this resume.

    Return ONLY valid JSON.

    {{
      "skills": [],
      "experience": [],
      "projects": []
    }}

    Resume:
    {resume_text}
    """

    response = chat(
        model="qwen2.5:3b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"]