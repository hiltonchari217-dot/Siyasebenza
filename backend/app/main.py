
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="KasiSkill API",
    version="0.1.0"
)

# Allowed frontend addresses
allowed_origins = [
    "http://localhost:5173",
]

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


class Skill(BaseModel):
    id: int
    name: str
    trade: str


STARTER_SKILLS = [
    Skill(
        id=1,
        name="Identify a leaking tap",
        trade="Plumbing"
    ),
    Skill(
        id=2,
        name="Basic pipe fitting",
        trade="Plumbing"
    ),
    Skill(
        id=3,
        name="General property maintenance",
        trade="General maintenance"
    ),
]


@app.get("/")
def home():
    return {"message": "Welcome to the KasiSkill API"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/skills", response_model=list[Skill])
def list_skills():
    return STARTER_SKILLS

