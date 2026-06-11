from fastapi.middleware.cors import CORSMiddleware
from collections import Counter
from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel
from services.resume_score_service import calculate_resume_score
from services.ai_service import analyze_resume_with_fallback
from services.interview_service import (
    generate_first_question,
    evaluate_answer,
    generate_next_question
)
from services.skill_gap_service import find_skill_gap
from services.roadmap_services import generate_learning_roadmap

from utils.resume_parser import extract_text_from_pdf

from database.database import SessionLocal
from database.models import InterviewResult

import os

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from database.database import engine
from database.models import Base

Base.metadata.create_all(bind=engine)
class InterviewStart(BaseModel):
    role: str
    skills: list


class ChatInput(BaseModel):
    role: str
    question: str
    answer: str

@app.post("/start-interview")
def start_interview(data: InterviewStart):

    question = generate_first_question(data.role, data.skills)

    return {
        "success": True,
        "data": question
    }

@app.post("/chat-interview")
@app.post("/chat-interview")
def chat_interview(data: ChatInput):

    evaluation = evaluate_answer(
        data.question,
        data.answer,
        data.role
    )
    print(evaluation)
    db = SessionLocal()

    try:
        new_result = InterviewResult(
            role=data.role,
            question=data.question,
            answer=data.answer,
            score=evaluation["score"],
            topic=evaluation.get("topic", "General")
        )

        db.add(new_result)
        db.commit()

    finally:
        db.close()

    next_question = generate_next_question(
        data.role,
        data.question,
        data.answer,
        evaluation["score"]
    )

    return {
        "success": True,
        "evaluation": evaluation,
        "next_question": next_question
    }

@app.get("/progress")
def get_progress():

    db = SessionLocal()

    results = db.query(InterviewResult).all()

    if not results:
        return {
            "average_score": 0,
            "total_questions": 0,
            "weak_topics": [],
            "strong_topics": []
        }

    average_score = round(
        sum(r.score for r in results) / len(results),
        2
    )

    weak_topics = list(
        set(
            r.topic
            for r in results
            if r.score < 6
        )
    )

    strong_topics = list(
        set(
            r.topic
            for r in results
            if r.score >= 8
        )
    )

    db.close()

    return {
        "average_score": average_score,
        "total_questions": len(results),
        "weak_topics": weak_topics,
        "strong_topics": strong_topics
    }  
@app.get("/dashboard")
def dashboard():

    db = SessionLocal()

    results = db.query(
        InterviewResult
    ).all()

    if not results:
        db.close()

        return {
            "total_interviews": 0,
            "average_score": 0,
            "best_topic": None,
            "weak_topic": None
        }

    total_interviews = len(results)

    average_score = round(
        sum(item.score for item in results)
        / total_interviews,
        2
    )

    topic_scores = {}

    for item in results:

        if item.topic not in topic_scores:
            topic_scores[item.topic] = []

        topic_scores[item.topic].append(
            item.score
        )

    topic_avg = {
        topic: sum(scores) / len(scores)
        for topic, scores in topic_scores.items()
    }

    best_topic = max(
        topic_avg,
        key=topic_avg.get
    )

    weak_topic = min(
        topic_avg,
        key=topic_avg.get
    )

    db.close()

    return {
        "total_interviews": total_interviews,
        "average_score": average_score,
        "best_topic": best_topic,
        "weak_topic": weak_topic,
        "recent_scores": [
            item.score
            for item in results[-5:]
       ]
    }
@app.get("/interview-summary")
def interview_summary():

    db = SessionLocal()

    results = db.query(InterviewResult).all()

    if not results:
        return {
            "total": 0,
            "avg_score": 0,
            "message": "No interviews yet"
        }

    total = len(results)
    avg = sum([r.score for r in results]) / total

    weak_topics = {}

    for r in results:
        if r.score < 5:
            weak_topics[r.topic] = weak_topics.get(r.topic, 0) + 1

    db.close()

    return {
        "total_questions": total,
        "average_score": round(avg, 2),
        "weak_topics": list(weak_topics.keys())
    }
@app.post("/resume-score")
async def resume_score(
    file: UploadFile = File(...),
    role: str = Form("AI Engineer")
):

    path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(path, "wb") as f:
        f.write(await file.read())

    resume_text = extract_text_from_pdf(path)

    analysis = analyze_resume_with_fallback(
        resume_text,
        role
    )

    skill_gap = find_skill_gap(
        analysis["skills"],
        role
    )

    score_data = calculate_resume_score(
        skill_gap
    )

    return {
        "success": True,
        "resume_score": score_data
    }
@app.get("/history")
def get_history():

    db = SessionLocal()

    results = db.query(
        InterviewResult
    ).order_by(
        InterviewResult.id.desc()
    ).all()

    history = []

    for item in results:
        history.append({
            "id": item.id,
            "role": item.role,
            "question": item.question,
            "score": item.score,
            "topic": item.topic
        })

    db.close()

    return history 

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
@app.get("/history")
def get_history():

    db = SessionLocal()

    results = db.query(InterviewResult).all()

    history = []

    for result in results:
        history.append({
            "id": result.id,
            "role": result.role,
            "question": result.question,
            "score": result.score,
            "topic": result.topic
        })

    db.close()

    return history
@app.delete("/clear-history")
def clear_history():

    db = SessionLocal()

    db.query(InterviewResult).delete()

    db.commit()

    db.close()

    return {
        "message": "History cleared"
    }
@app.post("/analyze-resume")
async def analyze(
    file: UploadFile = File(...),
    role: str = Form("AI Engineer")
):

    path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(path, "wb") as f:
        f.write(await file.read())

    resume_text = extract_text_from_pdf(path)

    result = analyze_resume_with_fallback(resume_text, role)
    skill_gap = find_skill_gap(result["skills"],role)
    roadmap = generate_learning_roadmap(
        skill_gap["missing_skills"]
    )
    return {
        "success": True,
        "analysis": result,
        "skill_gap": skill_gap,
        "roadmap":roadmap
    }
@app.get("/summary")
def get_summary():

    db = SessionLocal()

    results = db.query(
        InterviewResult
    ).all()

    db.close()

    if not results:
        return {
            "message": "No interview data"
        }

    total_questions = len(results)

    average_score = round(
        sum(r.score for r in results)
        / total_questions,
        2
    )

    strong_topics = list(
        set(
            r.topic
            for r in results
            if r.score >= 7
        )
    )

    weak_topics = list(
        set(
            r.topic
            for r in results
            if r.score < 5
        )
    )

    return {
        "total_questions": total_questions,
        "average_score": average_score,
        "strong_topics": strong_topics,
        "weak_topics": weak_topics
    }






