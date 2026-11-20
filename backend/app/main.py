
import os

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app import models
from app.models import User
from app.schemas import (
    UserRegister,
    UserLogin,
    UserResponse,
    TokenResponse,
)
from app.security import hash_password, verify_password
from app.auth import create_access_token, verify_access_token

app = FastAPI(
    title="KasiSkill API",
    version="0.2.0"
)

allowed_origins = ["http://localhost:5173"]

frontend_url = os.getenv("FRONTEND_URL")

if frontend_url:
    allowed_origins.append(frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {"message": "Welcome to the KasiSkill API"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post(
    "/api/auth/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    data: UserRegister,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )

    new_user = User(
        full_name=data.full_name,
        email=str(data.email).lower(),
        hashed_password=hash_password(data.password),
        account_type=data.account_type
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@app.post("/api/auth/login", response_model=TokenResponse)
def login(
    data: UserLogin,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == str(data.email).lower()
    ).first()

    if not user or not verify_password(
        data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="This account is inactive."
        )

    token = create_access_token(user.id)

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.get("/api/auth/me", response_model=UserResponse)
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    payload = verify_access_token(credentials.credentials)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token."
        )

    user_id = payload.get("sub")

    try:
        user_id = int(user_id)
    except (TypeError, ValueError):
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token."
        )

    user = db.query(User).filter(User.id == user_id).first()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=401,
            detail="User not found or inactive."
        )

    return user


@app.get("/api/skills")
def list_skills():
    return [
        {
            "id": 1,
            "name": "Identify a leaking tap",
            "trade": "Plumbing"
        },
        {
            "id": 2,
            "name": "Basic pipe fitting",
            "trade": "Plumbing"
        },
        {
            "id": 3,
            "name": "General property maintenance",
            "trade": "General maintenance"
        }
    ]
