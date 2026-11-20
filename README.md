<<<<<<< HEAD
# KasiSkill Starter

A beginner-friendly starter scaffold for the KasiSkill prototype.

## Included
- FastAPI backend with a health check and starter skills endpoint
- React + TypeScript frontend using Vite
- PostgreSQL connection settings through environment variables
- SQL starter schema for users, worker profiles, skills, and worker skills
- `.env.example` files and setup instructions

This is a **starting codebase**, not a complete production platform. Authentication, permissions,
assessor workflows, evidence uploads, bookings, matching, reviews, and POPIA-ready operational
controls still need to be designed and implemented before real users' data is collected.

## Requirements
- Python 3.11+
- Node.js LTS
- PostgreSQL
- Git

## 1. Backend (Git Bash / VS Code terminal)

```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Open http://127.0.0.1:8000/docs to view the API.

If you use macOS/Linux Bash, activate with:
```bash
source .venv/bin/activate
```

## 2. Frontend (open a second terminal)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## 3. PostgreSQL

Create a database named `kასiskill` or, preferably, `kasi_skill` in pgAdmin.
Run `database/schema.sql` against that database.

Edit `backend/.env` and set `DATABASE_URL`. Example:
```env
DATABASE_URL=postgresql+psycopg://kasi_app:YOUR_PASSWORD@localhost:5432/kasi_skill
```

For now the API starts without a database connection; the database URL is included for the next
development step. Do not commit `.env` files or passwords to GitHub.

## Suggested team workflow
- Keep `main` stable.
- Each teammate works on a separate feature branch.
- Make small commits and open pull requests.
- Never put real identity documents, private evidence, passwords, or personal data in this starter repo.
=======
# KasiSkill
AI-assisted skills verification and employment platform
>>>>>>> 820d3b43841695474b3a05b7d94ea29e65ab738f
