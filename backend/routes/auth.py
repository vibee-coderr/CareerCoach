from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from database.database import get_db

from database.models import User

from services.auth_service import *

from pydantic import BaseModel

router = APIRouter()


class RegisterUser(BaseModel):

    username: str

    email: str

    password: str


class LoginUser(BaseModel):

    email: str

    password: str


@router.post("/register")
def register(
    data: RegisterUser,
    db: Session = Depends(get_db)
):

    existing = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    user = User(

        username=data.username,

        email=data.email,

        hashed_password=hash_password(
            data.password
        )

    )

    db.add(user)

    db.commit()

    db.refresh(user)

    return {

        "message": "Registration Successful"

    }


@router.post("/login")
def login(
    data: LoginUser,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid Credentials"
        )

    if not verify_password(
        data.password,
        user.hashed_password
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid Credentials"
        )

    token = create_access_token(

        {

            "id": user.id,

            "email": user.email

        }

    )

    return {

        "access_token": token,

        "username": user.username,

        "email": user.email

    }