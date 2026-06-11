from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String

Base = declarative_base()

class InterviewResult(Base):

    __tablename__ = "interview_results"

    id = Column(Integer, primary_key=True, index=True)

    role = Column(String)
    question = Column(String)
    answer = Column(String)

    score = Column(Integer)

    topic = Column(String)