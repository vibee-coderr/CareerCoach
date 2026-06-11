from services.groq_service import analyze_resume as groq_analyze
from services.ollama_service import analyze_resume_ollama

def analyze_resume_with_fallback(text, role="AI Engineer"):

    try:
        return groq_analyze(text, role)
    except Exception:
        print("Groq failed → switching to Ollama")
        return analyze_resume_ollama(text)