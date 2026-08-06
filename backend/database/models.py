from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, Integer, String, ForeignKey

Base = declarative_base()


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, unique=True, index=True)

    email = Column(String, unique=True, index=True)

    hashed_password = Column(String)

    interviews = relationship(
        "InterviewResult",
        back_populates="user",
        cascade="all, delete"
    )


class InterviewResult(Base):

    __tablename__ = "interview_results"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    interview_id = Column(String)

    role = Column(String)

    difficulty = Column(String)

    question_number = Column(Integer)

    total_questions = Column(Integer)

    question = Column(String)

    answer = Column(String)

    score = Column(Integer)

    topic = Column(String)

    user = relationship(
        "User",
        back_populates="interviews"
    )