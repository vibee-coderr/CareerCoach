from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from collections import Counter
from routes.auth import router as auth_router
from services.auth_service import get_current_user
from fastapi import Depends
from fastapi.responses import FileResponse, JSONResponse
from services.pdf_service import create_career_report

import os
import uuid

from database.database import SessionLocal, engine
from database.models import Base, InterviewResult

from utils.resume_parser import extract_text_from_pdf

from services.ai_service import analyze_resume_with_fallback
from services.skill_gap_service import find_skill_gap
from services.roadmap_services import generate_learning_roadmap
from services.resume_score_service import calculate_resume_score

from services.interview_service import (
    generate_first_question,
    evaluate_answer,
    generate_next_question
)

# ---------------------------------------------------
# FastAPI App
# ---------------------------------------------------

app = FastAPI(title="AI Career Coach API")
app.include_router(auth_router)
allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------
# Database
# ---------------------------------------------------

Base.metadata.create_all(bind=engine)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.get("/")
def home():
    return {
        "message": "AI Career Coach API Running"
    }
# ---------------------------------------------------
# Request Models
# ---------------------------------------------------

class InterviewStart(BaseModel):

    role: str

    skills: list

    difficulty: str

    total_questions: int


class ChatInput(BaseModel):

    interview_id: str

    role: str

    question: str

    answer: str

    difficulty: str

    question_number: int

    total_questions: int


# ---------------------------------------------------
# Resume Analysis
# ---------------------------------------------------

@app.post("/analyze-resume")
async def analyze_resume(
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

    roadmap = generate_learning_roadmap(
        skill_gap["missing_skills"]
    )

    return {

        "success": True,

        "analysis": analysis,

        "skill_gap": skill_gap,

        "roadmap": roadmap

    }




# ---------------------------------------------------
# Resume Score
# ---------------------------------------------------

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

    score = calculate_resume_score(
        skill_gap
    )

    return {

        "success": True,

        "resume_score": score

    }


# ---------------------------------------------------
# Start Interview
# ---------------------------------------------------

@app.post("/start-interview")
def start_interview(data: InterviewStart):

    interview_id = str(uuid.uuid4())

    question = generate_first_question(

        data.role,

        data.skills,

        data.difficulty

    )

    return {

        "success": True,

        "interview_id": interview_id,

        "question_number": 1,

        "total_questions": data.total_questions,

        "data": question

    }


# ---------------------------------------------------
# Chat Interview
# ---------------------------------------------------

@app.post("/chat-interview")
def chat_interview(data: ChatInput,current_user=Depends(get_current_user)):

    evaluation = evaluate_answer(

        data.question,

        data.answer,

        data.role

    )

    db = SessionLocal()

    try:

        db.add(

            InterviewResult(
                user_id=current_user["id"],

                interview_id=data.interview_id,

                role=data.role,

                difficulty=data.difficulty,

                question_number=data.question_number,

                total_questions=data.total_questions,

                question=data.question,

                answer=data.answer,

                score=evaluation["score"],

                topic=evaluation.get(
                    "topic",
                    "General"
                )

            )

        )

        db.commit()

    finally:

        db.close()

    current_question = data.question_number + 1

    if current_question > data.total_questions:

        return {

            "success": True,

            "completed": True,

            "evaluation": evaluation

        }

    next_question = generate_next_question(

        data.role,

        data.question,

        data.answer,

        evaluation["score"],

        data.difficulty

    )

    return {

        "success": True,

        "completed": False,

        "evaluation": evaluation,

        "question_number": current_question,

        "total_questions": data.total_questions,

        "next_question": next_question

    }

# ---------------------------------------------------
# Dashboard
# ---------------------------------------------------

@app.get("/dashboard")
def dashboard(
    current_user=Depends(get_current_user)
):

    db = SessionLocal()

    results = db.query(
        InterviewResult
    ).filter(
        InterviewResult.user_id == current_user["id"]
    ).all()

    db.close()

    if not results:

        return {
            "total_interviews": 0,
            "average_score": 0,
            "best_topic": "-",
            "weak_topic": "-",
            "easy_count": 0,
            "medium_count": 0,
            "hard_count": 0,
            "recent_scores": []
        }

    total = len(results)

    average = round(
        sum(r.score for r in results) / total,
        2
    )

    topic_scores = {}

    for r in results:

        topic_scores.setdefault(
            r.topic,
            []
        ).append(r.score)

    topic_average = {

        topic: sum(scores)/len(scores)

        for topic, scores in topic_scores.items()

    }

    best_topic = max(
        topic_average,
        key=topic_average.get
    )

    weak_topic = min(
        topic_average,
        key=topic_average.get
    )

    difficulty_counter = Counter(
        r.difficulty for r in results
    )

    recent_scores = [

        r.score

        for r in results[-5:]

    ]

    return {

        "total_interviews": total,

        "average_score": average,

        "best_topic": best_topic,

        "weak_topic": weak_topic,

        "easy_count": difficulty_counter.get("Easy",0),

        "medium_count": difficulty_counter.get("Medium",0),

        "hard_count": difficulty_counter.get("Hard",0),

        "recent_scores": recent_scores

    }


# ---------------------------------------------------
# Progress
# ---------------------------------------------------

@app.get("/progress")
def get_progress(
    current_user=Depends(get_current_user)
):

    db = SessionLocal()

    results = db.query(
        InterviewResult
    ).filter(
        InterviewResult.user_id == current_user["id"]
    ).all()

    db.close()

    if not results:

        return {
            "average_score":0,
            "total_questions":0,
            "weak_topics":[],
            "strong_topics":[]
        }

    average = round(

        sum(r.score for r in results)

        / len(results),

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

    return {

        "average_score":average,

        "total_questions":len(results),

        "weak_topics":weak_topics,

        "strong_topics":strong_topics

    }


# ---------------------------------------------------
# Interview History
# ---------------------------------------------------

@app.get("/history")
def history(
    current_user=Depends(get_current_user)
):

    db = SessionLocal()

    results = (

        db.query(
            InterviewResult
        )

        .filter(
            InterviewResult.user_id == current_user["id"]
        )

        .order_by(
            InterviewResult.id.desc()
        )

        .all()

    )

    db.close()

    return [

        {

            "id":r.id,

            "role":r.role,

            "difficulty":r.difficulty,

            "question_number":r.question_number,

            "total_questions":r.total_questions,

            "question":r.question,

            "score":r.score,

            "topic":r.topic

        }

        for r in results

    ]

# ---------------------------------------------------
# Interview Summary
# ---------------------------------------------------

@app.get("/summary")
def summary(current_user=Depends(get_current_user)):
    db = SessionLocal()

    results = db.query(
    InterviewResult).filter(InterviewResult.user_id == current_user["id"]).all()

    db.close()

    if not results:

        return {

            "message": "No interview history"

        }

    total = len(results)

    average = round(

        sum(r.score for r in results)

        / total,

        2

    )

    strong_topics = list(

        set(

            r.topic

            for r in results

            if r.score >= 8

        )

    )

    weak_topics = list(

        set(

            r.topic

            for r in results

            if r.score < 6

        )

    )

    best_score = max(
        r.score
        for r in results
    )

    return {

        "total_questions": total,

        "average_score": average,

        "highest_score": best_score,

        "strong_topics": strong_topics,

        "weak_topics": weak_topics

    }

@app.get("/download-report")
def download_report(current_user=Depends(get_current_user)):

    db = SessionLocal()
    results = db.query(InterviewResult).filter(InterviewResult.user_id == current_user["id"]).all()

    if not results:

        db.close()

        return JSONResponse(
            status_code=404,
            content={"message": "No interview history found."}
        )

    total_questions = len(results)

    average_score = round(
        sum(r.score for r in results) / total_questions,
        2
    )

    strong_topics = list(
        set(
            r.topic
            for r in results
            if r.score >= 8
        )
    )

    weak_topics = list(
        set(
            r.topic
            for r in results
            if r.score < 6
        )
    )

    summary = {
        "total_questions": total_questions,
        "average_score": average_score,
        "strong_topics": strong_topics,
        "weak_topics": weak_topics
    }

    progress = {
        "total_questions": total_questions,
        "average_score": average_score
    }

    filename = "AI_Career_Report.pdf"

    create_career_report(
        filename,
        summary,
        progress,
        results
    )

    db.close()

    return FileResponse(
        path=os.path.abspath(filename),
        filename="AI_Career_Report.pdf",
        media_type="application/pdf"
    )

# ---------------------------------------------------
# Clear History
# ---------------------------------------------------

@app.delete("/clear-history")
def clear_history(
    current_user=Depends(get_current_user)
):

    db = SessionLocal()

    db.query(

        InterviewResult

    ).filter(

        InterviewResult.user_id == current_user["id"]

    ).delete()

    db.commit()

    db.close()

    return {

        "success":True,

        "message":"Interview history cleared."

    }